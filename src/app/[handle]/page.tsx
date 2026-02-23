
import { db } from "@/db";
import { profiles, links } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { parseLocation } from "@/lib/utils";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SocialRow } from "@/components/profile/SocialRow";
import { LinkList } from "@/components/links/LinkList";
import { Footer } from "@/components/layout/Footer";
import { LinkItem } from "@/types";
import type { Metadata } from "next";

// Force dynamic rendering as data comes from DB
export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{
        handle: string;
    }>;
}

async function getProfile(handle: string) {
    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.handle, handle),
        with: {
            user: true,
            links: {
                orderBy: (links, { desc }) => [desc(links.order)],
            },
            socials: {
                orderBy: (socials, { asc }) => [asc(socials.order)],
            }
        }
    });

    if (!profile) return null;

    // Note: we fetch links above via relation now!
    const userLinks = profile.links;

    // Filter visible links for public view and transform types
    const visibleLinks: LinkItem[] = userLinks
        .filter((l) => l.visible)
        .map(l => ({
            id: l.id,
            profileId: l.profileId,
            title: l.title,
            subtitle: l.subtitle || undefined,
            href: l.href,
            visible: l.visible ?? true,
            icon: (l.icon as any) || undefined,
            order: l.order ?? 0,
            variant: (l.variant as any) || undefined,
            badge: (l.badge as any) || undefined,
            layout: l.layout || undefined,
            accent: l.accent || undefined,
            ctaLabel: l.ctaLabel || undefined,
            price: l.price || undefined,
            originalPrice: l.originalPrice || undefined,
            rating: l.rating || undefined,
            thumbnailUrl: l.thumbnailUrl || undefined,
            analyticsEventName: l.analyticsEventName || undefined,
            openInNewTab: l.openInNewTab ?? undefined,
        }));

    return {
        ...profile,
        name: profile.user.name || profile.handle, // Map user name
        bio: profile.bio || "",
        location: parseLocation(profile.location),
        avatarUrl: profile.avatarUrl || "",
        verified: profile.verified ?? false,
        // safe parse sectionVisibility
        sectionVisibility: typeof profile.sectionVisibility === 'string' ? JSON.parse(profile.sectionVisibility) : profile.sectionVisibility,
        preferences: profile.preferences ? JSON.parse(profile.preferences) : undefined,
        links: visibleLinks,
        socials: profile.socials.map(s => ({
            ...s,
            // Cast platform to correct type or validate
            platform: s.platform as any,
            label: s.label || undefined,
            visible: s.visible ?? true,
            order: s.order ?? 0
        }))
    };
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { handle } = await params;
    const profile = await getProfile(handle);

    if (!profile) {
        return {
            title: "Profile Not Found",
        };
    }

    return {
        title: `${profile.name || profile.handle} | Link-Nexo`,
        description: profile.bio || `Check out ${profile.handle}'s links on Link-Nexo`,
        openGraph: {
            images: [profile.avatarUrl || ""],
        }
    };
}

export default async function ProfilePage({ params }: Props) {
    const { handle } = await params;

    if (["login", "admin", "api"].includes(handle)) {
        return notFound();
    }

    const profile = await getProfile(handle);

    if (!profile) {
        notFound();
    }

    const { preferences } = profile;

    // Define public HTML root equivalent wrapper styles based on preferences
    const isDark = preferences?.theme === "dark" || (preferences?.theme === "system" /* assume light fallback for SSR without client match-media, or default to dark? We'll let CSS handle base, and force dark if explicit */);
    const themeClass = preferences?.theme === "dark" ? "dark" : preferences?.theme === "light" ? "light" : "";
    const motionClass = preferences?.reduceMotion ? "reduce-motion" : "";
    const contrastClass = preferences?.highContrastMode ? "high-contrast" : "";
    const textClass = preferences?.largerText ? "larger-text" : "";

    return (
        <div
            className={`min-h-screen ${themeClass} ${motionClass} ${contrastClass} ${textClass}`}
            data-accent={preferences?.accentColor || "blue"}
            data-link-style={preferences?.linkStyle || "rounded"}
        >
            <main className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background/90 to-muted/20">
                <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
                    <ProfileHeader profile={profile} editable={false} />
                    <SocialRow socials={profile.socials} visible={profile.sectionVisibility?.socials} editable={false} />
                    <LinkList links={profile.links} visible={profile.sectionVisibility?.links} editable={false} accent={preferences?.accentColor || "blue"} />
                </div>
                <div className="fixed bottom-4 right-4 text-xs text-muted-foreground opacity-50 hover:opacity-100 transition-opacity">
                    Powered by Link-Nexo
                </div>
            </main>
        </div>
    );
}
