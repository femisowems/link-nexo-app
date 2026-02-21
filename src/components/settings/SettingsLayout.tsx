"use client";

import { ReactNode } from "react";

interface SettingsLayoutProps {
    nav: ReactNode;
    children: ReactNode;
}

export function SettingsLayout({ nav, children }: SettingsLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            {/* Page header */}
            <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
                    <h1 className="text-xl font-bold text-foreground tracking-tight">Settings</h1>
                    <span className="text-muted-foreground hidden sm:block">·</span>
                    <p className="text-sm text-muted-foreground hidden sm:block">Manage your profile and preferences</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
                {/* Mobile: nav on top, desktop: two-column */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Nav */}
                    <aside className="lg:w-56 lg:flex-shrink-0">
                        <div className="lg:sticky lg:top-[73px]">{nav}</div>
                    </aside>

                    {/* Right: Content */}
                    <main className="flex-1 min-w-0 space-y-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
