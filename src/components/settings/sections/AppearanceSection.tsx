"use client";

import { SettingsSectionCard, SettingsDivider } from "@/components/settings/SettingsSectionCard";
import { SettingsColorSwatch } from "@/components/settings/SettingsColorSwatch";
import { SegmentedControl } from "@/components/settings/SettingsSelect";
import { Settings, Theme, AccentColor, LinkStyle } from "@/hooks/useSettingsStore";
import { Sun, Moon, Monitor, AlignLeft, LayoutGrid, Square } from "lucide-react";

interface AppearanceSectionProps {
    settings: Settings;
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

const THEME_OPTIONS = [
    { value: "light" as Theme, label: "Light", icon: Sun },
    { value: "dark" as Theme, label: "Dark", icon: Moon },
    { value: "system" as Theme, label: "System", icon: Monitor },
];

const LINK_STYLE_OPTIONS = [
    { value: "rounded" as LinkStyle, label: "Rounded", icon: Square },
    { value: "minimal" as LinkStyle, label: "Minimal", icon: AlignLeft },
    { value: "card" as LinkStyle, label: "Card", icon: LayoutGrid },
];

const FONT_OPTIONS = [
    { value: "geist", label: "Geist" },
    { value: "inter", label: "Inter" },
    { value: "mono", label: "Mono" },
];

export function AppearanceSection({ settings, updateSetting }: AppearanceSectionProps) {
    return (
        <div className="space-y-4">
            {/* Theme */}
            <SettingsSectionCard
                title="Theme"
                description="Choose how Link-Nexo looks for you. System follows your device preference."
            >
                <SegmentedControl
                    label="Color mode"
                    value={settings.theme}
                    onChange={(val) => updateSetting("theme", val as Theme)}
                    options={THEME_OPTIONS}
                />
            </SettingsSectionCard>

            {/* Accent & Font */}
            <SettingsSectionCard
                title="Colors & Typography"
                description="Personalize the accent color and font style used across your profile."
            >
                <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Accent color</p>
                    <SettingsColorSwatch
                        value={settings.accentColor}
                        onChange={(val) => updateSetting("accentColor", val as AccentColor)}
                    />
                </div>

                <SettingsDivider />

                <SegmentedControl
                    label="Font style"
                    value={settings.fontStyle}
                    onChange={(val) => updateSetting("fontStyle", val as "geist" | "inter" | "mono")}
                    options={FONT_OPTIONS}
                />
            </SettingsSectionCard>

            {/* Link Style */}
            <SettingsSectionCard
                title="Link Style"
                description="Choose the visual variant for the link cards on your profile."
            >
                <SegmentedControl
                    label="Link card variant"
                    value={settings.linkStyle}
                    onChange={(val) => updateSetting("linkStyle", val as LinkStyle)}
                    options={LINK_STYLE_OPTIONS}
                />

                {/* Live preview */}
                <div className="mt-2 space-y-2">
                    <p className="text-xs text-muted-foreground">Preview</p>
                    <LinkPreview style={settings.linkStyle} />
                </div>
            </SettingsSectionCard>
        </div>
    );
}

function LinkPreview({ style }: { style: LinkStyle }) {
    const base = "w-full flex items-center gap-3 px-4 py-3 transition-all";
    const variants: Record<LinkStyle, string> = {
        rounded: `${base} bg-foreground/5 border border-border rounded-2xl`,
        minimal: `${base} bg-transparent border-b border-border`,
        card: `${base} bg-card border border-border rounded-xl shadow-sm`,
    };

    return (
        <div className="space-y-2 pointer-events-none select-none" aria-hidden="true">
            {["My Portfolio", "Latest Course"].map((label) => (
                <div key={label} className={variants[style]}>
                    <div className="w-8 h-8 rounded-lg bg-muted flex-shrink-0" />
                    <div className="space-y-1 flex-1">
                        <div className="h-2.5 w-32 bg-foreground/20 rounded-full" />
                        <div className="h-2 w-20 bg-muted-foreground/30 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}
