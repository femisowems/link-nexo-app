"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsAvatarUploadProps {
    value: string;
    onChange: (url: string) => void;
    name: string;
    disabled?: boolean;
}

const MAX_SIZE_MB = 5;

export function SettingsAvatarUpload({ value, onChange, name, disabled }: SettingsAvatarUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const processFile = useCallback(
        (file: File) => {
            setError(null);

            if (!file.type.startsWith("image/")) {
                setError("Please upload an image file (JPG, PNG, WebP, GIF).");
                return;
            }
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                setError(`Image must be smaller than ${MAX_SIZE_MB}MB.`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const url = e.target?.result as string;
                onChange(url);
            };
            reader.readAsDataURL(file);
        },
        [onChange]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            if (disabled) return;
            const file = e.dataTransfer.files[0];
            if (file) processFile(file);
        },
        [disabled, processFile]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
        // Reset so same file can be re-uploaded
        e.target.value = "";
    };

    return (
        <div className="flex items-start gap-5">
            {/* Avatar preview */}
            <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                    {value ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={value} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-8 h-8 text-muted-foreground" />
                    )}
                </div>
            </div>

            {/* Drop zone */}
            <div className="flex-1 min-w-0 space-y-2">
                <button
                    type="button"
                    onClick={() => !disabled && inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    disabled={disabled}
                    className={cn(
                        "w-full border-2 border-dashed rounded-xl px-4 py-5 flex flex-col items-center gap-2 transition-all cursor-pointer outline-none",
                        "focus-visible:ring-2 focus-visible:ring-primary",
                        isDragging
                            ? "border-foreground bg-muted/50"
                            : "border-border hover:border-foreground/30 hover:bg-muted/30",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                    aria-label="Upload avatar image"
                >
                    <Upload className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                    <div className="text-center">
                        <p className="text-sm font-medium text-foreground">
                            {isDragging ? "Drop to upload" : "Click or drag an image"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            JPG, PNG, WebP or GIF · Max {MAX_SIZE_MB}MB
                        </p>
                    </div>
                </button>

                {error && (
                    <p className="text-xs text-red-500" role="alert">{error}</p>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="sr-only"
                    aria-hidden="true"
                    tabIndex={-1}
                />
            </div>
        </div>
    );
}
