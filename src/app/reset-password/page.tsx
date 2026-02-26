"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Link2, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { resetPassword } from "@/app/actions";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) setError("Missing reset token. Please request a new link.");
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirm) {
            setError("Passwords don't match.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setIsLoading(true);
        const result = await resetPassword(token, password);
        setIsLoading(false);

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            setTimeout(() => router.push("/login?reset=true"), 2500);
        }
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

                {success ? (
                    <div className="flex flex-col items-center text-center gap-4 py-4">
                        <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle2 className="w-7 h-7 text-green-500" />
                        </div>
                        <div>
                            <h1 className="auth-title">Password updated!</h1>
                            <p className="auth-subtitle mt-1">Redirecting you to sign in…</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="auth-header">
                            <h1 className="auth-title">Choose a new password</h1>
                            <p className="auth-subtitle">Must be at least 8 characters.</p>
                        </div>

                        <div aria-live="polite" aria-atomic="true">
                            {error && <div className="auth-alert">{error}</div>}
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form" noValidate>
                            <div className="auth-field">
                                <label htmlFor="password" className="auth-label">New Password</label>
                                <div className="auth-input-wrap">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        minLength={8}
                                        className="auth-input"
                                        required
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="auth-eye-btn"
                                        onClick={() => setShowPassword(v => !v)}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="confirm" className="auth-label">Confirm Password</label>
                                <div className="auth-input-wrap">
                                    <input
                                        id="confirm"
                                        type={showConfirm ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        minLength={8}
                                        className="auth-input"
                                        required
                                    />
                                    <button
                                        type="button"
                                        aria-label={showConfirm ? "Hide confirm" : "Show confirm"}
                                        className="auth-eye-btn"
                                        onClick={() => setShowConfirm(v => !v)}
                                    >
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !token}
                                className="auth-submit-btn"
                            >
                                {isLoading && <Loader2 className="auth-spinner" />}
                                Set New Password
                            </button>
                        </form>

                        <p className="auth-footer-text">
                            <Link href="/login" className="auth-link">Back to Sign In</Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordForm />
        </Suspense>
    );
}
