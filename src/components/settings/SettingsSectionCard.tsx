"use client";

import { ReactNode } from "react";

interface SettingsSectionCardProps {
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
}

export function SettingsSectionCard({ title, description, children, className }: SettingsSectionCardProps) {
    return (
        <section
            className={`bg-card rounded-2xl border border-border p-6 space-y-6 ${className ?? ""}`}
            aria-label={title}
        >
            <div className="space-y-1">
                <h2 className="text-base font-semibold text-foreground tracking-tight">{title}</h2>
                {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}
            </div>
            <div className="space-y-5">{children}</div>
        </section>
    );
}

interface SettingsRowProps {
    label: string;
    description?: string;
    htmlFor?: string;
    children: ReactNode;
}

export function SettingsRow({ label, description, htmlFor, children }: SettingsRowProps) {
    return (
        <div className="flex items-center justify-between gap-6 py-1">
            <div className="flex-1 min-w-0 space-y-0.5">
                <label htmlFor={htmlFor} className="text-sm font-medium text-foreground cursor-pointer select-none">
                    {label}
                </label>
                {description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                )}
            </div>
            <div className="flex-shrink-0">{children}</div>
        </div>
    );
}

export function SettingsDivider() {
    return <hr className="border-border" />;
}
