"use client";

import { useState, useTransition } from "react";
import { updateProfileInfo } from "@/app/admin/settings/actions";
import { SettingsAvatarUpload } from "@/components/settings/SettingsAvatarUpload";
import { SettingsToggle } from "@/components/settings/SettingsToggle";
import { CheckCircle2, XCircle } from "lucide-react";
import { parseLocation } from "@/lib/utils";
import { COUNTRIES } from "@/lib/countries";

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
    const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl);
    const [verified, setVerified] = useState(initialData.verified);
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);
    const [nameError, setNameError] = useState<string | undefined>(undefined);

    const parsedLoc = parseLocation(initialData.location);
    const isStructured = typeof parsedLoc === "object";
    const [city, setCity] = useState(isStructured ? parsedLoc.city : "");
    const [country, setCountry] = useState(isStructured ? parsedLoc.country : (parsedLoc === "Everywhere, World" ? "WORLD" : ""));

    const handleSave = () => {
        if (!displayName.trim()) {
            setNameError("Display name cannot be empty.");
            return;
        }
        setNameError(undefined);

        let finalLocationString = "";
        if (country === "WORLD") {
            finalLocationString = "Everywhere, World";
        } else if (city || country) {
            const countryName = COUNTRIES.find(c => c.code === country)?.name || "";
            const display = [city, countryName].filter(Boolean).join(", ");
            finalLocationString = JSON.stringify({ city, country, display });
        }

        startTransition(async () => {
            const res = await updateProfileInfo(profileId, { displayName, bio, location: finalLocationString, avatarUrl, verified });
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

                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-foreground">Location</label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                            className="w-full px-4 py-2.5 rounded-xl text-sm border border-border bg-background text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all h-11"
                        />
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl text-sm border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all h-11 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010L12%2015L17%2010%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:calc(100%-12px)_center] pr-10"
                        >
                            <option value="" disabled>Select Country</option>
                            {COUNTRIES.map(c => (
                                <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

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
