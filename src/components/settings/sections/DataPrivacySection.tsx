"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { SettingsSectionCard } from "@/components/settings/SettingsSectionCard";
import { Settings } from "@/hooks/useSettingsStore";
import { Download, RotateCcw, AlertTriangle, X } from "lucide-react";

interface DataPrivacySectionProps {
    settings: Settings;
    exportSettings: () => void;
    resetSettings: () => void;
    reduceMotion: boolean;
}

export function DataPrivacySection({ exportSettings, resetSettings, reduceMotion }: DataPrivacySectionProps) {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleReset = () => {
        resetSettings();
        setShowConfirm(false);
    };

    const modalTransition: Transition = reduceMotion
        ? { duration: 0 }
        : { type: "spring", bounce: 0.25, duration: 0.4 };

    return (
        <div className="space-y-4">
            <SettingsSectionCard
                title="Your Data"
                description="Export or manage the data stored by Link-Nexo on this device."
            >
                {/* Export */}
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">Export profile JSON</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Download your profile and settings as a portable JSON file.
                        </p>
                    </div>
                    <button
                        onClick={exportSettings}
                        className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-border bg-background hover:bg-muted/50 text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        <Download className="w-4 h-4" aria-hidden="true" />
                        Export
                    </button>
                </div>
            </SettingsSectionCard>

            {/* Danger zone */}
            <SettingsSectionCard
                title="Danger Zone"
                description="Irreversible actions that affect your profile configuration."
                className="border-red-200 dark:border-red-900/50"
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">Reset to defaults</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Restore all settings to their original default values. This cannot be undone.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    >
                        <RotateCcw className="w-4 h-4" aria-hidden="true" />
                        Reset
                    </button>
                </div>
            </SettingsSectionCard>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirm && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                            onClick={() => setShowConfirm(false)}
                            aria-hidden="true"
                        />

                        {/* Modal */}
                        <motion.div
                            key="modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="reset-modal-title"
                            aria-describedby="reset-modal-desc"
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={modalTransition}
                            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle className="w-5 h-5 text-red-500" aria-hidden="true" />
                                    </div>
                                    <h2 id="reset-modal-title" className="text-base font-semibold text-foreground">
                                        Reset to defaults?
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
                                    aria-label="Close dialog"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <p id="reset-modal-desc" className="text-sm text-muted-foreground leading-relaxed">
                                All settings — including your profile info, appearance, and preferences — will be restored
                                to their original defaults. This action cannot be undone.
                            </p>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 h-10 rounded-xl border border-border text-sm font-medium text-foreground bg-background hover:bg-muted/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="flex-1 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                                >
                                    Yes, reset
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
