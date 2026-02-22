"use client";

import { useState, useTransition, useRef } from "react";
import { updateProfileInfo } from "@/app/admin/settings/actions";
import { SettingsAvatarUpload } from "@/components/settings/SettingsAvatarUpload";
import { SettingsToggle } from "@/components/settings/SettingsToggle";
import { CheckCircle2, XCircle } from "lucide-react";

interface ProfileEditFormProps {
    profileId: string;
    initialData: {
        displayName: string;
        bio: string;
        location: string;
        avatarUrl: string;
        verified: boolean;
    };
}

function Field({
    id, label, value, onChange, placeholder, multiline, maxLength, error,
}: {
    id: string; label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; multiline?: boolean; maxLength?: number; error?: string;
}) {
    const baseClass =
        "w-full px-4 py-2.5 rounded-xl text-sm border border-border bg-background text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all";

    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-sm font-medium text-foreground">{label}</label>
            {multiline ? (
                <textarea
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    rows={3}
                    className={`${baseClass} resize-none min-h-[80px] leading-relaxed`}
                />
            ) : (
                <input
                    id={id}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={`${baseClass} h-11`}
                />
            )}
            <div className="flex justify-between items-center">
                {error && <p className="text-xs text-red-500 flex-1" role="alert">{error}</p>}
                {maxLength && (
                    <p className={`text-xs tabular-nums ml-auto ${value.length >= maxLength ? "text-red-500" : "text-muted-foreground"}`}>
                        {value.length}/{maxLength}
                    </p>
                )}
            </div>
        </div>
    );
}

export function ProfileEditForm({ profileId, initialData }: ProfileEditFormProps) {
    const [displayName, setDisplayName] = useState(initialData.displayName);
    const [bio, setBio] = useState(initialData.bio);
    const [location, setLocation] = useState(initialData.location);
    const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl);
    const [verified, setVerified] = useState(initialData.verified);
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);
    const [nameError, setNameError] = useState<string | undefined>(undefined);

    const handleSave = () => {
        if (!displayName.trim()) {
            setNameError("Display name cannot be empty.");
            return;
        }
        setNameError(undefined);
        startTransition(async () => {
            const res = await updateProfileInfo(profileId, { displayName, bio, location, avatarUrl, verified });
            setResult(res);
        });
    };

    return (
        <div className="space-y-6">
            {/* Photo */}
            <section className="bg-card rounded-2xl border border-border p-6 space-y-5">
                <div>
                    <h2 className="text-base font-semibold text-foreground">Profile Photo</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Upload a photo to personalize this profile.</p>
                </div>
                <SettingsAvatarUpload
                    value={avatarUrl}
                    onChange={setAvatarUrl}
                    name={displayName}
                />
            </section>

            {/* Info */}
            <section className="bg-card rounded-2xl border border-border p-6 space-y-5">
                <div>
                    <h2 className="text-base font-semibold text-foreground">Profile Info</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">This appears publicly on your profile page.</p>
                </div>

                <Field id="displayName" label="Display Name" value={displayName} onChange={setDisplayName} placeholder="Your name" maxLength={60} error={nameError} />
                <Field id="bio" label="Bio" value={bio} onChange={setBio} placeholder="A short intro about you…" multiline maxLength={200} />
                <Field id="location" label="Location" value={location} onChange={setLocation} placeholder="City, Country" maxLength={80} />

                <hr className="border-border" />

                {/* Verified badge */}
                <div className="flex items-center justify-between gap-6">
                    <div className="space-y-0.5">
                        <label htmlFor="verified-toggle" className="text-sm font-medium text-foreground cursor-pointer">Verified Badge</label>
                        <p className="text-xs text-muted-foreground">Show a visual badge next to your name.</p>
                    </div>
                    <SettingsToggle
                        id="verified-toggle"
                        checked={verified}
                        onChange={setVerified}
                        label="Verified Badge"
                    />
                </div>
            </section>

            {/* Feedback + Save */}
            <div className="space-y-3">
                {result && (
                    <div
                        role="alert"
                        className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl border ${result.success
                                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                            }`}
                    >
                        {result.success
                            ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            : <XCircle className="w-4 h-4 flex-shrink-0" />}
                        {result.success ? "Profile saved successfully." : result.error}
                    </div>
                )}

                <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="h-11 px-8 rounded-xl text-sm font-semibold bg-foreground text-background hover:opacity-90 disabled:opacity-50 transition-all"
                >
                    {isPending ? "Saving…" : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
