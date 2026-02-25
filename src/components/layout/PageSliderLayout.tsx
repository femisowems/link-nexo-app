"use client";
import { ArrowDown, ArrowUp, LinkIcon, MapPin, Github, Linkedin, Twitter, Youtube, Instagram, Mail, Globe, Calendar, Star, Copy, QrCode, Share } from "lucide-react";
import { useState, useEffect } from "react";

interface PageSliderLayoutProps {
    profile: any;
}

const SocialIcon = ({ platform }: { platform: string }) => {
    switch (platform.toLowerCase()) {
        case 'github': return <Github size={20} />;
        case 'linkedin': return <Linkedin size={20} />;
        case 'twitter': return <Twitter size={20} />;
        case 'youtube': return <Youtube size={20} />;
        case 'instagram': return <Instagram size={20} />;
        case 'email': return <Mail size={20} />;
        case 'website': return <Globe size={20} />;
        default: return <LinkIcon size={20} />;
    }
};
export function PageSliderLayout({ profile }: PageSliderLayoutProps) {
    const { links, socials, name, bio, avatarUrl, handle, location } = profile;

    const [copied, setCopied] = useState(false);
    const [profileUrl, setProfileUrl] = useState("");

    useEffect(() => {
        setProfileUrl(window.location.origin + '/' + handle);
    }, [handle]);

    const copyToClipboard = () => {
        if (!profileUrl) return;
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${name || handle}'s Profile`,
                    url: profileUrl
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            // Fallback
            copyToClipboard();
        }
    };

    // Separate items into categories based on LinkItem variants
    // Map "featured" to highlight sections, and "primaryOffer" to dark sections.
    // We'll also fall back gracefully.
    const featuredCards = links?.filter((item: any) => item.variant === "featured") || [];
    const darkCards = links?.filter((item: any) => item.variant === "primaryOffer") || [];
    const mainLinks = links?.filter((item: any) => item.variant === "default" || !item.variant) || [];

    return (
        <div className="fixed inset-0 h-screen w-full overflow-y-auto snap-y snap-mandatory bg-slate-50 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-40">
            {/* 1. Profile Header Section */}
            <section id="profile" className="h-screen w-full snap-start flex flex-col items-center justify-center p-6 bg-slate-50 relative">
                <div className="w-40 h-40 rounded-full bg-slate-200 mb-6 overflow-hidden border-4 border-white shadow-xl flex items-center justify-center">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={name || handle} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-4xl font-bold text-slate-400">{(name || handle || "U")[0].toUpperCase()}</span>
                    )}
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 text-center tracking-tight">{name || handle}</h1>
                {location && (
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium mb-4">
                        <MapPin size={16} />
                        <span>{location}</span>
                    </div>
                )}

                <p className="text-lg md:text-xl text-slate-600 mb-8 text-center max-w-lg">{bio || "Welcome to my website!"}</p>

                {/* Social Icons Layout - Hero */}
                {socials && socials.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {socials.map((social: any) => (
                            <a
                                key={social.id}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.platform}
                                className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-50 hover:-translate-y-1 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                                <SocialIcon platform={social.platform} />
                            </a>
                        ))}
                    </div>
                )}

                <a
                    href={featuredCards.length > 0 ? "#featured-0" : mainLinks.length > 0 ? "#links" : "#contact"}
                    aria-label="Scroll down"
                    className="animate-bounce p-3 rounded-full bg-white shadow-md text-slate-500 border border-slate-100 hover:text-blue-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                    <ArrowDown size={20} />
                </a>
            </section>

            {/* 2. Featured Card Section */}
            {featuredCards.map((item: any, index: number) => {
                let accent = item.accent || "#89023E";
                if (!["#89023E", "#7FEFBD", "#000000"].includes(accent)) {
                    accent = "#89023E";
                }
                const isDynamicHex = accent.startsWith("#");

                const getAccentClasses = (c: string) => {
                    switch (c) {
                        case 'blue': return 'bg-blue-600 text-white';
                        case 'violet': return 'bg-violet-600 text-white';
                        case 'rose': return 'bg-rose-600 text-white';
                        case 'amber': return 'bg-amber-500 text-slate-900';
                        case 'emerald': return 'bg-emerald-600 text-white';
                        case 'orange': return 'bg-orange-500 text-white';
                        case 'slate':
                        default: return 'bg-slate-900 text-white';
                    }
                };

                const bgClass = !isDynamicHex
                    ? getAccentClasses(accent)
                    : (accent === '#7FEFBD' ? 'text-slate-900' : 'text-white');

                // Adjust button text color so it matches the theme
                const buttonTextClass = !isDynamicHex ? (
                    accent === 'amber' ? 'text-amber-600' :
                        accent === 'emerald' ? 'text-emerald-600' :
                            accent === 'slate' ? 'text-slate-900' : 'text-orange-600'
                ) : (
                    accent === '#89023E' ? 'text-[#89023E]' :
                        accent === '#7FEFBD' ? 'text-[#008f5d]' : // Darker green for button text legibility
                            accent === '#000000' ? 'text-black' : 'text-slate-900'
                );

                return (
                    <section
                        key={`featured-${item.id || index}`}
                        id={`featured-${index}`}
                        className={`h-screen w-full snap-start flex flex-col items-center justify-center p-6 ${bgClass}`}
                        style={isDynamicHex ? { backgroundColor: accent } : {}}
                    >
                        <div className="max-w-2xl w-full flex flex-col items-center text-center transform transition-transform hover:scale-105 duration-300">
                            {item.badge && <span className="uppercase tracking-widest text-sm font-bold mb-4 opacity-80">{item.badge}</span>}
                            {!item.badge && <span className="uppercase tracking-widest text-sm font-bold mb-4 opacity-80">Featured Video</span>}
                            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight">
                                {item.title}
                            </h2>
                            {item.subtitle && <p className="text-xl mb-8 opacity-90">{item.subtitle}</p>}
                            <a
                                href={item.href}
                                target={item.openInNewTab ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className={`px-10 py-5 rounded-full font-bold text-xl shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:outline-none transition-transform hover:-translate-y-1 bg-white ${buttonTextClass}`}
                            >
                                {item.ctaLabel || "View Content"}
                            </a>

                            {/* Scroll Indication */}
                            <a href={index < featuredCards.length - 1 ? `#featured-${index + 1}` : mainLinks.length > 0 ? "#links" : darkCards.length > 0 ? "#offer-0" : "#contact"} className="mt-16 opacity-60 hover:opacity-100 transition-opacity">
                                <ArrowDown size={24} />
                            </a>
                        </div>
                    </section>
                )
            })}

            {/* 3. Main Links List Section */}
            {mainLinks.length > 0 && (
                <section
                    id="links"
                    className="h-screen w-full snap-start flex flex-col items-center justify-center p-6 bg-blue-50 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="max-w-xl w-full flex flex-col items-center relative z-10 w-full overflow-y-auto max-h-screen py-20 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <h2 className="text-3xl font-bold mb-10 text-slate-900 border-b-2 border-slate-200 pb-2">Explore My Ecosystem</h2>
                        <div className="flex flex-col gap-4 w-full pb-8">
                            {mainLinks.map((item: any, index: number) => (
                                <a
                                    key={`link-${item.id || index}`}
                                    href={item.href}
                                    target={item.openInNewTab ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className="w-full bg-white px-8 py-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between group hover:shadow-md hover:border-blue-300 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-50 gap-4"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{item.title}</span>
                                        {item.subtitle && <span className="text-sm font-medium text-slate-500">{item.subtitle}</span>}
                                    </div>
                                    <span className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0 self-end sm:self-auto">
                                        <LinkIcon size={18} />
                                    </span>
                                </a>
                            ))}
                        </div>
                        {(darkCards.length > 0) && (
                            <a href="#offer-0" className="mt-4 text-slate-500 hover:text-slate-900 font-medium flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded p-1 pb-10">
                                Scroll for More <ArrowDown size={16} />
                            </a>
                        )}
                        {darkCards.length === 0 && (
                            <a href="#contact" className="mt-4 text-slate-500 hover:text-slate-900 font-medium flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded p-1 pb-10">
                                Contact <ArrowDown size={16} />
                            </a>
                        )}
                    </div>
                </section>
            )}

            {/* 4. Dark/Primary Offer Section */}
            {darkCards.map((item: any, index: number) => {
                const accent = item.accent || "slate";
                const isDynamicHex = accent.startsWith("#");

                const getAccentClasses = (c: string) => {
                    switch (c) {
                        case 'blue': return 'bg-blue-600';
                        case 'violet': return 'bg-violet-600';
                        case 'rose': return 'bg-rose-600';
                        case 'amber': return 'bg-amber-500';
                        case 'emerald': return 'bg-emerald-600';
                        case 'orange': return 'bg-orange-500';
                        case 'slate':
                        default: return 'bg-slate-900';
                    }
                };

                const bgClass = !isDynamicHex ? getAccentClasses(accent) : '';

                return (
                    <section
                        key={`offer-${item.id || index}`}
                        id={`offer-${index}`}
                        className={`h-screen w-full snap-start flex flex-col items-center justify-center p-6 text-white ${bgClass}`}
                        style={isDynamicHex ? { backgroundColor: accent } : {}}
                    >
                        <div className="max-w-2xl w-full flex flex-col items-center text-center transform transition-transform hover:scale-105 duration-300">
                            {item.badge && <span className="px-3 py-1 bg-white/20 rounded-full uppercase tracking-widest text-xs font-bold mb-6 backdrop-blur-sm">{item.badge}</span>}
                            {!item.badge && <span className="px-3 py-1 bg-white/20 rounded-full uppercase tracking-widest text-xs font-bold mb-6 backdrop-blur-sm">Exclusive Offer</span>}

                            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-white leading-tight drop-shadow-sm">
                                {item.title}
                            </h2>

                            {item.subtitle && <p className="text-xl mb-8 opacity-90">{item.subtitle}</p>}

                            {/* Product Details Row */}
                            {(item.price || item.rating) && (
                                <div className="flex flex-wrap items-center justify-center gap-6 mb-10 bg-black/20 p-4 rounded-2xl backdrop-blur-md">
                                    {item.price && (
                                        <div className="flex items-baseline">
                                            {item.originalPrice && <span className="text-xl text-white/50 line-through mr-3">{item.originalPrice}</span>}
                                            <span className="text-4xl font-extrabold">{item.price}</span>
                                        </div>
                                    )}

                                    {item.rating && (
                                        <div className="flex items-center gap-1.5 bg-yellow-400 text-yellow-950 font-bold px-3 py-1.5 rounded-full text-sm">
                                            <Star className="w-4 h-4 fill-current" />
                                            {item.rating}
                                        </div>
                                    )}
                                </div>
                            )}

                            <a
                                href={item.href}
                                target={item.openInNewTab ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className="px-10 py-5 rounded-full font-bold text-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] focus:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:outline-none transition-all hover:-translate-y-1 bg-white text-slate-900 hover:bg-slate-50 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                            >
                                {item.ctaLabel || "Get Access Now"}
                            </a>

                            <a href={index < darkCards.length - 1 ? `#offer-${index + 1}` : "#contact"} className="mt-16 text-white/50 hover:text-white transition-colors">
                                <ArrowDown size={24} />
                            </a>
                        </div>
                    </section>
                )
            })}

            {/* 5. Contact Section */}
            <section id="contact" className="min-h-screen w-full snap-start flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 relative overflow-hidden to-slate-100 text-slate-900 border-t border-border/10">
                {/* Decorative background elements */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

                <div className="w-full max-w-4xl mx-auto flex flex-col items-center z-10 relative">
                    <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900">Let's Connect</h2>
                    <p className="text-slate-600 mb-12 text-center max-w-lg font-medium text-lg leading-relaxed">
                        Thank you for visiting my digital space. Reach out on any of the platforms below to collaborate, chat, or just say hello.
                    </p>

                    {socials && socials.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full max-w-3xl">
                            {socials.map((social: any) => (
                                <a
                                    key={social.id}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.platform}
                                    className="group relative flex items-center gap-3 px-6 py-4 rounded-full bg-white shadow-sm border border-slate-200/60 text-slate-700 hover:text-blue-600 hover:border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="relative z-10 flex items-center justify-center">
                                        <SocialIcon platform={social.platform || ""} />
                                    </div>
                                    <span className="relative z-10 font-bold tracking-wide capitalize">{social.platform}</span>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Share Profile Card */}
                    <div className="mt-12 w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col items-center gap-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={name || handle} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-slate-400">{(name || handle || "U")[0].toUpperCase()}</span>
                                </div>
                            )}
                        </div>

                        <div className="w-full relative">
                            <input
                                type="text"
                                readOnly
                                value={profileUrl}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-600 rounded-xl py-3 pl-4 pr-12 text-sm font-medium focus:outline-none"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500"
                                aria-label="Copy to clipboard"
                            >
                                {copied ? <span className="text-xs font-bold text-emerald-600">Copied!</span> : <Copy size={16} />}
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={() => alert("QR Code generation coming soon!")}
                                className="w-full bg-slate-900 text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-md"
                            >
                                View QR Code <QrCode size={18} />
                            </button>
                            <button
                                onClick={handleShare}
                                className="w-full bg-blue-600 text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-md lg:hidden"
                            >
                                Share <Share size={18} />
                            </button>
                        </div>
                    </div>

                    <a
                        href="#profile"
                        className="mt-20 group flex items-center gap-2 text-slate-500 font-semibold hover:text-slate-900 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full ring-1 ring-slate-200/80 shadow-sm hover:shadow-md hover:ring-slate-300 transition-all duration-300"
                    >
                        <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
                        Back to Top
                    </a>
                </div>
            </section>
        </div>
    );
}
