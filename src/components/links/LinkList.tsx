"use client";

import { LinkItem } from "@/types";
import { LinkCard } from "./LinkCard";
import { motion, AnimatePresence } from "framer-motion";

interface LinkListProps {
    links: LinkItem[];
}

export function LinkList({ links }: LinkListProps) {
    return (
        <nav className="w-full max-w-lg mx-auto" aria-label="Main Navigation">
            <AnimatePresence mode="popLayout">
                <ul className="flex flex-col space-y-0 relative">
                    {links.map((link, index) => (
                        <motion.li
                            key={link.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: index * 0.08 + 0.2, // Stagger effect starting after header
                                type: "spring",
                                stiffness: 100,
                                damping: 15
                            }}
                        >
                            <LinkCard link={link} priority={index < 2} />
                        </motion.li>
                    ))}
                </ul>
            </AnimatePresence>
        </nav>
    );
}
