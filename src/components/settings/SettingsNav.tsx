"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SettingsTab {
    id: string;
    label: string;
    icon: LucideIcon;
    hasUnsavedChanges?: boolean;
}

interface SettingsNavProps {
    tabs: SettingsTab[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export function SettingsNav({ tabs, activeTab, onTabChange }: SettingsNavProps) {
    return (
        <>
            {/* Desktop: vertical sidebar */}
            <nav
                className="hidden lg:flex flex-col gap-1"
                aria-label="Settings navigation"
                role="tablist"
                aria-orientation="vertical"
            >
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`settings-panel-${tab.id}`}
                            id={`settings-tab-${tab.id}`}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full group outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                isActive
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="settings-nav-active"
                                    className="absolute inset-0 bg-muted rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                />
                            )}
                            <tab.icon
                                className={cn(
                                    "w-4 h-4 relative z-10 transition-colors",
                                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                )}
                                aria-hidden="true"
                            />
                            <span className="relative z-10">{tab.label}</span>
                            {tab.hasUnsavedChanges && (
                                <span
                                    className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-blue-500"
                                    aria-label="Unsaved changes"
                                />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Mobile: horizontal scrollable segmented control */}
            <div className="lg:hidden overflow-x-auto -mx-4 px-4 pb-1">
                <nav
                    className="flex gap-1 w-max min-w-full bg-muted/50 rounded-xl p-1"
                    aria-label="Settings navigation"
                    role="tablist"
                >
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                role="tab"
                                aria-selected={isActive}
                                aria-controls={`settings-panel-${tab.id}`}
                                onClick={() => onTabChange(tab.id)}
                                className={cn(
                                    "relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                    isActive
                                        ? "bg-card text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <tab.icon className="w-3.5 h-3.5" aria-hidden="true" />
                                {tab.label}
                                {tab.hasUnsavedChanges && (
                                    <span className="w-1 h-1 rounded-full bg-blue-500" aria-label="Unsaved changes" />
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
