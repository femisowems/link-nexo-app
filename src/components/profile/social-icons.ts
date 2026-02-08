import { Github, Linkedin, Twitter, Youtube, Mail, Instagram, Globe } from "lucide-react";

export const iconMap = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    youtube: Youtube,
    email: Mail,
    instagram: Instagram,
    website: Globe
};

export const SOCIAL_PLATFORMS = Object.keys(iconMap) as (keyof typeof iconMap)[];
