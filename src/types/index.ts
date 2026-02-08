export type LinkVariant = "featured" | "default";
export type LinkBadge = "NEW" | "FEATURED" | "LIVE";
export type SocialPlatform = "github" | "linkedin" | "twitter" | "youtube" | "instagram" | "email" | "website";

export type LinkItem = {
    id: string;
    title: string;
    subtitle?: string;
    href: string;
    icon?: SocialPlatform | "website" | "calendar" | "custom";
    variant?: LinkVariant;
    badge?: LinkBadge;
    thumbnailUrl?: string;
    analyticsEventName?: string;
    openInNewTab?: boolean;
    visible?: boolean;
};

export type CustomDomain = {
    id: string;
    domain: string;
    profileHandle: string;
    status: "pending" | "verified" | "error";
    verificationMethod: "CNAME" | "TXT";
    verificationToken?: string;
    createdAt: string;
};

export type Social = {
    id: string;
    platform: SocialPlatform;
    href: string;
    label?: string; // Optional label for accessibility
    visible?: boolean;
    order?: number;
};

export type Profile = {
    name: string;
    handle: string;
    bio: string;
    avatarUrl: string;
    verified?: boolean;
    location?: string;
    socials?: Social[];
    isPro?: boolean;
    customDomains?: CustomDomain[];
};

export type AppConfig = {
    profile: Profile;
    links: LinkItem[];
};
