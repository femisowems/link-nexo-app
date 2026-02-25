"use client";

import { useState, useCallback } from "react";
import { Profile } from "@/types";
import { CheckCircle2, MapPin, Eye, EyeOff, Edit2, Check, Share2 } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import Image from "next/image";
import { motion } from "framer-motion";
import { InlineEdit } from "@/components/ui/InlineEdit";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { ProfileShareModal } from "./ProfileShareModal";

interface ProfileHeaderProps {
    profile: Profile;
    editable?: boolean;
}

export function ProfileHeader({ profile, editable = false }: ProfileHeaderProps) {
    const [isVisible, setIsVisible] = useState(profile.sectionVisibility?.profile ?? true);
    const [isEditable, setIsEditable] = useState(false); // Local edit mode toggle, governed by prop
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // Restore profile state
    const [name, setName] = useState(profile.name);
    const [bio, setBio] = useState(profile.bio);

    // Track Location parts
    const isStructured = typeof profile.location === 'object' && profile.location !== null;
    const initialCity = isStructured ? (profile.location as { city?: string }).city || "" : "";
    const initialCountry = isStructured ? (profile.location as { country?: string }).country || "" : (profile.location === "Everywhere, World" ? "WORLD" : "");
    const initialDisplay = isStructured ? (profile.location as { display?: string }).display || "" : (typeof profile.location === "string" ? profile.location : "");

    const [city, setCity] = useState<string>(initialCity);
    const [country, setCountry] = useState<string>(initialCountry);
    const [displayLocation, setDisplayLocation] = useState<string>(initialDisplay);

    const { showToast } = useToast();

    // Mock save handler
    const handleSave = async (field: string, value: string, setter: (val: string) => void) => {
        const previousValue = field === "name" ? name : field === "bio" ? bio : displayLocation;

        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 600));
        setter(value);

        showToast("Saved", {
            onUndo: () => {
                setter(previousValue);
                if (field === "location") {
                    setCity(initialCity);
                    setCountry(initialCountry);
                }
            }
        });
    };

    const handleLocationChange = (newCity: string, newCountry: string) => {
        setCity(newCity);
        setCountry(newCountry);

        let newDisplay = "";
        if (newCountry === "WORLD") {
            newDisplay = "Everywhere, World";
        } else if (newCity || newCountry) {
            const countryName = COUNTRIES.find(c => c.code === newCountry)?.name || "";
            newDisplay = [newCity, countryName].filter(Boolean).join(", ");
        }

        // Firing the save handler to run the toast and update mock state
        handleSave("location", newDisplay, setDisplayLocation);
    };

    const handleToggleVisibility = () => {
        setIsVisible(!isVisible);
        showToast(isVisible ? "Profile section hidden" : "Profile section visible", {
            onUndo: () => setIsVisible(isVisible)
        });
    };

    // If hidden and not editing, don't render anything
    if (!isVisible && !isEditable) {
        if (!editable) return null;

        return (
            <div className="w-full flex justify-center mb-4">
                {/* Hidden state controller - allows you to enter edit mode */}
                <button
                    onClick={() => setIsEditable(true)}
                    className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-all px-3 py-1.5 rounded-full hover:bg-muted/50 opacity-0 hover:opacity-100"
                    title="Show Header Controls"
                >
                    <Edit2 className="w-3 h-3" /> Edit Profile
                </button>
            </div>
        );
    }

    return (
        <div className={cn(
            "flex flex-col items-center text-center space-y-4 mb-8 w-full transition-opacity duration-300 relative group",
            !isVisible && "opacity-50 grayscale"
        )}>
            {/* Edit Controls */}
            {editable && (
                <div className="absolute top-0 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setIsEditable(!isEditable)}
                        className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-all px-3 py-1.5 rounded-full bg-muted/30 hover:bg-muted/80 backdrop-blur-sm"
                    >
                        {isEditable ? (
                            <>
                                <Check className="w-3 h-3" /> Done
                            </>
                        ) : (
                            <>
                                <Edit2 className="w-3 h-3" /> Edit Profile
                            </>
                        )}
                    </button>
                    {isEditable && (
                        <button
                            onClick={handleToggleVisibility}
                            className={cn(
                                "flex items-center gap-2 text-xs font-medium transition-all px-3 py-1.5 rounded-full backdrop-blur-sm",
                                !isVisible ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                            )}
                            title={!isVisible ? "Show Section" : "Hide Section"}
                        >
                            {!isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                    )}
                </div>
            )}

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative mt-8"
            >
                <div className="relative">
                    <div className="rounded-full overflow-hidden border-4 border-background shadow-lg w-24 h-24 sm:w-28 sm:h-28 bg-muted relative">
                        <Image
                            src={profile.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${profile.handle}`}
                            alt={name || "Profile"}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 96px, 112px"
                        />
                    </div>

                    {/* Public Share Button */}
                    {!isEditable && !editable && (
                        <button
                            onClick={() => setIsShareModalOpen(true)}
                            className="absolute -top-1 -right-1 p-2 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow border border-slate-100 dark:border-slate-700 transition-all hover:-translate-y-0.5 z-10"
                            aria-label="Share profile"
                            title="Share profile"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="space-y-2 px-4 w-full flex flex-col items-center"
            >
                <div className="flex items-center justify-center gap-2 relative group w-full max-w-md">
                    {isEditable ? (
                        <InlineEdit
                            value={name}
                            onSave={(val) => handleSave("name", val, setName)}
                            className="text-xl sm:text-2xl font-bold text-foreground tracking-tight"
                            inputClassName="text-xl sm:text-2xl font-bold text-center font-sans"
                            label="Name"
                        />
                    ) : (
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{name}</h1>
                    )}

                    {profile.verified && (
                        <CheckCircle2 className="w-5 h-5 text-blue-500 absolute -right-6 top-1/2 -translate-y-1/2 hidden sm:block" aria-label="Verified Profile" />
                    )}
                </div>
                {profile.verified && (
                    <div className="sm:hidden flex items-center gap-1 text-xs text-blue-500 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                    </div>
                )}

                <p className="text-sm font-medium text-muted-foreground">{profile.handle}</p>

                <div className="w-full max-w-sm mx-auto">
                    {isEditable ? (
                        <InlineEdit
                            value={bio}
                            onSave={(val) => handleSave("bio", val, setBio)}
                            multiline
                            className="text-base text-foreground/80 leading-relaxed block"
                            inputClassName="text-base text-center leading-relaxed"
                            label="Bio"
                        />
                    ) : (
                        <p className="text-base text-foreground/80 leading-relaxed block">{bio}</p>
                    )}
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1 w-full max-w-xs">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {isEditable ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={city}
                                onBlur={(e) => handleLocationChange(e.target.value, country)}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="City"
                                className="w-[100px] sm:w-[120px] bg-transparent hover:bg-muted/50 focus:bg-background border border-transparent focus:border-border rounded-md px-2 py-1 text-center text-xs outline-none transition-all placeholder:text-muted-foreground/50"
                            />
                            <select
                                value={country}
                                onChange={(e) => handleLocationChange(city, e.target.value)}
                                className="w-[120px] sm:w-[140px] bg-transparent hover:bg-muted/50 focus:bg-background border border-transparent focus:border-border rounded-md px-2 py-1 text-xs outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Country</option>
                                {COUNTRIES.map(c => (
                                    <option key={c.code} value={c.code}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <span>{displayLocation}</span>
                    )}
                </div>
            </motion.div>

            <ProfileShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                profileHandle={profile.handle || ""}
                profileAvatar={profile.avatarUrl}
            />
        </div>
    );
}
