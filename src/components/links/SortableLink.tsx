"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LinkCard } from "./LinkCard";
import { LinkItem } from "@/types";
import { GripVertical } from "lucide-react";

interface SortableLinkProps {
    link: LinkItem;
    editable: boolean;
    onToggleVisibility: (id: string) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    autoFocusTitle?: boolean;
}

export function SortableLink({ link, editable, onToggleVisibility, onDelete, onDuplicate, autoFocusTitle }: SortableLinkProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: link.id, disabled: !editable });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        position: "relative" as const,
        opacity: isDragging ? 0.5 : 1,
    };

    // Drag Handle Component
    const DragHandle = editable ? (
        <div
            {...attributes}
            {...listeners}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-foreground touch-none z-20 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            aria-label="Reorder"
        >
            <GripVertical className="w-5 h-5" />
        </div>
    ) : null;

    return (
        <div ref={setNodeRef} style={style} className="relative touch-none mb-3">
            {/* mb-3 moved here from LinkCard to handle spacing in list correctly while dragging */}
            <LinkCard
                link={link}
                editable={editable}
                dragHandle={DragHandle}
                onToggleVisibility={onToggleVisibility}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                autoFocusTitle={autoFocusTitle}
            />
        </div>
    );
}
