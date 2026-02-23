"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { PrimaryOfferCardProps, accentStyles } from "../types";

export function SplitPrimaryOffer({
    title,
    description,
    href,
    icon: Icon,
    ctaLabel,
    price,
    originalPrice,
    rating,
    thumbnailUrl,
    badge,
    layout = "full",
    accent = "blue",
    reduceMotion = false,
}: PrimaryOfferCardProps) {
    const styles = accentStyles[accent] || accentStyles.blue;

    return (
        <motion.div
            layout={!reduceMotion}
            initial={!reduceMotion ? { opacity: 0, scale: 0.98, y: 10 } : { opacity: 1, scale: 1, y: 0 }}
            animate={!reduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            whileHover={!reduceMotion ? { y: -2 } : undefined}
            whileTap={!reduceMotion ? { scale: 0.98 } : undefined}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
                "group relative w-full mx-auto rounded-[1.25rem] bg-card shadow-sm border border-border/20 transition-all outline-none overflow-hidden",
                layout === "compact" && "max-w-[32rem]",
                styles.focus,
                "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-background"
            )}
            role="region"
            aria-labelledby={`offer-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
        >
            <a
                href={href}
                className="absolute inset-0 z-10 outline-none rounded-[1.25rem]"
                aria-label={`Go to ${title}`}
            >
                <span className="sr-only">Go to {title}</span>
            </a>

            <div className="flex flex-col sm:flex-row relative">

                {/* Content Area */}
                <div className="flex flex-col sm:flex-row items-start gap-4 p-4 flex-1">
                    {/* Square Thumbnail */}
                    {(thumbnailUrl || Icon) && (
                        <div className={cn(
                            "w-[60px] h-[60px] rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm",
                            !thumbnailUrl && styles.fallbackBg
                        )}>
                            {thumbnailUrl ? (
                                <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
                            ) : Icon ? (
                                <Icon className="w-6 h-6 opacity-90" />
                            ) : null}
                        </div>
                    )}

                    {/* Text block */}
                    <div className="flex flex-col flex-1 min-w-0 pt-1">
                        <h3
                            id={`offer-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
                            className="font-bold text-base text-foreground tracking-tight leading-tight truncate mb-1"
                        >
                            {title}
                        </h3>

                        {description && (
                            <p className="text-[12px] text-muted-foreground/80 leading-snug line-clamp-2">
                                {description}
                            </p>
                        )}

                        {/* Pricing & Badges Row */}
                        {(price || originalPrice || rating || badge) && (
                            <div className="flex items-center gap-1.5 flex-wrap mt-2">
                                {price && (
                                    <span className="text-sm font-extrabold text-foreground tracking-tight">
                                        {price}
                                    </span>
                                )}
                                {originalPrice && (
                                    <span className="text-xs font-medium text-muted-foreground/50 line-through">
                                        {originalPrice}
                                    </span>
                                )}
                                {rating && (
                                    <div className="bg-[#FFC933] text-amber-950 px-1.5 py-0.5 rounded-[4px] flex items-center gap-0.5 shadow-sm ml-0.5">
                                        <Star className="w-2.5 h-2.5 fill-current" />
                                        <span className="text-[10px] font-bold leading-none">{rating}</span>
                                    </div>
                                )}
                                {badge && (
                                    <span className="bg-rose-200 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 font-bold px-1.5 py-0.5 rounded-[4px] text-[10px] uppercase tracking-wider shadow-sm ml-0.5">
                                        {badge}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Vertical Divider (desktop) / Horizontal Divider (mobile) */}
                <div className="w-full h-px sm:w-px sm:h-auto bg-border/20 flex-shrink-0" />

                {/* Action Area */}
                <div className={cn(
                    "p-4 flex items-center justify-center sm:w-[140px] sm:min-w-[140px] flex-shrink-0",
                    styles.bg
                )}>
                    <button
                        className={cn(
                            "flex items-center justify-center gap-1.5 w-full px-3 py-2.5 rounded-lg font-semibold text-[13px] shadow-sm transition-transform active:scale-[0.98] outline-none",
                            styles.cta,
                            styles.focus
                        )}
                        onClick={(e) => { }} // No-op
                        tabIndex={-1}
                    >
                        {ctaLabel || "View"}
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
