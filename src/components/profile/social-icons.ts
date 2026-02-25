import { Github, Linkedin, Youtube, Mail, Instagram, Globe } from "lucide-react";
import { XBrandIcon } from "@/components/icons/XBrandIcon";

export const iconMap = {
    github: Github,
    linkedin: Linkedin,
    twitter: XBrandIcon,
    youtube: Youtube,
    email: Mail,
    instagram: Instagram,
    website: Globe
};

export const SOCIAL_PLATFORMS = Object.keys(iconMap) as (keyof typeof iconMap)[];
