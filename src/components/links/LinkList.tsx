"use client";

import { LinkItem, LinkBadge } from "@/types";
import { SortableLink } from "./SortableLink";
import { LinkCard } from "./LinkCard";
import { PrimaryOfferRenderer } from "@/components/blocks/primary-offer/PrimaryOfferRenderer";
import { Globe, Mail, Calendar, Youtube, Github, Twitter, Linkedin, Star, LucideIcon } from "lucide-react";
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
    accent?: string;
}

export function LinkList({ links: initialLinks, visible = true, editable = false, accent = "blue" }: LinkListProps) {
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


    let primary: LinkItem | undefined;
    const sortableItems: LinkItem[] = [];

    for (const link of optimisticLinks) {
        if (!primary && link.variant === "primaryOffer") {
            primary = link;
        } else {
            sortableItems.push(link.variant === "primaryOffer" && primary ? { ...link, variant: "featured" } : link);
        }
    }

    const iconMap: Record<string, LucideIcon> = {
        website: Globe, email: Mail, calendar: Calendar, youtube: Youtube,
        github: Github, twitter: Twitter, linkedin: Linkedin, custom: Star,
    };

    return (
        <div className={cn(
            "w-full max-w-lg mx-auto transition-opacity duration-300 flex flex-col gap-4",
            !isSectionVisible && "opacity-50 grayscale"
        )}>

            {/* Primary Offer Rendering */}
            {primary && (
                <div className="w-full relative group mb-4">
                    {isEditable ? (
                        <div className="relative border-[1.5px] border-border/60 bg-card rounded-2xl shadow-sm mt-3 pt-1">
                            <div className="absolute -top-3 left-4 bg-background px-3 py-0.5 text-[10.5px] font-bold text-foreground uppercase tracking-widest z-10 border-[1.5px] border-border/60 rounded-full shadow-sm">
                                Primary Offer
                            </div>
                            <LinkCard
                                link={primary}
                                editable={true}
                                onToggleVisibility={handleToggleVisibility}
                                onDelete={handleDeleteLink}
                            // We explicitly do NOT pass a drag handle here, meaning the item is pinned 📌
                            />
                        </div>
                    ) : (
                        <div className="w-full relative group">
                            <PrimaryOfferRenderer
                                title={primary.title}
                                description={primary.subtitle}
                                href={primary.href}
                                icon={primary.icon ? iconMap[primary.icon] : undefined}
                                ctaLabel={primary.ctaLabel}
                                price={primary.price}
                                originalPrice={primary.originalPrice}
                                rating={primary.rating}
                                thumbnailUrl={primary.thumbnailUrl}
                                layout={primary.layout}
                                template={primary.template as any}
                                badge={primary.badge === "NEW" || primary.badge === "FEATURED" || primary.badge === "LIVE" ? primary.badge : primary.badge}
                                accent={primary.accent || accent}
                            />
                        </div>
                    )}
                </div>
            )}

            <nav aria-label="Main Navigation">
                <DndContext
                    id="link-list-dnd"
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={sortableItems.map(l => l.id)}
                        strategy={verticalListSortingStrategy}
                        disabled={!isEditable}
                    >
                        <ul className="flex flex-col space-y-2 relative min-h-[50px]">
                            {sortableItems.length === 0 && !primary && (
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                                    <p className="text-muted-foreground font-medium">No links yet.</p>
                                </div>
                            )}

                            {sortableItems.map((link) => (
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
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:text-foreground hover:border-muted-foreground/60 hover:bg-muted/10 transition-all font-medium"
                >
                    <span className="text-xl leading-none">+</span> {isPending ? "Adding..." : "Add Link"}
                </motion.button>
            )}
        </div>
    );
}
