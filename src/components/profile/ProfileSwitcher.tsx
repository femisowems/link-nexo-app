/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Profile {
    id: string;
    handle: string;
    avatarUrl: string | null;
}

interface ProfileSwitcherProps {
    profiles: Profile[];
    activeProfileId: string;
}

export function ProfileSwitcher({ profiles, activeProfileId }: ProfileSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

    const handleSelect = (profileId: string) => {
        setIsOpen(false);
        const params = new URLSearchParams(searchParams.toString());
        params.set("profileId", profileId);
        // Remove 'new' if it exists when switching to an existing profile
        params.delete("new");
        router.push(`/admin?${params.toString()}`);
    };

    const handleCreateNew = () => {
        setIsOpen(false);
        const params = new URLSearchParams(searchParams.toString());
        params.set("new", "true");
        // We can optionally clear profileId so that the page knows we want a new one
        params.delete("profileId");
        router.push(`/admin?${params.toString()}`);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-[200px] px-3 py-2 text-sm border border-border rounded-md bg-background hover:bg-muted/50 transition-colors"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-2 truncate">
                    {activeProfile?.avatarUrl ? (
                        <img
                            src={activeProfile.avatarUrl}
                            alt={activeProfile.handle}
                            className="w-5 h-5 rounded-full bg-muted object-cover"
                        />
                    ) : (
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                            {activeProfile?.handle?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="truncate font-medium">/{activeProfile?.handle}</span>
                </div>
                <ChevronsUpDown className="w-4 h-4 text-muted-foreground shrink-0 opacity-50" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-1 w-[200px] bg-white dark:bg-zinc-950 border border-border rounded-md shadow-md z-50 py-1 flex flex-col max-h-[300px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                        {profiles.map((profile) => (
                            <button
                                key={profile.id}
                                onClick={() => handleSelect(profile.id)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left w-full",
                                    activeProfileId === profile.id && "bg-muted/50 font-medium"
                                )}
                            >
                                {profile.avatarUrl ? (
                                    <img
                                        src={profile.avatarUrl}
                                        alt={profile.handle}
                                        className="w-5 h-5 rounded-full bg-muted object-cover"
                                    />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                                        {profile.handle.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="truncate flex-1">/{profile.handle}</span>
                                {activeProfileId === profile.id && (
                                    <Check className="w-4 h-4 text-primary shrink-0" />
                                )}
                            </button>
                        ))}

                        {profiles.length > 0 && (
                            <div className="h-px bg-border my-1 mx-2" />
                        )}

                        <button
                            onClick={handleCreateNew}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 transition-colors text-left w-full"
                        >
                            <PlusCircle className="w-4 h-4 shrink-0" />
                            <span className="truncate">Create new profile</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
