import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "../src/db";
import { users, profiles, links, socials } from "../src/db/schema";
import { mockData } from "../src/data/mock-data";

async function main() {
    console.log("Seeding database...");

    const userEmail = "sarah@example.com";
    const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, userEmail),
    });

    let userId = user?.id;

    if (!userId) {
        console.log("Creating user...");
        const [newUser] = await db.insert(users).values({
            name: mockData.profile.name,
            email: userEmail,
            image: mockData.profile.avatarUrl,
            emailVerified: new Date(),
        }).returning();
        userId = newUser.id;
    } else {
        console.log("User already exists, skipping creation.");
    }

    console.log("Creating profile...");
    // Check if profile exists
    const existingProfile = await db.query.profiles.findFirst({
        where: (profiles, { eq }) => eq(profiles.handle, "sarah.dev"),
    });

    if (existingProfile) {
        console.log("Profile already exists, updating...");
        // update profile
        await db.update(profiles).set({
            userId: userId,
            bio: mockData.profile.bio,
            location: mockData.profile.location,
            avatarUrl: mockData.profile.avatarUrl,
            verified: mockData.profile.verified,
            sectionVisibility: JSON.stringify(mockData.profile.sectionVisibility),
        }).where(eq(profiles.id, existingProfile.id));

        // delete existing links and socials to re-seed
        await db.delete(links).where(eq(links.profileId, existingProfile.id));
        await db.delete(socials).where(eq(socials.profileId, existingProfile.id));

        console.log("Re-seeding links and socials...");
        // Re-insert links
        if (mockData.links) {
            await db.insert(links).values(mockData.links.map((link, index) => ({
                profileId: existingProfile.id,
                title: link.title,
                href: link.href,
                icon: link.icon,
                visible: true,
                order: index,
            })));
        }

        // Re-insert socials
        if (mockData.profile.socials) {
            await db.insert(socials).values(mockData.profile.socials.map((social, index) => ({
                profileId: existingProfile.id,
                platform: social.platform,
                href: social.href,
                label: social.label,
                visible: social.visible,
                order: index,
            })));
        }

    } else {
        console.log("Creating new profile...");
        const [newProfile] = await db.insert(profiles).values({
            userId: userId,
            handle: "sarah.dev",
            bio: mockData.profile.bio,
            location: mockData.profile.location,
            avatarUrl: mockData.profile.avatarUrl,
            verified: mockData.profile.verified,
            sectionVisibility: JSON.stringify(mockData.profile.sectionVisibility),
        }).returning();

        // Insert Links
        if (mockData.links) {
            await db.insert(links).values(mockData.links.map((link, index) => ({
                profileId: newProfile.id,
                title: link.title,
                href: link.href,
                icon: link.icon,
                visible: true,
                order: index,
            })));
        }

        // Insert Socials
        if (mockData.profile.socials) {
            await db.insert(socials).values(mockData.profile.socials.map((social, index) => ({
                profileId: newProfile.id,
                platform: social.platform,
                href: social.href,
                label: social.label,
                visible: social.visible,
                order: index,
            })));
        }
    }

    console.log("Seeding complete!");
    process.exit(0);
}

import { eq } from "drizzle-orm";

main().catch((err) => {
    console.error("Seeding failed");
    console.error(err);
    process.exit(1);
});
