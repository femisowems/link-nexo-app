"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Palette, Link2, Accessibility, Shield } from "lucide-react";

import { SettingsNav, SettingsTab } from "@/components/settings/SettingsNav";
import { ProfileSection } from "@/components/settings/sections/ProfileSection";
import { AppearanceSection } from "@/components/settings/sections/AppearanceSection";
import { LinkBehaviorSection } from "@/components/settings/sections/LinkBehaviorSection";
import { AccessibilitySection } from "@/components/settings/sections/AccessibilitySection";
import { DataPrivacySection } from "@/components/settings/sections/DataPrivacySection";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { useToast } from "@/components/ui/Toast";

// ─── Tab Config ────────────────────────────────────────────────────────────────

type TabId = "profile" | "appearance" | "links" | "accessibility" | "privacy";

const TABS: SettingsTab[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "links", label: "Links", icon: Link2 },
    { id: "accessibility", label: "Accessibility", icon: Accessibility },
    { id: "privacy", label: "Data & Privacy", icon: Shield },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabId>("profile");
    const { showToast } = useToast();

    const { settings, hasUnsavedChanges, updateSetting, resetSettings, exportSettings } =
        useSettingsStore((msg, opts) => showToast(msg, opts));

    const tabs: SettingsTab[] = TABS.map((t) => ({
        ...t,
        hasUnsavedChanges: hasUnsavedChanges && t.id === activeTab,
    }));

    const dur = settings.reduceMotion ? 0 : 0.22;
    const panelVariants = {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0, transition: { duration: dur, ease: "easeOut" as const } },
        exit: { opacity: 0, y: -6, transition: { duration: settings.reduceMotion ? 0 : 0.15 } },
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Nav */}
            <aside className="lg:w-56 lg:flex-shrink-0">
                <div className="lg:sticky lg:top-[73px]">
                    <SettingsNav
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={(id) => setActiveTab(id as TabId)}
                    />
                </div>
            </aside>

            {/* Right: Panel */}
            <main className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        variants={panelVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        role="tabpanel"
                        id={`settings-panel-${activeTab}`}
                        aria-labelledby={`settings-tab-${activeTab}`}
                    >
                        {activeTab === "profile" && (
                            <ProfileSection settings={settings} updateSetting={updateSetting} />
                        )}
                        {activeTab === "appearance" && (
                            <AppearanceSection settings={settings} updateSetting={updateSetting} />
                        )}
                        {activeTab === "links" && (
                            <LinkBehaviorSection settings={settings} updateSetting={updateSetting} />
                        )}
                        {activeTab === "accessibility" && (
                            <AccessibilitySection settings={settings} updateSetting={updateSetting} />
                        )}
                        {activeTab === "privacy" && (
                            <DataPrivacySection
                                settings={settings}
                                exportSettings={exportSettings}
                                resetSettings={resetSettings}
                                reduceMotion={settings.reduceMotion}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
