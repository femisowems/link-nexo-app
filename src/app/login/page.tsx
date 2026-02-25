"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Link2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToast();

    useEffect(() => {
        if (searchParams.get("registered") === "true") {
            showToast("Account created! Please sign in.");
        }
    }, [searchParams, showToast]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password. Please try again.");
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-root">
            <div className="auth-bg" aria-hidden="true" />
            <div className="auth-card">
                {/* Brand */}
                <div className="auth-brand">
                    <div className="auth-logo">
                        <Link2 size={22} strokeWidth={2.5} />
                    </div>
                    <span className="auth-logo-name">Link Nexo</span>
                </div>

                <div className="auth-header">
                    <h1 className="auth-title">Welcome back</h1>
                    <p className="auth-subtitle">Sign in to manage your profiles</p>
                </div>

                {/* Inline error */}
                <div aria-live="polite" aria-atomic="true">
                    {error && <div className="auth-alert">{error}</div>}
                </div>

                <form onSubmit={handleLogin} className="auth-form" noValidate>
                    {/* Email */}
                    <div className="auth-field">
                        <label htmlFor="email" className="auth-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`auth-input${error ? " auth-input-error" : ""}`}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="auth-field">
                        <div className="auth-label-row">
                            <label htmlFor="password" className="auth-label">Password</label>
                        </div>
                        <div className="auth-input-wrap">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                className={`auth-input${error ? " auth-input-error" : ""}`}
                                required
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="auth-eye-btn"
                                onClick={() => setShowPassword((v) => !v)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="auth-submit-btn">
                        {isLoading && <Loader2 className="auth-spinner" />}
                        Sign In
                    </button>
                </form>

                <p className="auth-footer-text">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="auth-link">Create one</Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
