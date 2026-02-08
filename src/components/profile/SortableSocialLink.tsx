"use client";

import { Social, SocialPlatform } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { iconMap, SOCIAL_PLATFORMS } from "./social-icons";
import { Globe, Trash2, GripVertical, Check, Eye, EyeOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SortableSocialLinkProps {
    social: Social;
    editable: boolean;
    onUpdate: (id: string, updates: Partial<Social>) => void;
    onDelete: (id: string) => void;
}

export function SortableSocialLink({ social, editable, onUpdate, onDelete }: SortableSocialLinkProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editUrl, setEditUrl] = useState(social.href);
    const [editPlatform, setEditPlatform] = useState<SocialPlatform>(social.platform);
    const popoverRef = useRef<HTMLDivElement>(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: social.id, disabled: !editable || isEditing });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : (isEditing ? 50 : "auto"),
        opacity: isDragging ? 0.5 : 1,
        position: 'relative' as const, // Ensure z-index works
    };

    const Icon = iconMap[social.platform as keyof typeof iconMap] || Globe;

    // Handle click outside to close popover
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsEditing(false);
            }
        }
        if (isEditing) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isEditing]);

    const handleSave = () => {
        onUpdate(social.id, { href: editUrl, platform: editPlatform });
        setIsEditing(false);
    };

    const handleToggleVisibility = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdate(social.id, { visible: !social.visible });
    };

    if (!editable) {
        if (social.visible === false) return null;
        return (
            <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label={social.label || `Visit our ${social.platform} page`}
            >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative group"
        >
            <div
                className={cn(
                    "p-3 rounded-full transition-all duration-200 flex items-center justify-center border-2",
                    isEditing ? "bg-background border-primary shadow-lg scale-110 z-30" : "bg-muted/30 border-transparent hover:bg-muted/50 hover:border-muted-foreground/20",
                    social.visible === false && !isEditing && "opacity-50 grayscale"
                )}
                {...attributes}
                {...listeners}
                onClick={() => !isDragging && setIsEditing(true)}
            >
                <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", isEditing ? "text-primary" : "text-muted-foreground")} />

                {/* Drag Handle Indicator on Hover */}
                {!isEditing && (
                    <div className="absolute -top-1 -right-1 bg-background rounded-full p-0.5 border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-3 h-3 text-muted-foreground" />
                    </div>
                )}
            </div>

            {/* Edit Popover */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white text-black border shadow-xl rounded-xl p-3 w-64 z-40 flex flex-col gap-3"
                        ref={popoverRef}
                        onClick={(e) => e.stopPropagation()} // Prevent drag start
                    >
                        {/* Arrow */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t rotate-45" />

                        <div className="relative z-10 space-y-3">
                            <div className="flex gap-2">
                                <select
                                    value={editPlatform}
                                    onChange={(e) => setEditPlatform(e.target.value as SocialPlatform)}
                                    className="flex-1 bg-white border border-gray-200 rounded-md px-2 py-1.5 text-sm text-black focus:ring-2 focus:ring-black/10 outline-none"
                                >
                                    {SOCIAL_PLATFORMS.map(p => (
                                        <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleToggleVisibility}
                                    className={cn(
                                        "p-1.5 rounded-md border transition-colors",
                                        social.visible === false ? "bg-gray-100 text-gray-500 border-gray-200" : "bg-blue-50 text-blue-600 border-blue-100"
                                    )}
                                    title={social.visible === false ? "Show link" : "Hide link"}
                                >
                                    {social.visible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm("Remove this social link?")) {
                                            onDelete(social.id);
                                        }
                                    }}
                                    className="p-1.5 rounded-md border border-transparent hover:bg-red-50 hover:text-red-500 hover:border-red-200 text-gray-500 transition-colors"
                                    title="Remove link"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <input
                                type="url"
                                value={editUrl}
                                onChange={(e) => setEditUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-sm text-black focus:ring-2 focus:ring-black/10 outline-none"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSave();
                                    if (e.key === "Escape") setIsEditing(false);
                                }}
                                autoFocus
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-xs font-medium flex items-center gap-1"
                                >
                                    <Check className="w-3 h-3" /> Save
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
