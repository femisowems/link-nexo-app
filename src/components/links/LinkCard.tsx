import { LinkItem } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ExternalLink, Globe, Mail, Calendar, Youtube, Github, Twitter, Linkedin, Star, Sparkles, Link as LinkIcon, AlertCircle, Eye, EyeOff, Trash2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { InlineEdit } from "@/components/ui/InlineEdit";
import { useState } from "react";

interface LinkCardProps {
    link: LinkItem;
    priority?: boolean;
    editable?: boolean;
    dragHandle?: React.ReactNode;
    onToggleVisibility?: (id: string) => void;
    onDelete?: (id: string) => void;
    autoFocusTitle?: boolean;
}

const iconMap = {
    website: Globe,
    email: Mail,
    calendar: Calendar,
    youtube: Youtube,
    github: Github,
    twitter: Twitter,
    linkedin: Linkedin,
    custom: Star,
};

export function LinkCard({ link, editable = false, dragHandle, onToggleVisibility, onDelete, autoFocusTitle = false }: LinkCardProps) {
    const Icon = link.icon ? iconMap[link.icon as keyof typeof iconMap] || Globe : null;
    const isFeatured = link.variant === "featured";
    const isVisible = link.visible !== false; // Default to true

    const [title, setTitle] = useState(link.title);
    const [subtitle, setSubtitle] = useState(link.subtitle || "");
    const [href, setHref] = useState(link.href);
    const [error, setError] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Mock save
    const handleSave = async (field: string, value: string, setter: (val: string) => void) => {
        if (field === "url") {
            try {
                new URL(value); // Basic validation
                setError(null);
            } catch {
                setError("Invalid URL");
                return;
            }
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        setter(value);
        console.log(`Saved ${field}:`, value);
    };

    // We use a div instead of motion.a to avoid nesting interactive elements (input inside a),
    // and programmatically handle the click for navigation if not editing.
    // This is a trade-off for the inline editing requirement without a separate page.
    const handleCardClick = () => {
        // If we are clicking an input, do nothing (stopPropagation is handled in InlineEdit)
        // If we are strictly clicking the card background:
        if (!editable) { // Only navigate if not in editable mode
            if (!link.openInNewTab) {
                window.location.href = href;
            } else {
                window.open(href, "_blank", "noopener,noreferrer");
            }
            trackEvent(link.analyticsEventName || "click_link", { url: link.href, id: link.id });
        }
    };

    return (
        <motion.div
            onClick={handleCardClick}
            className={cn(
                "group relative flex flex-col w-full p-4 rounded-2xl transition-all outline-none cursor-pointer", // removed mb-3 as it's now in wrapper
                isFeatured
                    ? "bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary/95"
                    : "bg-card text-card-foreground border border-border shadow-sm hover:shadow-md hover:border-black/50 hover:bg-muted/30",
                editable && "pl-10", // Make space for drag handle
                !isVisible && editable && "opacity-50 grayscale" // Dim if hidden
            )}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            layout
        >
            {dragHandle}

            {/* Actions (Editable Mode Only) */}
            {editable && (
                <div className="absolute right-2 top-2 flex items-center gap-1 z-20">
                    {/* Visibility Toggle */}
                    {onToggleVisibility && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleVisibility(link.id);
                            }}
                            className="p-1.5 rounded-full hover:bg-black/10 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={isVisible ? "Hide link" : "Show link"}
                        >
                            {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                    )}

                    {/* Delete Toggle */}
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirmDelete) {
                                    onDelete(link.id);
                                } else {
                                    setConfirmDelete(true);
                                }
                            }}
                            onBlur={() => setTimeout(() => setConfirmDelete(false), 200)} // Delay to allow click to register
                            className={cn(
                                "p-1.5 rounded-full transition-colors flex items-center gap-1",
                                confirmDelete
                                    ? "bg-red-500 text-white hover:bg-red-600 px-2"
                                    : "hover:bg-red-50 text-muted-foreground hover:text-red-500"
                            )}
                            aria-label={confirmDelete ? "Confirm delete" : "Delete link"}
                        >
                            {confirmDelete ? (
                                <>
                                    <span className="text-[10px] font-bold uppercase leading-none">Confirm</span>
                                </>
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                        </button>
                    )}
                </div>
            )}

            <div className="flex items-center w-full">
                {/* Icon Section */}
                {Icon && (
                    <div className={cn(
                        "flex-shrink-0 mr-4 p-2 rounded-xl",
                        isFeatured ? "bg-white/10" : "bg-muted text-foreground"
                    )}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                )}

                {/* Content Section */}
                <div className="flex-grow min-w-0 flex flex-col items-start text-left">
                    <div className={cn(
                        "font-semibold text-base sm:text-lg leading-tight w-full pr-8",
                        isFeatured ? "text-primary-foreground" : "text-foreground"
                    )}>
                        <InlineEdit
                            value={title}
                            onSave={(val) => handleSave("title", val, setTitle)}
                            label="Link Title"
                            className="hover:underline decoration-dashed decoration-1 underline-offset-4"
                            disabled={!editable}
                            autoFocus={autoFocusTitle && editable}
                        />
                    </div>

                    <div className={cn(
                        "text-xs sm:text-sm mt-0.5 w-full opacity-90 pr-8",
                        isFeatured ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                        <InlineEdit
                            value={subtitle}
                            onSave={(val) => handleSave("subtitle", val, setSubtitle)}
                            label="Link Subtitle"
                            className="min-h-[1.5em] block w-full hover:underline decoration-dashed decoration-1 underline-offset-4" // ensure clickable area if empty
                            disabled={!editable}
                        />
                    </div>
                </div>

                {/* Right Action / Chevron - Only show if NOT editable, to avoid clutter */}
                {!editable && (
                    <div className={cn(
                        "ml-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0 absolute right-4 top-4"
                    )}>
                        <ExternalLink className={cn("w-4 h-4", isFeatured ? "text-primary-foreground" : "text-muted-foreground")} />
                    </div>
                )}
            </div>

            {/* URL Display/Edit (Visible only when editable) */}
            {editable && (
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors border-t border-border/20 pt-2 w-full"
                    onClick={() => { }} // Stop navigation when interacting with URL area
                >
                    <LinkIcon className="w-3 h-3 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <InlineEdit
                            value={href}
                            onSave={(val) => handleSave("url", val, setHref)}
                            label="Link URL"
                            className={cn("font-mono hover:text-foreground hover:underline decoration-dashed", error && "text-red-500 decoration-red-500")}
                            inputClassName={cn("font-mono text-xs", error && "border-red-500 focus:ring-red-500")}
                            disabled={!editable}
                        />
                    </div>
                    {error && (
                        <div className="flex items-center gap-1 text-red-500 text-[10px] uppercase font-bold animate-in fade-in">
                            <AlertCircle className="w-3 h-3" />
                            {error}
                        </div>
                    )}
                </div>
            )}

            {/* Badge */}
            {link.badge && (
                <div className="absolute -top-2 -right-2 transform rotate-3 pointer-events-none">
                    <span className={cn(
                        "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm border",
                        link.badge === "NEW" ? "bg-blue-500 text-white border-blue-600" :
                            link.badge === "LIVE" ? "bg-red-500 text-white border-red-600 animate-pulse" :
                                "bg-amber-400 text-amber-950 border-amber-500" // Featured/Hot
                    )}>
                        {link.badge === "FEATURED" && <Sparkles className="w-3 h-3 inline-block mr-0.5 -mt-0.5" />}
                        {link.badge}
                    </span>
                </div>
            )}
        </motion.div>
    );
}
