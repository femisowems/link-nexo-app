/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { PrimaryOfferCardProps, accentStyles } from "../types";

export function MinimalPrimaryOffer({
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
                "group relative w-full mx-auto rounded-[1.25rem] bg-transparent border border-border/40 transition-all outline-none",
                layout === "compact" && "max-w-[26rem]",
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

            <div className="flex flex-col gap-3 relative">

                {/* Top Section: Image + Content */}
                <div className="flex items-center sm:items-start gap-3 w-full">
                    {/* Square Thumbnail */}
                    {(thumbnailUrl || Icon) && (
                        <div className={cn(
                            "w-[50px] h-[50px] sm:w-[55px] sm:h-[55px] rounded-[12px] flex-shrink-0 flex items-center justify-center overflow-hidden border border-border/20",
                            !thumbnailUrl && styles.bg,
                            !thumbnailUrl && styles.text
                        )}>
                            {thumbnailUrl ? (
                                <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
                            ) : Icon ? (
                                <Icon className="w-6 h-6 opacity-90" />
                            ) : null}
                        </div>
                    )}

                    {/* Text block */}
                    <div className="flex flex-col flex-1 min-w-0">
                        <h3
                            id={`offer-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
                            className="font-bold text-[15px] sm:text-base text-foreground tracking-tight leading-tight truncate mb-0.5"
                        >
                            {title}
                        </h3>

                        {description && (
                            <p className="text-[11.5px] sm:text-xs text-muted-foreground/80 leading-snug line-clamp-1 sm:line-clamp-2">
                                {description}
                            </p>
                        )}

                        {/* Pricing & Badges Row */}
                        {(price || originalPrice || rating || badge) && (
                            <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                                {price && (
                                    <span className="text-xs font-bold text-foreground tracking-tight">
                                        {price}
                                    </span>
                                )}
                                {originalPrice && (
                                    <span className="text-[11px] font-medium text-muted-foreground/50 line-through">
                                        {originalPrice}
                                    </span>
                                )}
                                {rating && (
                                    <div className="bg-[#FFC933]/10 text-amber-600 dark:text-amber-500 px-1.5 py-0.5 rounded-[4px] flex items-center gap-0.5 ml-0.5">
                                        <Star className="w-2.5 h-2.5 fill-current" />
                                        <span className="text-[10px] font-bold leading-none">{rating}</span>
                                    </div>
                                )}
                                {badge && (
                                    <span className="text-muted-foreground font-bold text-[9px] uppercase tracking-wider ml-0.5">
                                        • {badge}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Section: Full-width Button */}
                {ctaLabel && (
                    <div className="w-full relative z-20 mt-0.5">
                        <button
                            className={cn(
                                "flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl font-semibold text-[13px] transition-transform active:scale-[0.98] outline-none",
                                styles.bg,
                                styles.text,
                                styles.focus
                            )}
                            onClick={() => { }} // No-op
                            tabIndex={-1}
                        >
                            {ctaLabel}
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
