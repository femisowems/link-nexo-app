"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, Undo2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastContextType {
    showToast: (message: string, options?: { onUndo?: () => void; duration?: number }) => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [undoCallback, setUndoCallback] = useState<(() => void) | undefined>(undefined);
    const [elementId, setElementId] = useState<NodeJS.Timeout | undefined>(undefined);

    const hideToast = useCallback(() => {
        setIsVisible(false);
        setUndoCallback(undefined);
    }, []);

    const showToast = useCallback((msg: string, options?: { onUndo?: () => void; duration?: number }) => {
        if (elementId) clearTimeout(elementId);

        setMessage(msg);
        setUndoCallback(() => options?.onUndo);
        setIsVisible(true);

        const duration = options?.duration || 5000;
        const id = setTimeout(() => {
            setIsVisible(false);
            setUndoCallback(undefined);
        }, duration);
        setElementId(id);
    }, [elementId]);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex justify-center pointer-events-none w-full max-w-sm px-4">
                <AnimatePresence>
                    {isVisible && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-4 py-3 rounded-full shadow-xl flex items-center gap-4 pointer-events-auto border border-white/10 dark:border-black/5"
                        >
                            <span className="text-sm font-medium">{message}</span>

                            {undoCallback && (
                                <button
                                    onClick={() => {
                                        undoCallback();
                                        hideToast();
                                    }}
                                    className="flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 dark:bg-black/5 dark:hover:bg-black/10 px-2.5 py-1.5 rounded-full transition-colors"
                                >
                                    <Undo2 className="w-3.5 h-3.5" />
                                    Undo
                                </button>
                            )}

                            <button
                                onClick={hideToast}
                                className="text-white/50 hover:text-white dark:text-black/40 dark:hover:text-black ml-1"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
