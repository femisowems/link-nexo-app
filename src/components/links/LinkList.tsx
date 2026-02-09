"use client";

import { LinkItem } from "@/types";
import { SortableLink } from "./SortableLink";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    TouchSensor
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { useState } from "react";
import { Edit2, Check, Sparkles, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface LinkListProps {
    links: LinkItem[];
    visible?: boolean;
}

export function LinkList({ links: initialLinks, visible = true }: LinkListProps) {
    const [links, setLinks] = useState(initialLinks);
    const [isEditable, setIsEditable] = useState(false); // Demo toggle for editor mode
    // Initialize section visibility from props
    const [isSectionVisible, setIsSectionVisible] = useState(visible);

    const [newLinkId, setNewLinkId] = useState<string | null>(null); // Added newLinkId state
    const { showToast } = useToast();

    // ... (sensors and handlers remain the same) ...

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor, {
            // Press delay of 250ms, with tolerance of 5px of movement
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldLinks = [...links];
            setLinks((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });

            showToast("Order updated", {
                onUndo: () => setLinks(oldLinks)
            });
        }
    }

    const handleToggleVisibility = (id: string) => {
        const oldLinks = [...links];
        setLinks(currentLinks => currentLinks.map(link =>
            link.id === id ? { ...link, visible: link.visible === false ? true : false } : link
        ));

        // Find if we just hid or showed
        const link = links.find(l => l.id === id);
        const isHidden = link?.visible !== false; // Previous state

        showToast(isHidden ? "Link hidden" : "Link visible", {
            onUndo: () => setLinks(oldLinks)
        });
    };

    const handleAddLink = () => {
        const oldLinks = [...links];
        const id = crypto.randomUUID();
        const newLink: LinkItem = {
            id,
            title: "New Link",
            href: "https://example.com",
            visible: true,
            icon: "website",
            variant: "default",
        };

        setLinks(prev => [...prev, newLink]);
        setNewLinkId(id);

        showToast("Link added", {
            onUndo: () => {
                setLinks(oldLinks);
                setNewLinkId(null);
            }
        });
    };

    const handleDeleteLink = (id: string) => {
        const oldLinks = [...links];
        setLinks(currentLinks => currentLinks.filter(link => link.id !== id));

        showToast("Link deleted", {
            onUndo: () => setLinks(oldLinks)
        });
    };

    const handleToggleSectionVisibility = () => {
        setIsSectionVisible(!isSectionVisible);
        showToast(isSectionVisible ? "Links section hidden" : "Links section visible", {
            onUndo: () => setIsSectionVisible(isSectionVisible)
        });
    };

    // Filter links for display
    const displayedLinks = isEditable
        ? links
        : links.filter(link => link.visible !== false);


    // Logic:
    // If section hidden and NOT editing -> Render nothing (but keep "Builder" empty state concept? No, section is hidden)
    // If section hidden and editing -> Render dimmed

    if (!isSectionVisible && !isEditable) {
        // Render minimal editor entry point
        return (
            <div className="w-full max-w-lg mx-auto flex justify-end mb-4">
                <button
                    onClick={() => setIsEditable(true)}
                    className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted opacity-0 hover:opacity-100"
                >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Links
                </button>
            </div>
        );
    }

    // Normal Empty State Logic Check
    // If section is visible, but no links? We handle that inside.

    return (
        <div className={cn(
            "w-full max-w-lg mx-auto transition-opacity duration-300",
            !isSectionVisible && "opacity-50 grayscale"
        )}>
            {/* Editor Toggle - In a real app this would be a separate Admin View vs Public View */}
            <div className="flex justify-end mb-4 gap-2">
                {isEditable && (
                    <button
                        onClick={handleToggleSectionVisibility}
                        className={cn(
                            "flex items-center gap-2 text-xs font-medium transition-colors px-3 py-1.5 rounded-full",
                            !isSectionVisible ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                        )}
                        title={!isSectionVisible ? "Show Section" : "Hide Section"}
                    >
                        {!isSectionVisible ? (
                            <>
                                <EyeOff className="w-3.5 h-3.5" /> Hidden
                            </>
                        ) : (
                            <>
                                <Eye className="w-3.5 h-3.5" /> Visible
                            </>
                        )}
                    </button>
                )}
                <button
                    onClick={() => setIsEditable(!isEditable)}
                    className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted"
                >
                    {isEditable ? (
                        <>
                            <Check className="w-3.5 h-3.5" /> Done Editing
                        </>
                    ) : (
                        <>
                            <Edit2 className="w-3.5 h-3.5" /> Edit Links
                        </>
                    )}
                </button>
            </div>

            <nav aria-label="Main Navigation">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={displayedLinks.map(l => l.id)}
                        strategy={verticalListSortingStrategy}
                        disabled={!isEditable}
                    >
                        <ul className="flex flex-col space-y-0 relative min-h-[50px]">
                            {/* Empty State: Public View */}
                            {displayedLinks.length === 0 && !isEditable && (
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 animate-in fade-in zoom-in duration-500">
                                    <div className="p-3 bg-muted/30 rounded-full">
                                        <Sparkles className="w-6 h-6 text-muted-foreground/50" />
                                    </div>
                                    <p className="text-muted-foreground font-medium">No links to display yet.</p>
                                </div>
                            )}

                            {/* Empty State: Editor View (First-time user) */}
                            {displayedLinks.length === 0 && isEditable && (
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-in fade-in zoom-in duration-500 border-2 border-dashed border-muted-foreground/20 rounded-2xl mx-2">
                                    <div className="p-4 bg-primary/5 rounded-full ring-1 ring-primary/10">
                                        <Sparkles className="w-8 h-8 text-primary" />
                                    </div>
                                    <div className="space-y-1 max-w-[250px]">
                                        <h3 className="font-semibold text-lg">Start Building</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Share your world by adding your first link below.
                                        </p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleAddLink}
                                        className="mt-2 px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all"
                                    >
                                        + Add First Link
                                    </motion.button>
                                </div>
                            )}

                            {displayedLinks.map((link) => (
                                <SortableLink
                                    key={link.id}
                                    link={link}
                                    editable={isEditable}
                                    onToggleVisibility={handleToggleVisibility}
                                    onDelete={handleDeleteLink}
                                    autoFocusTitle={link.id === newLinkId}
                                />
                            ))}
                        </ul>
                    </SortableContext>
                </DndContext>
            </nav>

            {/* Add Link Button */}
            {isEditable && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleAddLink}
                    className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:text-foreground hover:border-muted-foreground/60 hover:bg-muted/10 transition-all font-medium"
                >
                    <span className="text-xl leading-none">+</span> Add Link
                </motion.button>
            )}
        </div>
    );
}
