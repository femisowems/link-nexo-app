"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface InlineEditProps {
    value: string;
    onSave: (value: string) => Promise<void> | void;
    multiline?: boolean;
    className?: string;
    inputClassName?: string;
    label: string; // For accessibility
    disabled?: boolean;
    autoFocus?: boolean;
}

export function InlineEdit({
    value,
    onSave,
    multiline = false,
    className,
    inputClassName,
    label,
    disabled = false,
    autoFocus = false,
}: InlineEditProps) {
    const [isEditing, setIsEditing] = useState(autoFocus);
    const [inputValue, setInputValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const triggerRef = useRef<HTMLSpanElement>(null);
    const prevIsEditing = useRef(isEditing);

    useEffect(() => {
        // Focus input when entering edit mode
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }

        // Restore focus to trigger when exiting edit mode
        if (prevIsEditing.current && !isEditing && triggerRef.current) {
            triggerRef.current.focus();
        }

        prevIsEditing.current = isEditing;
    }, [isEditing]);

    const handleSave = async () => {
        if (inputValue.trim() === value) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            await onSave(inputValue);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save:", error);
            // Keep editing state on error so user can retry or cancel
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setInputValue(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === "Escape") {
            e.preventDefault(); // Prevent bubbling
            handleCancel();
        }
    };

    if (isEditing) {
        const Component = multiline ? "textarea" : "input";

        return (
            <div className="relative w-full">
                <Component
                    ref={inputRef as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
                    value={inputValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInputValue(e.target.value)}
                    onBlur={() => {
                        // Small delay to allow cancel button click if we had one, 
                        // but here we just have blur saving.
                        // Ideally checking relatedTarget, but for now simple blur-save is fine.
                        handleSave();
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={isSaving}
                    className={cn(
                        "w-full bg-background border border-foreground/20 rounded-md px-2 py-1 outline-none ring-2 ring-foreground/20 focus:ring-foreground transition-all",
                        multiline ? "resize-none min-h-[5em]" : "h-auto",
                        inputClassName
                    )}
                    aria-label={`Edit ${label}`}
                />
                {isSaving && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                )}
            </div>
        );
    }

    return (
        <span
            ref={triggerRef}
            onClick={(e) => {
                if (disabled) return; // Propagate click if disabled (for navigation links)

                e.preventDefault();
                e.stopPropagation();
                setInputValue(value);
                setIsEditing(true);
            }}
            className={cn(
                "rounded px-1 -mx-1 transition-colors border border-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary",
                !disabled && "cursor-text hover:bg-black/5 dark:hover:bg-white/10 hover:border-border",
                disabled && "cursor-inherit",
                className
            )}
            role={disabled ? undefined : "button"}
            tabIndex={disabled ? undefined : 0}
            onKeyDown={(e) => {
                if (disabled) return;

                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setInputValue(value);
                    setIsEditing(true);
                }
            }}
            aria-label={disabled ? undefined : `Edit ${label}: ${value}`}
        >
            {value}
        </span>
    );
}
