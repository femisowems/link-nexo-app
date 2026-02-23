/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { PrimaryOfferCardProps, accentStyles } from "../types";

export function BannerPrimaryOffer({
    title,

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
                "group relative w-full mx-auto rounded-[1.25rem] shadow-sm transition-all outline-none overflow-hidden",
                layout === "compact" && "max-w-[26rem]",
                styles.bg,
                styles.border,
                "border-[1.5px]",
                styles.focus,
                "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-background p-3 sm:p-4"
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

            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 relative">

                {/* Square Thumbnail */}
                {(thumbnailUrl || Icon) && (
                    <div className={cn(
                        "w-[48px] h-[48px] rounded-[10px] flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm bg-background/50 backdrop-blur-sm"
                    )}>
                        {thumbnailUrl ? (
                            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
                        ) : Icon ? (
                            <Icon className={cn("w-5 h-5 opacity-90", styles.text)} />
                        ) : null}
                    </div>
                )}

                {/* Text block */}
                <div className="flex flex-col flex-1 min-w-0 text-center sm:text-left">
                    <h3
                        id={`offer-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
                        className={cn("font-bold text-[15px] sm:text-base tracking-tight leading-tight truncate", styles.text)}
                    >
                        {title}
                    </h3>

                    {/* Pricing & Badges Row */}
                    {(price || originalPrice || rating || badge) && (
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap mt-0.5">
                            {price && (
                                <span className={cn("text-xs font-bold tracking-tight", styles.text)}>
                                    {price}
                                </span>
                            )}
                            {originalPrice && (
                                <span className={cn("text-[11px] font-medium opacity-60 line-through", styles.text)}>
                                    {originalPrice}
                                </span>
                            )}
                            {rating && (
                                <div className="bg-white/20 dark:bg-black/20 px-1 py-0.5 rounded-[4px] flex items-center gap-0.5 ml-0.5">
                                    <Star className={cn("w-2 h-2 fill-current", styles.text)} />
                                    <span className={cn("text-[9px] font-bold leading-none", styles.text)}>{rating}</span>
                                </div>
                            )}
                            {badge && (
                                <span className={cn("font-bold text-[9px] uppercase tracking-wider ml-0.5 opacity-80", styles.text)}>
                                    • {badge}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Action */}
                {ctaLabel && (
                    <div className="w-full sm:w-auto relative z-20 mt-2 sm:mt-0 flex-shrink-0">
                        <button
                            className={cn(
                                "flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-[12px] shadow-sm transition-transform active:scale-[0.98] outline-none",
                                styles.cta,
                                styles.focus
                            )}
                            onClick={() => { }} // No-op
                            tabIndex={-1}
                        >
                            {ctaLabel}
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
