
import { auth } from "@/auth";
import { db } from "@/db";
import { profiles, links, socials } from "@/db/schema";
import { mockData } from "@/data/mock-data";
import { eq, desc } from "drizzle-orm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SocialRow } from "@/components/profile/SocialRow";
import { LinkList } from "@/components/links/LinkList";
import { redirect } from "next/navigation";
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { parseLocation } from "@/lib/utils";

import { AlertCircle, UserPlus, AtSign, ArrowRight } from "lucide-react";

// Form to create profile if missing
function CreateProfile({ userId }: { userId: string }) {
    const randomName = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: '',
        style: 'lowerCase'
    });
    // Remove the number
    const defaultHandle = randomName;

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl p-8 sm:p-10 relative overflow-hidden">
                {/* Decorative background gradients */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col items-center text-center mb-8 relative z-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-primary/20">
                        <UserPlus className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Welcome to Link-Nexo</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px]">
                        Let's get started by claiming your unique profile handle.
                    </p>
                </div>

                <form action={async (formData) => {
                    "use server";
                    let handle = formData.get("handle") as string;
                    if (!handle) return;

                    // Clean the handle
                    handle = handle.toLowerCase().replace(/[^a-z0-9_-]/g, "");

                    // Check uniqueness and retry until unique if handle is taken
                    let isUnique = false;
                    while (!isUnique) {
                        const existingProfile = await db.query.profiles.findFirst({
                            where: eq(profiles.handle, handle)
                        });

                        if (existingProfile) {
                            handle = uniqueNamesGenerator({
                                dictionaries: [adjectives, animals],
                                separator: '',
                                style: 'lowerCase'
                            });
                        } else {
                            isUnique = true;
                        }
                    }

                    // Create Profile
                    const [newProfile] = await db.insert(profiles).values({
                        userId,
                        handle,
                        bio: "Welcome to my new profile!",
                        location: "Everywhere, World",
                        avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${handle}`,
                        sectionVisibility: JSON.stringify({ profile: true, socials: true, links: true }),
                    }).returning();

                    // Insert Mock Links and Socials (omitted from UI code for brevity, kept functional)
                    if (mockData.links && mockData.links.length > 0) {
                        await Promise.all(mockData.links.map((link, index) =>
                            db.insert(links).values({
                                profileId: newProfile.id, title: link.title, subtitle: link.subtitle, href: link.href, icon: link.icon || "website", variant: link.variant || "default", badge: link.badge, thumbnailUrl: link.thumbnailUrl, analyticsEventName: link.analyticsEventName, openInNewTab: link.openInNewTab ?? true, visible: true, order: index,
                            })
                        ));
                    }
                    if (mockData.profile.socials && mockData.profile.socials.length > 0) {
                        await Promise.all(mockData.profile.socials.map((social, index) =>
                            db.insert(socials).values({
                                profileId: newProfile.id, platform: social.platform, href: social.href, label: social.label, visible: true, order: index,
                            })
                        ));
                    }

                    redirect("/admin");
                }} className="flex flex-col gap-6 relative z-10">
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="handle" className="text-sm font-medium text-foreground/80 pl-1">Choose your handle</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                <AtSign className="w-5 h-5" />
                            </div>
                            <input
                                id="handle"
                                name="handle"
                                defaultValue={defaultHandle}
                                placeholder="e.g. johndoe"
                                className="w-full pl-11 pr-4 py-3.5 bg-background border border-border/60 hover:border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base placeholder:text-muted-foreground/50"
                                required
                                pattern="[a-zA-Z0-9_-]+"
                                title="Letters, numbers, underscores, and hyphens only"
                            />
                        </div>
                        <p className="text-[11px] text-muted-foreground px-1 mt-1 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            link-nexo.com/<span className="text-foreground font-semibold">handle</span>
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="group relative w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg hover:bg-primary/90 hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Create My Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    </button>
                </form>
            </div>

            {/* Very simple shimmer animation for global css if needed, otherwise generic transition works */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}} />
        </div>
    );
}

export default async function AdminPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, session.user.id),
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

    if (!profile) {
        return <CreateProfile userId={session.user.id} />;
    }

    const formattedLinks = profile.links.map(l => ({
        ...l,
        subtitle: l.subtitle || undefined,
        visible: l.visible ?? true,
        icon: (l.icon as "website" | "github" | "linkedin" | "twitter" | "youtube" | "instagram" | "email" | "calendar" | "custom") || undefined,
        order: l.order ?? 0,
        variant: (l.variant as "featured" | "default" | "primaryOffer") || undefined,
        badge: l.badge || undefined,
        layout: l.layout || undefined,
        accent: l.accent || undefined,
        template: (l.template as any) || undefined,
        ctaLabel: l.ctaLabel || undefined,
        price: l.price || undefined,
        originalPrice: l.originalPrice || undefined,
        rating: l.rating || undefined,
        thumbnailUrl: l.thumbnailUrl || undefined,
        analyticsEventName: l.analyticsEventName || undefined,
        openInNewTab: l.openInNewTab ?? undefined,
    }));

    // Transform for UI
    const formattedProfile = {
        ...profile,
        name: profile.user.name || profile.handle,
        bio: profile.bio || "",
        location: parseLocation(profile.location),
        avatarUrl: profile.avatarUrl || "",
        verified: profile.verified ?? false,
        sectionVisibility: typeof profile.sectionVisibility === 'string' ? JSON.parse(profile.sectionVisibility) : profile.sectionVisibility,
        socials: profile.socials.map(s => ({
            ...s,
            // Cast platform to correct type or validate
            platform: s.platform as "github" | "linkedin" | "twitter" | "youtube" | "instagram" | "email" | "website",
            label: s.label || undefined,
            visible: s.visible ?? true,
            order: s.order ?? 0
        }))
    };

    return (
        <div className="max-w-md mx-auto p-4 space-y-8 min-h-screen">
            <div className="flex justify-between items-center bg-muted/20 p-4 rounded-lg">
                <div>
                    <h2 className="font-semibold">Your Link:</h2>
                    <a href={`/${profile.handle}`} target="_blank" className="text-blue-500 hover:underline">
                        {`/${profile.handle}`}
                    </a>
                </div>
                <button className="text-xs border px-2 py-1 rounded">Share</button>
            </div>

            <ProfileHeader profile={formattedProfile} editable={true} />
            <SocialRow socials={formattedProfile.socials} visible={formattedProfile.sectionVisibility?.socials} editable={true} />
            <LinkList links={formattedLinks} visible={true} editable={true} />
        </div>
    );
}
