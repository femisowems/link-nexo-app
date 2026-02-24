import { motion } from "framer-motion";
import { X } from "lucide-react";
import {
    Globe, Mail, Instagram, Twitch, Facebook, Twitter, Github, Linkedin,
    Calendar, Youtube, Link as LinkIcon, Bookmark, Music, Video, MapPin,
    Phone, ShoppingBag, Star, Heart, MessageCircle
} from "lucide-react";

export const AVAILABLE_ICONS = [
    { id: "website", icon: Globe, label: "Website" },
    { id: "email", icon: Mail, label: "Email" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "youtube", icon: Youtube, label: "YouTube" },
    { id: "github", icon: Github, label: "GitHub" },
    { id: "twitter", icon: Twitter, label: "Twitter" },
    { id: "linkedin", icon: Linkedin, label: "LinkedIn" },
    { id: "instagram", icon: Instagram, label: "Instagram" },
    { id: "twitch", icon: Twitch, label: "Twitch" },
    { id: "facebook", icon: Facebook, label: "Facebook" },
    { id: "link", icon: LinkIcon, label: "Link" },
    { id: "bookmark", icon: Bookmark, label: "Bookmark" },
    { id: "music", icon: Music, label: "Music" },
    { id: "video", icon: Video, label: "Video" },
    { id: "map", icon: MapPin, label: "Map" },
    { id: "phone", icon: Phone, label: "Phone" },
    { id: "shop", icon: ShoppingBag, label: "Shop" },
    { id: "star", icon: Star, label: "Star" },
    { id: "heart", icon: Heart, label: "Heart" },
    { id: "message", icon: MessageCircle, label: "Message" },
];

export function IconSelectorModal({
    currentIconId,
    onSelect,
    onClose
}: {
    currentIconId: string;
    onSelect: (id: string) => void;
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
        >
            <motion.div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            <motion.div
                className="relative bg-background rounded-2xl border border-border shadow-2xl w-full max-w-md p-6 flex flex-col max-h-[80vh]"
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 30 } }}
                exit={{ opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } }}
            >
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold">Choose an Icon</h2>
                        <p className="text-sm text-muted-foreground">Select an icon to display on your link.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto pr-2 -mr-2 flex-1">
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                        {AVAILABLE_ICONS.map((item) => {
                            const IconCmp = item.icon;
                            const isSelected = currentIconId === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onSelect(item.id);
                                        onClose();
                                    }}
                                    className={`
                                        flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all
                                        ${isSelected
                                            ? "bg-primary/10 border-primary text-primary shadow-sm"
                                            : "bg-card border-border hover:bg-muted hover:border-muted-foreground/30 text-foreground"
                                        }
                                    `}
                                    title={item.label}
                                >
                                    <IconCmp className="w-6 h-6" />
                                    <span className="text-[10px] sm:text-xs font-medium truncate w-full text-center">
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
