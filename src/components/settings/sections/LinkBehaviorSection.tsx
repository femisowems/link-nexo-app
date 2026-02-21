"use client";

import { SettingsSectionCard, SettingsRow, SettingsDivider } from "@/components/settings/SettingsSectionCard";
import { SettingsToggle } from "@/components/settings/SettingsToggle";
import { Settings } from "@/hooks/useSettingsStore";
import { ExternalLink, Star, BarChart2 } from "lucide-react";

interface LinkBehaviorSectionProps {
    settings: Settings;
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export function LinkBehaviorSection({ settings, updateSetting }: LinkBehaviorSectionProps) {
    return (
        <SettingsSectionCard
            title="Link Behavior"
            description="Control how links behave and appear on your profile."
        >
            <SettingsRow
                label="Open links in new tab"
                description="All links on your profile will open in a new browser tab."
                htmlFor="new-tab-toggle"
            >
                <SettingsToggle
                    id="new-tab-toggle"
                    checked={settings.openLinksInNewTab}
                    onChange={(val) => updateSetting("openLinksInNewTab", val)}
                    label="Open links in new tab"
                    reduceMotion={settings.reduceMotion}
                />
            </SettingsRow>

            <SettingsDivider />

            <SettingsRow
                label="Enable featured badges"
                description="Show NEW, LIVE, and FEATURED badges on highlighted links."
                htmlFor="badges-toggle"
            >
                <SettingsToggle
                    id="badges-toggle"
                    checked={settings.enableFeaturedBadges}
                    onChange={(val) => updateSetting("enableFeaturedBadges", val)}
                    label="Enable featured badges"
                    reduceMotion={settings.reduceMotion}
                />
            </SettingsRow>

            <SettingsDivider />

            <SettingsRow
                label="Enable click analytics"
                description="Track click counts per link. No third-party data is collected."
                htmlFor="analytics-toggle"
            >
                <SettingsToggle
                    id="analytics-toggle"
                    checked={settings.enableClickAnalytics}
                    onChange={(val) => updateSetting("enableClickAnalytics", val)}
                    label="Enable click analytics"
                    reduceMotion={settings.reduceMotion}
                />
            </SettingsRow>

            {/* Visual indicator of active toggles */}
            <div className="flex flex-wrap gap-2 pt-1">
                {settings.openLinksInNewTab && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-1 rounded-full">
                        <ExternalLink className="w-3 h-3" /> New Tab
                    </span>
                )}
                {settings.enableFeaturedBadges && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-violet-600 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-400 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3" /> Badges
                    </span>
                )}
                {settings.enableClickAnalytics && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-1 rounded-full">
                        <BarChart2 className="w-3 h-3" /> Analytics
                    </span>
                )}
            </div>
        </SettingsSectionCard>
    );
}
