/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { PrimaryOfferCardProps, accentStyles } from "../types";

export function ElevatedPrimaryOffer({
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
                "group relative w-full mx-auto rounded-[1.25rem] bg-[#FDFBF7] dark:bg-card shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-border/10 transition-all outline-none",
                layout === "compact" && "max-w-[26rem]",
                styles.focus,
                "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-background p-4"
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

            <div className="flex flex-col gap-4 relative">

                {/* Top Section: Image + Content */}
                <div className="flex items-start gap-4 w-full">
                    {/* Square Thumbnail */}
                    {(thumbnailUrl || Icon) && (
                        <div className={cn(
                            "w-[70px] h-[70px] sm:w-[75px] sm:h-[75px] rounded-[14px] flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm",
                            !thumbnailUrl && styles.fallbackBg
                        )}>
                            {thumbnailUrl ? (
                                <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
                            ) : Icon ? (
                                <Icon className="w-8 h-8 opacity-90" />
                            ) : null}
                        </div>
                    )}

                    {/* Text block */}
                    <div className="flex flex-col flex-1 min-w-0 pt-0.5">
                        <h3
                            id={`offer-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
                            className="font-bold text-base sm:text-[17px] text-foreground tracking-tight leading-tight truncate mb-1"
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
                            <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                                {price && (
                                    <span className="text-sm font-extrabold text-foreground tracking-tight">
                                        {price}
                                    </span>
                                )}
                                {originalPrice && (
                                    <span className="text-sm font-medium text-muted-foreground/50 line-through">
                                        {originalPrice}
                                    </span>
                                )}
                                {rating && (
                                    <div className="bg-[#FFC933] text-amber-950 px-1.5 py-0.5 rounded-[5px] flex items-center gap-0.5 shadow-sm ml-0.5">
                                        <Star className="w-2.5 h-2.5 fill-current" />
                                        <span className="text-[10px] font-bold leading-none">{rating}</span>
                                    </div>
                                )}
                                {badge && (
                                    <span className="bg-rose-200 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 font-bold px-1.5 py-0.5 rounded-[5px] text-[10px] uppercase tracking-wider shadow-sm ml-0.5">
                                        {badge}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Section: Full-width Button */}
                {ctaLabel && (
                    <div className="w-full relative z-20 mt-1">
                        <a
                            href={href}
                            className={cn(
                                "flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold text-[13px] shadow-sm transition-transform active:scale-[0.98] outline-none",
                                styles.cta,
                                styles.focus
                            )}
                            tabIndex={-1}
                        >
                            {ctaLabel}
                            <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
