import { auth } from "@/auth";
import { db } from "@/db";
import { profiles, links, socials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Link2, Share2, PencilLine } from "lucide-react";

export const metadata = {
    title: "My Profiles — Link-Nexo Admin",
};

export default async function ProfilesPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    // Fetch all profiles belonging to this user, with link and social counts
    const userProfiles = await db.query.profiles.findMany({
        where: eq(profiles.userId, session.user.id),
        with: {
            links: true,
            socials: true,
        },
    });

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Profiles</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        All profiles connected to <span className="font-medium">{session.user.email}</span>
                    </p>
                </div>
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 text-sm font-medium border rounded-lg px-4 py-2 hover:bg-muted/50 transition-colors"
                >
                    <PencilLine className="w-4 h-4" />
                    Edit Active Profile
                </Link>
            </div>

            {userProfiles.length === 0 ? (
                /* Empty state */
                <div className="rounded-xl border border-dashed p-12 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted">
                        <Link2 className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg">No profiles yet</h2>
                        <p className="text-muted-foreground text-sm mt-1">
                            Head to the dashboard to create your first profile.
                        </p>
                    </div>
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg px-5 py-2 hover:opacity-90 transition-opacity"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {userProfiles.map((profile) => {
                        const visibleLinks = profile.links.filter((l) => l.visible).length;
                        const totalLinks = profile.links.length;
                        const visibleSocials = profile.socials.filter((s) => s.visible).length;
                        const totalSocials = profile.socials.length;
                        const avatar =
                            profile.avatarUrl ||
                            `https://api.dicebear.com/9.x/avataaars/svg?seed=${profile.handle}`;

                        return (
                            <div
                                key={profile.id}
                                className="group relative flex flex-col rounded-xl border bg-card hover:shadow-md transition-shadow overflow-hidden"
                            >
                                {/* Card top accent bar */}
                                <div className="h-1 w-full bg-gradient-to-r from-primary/70 to-primary" />

                                <div className="p-5 flex flex-col gap-4 flex-1">
                                    {/* Avatar + Handle */}
                                    <div className="flex items-center gap-3">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={avatar}
                                            alt={profile.handle}
                                            className="w-12 h-12 rounded-full border bg-muted object-cover flex-shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <p className="font-semibold truncate">@{profile.handle}</p>
                                            {profile.bio && (
                                                <p className="text-muted-foreground text-xs line-clamp-2 mt-0.5">
                                                    {profile.bio}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Stats pills */}
                                    <div className="flex gap-2 flex-wrap text-xs">
                                        <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-medium">
                                            <Link2 className="w-3 h-3" />
                                            {visibleLinks}/{totalLinks} links
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-medium">
                                            <Share2 className="w-3 h-3" />
                                            {visibleSocials}/{totalSocials} socials
                                        </span>
                                        {profile.verified && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-0.5 font-medium">
                                                ✓ Verified
                                            </span>
                                        )}
                                    </div>

                                    {/* Location */}
                                    {profile.location && (
                                        <p className="text-muted-foreground text-xs">📍 {profile.location}</p>
                                    )}
                                </div>

                                {/* Action buttons */}
                                <div className="border-t flex divide-x">
                                    <Link
                                        href="/admin"
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium py-2.5 hover:bg-muted/40 transition-colors"
                                    >
                                        <PencilLine className="w-3.5 h-3.5" />
                                        Edit
                                    </Link>
                                    <a
                                        href={`/${profile.handle}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium py-2.5 hover:bg-muted/40 transition-colors"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        View Public
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Helper text */}
            {userProfiles.length > 0 && (
                <p className="text-center text-xs text-muted-foreground pt-2">
                    Showing {userProfiles.length} profile{userProfiles.length !== 1 ? "s" : ""} linked to your account.
                </p>
            )}
        </div>
    );
}
