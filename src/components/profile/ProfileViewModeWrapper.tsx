"use client";

import { useState } from "react";
import { MonitorSmartphone, LayoutGrid } from "lucide-react";
import { PageSliderLayout } from "@/components/layout/PageSliderLayout";

interface ProfileViewModeWrapperProps {
    children: React.ReactNode;
    profile: any;
}

export function ProfileViewModeWrapper({ children, profile }: ProfileViewModeWrapperProps) {
    const [isWebsiteMode, setIsWebsiteMode] = useState(false);

    return (
        <>
            {/* Fixed Website Toggle Button for User Profiles */}
            <button
                onClick={() => setIsWebsiteMode(!isWebsiteMode)}
                className="fixed top-4 right-4 z-50 p-3 md:px-5 md:py-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-all flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 hover:shadow-xl"
                aria-label={isWebsiteMode ? "Switch to Classic View" : "Switch to Website Mode"}
            >
                {isWebsiteMode ? (
                    <>
                        <LayoutGrid size={18} className="text-blue-600 transition-transform group-hover:scale-110" />
                        <span className="hidden md:inline font-bold text-sm text-slate-800">Classic View</span>
                    </>
                ) : (
                    <>
                        <MonitorSmartphone size={18} className="transition-transform group-hover:scale-110 group-hover:text-blue-600" />
                        <span className="hidden md:inline font-bold text-sm text-slate-800">Website Mode</span>
                    </>
                )}
            </button>

            {isWebsiteMode ? (
                <PageSliderLayout profile={profile} />
            ) : (
                children
            )}
        </>
    );
}
