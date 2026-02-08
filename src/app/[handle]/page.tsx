import { notFound } from "next/navigation";
import { mockData } from "@/data/mock-data";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SocialRow } from "@/components/profile/SocialRow";
import { LinkList } from "@/components/links/LinkList";
import { Footer } from "@/components/layout/Footer";

// In a real app, this would be an async database call
async function getProfileData(handle: string) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // For demo purposes, we return the same mock data for any handle
    // In reality, check if handle matches
    if (!handle) return null;

    // We can customize the name based on the handle for the demo
    const data = { ...mockData };
    if (handle !== "demo" && handle !== data.profile.handle.replace("@", "")) {
        // Just to show dynamic capabilities, we could potentially return 404
        // or just render the default mock data as requested.
        // Let's keep it simple and return the mock data for any valid-looking handle.
    }

    return data;
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
    const { handle } = await params;
    const data = await getProfileData(handle);

    if (!data) return {};

    return {
        title: `${data.profile.name} (@${handle}) | Link-Nexo`,
        description: data.profile.bio,
    };
}

export default async function ProfilePage({ params }: { params: Promise<{ handle: string }> }) {
    const { handle } = await params;
    const data = await getProfileData(handle);

    if (!data) {
        notFound();
    }

    return (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            <ProfileHeader profile={data.profile} />
            <SocialRow socials={data.profile.socials || []} />
            <LinkList links={data.links} />

            {/* Debug Info for Custom Domain Verification */}
            {/* In production, remove this or hide behind a flag */}
            <div className="mt-8 p-4 text-xs text-muted-foreground bg-muted/30 rounded-lg max-w-md text-center">
                <p>Debug: Served via {handle}</p>
            </div>

            <div className="flex-grow min-h-[50px]" /> {/* Spacer */}
            <Footer />
        </div>
    );
}
