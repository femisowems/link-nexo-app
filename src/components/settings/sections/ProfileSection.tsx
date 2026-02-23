"use client";

import { useState } from "react";
import { SettingsSectionCard, SettingsDivider } from "@/components/settings/SettingsSectionCard";
import { SettingsInput } from "@/components/settings/SettingsInput";
import { SettingsAvatarUpload } from "@/components/settings/SettingsAvatarUpload";
import { SettingsToggle } from "@/components/settings/SettingsToggle";
import { SettingsRow } from "@/components/settings/SettingsSectionCard";
import { Settings } from "@/hooks/useSettingsStore";
import { ShieldCheck } from "lucide-react";

interface ProfileSectionProps {
    settings: Settings;
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export function ProfileSection({ settings, updateSetting }: ProfileSectionProps) {
    const [nameError, setNameError] = useState<string | undefined>(undefined);

    const handleNameChange = (val: string) => {
        if (!val.trim()) {
            setNameError("Display name cannot be empty.");
        } else {
            setNameError(undefined);
            updateSetting("displayName", val);
        }
    };

    return (
        <div className="space-y-4">
            {/* Avatar */}
            <SettingsSectionCard
                title="Profile Photo"
                description="Upload a photo to personalize your profile."
            >
                <SettingsAvatarUpload
                    value={settings.avatarUrl}
                    onChange={(url) => updateSetting("avatarUrl", url)}
                    name={settings.displayName}
                />
            </SettingsSectionCard>

            {/* Profile Info */}
            <SettingsSectionCard
                title="Profile Info"
                description="This information appears publicly on your profile page."
            >
                <SettingsInput
                    label="Display Name"
                    value={settings.displayName}
                    onChange={handleNameChange}
                    placeholder="Your name"
                    maxLength={60}
                    error={nameError}
                />

                <SettingsInput
                    label="Bio"
                    value={settings.bio}
                    onChange={(val) => updateSetting("bio", val)}
                    placeholder="A short description of who you are..."
                    multiline
                    maxLength={200}
                />

                <SettingsInput
                    label="Location"
                    value={settings.location}
                    onChange={(val) => updateSetting("location", val)}
                    placeholder="City, Country"
                    maxLength={80}
                />

                <SettingsDivider />

                <SettingsRow
                    label="Verified Badge"
                    description="Display a visual verified badge next to your name (decorative only)."
                    htmlFor="verified-badge-toggle"
                >
                    <SettingsToggle
                        id="verified-badge-toggle"
                        checked={settings.verifiedBadge}
                        onChange={(val) => updateSetting("verifiedBadge", val)}
                        label="Verified Badge"
                    />
                </SettingsRow>

                {settings.verifiedBadge && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                        <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <p className="text-xs leading-relaxed">
                            The verified badge is visual-only and not backed by a verification process. It&apos;ll appear on your public profile.
                        </p>
                    </div>
                )}
            </SettingsSectionCard>
        </div>
    );
}
