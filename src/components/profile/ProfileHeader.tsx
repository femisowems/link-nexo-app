"use client";

import { useState } from "react";
import { Profile } from "@/types";
import { CheckCircle2, MapPin, Eye, EyeOff, Edit2, Check } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { InlineEdit } from "@/components/ui/InlineEdit";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
    profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
    const [isVisible, setIsVisible] = useState(profile.sectionVisibility?.profile ?? true);
    const [isEditable, setIsEditable] = useState(false);

    // Restore profile state
    const [name, setName] = useState(profile.name);
    const [bio, setBio] = useState(profile.bio);
    const [location, setLocation] = useState(profile.location || "");

    const { showToast } = useToast();

    // Mock save handler
    const handleSave = async (field: string, value: string, setter: (val: string) => void) => {
        const previousValue = field === "name" ? name : field === "bio" ? bio : location;

        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 600));
        setter(value);

        showToast("Saved", {
            onUndo: () => {
                setter(previousValue);
                // In a real app, you'd also revert backend state here
            }
        });
        console.log(`Saved ${field}:`, value);
    };

    const handleToggleVisibility = () => {
        setIsVisible(!isVisible);
        showToast(isVisible ? "Profile section hidden" : "Profile section visible", {
            onUndo: () => setIsVisible(isVisible)
        });
    };

    // If hidden and not editing, don't render anything
    if (!isVisible && !isEditable) {
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

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative mt-8"
            >
                <div className="rounded-full overflow-hidden border-4 border-background shadow-lg w-24 h-24 sm:w-28 sm:h-28">
                    <Image
                        src={profile.avatarUrl}
                        alt={name}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 96px, 112px"
                    />
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
                        <InlineEdit
                            value={location}
                            onSave={(val) => handleSave("location", val, setLocation)}
                            className="min-w-[100px]"
                            inputClassName="text-center text-xs"
                            label="Location"
                        />
                    ) : (
                        <span>{location}</span>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
