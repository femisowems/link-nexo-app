"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Link2 } from "lucide-react";
import { signUpUser } from "@/app/actions";

export default function SignUpPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [globalError, setGlobalError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Clear error for that field on change
        if (fieldErrors[name]) {
            setFieldErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setGlobalError("");
        setFieldErrors({});

        const result = await signUpUser(form);
        setIsLoading(false);

        if (result.fieldErrors) {
            setFieldErrors(result.fieldErrors);
            return;
        }
        if (result.error) {
            setGlobalError(result.error);
            return;
        }
        if (result.success) {
            router.push("/login?registered=true");
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
                    <h1 className="auth-title">Create your account</h1>
                    <p className="auth-subtitle">Fill in the details below to get started</p>
                </div>

                {/* Global error */}
                <div aria-live="polite" aria-atomic="true">
                    {globalError && (
                        <div className="auth-alert">{globalError}</div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    {/* Name */}
                    <div className="auth-field">
                        <label htmlFor="name" className="auth-label">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            placeholder="Jane Doe"
                            value={form.name}
                            onChange={handleChange}
                            className={`auth-input${fieldErrors.name ? " auth-input-error" : ""}`}
                            required
                        />
                        {fieldErrors.name && <p className="auth-field-error">{fieldErrors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="auth-field">
                        <label htmlFor="email" className="auth-label">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            className={`auth-input${fieldErrors.email ? " auth-input-error" : ""}`}
                            required
                        />
                        {fieldErrors.email && <p className="auth-field-error">{fieldErrors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="auth-field">
                        <label htmlFor="password" className="auth-label">Password</label>
                        <div className="auth-input-wrap">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                minLength={8}
                                className={`auth-input${fieldErrors.password ? " auth-input-error" : ""}`}
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
                        {fieldErrors.password && <p className="auth-field-error">{fieldErrors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="auth-field">
                        <label htmlFor="confirmPassword" className="auth-label">Confirm Password</label>
                        <div className="auth-input-wrap">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="••••••••"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                minLength={8}
                                className={`auth-input${fieldErrors.confirmPassword ? " auth-input-error" : ""}`}
                                required
                            />
                            <button
                                type="button"
                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                className="auth-eye-btn"
                                onClick={() => setShowConfirmPassword((v) => !v)}
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {fieldErrors.confirmPassword && <p className="auth-field-error">{fieldErrors.confirmPassword}</p>}
                    </div>

                    <button type="submit" disabled={isLoading} className="auth-submit-btn">
                        {isLoading && <Loader2 className="auth-spinner" />}
                        Create Account
                    </button>
                </form>

                <p className="auth-footer-text">
                    Already have an account?{" "}
                    <Link href="/login" className="auth-link">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
