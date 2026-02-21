"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark" | "system";
export type AccentColor = "blue" | "violet" | "rose" | "amber" | "emerald" | "slate";
export type FontStyle = "geist" | "inter" | "mono";
export type LinkStyle = "rounded" | "minimal" | "card";

export interface Settings {
    // Profile
    displayName: string;
    bio: string;
    location: string;
    avatarUrl: string;
    verifiedBadge: boolean;

    // Appearance
    theme: Theme;
    accentColor: AccentColor;
    fontStyle: FontStyle;
    linkStyle: LinkStyle;

    // Link Behavior
    openLinksInNewTab: boolean;
    enableFeaturedBadges: boolean;
    enableClickAnalytics: boolean;

    // Accessibility
    reduceMotion: boolean;
    highContrastMode: boolean;
    largerText: boolean;
}

const DEFAULT_SETTINGS: Settings = {
    displayName: "Sarah Jenkins",
    bio: "Principal Frontend Engineer building high-performance web apps. Creating content about React, Next.js, and Design Systems.",
    location: "San Francisco, CA",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4",
    verifiedBadge: false,

    theme: "system",
    accentColor: "blue",
    fontStyle: "geist",
    linkStyle: "rounded",

    openLinksInNewTab: true,
    enableFeaturedBadges: true,
    enableClickAnalytics: false,

    reduceMotion: false,
    highContrastMode: false,
    largerText: false,
};

const STORAGE_KEY = "link-nexo-settings";

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseSettingsStore {
    settings: Settings;
    hasUnsavedChanges: boolean;
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
    resetSettings: () => void;
    loadSettings: () => void;
    exportSettings: () => void;
}

export function useSettingsStore(
    onToast?: (msg: string, options?: { onUndo?: () => void }) => void
): UseSettingsStore {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const prevSettings = useRef<Settings>(DEFAULT_SETTINGS);

    // Load from localStorage on mount
    const loadSettings = useCallback(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } as Settings;
                setSettings(parsed);
                prevSettings.current = parsed;
                applyRootClasses(parsed);
            }
        } catch {
            // Silently fall back to defaults if storage is corrupt
        }
    }, []);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    // Persist settings to localStorage
    const persistSettings = useCallback((next: Settings) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            setHasUnsavedChanges(false);
        } catch {
            // Ignore storage errors (private browsing, quota exceeded)
        }
    }, []);

    // Optimistic update with debounced auto-save
    const updateSetting = useCallback(
        <K extends keyof Settings>(key: K, value: Settings[K]) => {
            const previous = settings[key];

            // Optimistic update
            setSettings((prev) => {
                const next = { ...prev, [key]: value };
                applyRootClasses(next);
                return next;
            });
            setHasUnsavedChanges(true);

            // Toast feedback
            if (onToast) {
                onToast("Setting saved", {
                    onUndo: () => {
                        setSettings((prev) => {
                            const reverted = { ...prev, [key]: previous };
                            applyRootClasses(reverted);
                            return reverted;
                        });
                    },
                });
            }

            // Debounced persist
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                setSettings((current) => {
                    persistSettings(current);
                    return current;
                });
            }, 500);
        },
        [settings, onToast, persistSettings]
    );

    // Reset to defaults
    const resetSettings = useCallback(() => {
        setSettings(DEFAULT_SETTINGS);
        applyRootClasses(DEFAULT_SETTINGS);
        persistSettings(DEFAULT_SETTINGS);
        setHasUnsavedChanges(false);
        if (onToast) {
            onToast("Settings reset to defaults");
        }
    }, [onToast, persistSettings]);

    // Export profile JSON
    const exportSettings = useCallback(() => {
        const data = JSON.stringify(settings, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "link-nexo-profile.json";
        a.click();
        URL.revokeObjectURL(url);
        if (onToast) {
            onToast("Profile exported as JSON");
        }
    }, [settings, onToast]);

    return { settings, hasUnsavedChanges, updateSetting, resetSettings, loadSettings, exportSettings };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function applyRootClasses(settings: Settings) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    // Theme
    if (settings.theme === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
    } else if (settings.theme === "light") {
        root.classList.add("light");
        root.classList.remove("dark");
    } else {
        root.classList.remove("dark", "light");
    }

    // Accessibility
    root.classList.toggle("reduce-motion", settings.reduceMotion);
    root.classList.toggle("high-contrast", settings.highContrastMode);
    root.classList.toggle("larger-text", settings.largerText);

    // Accent color as data attribute (consumed by CSS var)
    root.setAttribute("data-accent", settings.accentColor);

    // Link style as data attribute
    root.setAttribute("data-link-style", settings.linkStyle);
}
