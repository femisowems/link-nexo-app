import { useState, useEffect } from "react";

export type LayoutMode = "cards" | "page";

export function useLayoutMode() {
    const [layoutMode, setLayoutMode] = useState<LayoutMode>("cards");
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setIsHydrated(true);
        if (typeof window !== "undefined") {
            const savedMode = localStorage.getItem("layout-mode") as LayoutMode;
            if (savedMode === "cards" || savedMode === "page") {
                setLayoutMode(savedMode);
            }
        }
    }, []);

    const setMode = (mode: LayoutMode) => {
        setLayoutMode(mode);
        if (typeof window !== "undefined") {
            localStorage.setItem("layout-mode", mode);
            document.documentElement.setAttribute("data-layout", mode);
        }
    };

    useEffect(() => {
        if (isHydrated && typeof window !== "undefined") {
            document.documentElement.setAttribute("data-layout", layoutMode);
        }
    }, [layoutMode, isHydrated]);

    return { layoutMode, setMode, isHydrated };
}
