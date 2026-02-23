import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LocationData } from "@/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function parseLocation(val: string | null | undefined): LocationData | string {
    if (!val) return "";
    try {
        const parsed = JSON.parse(val);
        if (typeof parsed === 'object' && parsed !== null && 'display' in parsed) {
            return parsed as LocationData;
        }
    } catch {
        // It's a plain string like "Everywhere, World"
    }
    return val;
}
