"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type PrimaryOfferCardProps = {
    title: string;
    description?: string;
    href: string;
    icon?: LucideIcon;
    ctaLabel?: string;
    price?: string;
    badge?: string;
    accent: string;
    reduceMotion?: boolean;
};

const accentStyles: Record<string, { wrapper: string; badge: string; cta: string; focus: string }> = {
    blue: {
        wrapper: "border-blue-200/50 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20",
        badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        cta: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20",
        focus: "focus-visible:ring-blue-500",
    },
    violet: {
        wrapper: "border-violet-200/50 dark:border-violet-900/50 bg-violet-50/50 dark:bg-violet-950/20",
        badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 border-violet-200 dark:border-violet-800",
        cta: "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/20",
        focus: "focus-visible:ring-violet-500",
    },
    rose: {
        wrapper: "border-rose-200/50 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20",
        badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 border-rose-200 dark:border-rose-800",
        cta: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20",
        focus: "focus-visible:ring-rose-500",
    },
    amber: {
        wrapper: "border-amber-200/50 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20",
        badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        cta: "bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-amber-500/20",
        focus: "focus-visible:ring-amber-500",
    },
    emerald: {
        wrapper: "border-emerald-200/50 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20",
        badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        cta: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20",
        focus: "focus-visible:ring-emerald-500",
    },
    slate: {
        wrapper: "border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20",
        badge: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700",
        cta: "bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white shadow-slate-500/20",
        focus: "focus-visible:ring-slate-500",
    },
};

export function PrimaryOfferCard({
    title,
    description,
    href,
    icon: Icon,
    ctaLabel,
    price,
    badge,
    accent = "blue",
    reduceMotion = false,
}: PrimaryOfferCardProps) {
    const styles = accentStyles[accent] || accentStyles.blue;

    // We treat the main card wrapper as the actionable area
    return (
        <motion.div
            layout={!reduceMotion}
            initial={!reduceMotion ? { opacity: 0, scale: 0.98, y: 10 } : { opacity: 1, scale: 1, y: 0 }}
            animate={!reduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            whileHover={!reduceMotion ? { y: -2 } : undefined}
            whileTap={!reduceMotion ? { scale: 0.98 } : undefined}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
                "group relative w-full rounded-2xl border p-1 shadow-sm transition-all outline-none",
                styles.wrapper,
                styles.focus,
                "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-background"
            )}
            role="region"
            aria-labelledby={`offer-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
        >
            <a
                href={href}
                className="absolute inset-0 z-10 outline-none rounded-2xl"
                aria-label={`Go to ${title}`}
            >
                <span className="sr-only">Go to {title}</span>
            </a>

            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 bg-card rounded-xl p-4 md:p-5 border border-border/50 h-full w-full">

                {/* Left side: Content */}
                <div className="flex flex-1 items-start gap-4 min-w-0">
                    {Icon && (
                        <div className={cn(
                            "flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-muted/50 text-foreground",
                            "group-hover:scale-105 transition-transform duration-300",
                            reduceMotion && "group-hover:scale-100"
                        )}>
                            <Icon className="w-6 h-6" />
                        </div>
                    )}

                    <div className="flex flex-col min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            {badge && (
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm",
                                    styles.badge
                                )}>
                                    {badge}
                                </span>
                            )}
                            {/** Extra logic: if price is present, we can show it here or down near the CTA */}
                            {price && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-foreground border border-border/50 whitespace-nowrap">
                                    {price}
                                </span>
                            )}
                        </div>

                        <h3
                            id={`offer-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
                            className="font-bold text-lg sm:text-xl text-foreground tracking-tight leading-tight truncate"
                        >
                            {title}
                        </h3>

                        {description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right side: Optional CTA Button */}
                {ctaLabel && (
                    <div className="w-full md:w-auto mt-2 md:mt-0 flex-shrink-0 relative z-20">
                        <button
                            className={cn(
                                "w-full md:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all active:scale-95 outline-none min-h-[44px]",
                                styles.cta,
                                styles.focus
                            )}
                            onClick={(e) => {
                                // Stop propagation so we don't double fire if wrapping `a` intercepts, 
                                // but we still want navigation to happen. We can programmatic nav or let bubble.
                                // Actually, since the `<a>` covers the entire card, clicking the button triggers the link
                                // naturally if we don't stop propagation. But if stopping, we must manually nav.
                                // Alternatively, simply making this a non-interactive `div` that *looks* like a button is safer for nested anchors.
                                // But accessibility dictates interactive focus rules. 
                                // Best practice for click-through cards: make the wrapper the link, and button just a visual affordance.
                            }}
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
