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
import { useState, useOptimistic, useTransition } from "react";
import { Edit2, Check, Sparkles, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { addLink, deleteLink, reorderLinks, updateLink } from "@/app/actions";

interface LinkListProps {
    links: LinkItem[];
    visible?: boolean;
    editable?: boolean;
}

export function LinkList({ links: initialLinks, visible = true, editable = false }: LinkListProps) {
    const [isEditable, setIsEditable] = useState(editable); // Default to prop value
    const [isSectionVisible, setIsSectionVisible] = useState(visible);
    const { showToast } = useToast();
    const [isPending, startTransition] = useTransition();

    // Use optimistic state for links
    const [optimisticLinks, addOptimisticLink] = useOptimistic(
        initialLinks,
        (state, newLink: LinkItem | { type: "delete"; id: string } | { type: "reorder"; items: LinkItem[] }) => {
            if ('type' in newLink && newLink.type === "delete") {
                return state.filter(l => l.id !== newLink.id);
            }
            if ('type' in newLink && newLink.type === "reorder") {
                return newLink.items;
            }
            if ('id' in newLink) {
                return [...state, newLink as LinkItem];
            }
            return state;
        }
    );

    const sensors = useSensors(
        useSensor(PointerSensor),
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
            const oldIndex = optimisticLinks.findIndex((item) => item.id === active.id);
            const newIndex = optimisticLinks.findIndex((item) => item.id === over.id);
            const newOrder = arrayMove(optimisticLinks, oldIndex, newIndex);

            startTransition(async () => {
                addOptimisticLink({ type: "reorder", items: newOrder });
                await reorderLinks(newOrder.map((l, index) => ({ id: l.id, order: index })));
            });
        }
    }

    const handleToggleVisibility = async (id: string) => {
        const link = optimisticLinks.find(l => l.id === id);
        if (!link) return;
        const newVisible = !link.visible;

        // Optimistic update? Needs complex reducer or just direct mutation logic
        // For simplicity, calling server action directly
        await updateLink(id, { visible: newVisible });
        showToast(newVisible ? "Link visible" : "Link hidden");
    };

    const handleAddLink = () => {
        startTransition(async () => {
            // Optimistic?
            // addOptimisticLink({ id: "temp", title: "New Link", ... } as LinkItem);
            const res = await addLink();
            if (res.success) showToast("Link added");
        });
    };

    const handleDeleteLink = (id: string) => {
        startTransition(async () => {
            addOptimisticLink({ type: "delete", id });
            await deleteLink(id);
            showToast("Link deleted");
        });
    };


    const displayedLinks = optimisticLinks;

    return (
        <div className={cn(
            "w-full max-w-lg mx-auto transition-opacity duration-300",
            !isSectionVisible && "opacity-50 grayscale"
        )}>

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
                        <ul className="flex flex-col space-y-2 relative min-h-[50px]">
                            {displayedLinks.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                                    <p className="text-muted-foreground font-medium">No links yet.</p>
                                </div>
                            )}

                            {displayedLinks.map((link) => (
                                <SortableLink
                                    key={link.id}
                                    link={link}
                                    editable={isEditable}
                                    onToggleVisibility={handleToggleVisibility}
                                    onDelete={handleDeleteLink}
                                />
                            ))}
                        </ul>
                    </SortableContext>
                </DndContext>
            </nav>

            {isEditable && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleAddLink}
                    disabled={isPending}
                    className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:text-foreground hover:border-muted-foreground/60 hover:bg-muted/10 transition-all font-medium"
                >
                    <span className="text-xl leading-none">+</span> {isPending ? "Adding..." : "Add Link"}
                </motion.button>
            )}
        </div>
    );
}
