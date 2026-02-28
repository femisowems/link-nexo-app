export type LinkVariant = "featured" | "default" | "primaryOffer";
export type PrimaryOfferTemplate = "elevated" | "split" | "minimal" | "banner";
export type LinkBadge = string;
export type SocialPlatform = "github" | "linkedin" | "twitter" | "youtube" | "instagram" | "email" | "website";

export type LinkItem = {
    id: string;
    title: string;
    subtitle?: string;
    href: string;
    icon?: SocialPlatform | "website" | "calendar" | "custom";
    variant?: LinkVariant;
    badge?: LinkBadge;
    layout?: string;
    accent?: string;
    template?: PrimaryOfferTemplate;
    ctaLabel?: string;
    price?: string;
    originalPrice?: string;
    rating?: string;
    thumbnailUrl?: string;
    analyticsEventName?: string;
    openInNewTab?: boolean;
    visible?: boolean;
    startDate?: Date | null;
    endDate?: Date | null;
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

export type SectionVisibility = {
    profile: boolean;
    socials: boolean;
    links: boolean;
};

export type LocationData = {
    city: string;
    country: string;
    display: string;
};

export type Profile = {
    name?: string | null;
    handle: string;
    bio: string;
    avatarUrl: string;
    verified?: boolean;
    location?: LocationData | string;
    socials?: Social[];
    isPro?: boolean;
    customDomains?: CustomDomain[];
    sectionVisibility?: SectionVisibility;
};

export type AppConfig = {
    profile: Partial<Profile>;
    links: LinkItem[];
};
