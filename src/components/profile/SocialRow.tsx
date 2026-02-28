"use client";

import { Social } from "@/types";
import { Edit2, Check, Plus, Sparkles, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
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
    horizontalListSortingStrategy
} from "@dnd-kit/sortable";
import { SortableSocialLink } from "./SortableSocialLink";
import { useToast } from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { addSocial, deleteSocial, updateSocial, reorderSocials, updateProfile } from "@/app/actions";

interface SocialRowProps {
    socials: Social[];
    profileId: string;
    profile: { sectionVisibility: any };
    visible?: boolean;
    editable?: boolean;
}

export function SocialRow({ socials: initialSocials, profileId, profile, visible = true, editable = false }: SocialRowProps) {
    const [socials, setSocials] = useState(initialSocials || []);
    const [isEditable, setIsEditable] = useState(false);
    const [isSectionVisible, setIsSectionVisible] = useState(visible);
    const { showToast } = useToast();

    // ... (sensors and handlers remain the same) ...

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
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
            const oldSocials = [...socials];
            let newOrder: Social[] = [];
            setSocials((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                newOrder = arrayMove(items, oldIndex, newIndex);
                return newOrder;
            });

            reorderSocials(newOrder.map((s, index) => ({ id: s.id, order: index }))).catch(e => {
                setSocials(oldSocials);
                showToast("Failed to reorder socials.");
            });
            showToast("Socials reordered", {
                onUndo: () => setSocials(oldSocials)
            });
        }
    }

    const handleUpdateSocial = (id: string, updates: Partial<Social>) => {
        const oldSocials = [...socials];
        setSocials(current => current.map(s =>
            s.id === id ? { ...s, ...updates } : s
        ));

        // Background update
        updateSocial(id, updates).catch(e => {
            setSocials(oldSocials);
            showToast("Failed to update social.");
        });

        // Show toast only for visible/hidden toggle to avoid spamming on keystrokes
        if ('visible' in updates) {
            const isHidden = updates.visible === false;
            showToast(isHidden ? "Social hidden" : "Social visible", {
                onUndo: () => {
                    setSocials(oldSocials);
                    const originalVisible = oldSocials.find(s => s.id === id)?.visible ?? true;
                    updateSocial(id, { visible: originalVisible });
                }
            });
        }
    };

    const handleDeleteSocial = (id: string) => {
        const oldSocials = [...socials];
        setSocials(current => current.filter(s => s.id !== id));
        deleteSocial(id).catch(e => {
            setSocials(oldSocials);
            showToast("Failed to delete social.");
        });
        showToast("Social link removed", {
            onUndo: () => setSocials(oldSocials)
        });
    };

    const handleAddSocial = async () => {
        const oldSocials = [...socials];

        try {
            const res = await addSocial(profileId);
            if (res.success && res.social) {
                // Cast to social, UI expects it
                const newSocial = res.social as Social;
                setSocials(prev => [...prev, newSocial]);
                showToast("Social link added", {
                    onUndo: () => {
                        setSocials(oldSocials);
                        deleteSocial(newSocial.id);
                    }
                });
            }
        } catch (e) {
            showToast("Failed to add social link.");
        }
    };

    const handleToggleSectionVisibility = async () => {
        const newVisible = !isSectionVisible;
        setIsSectionVisible(newVisible);

        const newVisibilityMap = {
            ...(typeof profile.sectionVisibility === 'object' && profile.sectionVisibility !== null ? profile.sectionVisibility : {}),
            socials: newVisible
        };
        const newVisibilityJson = JSON.stringify(newVisibilityMap);

        try {
            await updateProfile({ sectionVisibility: newVisibilityJson });
            showToast(isSectionVisible ? "Socials section hidden" : "Socials section visible", {
                onUndo: () => {
                    setIsSectionVisible(isSectionVisible);
                    const oldVisibilityMap = {
                        ...(typeof profile.sectionVisibility === 'object' && profile.sectionVisibility !== null ? profile.sectionVisibility : {}),
                        socials: isSectionVisible
                    };
                    updateProfile({ sectionVisibility: JSON.stringify(oldVisibilityMap) });
                }
            });
        } catch {
            setIsSectionVisible(isSectionVisible);
            showToast("Failed to save visibility. Please try again.");
        }
    };

    // Filter for public view
    const displayedSocials = isEditable
        ? socials
        : socials.filter(s => s.visible !== false);

    // Logic:
    // If section hidden and NOT editing -> Render nothing
    // If section hidden and editing -> Render dimmed
    if (!isSectionVisible && !isEditable) {
        if (!editable) return null;

        return (
            <div className="w-full flex justify-center mt-6 mb-8">
                <button
                    onClick={() => setIsEditable(true)}
                    className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-all px-3 py-1.5 rounded-full hover:bg-muted/50 opacity-0 hover:opacity-100"
                    title="Show Social Controls"
                >
                    <Edit2 className="w-3 h-3" /> Edit Socials
                </button>
            </div>
        );
    }

    // If no socials and not editable, show nothing (unless section is visible and empty? No, existing logic was return null)
    // We should keep the existing logic for empty state + public view -> return null.
    if (!isEditable && (!displayedSocials || displayedSocials.length === 0)) return null;


    return (
        <div className={cn(
            "w-full flex flex-col items-center mt-6 mb-8 gap-4 relative z-20 transition-opacity duration-300",
            !isSectionVisible && "opacity-50 grayscale"
        )}>
            {/* Edit Toggle */}
            {editable && (
                <div className="bg-muted/30 rounded-full p-1 self-center mb-2 flex items-center gap-1">
                    <button
                        onClick={() => setIsEditable(!isEditable)}
                        className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-all px-3 py-1.5 rounded-full hover:bg-background/80"
                    >
                        {isEditable ? (
                            <>
                                <Check className="w-3 h-3" /> Done
                            </>
                        ) : (
                            <>
                                <Edit2 className="w-3 h-3" /> Edit Socials
                            </>
                        )}
                    </button>
                    {isEditable && (
                        <button
                            onClick={handleToggleSectionVisibility}
                            className={cn(
                                "flex items-center justify-center p-1.5 rounded-full transition-colors w-8 h-8",
                                !isSectionVisible ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                            )}
                            title={!isSectionVisible ? "Show Section" : "Hide Section"}
                        >
                            {!isSectionVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                    )}
                </div>
            )}
            <DndContext
                id="social-row-dnd"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-wrap items-center justify-center gap-3 min-h-[48px]">
                    <SortableContext
                        items={socials.map(s => s.id)}
                        strategy={horizontalListSortingStrategy}
                        disabled={!isEditable}
                    >
                        <AnimatePresence>
                            {displayedSocials.map((social) => (
                                <SortableSocialLink
                                    key={social.id}
                                    social={social}
                                    editable={isEditable}
                                    onUpdate={handleUpdateSocial}
                                    onDelete={handleDeleteSocial}
                                />
                            ))}
                        </AnimatePresence>
                    </SortableContext>

                    {/* Add Button */}
                    {isEditable && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleAddSocial}
                            className="p-3 rounded-full bg-primary text-primary-foreground shadow-md hover:shadow-lg flex items-center justify-center"
                            title="Add social link"
                        >
                            <Plus className="w-5 h-5" />
                        </motion.button>
                    )}

                    {/* Empty State in Editor */}
                    {isEditable && socials.length === 0 && (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm border border-dashed border-muted-foreground/30 px-4 py-2 rounded-full">
                            <Sparkles className="w-4 h-4" />
                            <span>Add your first social link</span>
                        </div>
                    )}
                </div>
            </DndContext>
        </div>
    );
}
