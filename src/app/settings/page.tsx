import { DomainSettings } from "@/components/settings/DomainSettings";
import { mockData } from "@/data/mock-data";
import { Footer } from "@/components/layout/Footer";

// This page is for demonstration purposes to show the settings UI
// In a real app, it would be protected by auth
export default function SettingsPage() {
    const { profile } = mockData;
    // Use mock data properties
    const isPro = profile.isPro || false;
    const customDomains = profile.customDomains || [];

    return (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-500 py-12 px-4">
            <div className="w-full max-w-lg mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground">Manage your account and preferences.</p>
            </div>

            <DomainSettings initialDomains={customDomains} isPro={isPro} />

            <div className="flex-grow min-h-[50px]" />
            <Footer />
        </div>
    );
}
