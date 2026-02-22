
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
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Complete your profile</h2>
            <form action={async (formData) => {
                "use server";
                let handle = formData.get("handle") as string;
                if (!handle) return;

                // Check uniqueness and retry until unique if handle is taken
                let isUnique = false;
                while (!isUnique) {
                    const existingProfile = await db.query.profiles.findFirst({
                        where: eq(profiles.handle, handle)
                    });

                    if (existingProfile) {
                        // Generate a new random handle if the current one is taken
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

                // Insert Mock Links
                if (mockData.links && mockData.links.length > 0) {
                    await Promise.all(mockData.links.map((link, index) =>
                        db.insert(links).values({
                            profileId: newProfile.id,
                            title: link.title,
                            subtitle: link.subtitle,
                            href: link.href,
                            icon: link.icon || "website",
                            visible: true,
                            order: index,
                        })
                    ));
                }

                // Insert Mock Socials
                if (mockData.profile.socials && mockData.profile.socials.length > 0) {
                    await Promise.all(mockData.profile.socials.map((social, index) =>
                        db.insert(socials).values({
                            profileId: newProfile.id,
                            platform: social.platform,
                            href: social.href,
                            label: social.label,
                            visible: true,
                            order: index,
                        })
                    ));
                }

                redirect("/admin");
            }} className="flex flex-col gap-4 max-w-xs mx-auto">
                <input name="handle" defaultValue={defaultHandle} placeholder="Choose a handle (e.g. johndoe)" className="border p-2 rounded" required />
                <button type="submit" className="bg-primary text-primary-foreground p-2 rounded">Create Profile</button>
            </form>
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

    const formattedLinks: any[] = profile.links.map(l => ({
        ...l,
        visible: l.visible ?? true,
        icon: (l.icon as any) || undefined, // Transform null to undefined or default
        order: l.order ?? 0
    }));

    // Transform for UI
    const formattedProfile = {
        ...profile,
        name: profile.user.name || profile.handle,
        bio: profile.bio || "",
        location: profile.location || "",
        avatarUrl: profile.avatarUrl || "",
        verified: profile.verified ?? false,
        sectionVisibility: typeof profile.sectionVisibility === 'string' ? JSON.parse(profile.sectionVisibility) : profile.sectionVisibility,
        socials: profile.socials.map(s => ({
            ...s,
            // Cast platform to correct type or validate
            platform: s.platform as any,
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
