import { auth } from "@/auth";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import { ProfileEditForm } from "@/app/admin/profiles/[id]/edit/ProfileEditForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProfileEditPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const { id } = await params;

    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, id),
        with: { user: true },
    });

    if (!profile || profile.userId !== session.user.id) notFound();

    return (
        <div className="space-y-6">
            {/* Back link */}
            <Link
                href="/admin/profiles"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                My Profiles
            </Link>

            <div>
                <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    @{profile.handle} · <a href={`/${profile.handle}`} target="_blank" className="text-primary hover:underline">{`/${profile.handle}`}</a>
                </p>
            </div>

            <ProfileEditForm
                profileId={profile.id}
                initialData={{
                    displayName: profile.user.name ?? profile.handle,
                    bio: profile.bio ?? "",
                    location: profile.location ?? "",
                    avatarUrl: profile.avatarUrl ?? "",
                    verified: profile.verified ?? false,
                }}
            />
        </div>
    );
}
