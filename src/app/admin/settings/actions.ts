"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { profiles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";

// ─── Update Email ──────────────────────────────────────────────────────────────

const UpdateEmailSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(1, "Please confirm your current password."),
});

export async function updateEmail(formData: FormData): Promise<{ success?: boolean; error?: string }> {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized." };

    const parsed = UpdateEmailSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    const user = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
    if (!user) return { error: "User not found." };

    // If the user set a password, verify it before allowing email change
    if (user.password) {
        const match = await bcrypt.compare(parsed.data.password, user.password);
        if (!match) return { error: "Incorrect current password." };
    }

    // Check email uniqueness
    const existing = await db.query.users.findFirst({ where: eq(users.email, parsed.data.email) });
    if (existing && existing.id !== session.user.id) return { error: "That email is already in use." };

    await db.update(users).set({ email: parsed.data.email }).where(eq(users.id, session.user.id));
    revalidatePath("/admin/settings");
    return { success: true };
}

// ─── Update Password ───────────────────────────────────────────────────────────

const UpdatePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Please enter your current password."),
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
}).refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

export async function updatePassword(formData: FormData): Promise<{ success?: boolean; error?: string }> {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized." };

    const parsed = UpdatePasswordSchema.safeParse({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
    });
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    const user = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
    if (!user) return { error: "User not found." };

    if (user.password) {
        const match = await bcrypt.compare(parsed.data.currentPassword, user.password);
        if (!match) return { error: "Incorrect current password." };
    }

    const hashed = await bcrypt.hash(parsed.data.newPassword, 12);
    await db.update(users).set({ password: hashed }).where(eq(users.id, session.user.id));
    return { success: true };
}

// ─── Update Profile (per-profile settings) ────────────────────────────────────

const UpdateProfileInfoSchema = z.object({
    displayName: z.string().max(60).optional(),
    bio: z.string().max(200).optional(),
    location: z.string().max(80).optional(),
    avatarUrl: z.string().optional(),
    verified: z.boolean().optional(),
});

export async function updateProfileInfo(
    profileId: string,
    data: z.infer<typeof UpdateProfileInfoSchema>
): Promise<{ success?: boolean; error?: string }> {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized." };

    // Verify ownership
    const profile = await db.query.profiles.findFirst({ where: eq(profiles.id, profileId) });
    if (!profile || profile.userId !== session.user.id) return { error: "Unauthorized." };

    const parsed = UpdateProfileInfoSchema.safeParse(data);
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    // Update per-profile fields
    const updateData: Partial<typeof profiles.$inferInsert> = {
        bio: parsed.data.bio ?? "",
        location: parsed.data.location ?? "",
        avatarUrl: parsed.data.avatarUrl ?? "",
        verified: parsed.data.verified ?? false,
    };

    if (parsed.data.displayName !== undefined) {
        updateData.name = parsed.data.displayName;
    }

    await db.update(profiles).set(updateData).where(eq(profiles.id, profileId));

    revalidatePath("/admin/profiles");
    revalidatePath(`/admin/profiles/${profileId}/edit`);
    revalidatePath(`/${profile.handle}`);
    return { success: true };
}
