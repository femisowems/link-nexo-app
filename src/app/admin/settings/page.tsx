import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { EmailSection, PasswordSection } from "@/app/admin/settings/AccountSection";
import { AppearanceSettingsClient } from "@/app/admin/settings/AppearanceSettingsClient";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { profiles } from "@/db/schema";
import { Settings } from "@/hooks/useSettingsStore";

export const metadata = { title: "Settings — Link-Nexo Admin" };

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, session.user.id),
    });

    let initialPreferences: Partial<Settings> | undefined;

    if (profile?.preferences) {
        try {
            initialPreferences = JSON.parse(profile.preferences);
        } catch (e) {
            console.error("Failed to parse profile preferences", e);
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences.</p>
            </div>

            {/* Account — server-rendered with live email */}
            <section className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Account</h2>
                <EmailSection currentEmail={session.user.email ?? ""} />
                <PasswordSection />
            </section>

            {/* Appearance / Accessibility etc — client-side local prefs */}
            <section className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Preferences</h2>
                <AppearanceSettingsClient initialPreferences={initialPreferences} />
            </section>
        </div>
    );
}
