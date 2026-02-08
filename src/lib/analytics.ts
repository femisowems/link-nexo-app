export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
    if (typeof window !== "undefined") {
        // In a real app, this would send data to GA4, Mixpanel, etc.
        console.groupCollapsed(`[Analytics] Event: ${eventName}`);
        console.log("Properties:", properties);
        console.groupEnd();
    }
}
