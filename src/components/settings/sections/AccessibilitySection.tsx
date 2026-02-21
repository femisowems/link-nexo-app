"use client";

import { SettingsSectionCard, SettingsRow, SettingsDivider } from "@/components/settings/SettingsSectionCard";
import { SettingsToggle } from "@/components/settings/SettingsToggle";
import { Settings } from "@/hooks/useSettingsStore";
import { Info } from "lucide-react";

interface AccessibilitySectionProps {
    settings: Settings;
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export function AccessibilitySection({ settings, updateSetting }: AccessibilitySectionProps) {
    return (
        <div className="space-y-4">
            <SettingsSectionCard
                title="Accessibility"
                description="These settings apply globally to help you interact with Link-Nexo more comfortably."
            >
                <SettingsRow
                    label="Reduce motion"
                    description="Disables animations and transitions for a calmer experience."
                    htmlFor="reduce-motion-toggle"
                >
                    <SettingsToggle
                        id="reduce-motion-toggle"
                        checked={settings.reduceMotion}
                        onChange={(val) => updateSetting("reduceMotion", val)}
                        label="Reduce motion"
                        reduceMotion={settings.reduceMotion}
                    />
                </SettingsRow>

                <SettingsDivider />

                <SettingsRow
                    label="High contrast mode"
                    description="Increases color contrast for better legibility."
                    htmlFor="high-contrast-toggle"
                >
                    <SettingsToggle
                        id="high-contrast-toggle"
                        checked={settings.highContrastMode}
                        onChange={(val) => updateSetting("highContrastMode", val)}
                        label="High contrast mode"
                        reduceMotion={settings.reduceMotion}
                    />
                </SettingsRow>

                <SettingsDivider />

                <SettingsRow
                    label="Larger text"
                    description="Increases the base font size across the application."
                    htmlFor="larger-text-toggle"
                >
                    <SettingsToggle
                        id="larger-text-toggle"
                        checked={settings.largerText}
                        onChange={(val) => updateSetting("largerText", val)}
                        label="Larger text"
                        reduceMotion={settings.reduceMotion}
                    />
                </SettingsRow>
            </SettingsSectionCard>

            <div className="flex items-start gap-2.5 p-4 rounded-xl bg-muted/50 border border-border">
                <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Accessibility settings apply instantly and are saved to your browser. They affect the Link-Nexo editor
                    and admin interface. Your public profile page inherits the viewer&apos;s system preferences.
                </p>
            </div>
        </div>
    );
}
