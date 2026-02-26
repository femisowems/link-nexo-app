"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Link2, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { verifyEmail } from "@/app/actions";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Missing verification token. Please use the link from your email.");
            return;
        }
        verifyEmail(token).then((result) => {
            if (result.error) {
                setStatus("error");
                setMessage(result.error);
            } else {
                setStatus("success");
            }
        });
    }, [token]);

    return (
        <div className="auth-root">
            <div className="auth-bg" aria-hidden="true" />
            <div className="auth-card">
                <Link href="/" className="auth-brand">
                    <div className="auth-logo">
                        <Link2 size={22} strokeWidth={2.5} />
                    </div>
                    <span className="auth-logo-name">Link Nexo</span>
                </Link>

                <div className="flex flex-col items-center text-center gap-4 py-6">
                    {status === "loading" && (
                        <>
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            <p className="auth-subtitle">Verifying your email…</p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-green-500" />
                            </div>
                            <div>
                                <h1 className="auth-title">Email verified!</h1>
                                <p className="auth-subtitle mt-1">
                                    Your email has been confirmed. You&apos;re all set!
                                </p>
                            </div>
                            <Link href="/admin" className="auth-submit-btn inline-block text-center mt-2">
                                Go to Dashboard →
                            </Link>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                                <XCircle className="w-7 h-7 text-red-500" />
                            </div>
                            <div>
                                <h1 className="auth-title">Verification failed</h1>
                                <p className="auth-subtitle mt-1">{message}</p>
                            </div>
                            <Link href="/admin" className="auth-link mt-2">
                                Go to Dashboard
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense>
            <VerifyEmailContent />
        </Suspense>
    );
}
