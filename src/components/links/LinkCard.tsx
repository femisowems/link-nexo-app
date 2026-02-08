"use client";

import { LinkItem } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ExternalLink, Globe, Mail, Calendar, Youtube, Github, Twitter, Linkedin, Star, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface LinkCardProps {
    link: LinkItem;
    priority?: boolean;
}

const iconMap = {
    website: Globe,
    email: Mail,
    calendar: Calendar,
    youtube: Youtube,
    github: Github,
    twitter: Twitter,
    linkedin: Linkedin,
    custom: Star,
};

export function LinkCard({ link, priority = false }: LinkCardProps) {
    const Icon = link.icon ? iconMap[link.icon as keyof typeof iconMap] || Globe : null;
    const isFeatured = link.variant === "featured";

    return (
        <motion.a
            href={link.href}
            target={link.openInNewTab ? "_blank" : undefined}
            rel={link.openInNewTab ? "noopener noreferrer" : undefined}
            onClick={() => trackEvent(link.analyticsEventName || "click_link", { url: link.href, id: link.id })}
            className={cn(
                "group relative flex items-center w-full p-4 mb-3 rounded-2xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                isFeatured
                    ? "bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary/95 focus-visible:ring-primary"
                    : "bg-card text-card-foreground border border-border shadow-sm hover:shadow-md hover:border-black/50 hover:bg-muted/30 focus-visible:ring-ring"
            )}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            layout
        >
            {/* Icon Section */}
            {Icon && (
                <div className={cn(
                    "flex-shrink-0 mr-4 p-2 rounded-xl",
                    isFeatured ? "bg-white/10" : "bg-muted text-foreground"
                )}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
            )}

            {/* Content Section */}
            <div className="flex-grow min-w-0 flex flex-col items-start text-left">
                <span className={cn(
                    "font-semibold text-base sm:text-lg leading-tight truncate w-full",
                    isFeatured ? "text-primary-foreground" : "text-foreground"
                )}>
                    {link.title}
                </span>
                {link.subtitle && (
                    <span className={cn(
                        "text-xs sm:text-sm mt-0.5 truncate w-full opacity-90",
                        isFeatured ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                        {link.subtitle}
                    </span>
                )}
            </div>

            {/* Right Action / Chevron */}
            <div className={cn(
                "ml-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0"
            )}>
                <ExternalLink className={cn("w-4 h-4", isFeatured ? "text-primary-foreground" : "text-muted-foreground")} />
            </div>

            {/* Badge */}
            {link.badge && (
                <div className="absolute -top-2 -right-2 transform rotate-3">
                    <span className={cn(
                        "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm border",
                        link.badge === "NEW" ? "bg-blue-500 text-white border-blue-600" :
                            link.badge === "LIVE" ? "bg-red-500 text-white border-red-600 animate-pulse" :
                                "bg-amber-400 text-amber-950 border-amber-500" // Featured/Hot
                    )}>
                        {link.badge === "FEATURED" && <Sparkles className="w-3 h-3 inline-block mr-0.5 -mt-0.5" />}
                        {link.badge}
                    </span>
                </div>
            )}
        </motion.a>
    );
}
