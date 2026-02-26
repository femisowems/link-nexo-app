"use client";

import { useState } from "react";
import Link from "next/link";
import { Link2, Loader2, ArrowLeft, MailCheck } from "lucide-react";
import { requestPasswordReset } from "@/app/actions";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        await requestPasswordReset(email.trim().toLowerCase());
        setIsLoading(false);
        setSubmitted(true); // Always show success to avoid email enumeration
    };

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

                {submitted ? (
                    <div className="flex flex-col items-center text-center gap-4 py-4">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                            <MailCheck className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="auth-title">Check your inbox</h1>
                            <p className="auth-subtitle mt-1">
                                If <strong>{email}</strong> is registered, you&apos;ll receive a
                                password reset link shortly.
                            </p>
                        </div>
                        <Link href="/login" className="auth-link flex items-center gap-1.5 mt-2">
                            <ArrowLeft size={14} />
                            Back to Sign In
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="auth-header">
                            <h1 className="auth-title">Forgot your password?</h1>
                            <p className="auth-subtitle">
                                Enter your email and we&apos;ll send you a reset link.
                            </p>
                        </div>

                        <div aria-live="polite" aria-atomic="true">
                            {error && <div className="auth-alert">{error}</div>}
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form" noValidate>
                            <div className="auth-field">
                                <label htmlFor="email" className="auth-label">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="auth-input"
                                    required
                                />
                            </div>

                            <button type="submit" disabled={isLoading} className="auth-submit-btn">
                                {isLoading && <Loader2 className="auth-spinner" />}
                                Send Reset Link
                            </button>
                        </form>

                        <p className="auth-footer-text">
                            Remember your password?{" "}
                            <Link href="/login" className="auth-link">Sign in</Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
