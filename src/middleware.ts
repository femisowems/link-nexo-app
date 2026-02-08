import { NextRequest, NextResponse } from "next/server";
import { mockData } from "@/data/mock-data";

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
    ],
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const hostname = req.headers.get("host") || "";

    // Define allowed domains (localhost and main app domain)
    // In production, these would be env vars like process.env.NEXT_PUBLIC_ROOT_DOMAIN
    const allowedDomains = ["localhost:3000", "link-nexo.com", "Main-App-Domain"];

    // Check if the current hostname is a custom domain
    const isCustomDomain = !allowedDomains.some(domain => hostname.includes(domain));

    // If it's a custom domain, we need to rewrite to the profile page
    if (isCustomDomain) {
        // In a real app, we would look up the domain in a DB (e.g., Redis/Postgres)
        // const domainData = await getDomainData(hostname);

        // For this demo, we check our mock data
        const matchedProfile = mockData.profile.customDomains?.find(d => d.domain === hostname);

        if (matchedProfile) {
            // SECURITY CHECK: Only allow verified domains to render the profile
            if (matchedProfile.status !== "verified") {
                return NextResponse.rewrite(new URL("/domain-not-verified", req.url));
            }

            // Rewrite the URL to the dynamic route for the profile
            // keep the path (e.g. /about) if we want to support sub-pages later
            // For now, custom domains usually point to root
            return NextResponse.rewrite(new URL(`/${matchedProfile.profileHandle}${url.pathname}`, req.url));
        }

        // If domain is not found but points here, show 404 or a "Unclaimed Domain" page
        // For now, we just let it fall through or rewrite to 404
        // return NextResponse.rewrite(new URL("/404", req.url));
    }

    return NextResponse.next();
}
