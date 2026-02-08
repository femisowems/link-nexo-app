"use client";

import { Profile } from "@/types";
import { CheckCircle2, MapPin } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
    profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
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
                        alt={profile.name}
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
                className="space-y-2 px-4"
            >
                <div className="flex items-center justify-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                        {profile.name}
                    </h1>
                    {profile.verified && (
                        <CheckCircle2 className="w-5 h-5 text-blue-500" aria-label="Verified Profile" />
                    )}
                </div>
                <p className="text-sm font-medium text-muted-foreground">{profile.handle}</p>

                <p className="text-base text-foreground/80 max-w-sm mx-auto leading-relaxed">
                    {profile.bio}
                </p>

                {profile.location && (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{profile.location}</span>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
