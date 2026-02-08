"use client";

import { Social } from "@/types";
import { Github, Linkedin, Twitter, Youtube, Mail, Instagram, Globe } from "lucide-react";
import Link from "next/link"; // Use explicit Next Link for potential internal routing or prefetching, though typically external.
import { trackEvent } from "@/lib/analytics";

interface SocialRowProps {
    socials: Social[];
}

const iconMap = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    youtube: Youtube,
    email: Mail,
    instagram: Instagram,
    website: Globe
};

export function SocialRow({ socials }: SocialRowProps) {
    if (!socials || socials.length === 0) return null;

    return (
        <div className="flex items-center justify-center gap-4 mt-8 mb-12 flex-wrap">
            {socials.map((social) => {
                const Icon = iconMap[social.platform as keyof typeof iconMap] || Globe;

                return (
                    <a
                        key={social.platform}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        aria-label={social.label || `Visit our ${social.platform} page`}
                        onClick={() => trackEvent("click_social", { platform: social.platform })}
                    >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                );
            })}
        </div>
    );
}
