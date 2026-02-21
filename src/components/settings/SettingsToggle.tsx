"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SettingsToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    disabled?: boolean;
    reduceMotion?: boolean;
    id?: string;
}

export function SettingsToggle({
    checked,
    onChange,
    label,
    disabled = false,
    reduceMotion = false,
    id: externalId,
}: SettingsToggleProps) {
    const generatedId = useId();
    const id = externalId ?? generatedId;

    const spring = reduceMotion
        ? { type: "tween" as const, duration: 0 }
        : { type: "spring" as const, stiffness: 500, damping: 35 };

    return (
        <button
            id={id}
            role="switch"
            aria-checked={checked}
            aria-label={label}
            disabled={disabled}
            onClick={() => !disabled && onChange(!checked)}
            className={cn(
                "relative flex-shrink-0 w-11 h-6 rounded-full border-2 outline-none transition-colors duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                checked
                    ? "bg-foreground border-foreground"
                    : "bg-muted border-border",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            <motion.span
                layout
                transition={spring}
                className={cn(
                    "block w-4 h-4 rounded-full shadow-sm",
                    checked ? "bg-background" : "bg-muted-foreground/50"
                )}
                style={{
                    position: "absolute",
                    top: "50%",
                    y: "-50%",
                    left: checked ? "calc(100% - 18px)" : "2px",
                }}
                aria-hidden="true"
            />
        </button>
    );
}
