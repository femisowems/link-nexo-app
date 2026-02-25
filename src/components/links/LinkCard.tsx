import { LinkItem } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ExternalLink, Globe, Sparkles, Link as LinkIcon, AlertCircle, Eye, EyeOff, Trash2, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { InlineEdit } from "@/components/ui/InlineEdit";
import { useState, useTransition } from "react";
import { updateLink } from "@/app/actions";
import { IconSelectorModal, AVAILABLE_ICONS } from "./IconSelectorModal";
import { AnimatePresence } from "framer-motion";

interface LinkCardProps {
    link: LinkItem;
    priority?: boolean;
    editable?: boolean;
    dragHandle?: React.ReactNode;
    onToggleVisibility?: (id: string) => void;
    onDelete?: (id: string) => void;
    autoFocusTitle?: boolean;
}

export function LinkCard({ link, editable = false, dragHandle, onToggleVisibility, onDelete, autoFocusTitle = false }: LinkCardProps) {
    const [localIconId, setLocalIconId] = useState<string>(link.icon || "website");
    const IconRecord = AVAILABLE_ICONS.find(i => i.id === localIconId);
    const Icon = IconRecord ? IconRecord.icon : Globe;
    const isFeatured = link.variant === "featured";
    const isVisible = link.visible !== false; // Default to true

    const getFeaturedCardClass = (color: string) => {
        switch (color) {
            case "#7FEFBD": return "bg-[#7FEFBD] text-slate-900 shadow-lg hover:shadow-xl hover:bg-[#6be0ae]";
            case "#000000": return "bg-[#000000] text-white shadow-lg hover:shadow-xl hover:bg-[#222222]";
            case "#89023E":
            case "blue":
            case "default":
            case "":
            default: return "bg-[#89023E] text-white shadow-lg hover:shadow-xl hover:bg-[#730132]";
        }
    };

    const [title, setTitle] = useState(link.title);
    const [subtitle, setSubtitle] = useState(link.subtitle || "");
    const [href, setHref] = useState(link.href);
    const [variant, setVariant] = useState<string>(link.variant || "default");
    const [layout, setLayout] = useState<string>(link.layout || "full");
    const [template, setTemplate] = useState<string>(link.template || "elevated");
    const [accent, setAccent] = useState<string>(link.accent || "");
    const [ctaLabel, setCtaLabel] = useState(link.ctaLabel || "");
    const [price, setPrice] = useState(link.price || "");
    const [originalPrice, setOriginalPrice] = useState(link.originalPrice || "");
    const [rating, setRating] = useState(link.rating || "");
    const [badge, setBadge] = useState(link.badge || "");
    const [error, setError] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isIconModalOpen, setIsIconModalOpen] = useState(false);

    const handleSave = (field: string, value: string, setter: (val: string) => void) => {
        if (field === "url") {
            try {
                new URL(value); // Basic validation
                setError(null);
            } catch {
                setError("Invalid URL");
                return;
            }
        }

        // Optimistic update
        setter(value);

        startTransition(async () => {
            try {
                const dbField = field === "url" ? "href" : field;
                await updateLink(link.id, { [dbField]: value });
            } catch (err) {
                console.error("Failed to save", err);
            }
        });
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
                    ? (editable ? "bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary/95" : getFeaturedCardClass(accent))
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
                    <button
                        onClick={(e) => {
                            if (editable) {
                                e.stopPropagation();
                                setIsIconModalOpen(true);
                            }
                        }}
                        disabled={!editable}
                        className={cn(
                            "flex-shrink-0 mr-4 p-2 rounded-xl transition-all outline-none",
                            isFeatured ? (editable ? "bg-white/10" : "bg-white/20") : "bg-muted text-foreground",
                            editable ? "hover:scale-105 hover:ring-2 hover:ring-primary/40 cursor-pointer" : "cursor-default"
                        )}
                        title={editable ? "Change Icon" : undefined}
                    >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                )}

                {/* Content Section */}
                <div className="flex-grow min-w-0 flex flex-col items-start text-left">
                    <div className={cn(
                        "font-semibold text-base sm:text-lg leading-tight w-full pr-8",
                        isFeatured ? (editable ? "text-primary-foreground" : (accent === '#7FEFBD' ? "text-slate-900" : "text-white")) : "text-foreground"
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
                        isFeatured ? (editable ? "text-primary-foreground/80" : (accent === '#7FEFBD' ? "text-slate-900/80" : "text-white/80")) : "text-muted-foreground"
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
                        <ExternalLink className={cn("w-4 h-4", isFeatured ? (editable ? "text-primary-foreground" : (accent === '#7FEFBD' ? 'text-slate-900' : 'text-white')) : "text-muted-foreground")} />
                    </div>
                )}
            </div>

            {/* URL Display/Edit (Visible only when editable) */}
            {editable && (
                <div className="mt-3 flex flex-col gap-3 border-t border-border/20 pt-3 w-full"
                    onClick={() => { }} // Stop navigation when interacting with URL area
                >
                    <div className="flex flex-col sm:flex-row gap-3 w-full items-start sm:items-center sm:flex-wrap">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors flex-1 w-full min-w-[200px]">
                            <LinkIcon className="w-3 h-3 flex-shrink-0" />
                            <div className="flex-1 w-full min-w-0">
                                <InlineEdit
                                    value={href}
                                    onSave={(val) => handleSave("url", val, setHref)}
                                    label="Link URL"
                                    className={cn("font-mono hover:text-foreground hover:underline decoration-dashed w-full block", error && "text-red-500 decoration-red-500")}
                                    inputClassName={cn("font-mono text-xs w-full", error && "border-red-500 focus:ring-red-500")}
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

                        {/* Layout Selector */}
                        {variant === "primaryOffer" && (
                            <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0 text-xs bg-muted/30 sm:bg-transparent p-2 sm:p-0 rounded-lg sm:rounded-none ml-0 sm:ml-2">
                                <span className="text-muted-foreground font-medium">Layout:</span>
                                <select
                                    value={layout}
                                    onChange={(e) => handleSave("layout", e.target.value, setLayout)}
                                    disabled={isPending}
                                    className="bg-background sm:bg-muted text-foreground border border-border sm:border-transparent rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-primary outline-none flex-1 sm:flex-none"
                                >
                                    <option value="full">Full Width</option>
                                    <option value="compact">Compact (Max-W)</option>
                                </select>
                            </div>
                        )}

                        {/* Template Selector */}
                        {variant === "primaryOffer" && (
                            <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0 text-xs bg-muted/30 sm:bg-transparent p-2 sm:p-0 rounded-lg sm:rounded-none ml-0 sm:ml-2">
                                <span className="text-muted-foreground font-medium">Template:</span>
                                <select
                                    value={template}
                                    onChange={(e) => handleSave("template", e.target.value, setTemplate)}
                                    disabled={isPending}
                                    className="bg-background sm:bg-muted text-foreground border border-border sm:border-transparent rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-primary outline-none flex-1 sm:flex-none"
                                >
                                    <option value="elevated">Elevated</option>
                                    <option value="split">Split Layout</option>
                                    <option value="minimal">Minimal Ghost</option>
                                    <option value="banner">Full Banner</option>
                                </select>
                            </div>
                        )}

                        {/* Variant Selector */}
                        <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0 text-xs bg-muted/30 sm:bg-transparent p-2 sm:p-0 rounded-lg sm:rounded-none ml-0 sm:ml-2">
                            <span className="text-muted-foreground font-medium">Variant:</span>
                            <select
                                value={variant}
                                onChange={(e) => handleSave("variant", e.target.value, setVariant)}
                                disabled={isPending}
                                className="bg-background sm:bg-muted text-foreground border border-border sm:border-transparent rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-primary outline-none flex-1 sm:flex-none"
                            >
                                <option value="default">Default</option>
                                <option value="featured">Featured</option>
                                <option value="primaryOffer">Primary Offer Block</option>
                            </select>
                        </div>

                        {/* Accent Color Picker */}
                        {(variant === "primaryOffer" || variant === "featured") && (
                            <div className="flex items-center gap-1.5 ml-0 sm:ml-2">
                                {(variant === "primaryOffer" ? [
                                    { id: "blue", bg: "bg-blue-500" },
                                    { id: "violet", bg: "bg-violet-500" },
                                    { id: "rose", bg: "bg-rose-500" },
                                    { id: "amber", bg: "bg-amber-500" },
                                    { id: "emerald", bg: "bg-emerald-500" },
                                    { id: "slate", bg: "bg-slate-500" },
                                ] : [
                                    { id: "#89023E", bg: "bg-[#89023E]" },
                                    { id: "#7FEFBD", bg: "bg-[#7FEFBD]" },
                                    { id: "#000000", bg: "bg-[#000000]" },
                                ]).map((color) => (
                                    <button
                                        key={color.id}
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); handleSave("accent", color.id, setAccent); }}
                                        className={cn(
                                            "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                                            color.bg,
                                            accent === color.id ? "ring-2 ring-offset-1 ring-foreground/20 scale-110" : "hover:scale-105 opacity-80 hover:opacity-100"
                                        )}
                                        aria-label={`Select ${color.id} color`}
                                    >
                                        {accent === color.id && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Standard Link Badge Toggle (Shown if NOT primaryOffer) */}
                        {variant !== "primaryOffer" && (
                            <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0 text-xs bg-muted/30 sm:bg-transparent p-2 sm:p-0 rounded-lg sm:rounded-none ml-0 sm:ml-2">
                                <span className="text-muted-foreground font-medium">New Badge:</span>
                                <div className="flex bg-muted rounded-md p-0.5 border border-border">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleSave("badge", "NEW", setBadge); }}
                                        className={cn("px-2.5 py-1 text-xs font-semibold rounded-sm transition-all", badge === "NEW" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        ON
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleSave("badge", "", setBadge); }}
                                        className={cn("px-2.5 py-1 text-xs font-semibold rounded-sm transition-all", badge !== "NEW" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        OFF
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Extra Meta fields row */}
                    {variant === "primaryOffer" && (
                        <div className="flex flex-wrap gap-2 w-full animate-in fade-in slide-in-from-top-2 duration-300 mt-2">
                            <div className="flex-[1_1_85px] min-w-[85px] bg-card rounded-xl p-2.5 border-[1.5px] border-border/40 shadow-sm">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">CTA Label</label>
                                <InlineEdit
                                    value={ctaLabel}
                                    onSave={(val) => handleSave("ctaLabel", val, setCtaLabel)}
                                    label="e.g. Buy Now"
                                    className="text-xs text-foreground font-medium min-h-[1.5em] block w-full hover:underline decoration-dashed decoration-1 underline-offset-2"
                                />
                            </div>
                            <div className="flex-[1_1_85px] min-w-[85px] bg-card rounded-xl p-2.5 border-[1.5px] border-border/40 shadow-sm">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Price</label>
                                <InlineEdit
                                    value={price}
                                    onSave={(val) => handleSave("price", val, setPrice)}
                                    label="e.g. $49"
                                    className="text-xs text-foreground font-medium min-h-[1.5em] block w-full hover:underline decoration-dashed decoration-1 underline-offset-2"
                                />
                            </div>
                            <div className="flex-[1_1_85px] min-w-[85px] bg-card rounded-xl p-2.5 border-[1.5px] border-border/40 shadow-sm">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Orig. Price</label>
                                <InlineEdit
                                    value={originalPrice}
                                    onSave={(val) => handleSave("originalPrice", val, setOriginalPrice)}
                                    label="e.g. $99"
                                    className="text-xs text-foreground font-medium min-h-[1.5em] block w-full hover:underline decoration-dashed decoration-1 underline-offset-2"
                                />
                            </div>
                            <div className="flex-[1_1_85px] min-w-[85px] bg-card rounded-xl p-2.5 border-[1.5px] border-border/40 shadow-sm">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Rating</label>
                                <InlineEdit
                                    value={rating}
                                    onSave={(val) => handleSave("rating", val, setRating)}
                                    label="e.g. 4.7"
                                    className="text-xs text-foreground font-medium min-h-[1.5em] block w-full hover:underline decoration-dashed decoration-1 underline-offset-2"
                                />
                            </div>
                            <div className="flex-[1_1_85px] min-w-[85px] bg-card rounded-xl p-2.5 border-[1.5px] border-border/40 shadow-sm">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Discount</label>
                                <InlineEdit
                                    value={badge}
                                    onSave={(val) => handleSave("badge", val, setBadge)}
                                    label="e.g. 50% OFF"
                                    className="text-xs text-foreground font-medium min-h-[1.5em] block w-full hover:underline decoration-dashed decoration-1 underline-offset-2"
                                />
                            </div>
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

            <AnimatePresence>
                {isIconModalOpen && (
                    <IconSelectorModal
                        currentIconId={localIconId}
                        onSelect={(id) => {
                            handleSave("icon", id, setLocalIconId);
                        }}
                        onClose={() => setIsIconModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
