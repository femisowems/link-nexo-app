"use client";

import { useState, useRef, useTransition } from "react";
import { updateEmail, updatePassword } from "@/app/admin/settings/actions";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

function PasswordInput({ name, label, placeholder }: { name: string; label: string; placeholder?: string }) {
    const [show, setShow] = useState(false);
    return (
        <div className="space-y-1.5">
            <label htmlFor={name} className="block text-sm font-medium text-foreground">{label}</label>
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    required
                    className="w-full h-11 pl-4 pr-12 rounded-xl text-sm border border-border bg-background text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all"
                />
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={show ? "Hide password" : "Show password"}
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}

function FormFeedback({ success, error }: { success?: boolean; error?: string }) {
    if (!success && !error) return null;
    return (
        <div
            role="alert"
            className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl ${success
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                    : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                }`}
        >
            {success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
            {success ? "Saved successfully." : error}
        </div>
    );
}

// ─── Email Section ─────────────────────────────────────────────────────────────

export function EmailSection({ currentEmail }: { currentEmail: string }) {
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <section className="bg-card rounded-2xl border border-border p-6 space-y-5">
            <div>
                <h2 className="text-base font-semibold text-foreground">Email Address</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Your current email: <span className="font-medium text-foreground">{currentEmail}</span></p>
            </div>

            <form
                ref={formRef}
                action={(formData) => {
                    startTransition(async () => {
                        const res = await updateEmail(formData);
                        setResult(res);
                        if (res.success) formRef.current?.reset();
                    });
                }}
                className="space-y-4"
            >
                <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-sm font-medium text-foreground">New Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full h-11 px-4 rounded-xl text-sm border border-border bg-background text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all"
                    />
                </div>
                <PasswordInput name="password" label="Confirm current password" placeholder="Your current password" />

                <FormFeedback {...(result ?? {})} />

                <button
                    type="submit"
                    disabled={isPending}
                    className="h-10 px-6 rounded-xl text-sm font-medium bg-foreground text-background hover:opacity-90 disabled:opacity-50 transition-all"
                >
                    {isPending ? "Saving…" : "Update Email"}
                </button>
            </form>
        </section>
    );
}

// ─── Password Section ──────────────────────────────────────────────────────────

export function PasswordSection() {
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <section className="bg-card rounded-2xl border border-border p-6 space-y-5">
            <div>
                <h2 className="text-base font-semibold text-foreground">Change Password</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Choose a strong password of at least 8 characters.</p>
            </div>

            <form
                ref={formRef}
                action={(formData) => {
                    startTransition(async () => {
                        const res = await updatePassword(formData);
                        setResult(res);
                        if (res.success) formRef.current?.reset();
                    });
                }}
                className="space-y-4"
            >
                <PasswordInput name="currentPassword" label="Current password" />
                <PasswordInput name="newPassword" label="New password" placeholder="At least 8 characters" />
                <PasswordInput name="confirmPassword" label="Confirm new password" />

                <FormFeedback {...(result ?? {})} />

                <button
                    type="submit"
                    disabled={isPending}
                    className="h-10 px-6 rounded-xl text-sm font-medium bg-foreground text-background hover:opacity-90 disabled:opacity-50 transition-all"
                >
                    {isPending ? "Saving…" : "Change Password"}
                </button>
            </form>
        </section>
    );
}
