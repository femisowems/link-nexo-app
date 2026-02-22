import { auth } from "@/auth";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ProfilesClient } from "@/app/admin/profiles/ProfilesClient";

export const metadata = {
    title: "My Profiles — Link-Nexo Admin",
};

export default async function ProfilesPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const userProfiles = await db.query.profiles.findMany({
        where: eq(profiles.userId, session.user.id),
        with: {
            links: true,
            socials: true,
        },
    });

    return (
        <ProfilesClient
            profiles={userProfiles}
            userEmail={session.user.email ?? ""}
        />
    );
}
