"use client";

import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
    value: string;
    label: string;
    description?: string;
}

interface SettingsSelectProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    options: SelectOption[];
    disabled?: boolean;
    className?: string;
}

export function SettingsSelect({ value, onChange, label, options, disabled, className }: SettingsSelectProps) {
    const id = useId();

    return (
        <div className={cn("space-y-1.5", className)}>
            <label htmlFor={id} className="block text-sm font-medium text-foreground">
                {label}
            </label>
            <div className="relative">
                <select
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={cn(
                        "w-full appearance-none h-11 pl-4 pr-10 rounded-xl text-sm font-medium",
                        "bg-background border border-border text-foreground",
                        "outline-none transition-all cursor-pointer",
                        "focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                    aria-hidden="true"
                />
            </div>
        </div>
    );
}

// Inline variant: segmented control / radio group for small option sets
interface SegmentedOption {
    value: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface SegmentedControlProps {
    value: string;
    onChange: (value: string) => void;
    options: SegmentedOption[];
    label: string;
    disabled?: boolean;
}

export function SegmentedControl({ value, onChange, options, label, disabled }: SegmentedControlProps) {
    const id = useId();
    return (
        <div className="space-y-1.5">
            <p id={id} className="text-sm font-medium text-foreground">
                {label}
            </p>
            <div
                role="radiogroup"
                aria-labelledby={id}
                className="flex bg-muted rounded-xl p-1 gap-1"
            >
                {options.map((opt) => {
                    const isActive = value === opt.value;
                    return (
                        <button
                            key={opt.value}
                            role="radio"
                            aria-checked={isActive}
                            disabled={disabled}
                            onClick={() => !disabled && onChange(opt.value)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all outline-none",
                                "focus-visible:ring-2 focus-visible:ring-primary",
                                isActive
                                    ? "bg-card text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground",
                                disabled && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {opt.icon && <opt.icon className="w-3.5 h-3.5" />}
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
