"use client";

import { useState, useTransition } from "react";
import { MailWarning, X, Loader2 } from "lucide-react";
import { sendVerificationEmailAction } from "@/app/actions";

export function UnverifiedEmailBanner() {
    const [dismissed, setDismissed] = useState(false);
    const [sent, setSent] = useState(false);
    const [isPending, startTransition] = useTransition();

    if (dismissed) return null;

    const handleResend = () => {
        startTransition(async () => {
            await sendVerificationEmailAction();
            setSent(true);
        });
    };

    return (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-4 py-3 text-sm relative">
            <MailWarning className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
            <div className="flex-1">
                {sent ? (
                    <span className="font-medium">Verification email sent! Check your inbox.</span>
                ) : (
                    <>
                        <span className="font-medium">Please verify your email address.</span>
                        {" "}
                        <button
                            onClick={handleResend}
                            disabled={isPending}
                            className="underline underline-offset-2 hover:text-amber-700 inline-flex items-center gap-1 disabled:opacity-60"
                        >
                            {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                            Resend verification email
                        </button>
                    </>
                )}
            </div>
            <button
                onClick={() => setDismissed(true)}
                aria-label="Dismiss"
                className="text-amber-400 hover:text-amber-600 flex-shrink-0"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
