"use client";

import { useId, useRef, useEffect, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SettingsInputProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder?: string;
    multiline?: boolean;
    maxLength?: number;
    disabled?: boolean;
    error?: string;
    className?: string;
}

export const SettingsInput = forwardRef<
    HTMLInputElement | HTMLTextAreaElement,
    SettingsInputProps
>(function SettingsInput(
    { value, onChange, label, placeholder, multiline = false, maxLength, disabled, error, className },
    ref
) {
    const id = useId();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (multiline && textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value, multiline]);

    const baseClass = cn(
        "w-full px-4 py-2.5 rounded-xl text-sm text-foreground",
        "bg-background border transition-all outline-none",
        "placeholder:text-muted-foreground/60",
        "focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30",
        error ? "border-red-400 focus:ring-red-300/30" : "border-border",
        disabled && "opacity-50 cursor-not-allowed",
        className
    );

    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-sm font-medium text-foreground">
                {label}
            </label>

            {multiline ? (
                <textarea
                    id={id}
                    ref={(el) => {
                        (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
                        if (typeof ref === "function") ref(el);
                        else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
                    }}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    disabled={disabled}
                    rows={3}
                    className={cn(baseClass, "resize-none min-h-[80px] leading-relaxed")}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
            ) : (
                <input
                    id={id}
                    ref={ref as React.Ref<HTMLInputElement>}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    disabled={disabled}
                    className={cn(baseClass, "h-11")}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
            )}

            <div className="flex items-center justify-between gap-2">
                {error ? (
                    <p id={`${id}-error`} className="text-xs text-red-500" role="alert">
                        {error}
                    </p>
                ) : (
                    <span />
                )}
                {maxLength && (
                    <p className={cn("text-xs tabular-nums ml-auto", value.length >= maxLength ? "text-red-500" : "text-muted-foreground")}>
                        {value.length}/{maxLength}
                    </p>
                )}
            </div>
        </div>
    );
});
