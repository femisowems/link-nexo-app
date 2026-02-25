import React from "react";
import { PrimaryOfferTemplate } from "@/types";

export type PrimaryOfferCardProps = {
    title: string;
    description?: string;
    href: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
    ctaLabel?: string;
    price?: string;
    originalPrice?: string;
    rating?: string;
    thumbnailUrl?: string;
    badge?: string;
    layout?: string;
    accent: string;
    template?: PrimaryOfferTemplate;
    reduceMotion?: boolean;
};

// Shared token styles for accent colors across all templates
export const accentStyles: Record<string, { cta: string; focus: string; fallbackBg: string; text: string; bg: string; border: string }> = {
    blue: {
        cta: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20",
        focus: "focus-visible:ring-blue-500",
        fallbackBg: "bg-blue-600 text-white",
        text: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-900",
    },
    violet: {
        cta: "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/20",
        focus: "focus-visible:ring-violet-500",
        fallbackBg: "bg-violet-600 text-white",
        text: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-50 dark:bg-violet-900/20",
        border: "border-violet-200 dark:border-violet-900",
    },
    rose: {
        cta: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20",
        focus: "focus-visible:ring-rose-500",
        fallbackBg: "bg-rose-600 text-white",
        text: "text-rose-600 dark:text-rose-400",
        bg: "bg-rose-50 dark:bg-rose-900/20",
        border: "border-rose-200 dark:border-rose-900",
    },
    amber: {
        cta: "bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-amber-500/20",
        focus: "focus-visible:ring-amber-500",
        fallbackBg: "bg-amber-500 text-amber-950",
        text: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-900/20",
        border: "border-amber-200 dark:border-amber-900",
    },
    emerald: {
        cta: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20",
        focus: "focus-visible:ring-emerald-500",
        fallbackBg: "bg-emerald-600 text-white",
        text: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        border: "border-emerald-200 dark:border-emerald-900",
    },
    slate: {
        cta: "bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white shadow-slate-500/20",
        focus: "focus-visible:ring-slate-500",
        fallbackBg: "bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900",
        text: "text-slate-800 dark:text-slate-100",
        bg: "bg-slate-100 dark:bg-slate-800",
        border: "border-slate-200 dark:border-slate-700",
    },
};
