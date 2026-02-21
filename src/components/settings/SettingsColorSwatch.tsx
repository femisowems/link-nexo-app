"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccentColor } from "@/hooks/useSettingsStore";

const SWATCHES: { value: AccentColor; label: string; bg: string; ring: string }[] = [
    { value: "blue", label: "Blue", bg: "bg-blue-500", ring: "ring-blue-400" },
    { value: "violet", label: "Violet", bg: "bg-violet-500", ring: "ring-violet-400" },
    { value: "rose", label: "Rose", bg: "bg-rose-500", ring: "ring-rose-400" },
    { value: "amber", label: "Amber", bg: "bg-amber-500", ring: "ring-amber-400" },
    { value: "emerald", label: "Emerald", bg: "bg-emerald-500", ring: "ring-emerald-400" },
    { value: "slate", label: "Slate", bg: "bg-slate-500", ring: "ring-slate-400" },
];

interface SettingsColorSwatchProps {
    value: AccentColor;
    onChange: (color: AccentColor) => void;
    disabled?: boolean;
}

export function SettingsColorSwatch({ value, onChange, disabled }: SettingsColorSwatchProps) {
    return (
        <div
            role="radiogroup"
            aria-label="Accent color"
            className="flex items-center flex-wrap gap-3"
        >
            {SWATCHES.map((swatch) => {
                const isSelected = value === swatch.value;
                return (
                    <button
                        key={swatch.value}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={swatch.label}
                        disabled={disabled}
                        onClick={() => !disabled && onChange(swatch.value)}
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all outline-none",
                            "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            `focus-visible:${swatch.ring}`,
                            swatch.bg,
                            isSelected && `ring-2 ring-offset-2 ring-offset-background ${swatch.ring}`,
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isSelected && (
                            <Check className="w-3.5 h-3.5 text-white drop-shadow" aria-hidden="true" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
