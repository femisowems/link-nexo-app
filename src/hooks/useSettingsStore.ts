"use client";

import { useState, useCallback, useRef } from "react";
import { updatePreferences } from "@/app/actions";

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

export const DEFAULT_SETTINGS: Settings = {
    displayName: "User",
    bio: "",
    location: "Everywhere",
    avatarUrl: "",
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
    onToast?: (msg: string, options?: { onUndo?: () => void }) => void,
    initialSettings?: Partial<Settings>
): UseSettingsStore {
    // We start with database initialSettings if provided, else fallback to defaults.
    // LocalStorage will override this on mount if `loadSettings` finds it, but we can prioritize server initialSettings.
    const startingSettings = { ...DEFAULT_SETTINGS, ...initialSettings };
    const [settings, setSettings] = useState<Settings>(startingSettings);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const prevSettings = useRef<Settings>(startingSettings);

    // Load from localStorage on mount, but allow server prop `initialSettings` to take precedence if present
    const loadSettings = useCallback(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            let parsed = { ...DEFAULT_SETTINGS };

            if (stored) {
                parsed = { ...parsed, ...JSON.parse(stored) };
            }

            // Always let server-provided initial settings override local cache
            if (initialSettings) {
                parsed = { ...parsed, ...initialSettings };
            }

            setSettings(parsed);
            prevSettings.current = parsed;
            applyRootClasses(parsed);
        } catch {
            // Silently fall back to defaults if storage is corrupt
            if (initialSettings) {
                const parsed = { ...DEFAULT_SETTINGS, ...initialSettings };
                setSettings(parsed);
                applyRootClasses(parsed);
            }
        }
    }, [initialSettings]);

    // Make sure we apply classes on initial mount to avoid flickering if possible, or wait for effect
    // But since this is a client component, `applyRootClasses` is safe here.

    // Persist settings to localStorage AND Database via Server Action
    const persistSettings = useCallback(async (next: Settings) => {
        try {
            // 1. Save to local storage for instant read on browser refresh
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

            // 2. Save to database for public profile visibility
            await updatePreferences(JSON.stringify(next));

            setHasUnsavedChanges(false);
        } catch {
            // Ignore storage errors (private browsing, quota exceeded, network error)
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
