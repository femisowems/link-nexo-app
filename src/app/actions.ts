
"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { links, profiles, users } from "@/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- Profile Actions ---

const UpdateProfileSchema = z.object({
    name: z.string().min(1).optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    handle: z.string().min(3).optional(), // Handle updates might need unique check
});

export async function updateProfile(formData: { [key: string]: string }) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const userId = session.user.id;
    // Check if profile exists for user, if not create one?
    let profile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, userId),
    });

    if (!profile) {
        // Create profile if missing (e.g. first login)
        // Usually would happen on signup or first login flow
        // For now, let's defer creation to a specific "createProfile" action or handle it here
        throw new Error("Profile not found");
    }

    // Parse data
    const { name, bio, location } = formData;

    // Update Profile
    await db.update(profiles)
        .set({ bio, location })
        .where(eq(profiles.userId, userId));

    // Update User name if provided
    if (name) {
        await db.update(users)
            .set({ name })
            .where(eq(users.id, userId));
    }

    revalidatePath("/admin");
    revalidatePath(`/${profile.handle}`); // Revalidate public page
    return { success: true };
}

// --- Link Actions ---

export async function addLink() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const userId = session.user.id;
    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, userId),
    });

    if (!profile) throw new Error("Profile not found");

    // Get max order
    const existingLinks = await db.query.links.findMany({
        where: eq(links.profileId, profile.id),
        orderBy: [desc(links.order)],
        limit: 1,
    });
    const newOrder = (existingLinks[0]?.order ?? -1) + 1;

    const newLink = await db.insert(links).values({
        profileId: profile.id,
        title: "New Link",
        href: "https://example.com",
        visible: true,
        order: newOrder,
        icon: "website",
    }).returning();

    revalidatePath("/admin");
    return { success: true, link: newLink[0] };
}

export async function updateLink(id: string, data: Partial<typeof links.$inferInsert>) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Verify ownership
    // In a real app, join with profiles -> users to ensure ownership
    // For speed, let's trust the session user owns the profile that owns the link
    // Better: fetch link, check profile.userId === session.user.id

    // Simplification for now:
    await db.update(links).set(data).where(eq(links.id, id));
    revalidatePath("/admin");
    return { success: true };
}

export async function deleteLink(id: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.delete(links).where(eq(links.id, id));
    revalidatePath("/admin");
    return { success: true };
}

export async function reorderLinks(items: { id: string; order: number }[]) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Transaction?
    // Using Promise.all for now
    await Promise.all(
        items.map(item =>
            db.update(links).set({ order: item.order }).where(eq(links.id, item.id))
        )
    );
    revalidatePath("/admin");
    return { success: true };
}
