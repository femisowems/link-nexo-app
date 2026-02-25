"use client";

import { X, Copy, QrCode, Share2, Check, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useToast } from "@/components/ui/Toast";

interface ProfileShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    profileHandle: string;
    profileAvatar?: string;
}

export function ProfileShareModal({ isOpen, onClose, profileHandle, profileAvatar }: ProfileShareModalProps) {
    const [copiedShare, setCopiedShare] = useState(false);
    const [profileUrl, setProfileUrl] = useState("");
    const [showQrCode, setShowQrCode] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setProfileUrl(window.location.origin + '/' + profileHandle);
        }
    }, [profileHandle]);

    // Handle ESC key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const handleClose = () => {
        onClose();
        setTimeout(() => setShowQrCode(false), 200); // Reset state after close animation
    };

    if (!isOpen) return null;

    const copyToClipboard = () => {
        if (!profileUrl) return;
        navigator.clipboard.writeText(profileUrl);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
    };

    const handleShare = async () => {
        if (!profileUrl) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${profileHandle}'s Profile`,
                    url: profileUrl
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            // Fallback
            copyToClipboard();
            showToast("Profile link copied!");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Modal Box */}
            <div className={`relative w-full max-w-[360px] bg-white rounded-[28px] overflow-hidden shadow-2xl flex flex-col px-6 transition-all duration-300 animate-in zoom-in-95 ${showQrCode ? 'py-8' : 'pt-12 pb-6'}`}>
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                    <span className="sr-only">Close share modal</span>
                </button>

                {showQrCode ? (
                    <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-xl font-bold text-slate-900 mb-8">Scan to Connect</h3>

                        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-8 max-w-full">
                            {profileUrl && (
                                <QRCode
                                    value={profileUrl}
                                    size={200}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    viewBox={`0 0 256 256`}
                                />
                            )}
                        </div>

                        <button
                            onClick={() => setShowQrCode(false)}
                            className="w-full bg-[#1c1d25] text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-[#2a2c38] transition-colors shadow-sm text-[15px]"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Options
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-300">
                        {/* Header / Avatar */}
                        <div className="flex flex-col items-center gap-4 mb-6">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{profileHandle}</h2>

                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm relative bg-slate-100">
                                {profileAvatar ? (
                                    <Image
                                        src={profileAvatar}
                                        alt={profileHandle}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-3xl font-bold text-slate-400">
                                            {profileHandle.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* URL Box */}
                        <div className="w-full relative mb-6 group">
                            <input
                                type="text"
                                readOnly
                                value={profileUrl}
                                className="w-full bg-slate-100 border-none text-slate-600 rounded-xl py-3.5 pl-4 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                                title="Copy link"
                                aria-label="Copy to clipboard"
                            >
                                {copiedShare ? (
                                    <Check className="w-4 h-4 text-emerald-600" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full flex gap-3 flex-col">
                            <button
                                onClick={() => setShowQrCode(true)}
                                className="w-full bg-[#1c1d25] text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-[#2a2c38] transition-colors shadow-sm text-[15px]"
                            >
                                View QR Code <QrCode className="w-4 h-4" />
                            </button>

                            <button
                                onClick={handleShare}
                                className="w-full bg-[#2a7ce4] text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-[#2068c5] transition-colors shadow-sm text-[15px]"
                            >
                                Share <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
