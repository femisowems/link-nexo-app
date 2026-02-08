"use client";

import { useState } from "react";
import { Profile } from "@/types";
import { CheckCircle2, MapPin } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { InlineEdit } from "@/components/ui/InlineEdit";
import { useToast } from "@/components/ui/Toast";

interface ProfileHeaderProps {
    profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
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

    return (
        <div className="flex flex-col items-center text-center space-y-4 mb-8 w-full">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative"
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
                    <InlineEdit
                        value={name}
                        onSave={(val) => handleSave("name", val, setName)}
                        className="text-xl sm:text-2xl font-bold text-foreground tracking-tight"
                        inputClassName="text-xl sm:text-2xl font-bold text-center font-sans"
                        label="Name"
                    />
                    {profile.verified && (
                        <CheckCircle2 className="w-5 h-5 text-blue-500 absolute -right-6top-1/2 -translate-y-1/2 hidden sm:block" aria-label="Verified Profile" />
                    )}
                    {/* Maintain layout for verified badge on mobile/desktop appropriately if needed, 
                        or just let it sit next to input if we wrap them. 
                        For now, inline edit blocks are full width mostly.
                    */}
                </div>
                {profile.verified && (
                    <div className="sm:hidden flex items-center gap-1 text-xs text-blue-500 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                    </div>
                )}

                <p className="text-sm font-medium text-muted-foreground">{profile.handle}</p>

                <div className="w-full max-w-sm mx-auto">
                    <InlineEdit
                        value={bio}
                        onSave={(val) => handleSave("bio", val, setBio)}
                        multiline
                        className="text-base text-foreground/80 leading-relaxed block"
                        inputClassName="text-base text-center leading-relaxed"
                        label="Bio"
                    />
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1 w-full max-w-xs">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <InlineEdit
                        value={location}
                        onSave={(val) => handleSave("location", val, setLocation)}
                        className="min-w-[100px]"
                        inputClassName="text-center text-xs"
                        label="Location"
                    />
                </div>
            </motion.div>
        </div>
    );
}
