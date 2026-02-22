"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Trash2, ExternalLink, Link2, Share2, PencilLine,
    X, AlertTriangle, CheckCircle2, XCircle, AtSign, Loader2,
} from "lucide-react";
import { createProfile, deleteProfile } from "@/app/actions";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ProfileCardData {
    id: string;
    handle: string;
    bio: string | null;
    location: string | null;
    avatarUrl: string | null;
    verified: boolean | null;
    links: { visible: boolean | null }[];
    socials: { visible: boolean | null }[];
}

// ─── Create Profile Modal ──────────────────────────────────────────────────────

function CreateProfileModal({ onClose }: { onClose: () => void }) {
    const [handle, setHandle] = useState("");
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData();
        formData.set("handle", handle);
        startTransition(async () => {
            const res = await createProfile(formData);
            if (res.error) { setError(res.error); return; }
            router.refresh();
            onClose();
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-modal-title"
        >
            {/* Backdrop */}
            <motion.div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            <motion.div
                className="relative bg-background rounded-2xl border border-border shadow-2xl w-full max-w-md p-6 space-y-5"
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 30 } }}
                exit={{ opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } }}
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="space-y-1">
                    <h2 id="create-modal-title" className="text-lg font-semibold">Create New Profile</h2>
                    <p className="text-sm text-muted-foreground">Choose a unique handle for this profile. You can edit details after creation.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label htmlFor="handle-input" className="block text-sm font-medium">Handle</label>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <AtSign className="w-4 h-4" />
                            </span>
                            <input
                                ref={inputRef}
                                id="handle-input"
                                type="text"
                                value={handle}
                                onChange={(e) => { setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "")); setError(null); }}
                                placeholder="yourhandle"
                                required
                                minLength={3}
                                maxLength={32}
                                autoFocus
                                className="w-full h-11 pl-9 pr-4 rounded-xl text-sm border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all font-mono"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Your public URL: <span className="font-medium text-foreground">/{handle || "yourhandle"}</span>
                        </p>
                    </div>

                    {error && (
                        <div role="alert" className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                            <XCircle className="w-4 h-4 flex-shrink-0" /> {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-10 rounded-xl text-sm font-medium border border-border hover:bg-muted/50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || handle.length < 3}
                            className="flex-1 h-10 rounded-xl text-sm font-semibold bg-foreground text-background hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : <>Create Profile</>}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────

function DeleteConfirmModal({
    profile, onClose,
}: { profile: ProfileCardData; onClose: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = () => {
        startTransition(async () => {
            const res = await deleteProfile(profile.id);
            if (res.error) { setError(res.error); return; }
            router.refresh();
            onClose();
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
        >
            <motion.div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            <motion.div
                className="relative bg-background rounded-2xl border border-red-200 dark:border-red-900 shadow-2xl w-full max-w-sm p-6 space-y-5"
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 30 } }}
                exit={{ opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } }}
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="space-y-1">
                        <h2 id="delete-modal-title" className="text-base font-semibold">Delete @{profile.handle}?</h2>
                        <p className="text-sm text-muted-foreground">
                            This will permanently delete the profile and all its links and socials. <strong className="text-foreground">This cannot be undone.</strong>
                        </p>
                    </div>
                </div>

                {error && (
                    <div role="alert" className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                        <XCircle className="w-4 h-4 flex-shrink-0" /> {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 h-10 rounded-xl text-sm font-medium border border-border hover:bg-muted/50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="flex-1 h-10 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</> : "Delete Profile"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Profile Card ──────────────────────────────────────────────────────────────

function ProfileCard({ profile, onDeleteClick }: { profile: ProfileCardData; onDeleteClick: (p: ProfileCardData) => void }) {
    const visibleLinks = profile.links.filter((l) => l.visible).length;
    const totalLinks = profile.links.length;
    const visibleSocials = profile.socials.filter((s) => s.visible).length;
    const totalSocials = profile.socials.length;
    const avatar = profile.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${profile.handle}`;

    return (
        <div className="group relative flex flex-col rounded-xl border bg-card hover:shadow-md transition-shadow overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-primary/70 to-primary" />
            <div className="p-5 flex flex-col gap-4 flex-1">
                <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatar} alt={profile.handle} className="w-12 h-12 rounded-full border bg-muted object-cover flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="font-semibold truncate">@{profile.handle}</p>
                        {profile.bio && (
                            <p className="text-muted-foreground text-xs line-clamp-2 mt-0.5">{profile.bio}</p>
                        )}
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-medium">
                        <Link2 className="w-3 h-3" /> {visibleLinks}/{totalLinks} links
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-medium">
                        <Share2 className="w-3 h-3" /> {visibleSocials}/{totalSocials} socials
                    </span>
                    {profile.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-0.5 font-medium">
                            ✓ Verified
                        </span>
                    )}
                </div>

                {profile.location && (
                    <p className="text-muted-foreground text-xs">📍 {profile.location}</p>
                )}
            </div>

            {/* Action buttons */}
            <div className="border-t flex divide-x divide-border">
                <Link
                    href={`/admin/profiles/${profile.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center gap-2 text-xs font-medium py-4 px-3 hover:bg-muted/40 transition-colors whitespace-nowrap"
                >
                    <PencilLine className="w-3.5 h-3.5" /> Edit
                </Link>
                <a
                    href={`/${profile.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 text-xs font-medium py-4 px-3 hover:bg-muted/40 transition-colors whitespace-nowrap"
                >
                    <ExternalLink className="w-3.5 h-3.5" /> View Public
                </a>
                <button
                    onClick={() => onDeleteClick(profile)}
                    className="flex-1 inline-flex items-center justify-center gap-2 text-xs font-medium py-4 px-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-colors whitespace-nowrap"
                    aria-label={`Delete @${profile.handle}`}
                >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
            </div>
        </div>
    );
}

// ─── Main client component ─────────────────────────────────────────────────────

export function ProfilesClient({
    profiles: initialProfiles,
    userEmail,
}: {
    profiles: ProfileCardData[];
    userEmail: string;
}) {
    const [showCreate, setShowCreate] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<ProfileCardData | null>(null);

    return (
        <>
            <div className="space-y-8">
                {/* Page header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">My Profiles</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            All profiles connected to <span className="font-medium">{userEmail}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="inline-flex items-center gap-2 text-sm font-medium bg-foreground text-background rounded-lg px-4 py-2 hover:opacity-90 transition-opacity shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Profile
                    </button>
                </div>

                {initialProfiles.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-12 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted">
                            <Link2 className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-lg">No profiles yet</h2>
                            <p className="text-muted-foreground text-sm mt-1">Create your first profile to get started.</p>
                        </div>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="inline-flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg px-5 py-2 hover:opacity-90 transition-opacity"
                        >
                            <Plus className="w-4 h-4" /> Create Profile
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-5xl">
                            {initialProfiles.map((profile) => (
                                <ProfileCard key={profile.id} profile={profile} onDeleteClick={setDeleteTarget} />
                            ))}

                            {/* Add another card */}
                            <button
                                onClick={() => setShowCreate(true)}
                                className="group flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-muted/30 p-10 text-muted-foreground hover:text-foreground transition-all min-h-[180px]"
                            >
                                <div className="w-10 h-10 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium">New Profile</span>
                            </button>
                        </div>
                        <p className="text-center text-xs text-muted-foreground pt-2">
                            {initialProfiles.length} profile{initialProfiles.length !== 1 ? "s" : ""} linked to your account.
                        </p>
                    </>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showCreate && <CreateProfileModal onClose={() => setShowCreate(false)} />}
                {deleteTarget && <DeleteConfirmModal profile={deleteTarget} onClose={() => setDeleteTarget(null)} />}
            </AnimatePresence>
        </>
    );
}
