"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Link2, Accessibility, Shield } from "lucide-react";

import { SettingsNav, SettingsTab } from "@/components/settings/SettingsNav";
import { AppearanceSection } from "@/components/settings/sections/AppearanceSection";
import { LinkBehaviorSection } from "@/components/settings/sections/LinkBehaviorSection";
import { AccessibilitySection } from "@/components/settings/sections/AccessibilitySection";
import { DataPrivacySection } from "@/components/settings/sections/DataPrivacySection";
import { useSettingsStore, Settings } from "@/hooks/useSettingsStore";
import { useToast } from "@/components/ui/Toast";

type TabId = "appearance" | "links" | "accessibility" | "privacy";

const TABS: SettingsTab[] = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "links", label: "Links", icon: Link2 },
    { id: "accessibility", label: "Accessibility", icon: Accessibility },
    { id: "privacy", label: "Data & Privacy", icon: Shield },
];

export function AppearanceSettingsClient({ initialPreferences }: { initialPreferences?: Partial<Settings> }) {
    const [activeTab, setActiveTab] = useState<TabId>("appearance");
    const { showToast } = useToast();
    const { settings, hasUnsavedChanges, updateSetting, resetSettings, exportSettings } =
        useSettingsStore((msg, opts) => showToast(msg, opts), initialPreferences);

    const tabs = TABS.map((t) => ({
        ...t,
        hasUnsavedChanges: hasUnsavedChanges && t.id === activeTab,
    }));

    const dur = settings.reduceMotion ? 0 : 0.2;

    return (
        <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex flex-col sm:flex-row gap-6">
                {/* Mini left nav */}
                <aside className="sm:w-44 flex-shrink-0">
                    <SettingsNav tabs={tabs} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as TabId)} />
                </aside>

                {/* Panel */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0, transition: { duration: dur, ease: "easeOut" as const } }}
                            exit={{ opacity: 0, y: -4, transition: { duration: dur * 0.7 } }}
                            role="tabpanel"
                        >
                            {activeTab === "appearance" && <AppearanceSection settings={settings} updateSetting={updateSetting} />}
                            {activeTab === "links" && <LinkBehaviorSection settings={settings} updateSetting={updateSetting} />}
                            {activeTab === "accessibility" && <AccessibilitySection settings={settings} updateSetting={updateSetting} />}
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
                </div>
            </div>
        </div>
    );
}
