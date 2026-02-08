"use client";

import { useState } from "react";
import { CustomDomain } from "@/types";
import { Copy, Check, Info, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface DomainSettingsProps {
    initialDomains?: CustomDomain[];
    isPro: boolean;
}

export function DomainSettings({ initialDomains = [], isPro }: DomainSettingsProps) {
    const [hostname, setHostname] = useState("");
    const [domains, setDomains] = useState<CustomDomain[]>(initialDomains);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddDomain = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPro) return;

        setLoading(true);
        setError(null);

        // basic validation
        const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
        if (!domainRegex.test(hostname)) {
            setError("Please enter a valid domain name (e.g. links.example.com)");
            setLoading(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            const newDomain: CustomDomain = {
                id: Math.random().toString(36).substring(7),
                domain: hostname,
                profileHandle: "sarah.dev",
                status: "pending",
                verificationMethod: "CNAME",
                createdAt: new Date().toISOString()
            };
            setDomains([...domains, newDomain]);
            setHostname("");
            setLoading(false);
        }, 1000);
    };

    const handleVerify = (id: string) => {
        // Simulate verification check
        setDomains(domains.map(d =>
            d.id === id ? { ...d, status: "verified" } : d
        ));
    };

    const handleRemove = (id: string) => {
        setDomains(domains.filter(d => d.id !== id));
    };

    return (
        <div className="w-full max-w-lg mx-auto space-y-8 p-6 bg-card rounded-2xl border border-border">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Custom Domains</h2>
                <p className="text-muted-foreground">
                    Connect your own domain to your profile to build your brand.
                </p>
            </div>

            {!isPro && (
                <div className="p-4 rounded-xl bg-muted/50 border border-border flex items-start gap-3">
                    <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Upgrade to Pro</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Custom domains are a Pro feature. Upgrade now to unlock.
                        </p>
                        <button className="mt-3 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-full">
                            Upgrade for $5/mo
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleAddDomain} className="space-y-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="links.yourdomain.com"
                        value={hostname}
                        onChange={(e) => setHostname(e.target.value)}
                        disabled={!isPro || loading}
                        className="flex-1 h-11 px-4 rounded-xl bg-background border border-muted focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-all disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!isPro || loading || !hostname}
                        className="h-11 px-6 rounded-xl bg-foreground text-background font-medium disabled:opacity-50 transition-all hover:opacity-90 flex items-center justify-center min-w-[80px]"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
                    </button>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
            </form>

            <div className="space-y-4">
                <AnimatePresence>
                    {domains.map((domain) => (
                        <motion.div
                            key={domain.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 rounded-xl border border-border bg-background space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="font-semibold">{domain.domain}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <StatusBadge status={domain.status} />
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemove(domain.id)}
                                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                                >
                                    Remove
                                </button>
                            </div>

                            {domain.status === "pending" && (
                                <VerificationInstructions domain={domain} onVerify={() => handleVerify(domain.id)} />
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: CustomDomain['status'] }) {
    if (status === "verified") {
        return (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3" /> Verified
            </span>
        );
    }
    if (status === "pending") {
        return (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                <Loader2 className="w-3 h-3 animate-spin" /> Pending DNS
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-red-600 bg-red-500/10 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" /> Error
        </span>
    );
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground">
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </button>
    );
}

function VerificationInstructions({ domain, onVerify }: { domain: CustomDomain, onVerify: () => void }) {
    const [method, setMethod] = useState<"CNAME" | "TXT">("CNAME");
    const isApex = domain.domain.split('.').length === 2;

    return (
        <div className="bg-muted/30 p-4 rounded-lg text-sm space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground font-medium">Verification Method</p>
                <div className="flex bg-muted rounded-lg p-1 gap-1">
                    <button
                        onClick={() => setMethod("CNAME")}
                        className={cn(
                            "px-3 py-1 rounded-md text-xs font-medium transition-all",
                            method === "CNAME" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        CNAME
                    </button>
                    <button
                        onClick={() => setMethod("TXT")}
                        className={cn(
                            "px-3 py-1 rounded-md text-xs font-medium transition-all",
                            method === "TXT" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        TXT
                    </button>
                </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-3 space-y-3">
                <div className="grid grid-cols-[60px_1fr] gap-y-3 gap-x-4 items-center text-xs sm:text-sm">
                    <span className="text-muted-foreground font-medium">Type</span>
                    <span className="font-mono">{method}</span>

                    <span className="text-muted-foreground font-medium">Name</span>
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono truncate">{method === "CNAME" ? (isApex ? "www" : domain.domain.split('.')[0]) : "@"}</span>
                        <CopyButton text={method === "CNAME" ? (isApex ? "www" : domain.domain.split('.')[0]) : "@"} />
                    </div>

                    <span className="text-muted-foreground font-medium">Value</span>
                    <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                        <span className="font-mono truncate">
                            {method === "CNAME" ? "cname.linknmexo.com" : `linknexo-verification=${domain.id}`}
                        </span>
                        <CopyButton text={method === "CNAME" ? "cname.linknmexo.com" : `linknexo-verification=${domain.id}`} />
                    </div>
                </div>
            </div>

            <div className="bg-blue-500/10 text-blue-700 dark:text-blue-300 p-3 rounded-lg text-xs flex gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                    {method === "CNAME"
                        ? "Recommended for subdomains. Point your CNAME record to our service."
                        : "Recommended for apex domains (e.g. example.com). Add a TXT record to verify ownership."}
                </p>
            </div>

            <button
                onClick={onVerify}
                className="w-full py-2.5 bg-foreground text-background rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
            >
                Verify Connection
            </button>
        </div>
    );
}
