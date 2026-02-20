"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Menu, Globe2, Link as LinkIcon, Smartphone, BarChart3, Palette, Github, Twitter, Youtube, Twitch, Figma, Framer, Code2, Terminal, Cpu, Box } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen font-sans">
            {/* Navbar */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 flex items-center justify-between px-6 py-4 rounded-full m-4 max-w-[calc(100%-2rem)] mx-auto shadow-sm border border-slate-100">
                <div className="flex items-center gap-6">
                    <Link href="/" className="font-bold text-2xl tracking-tighter flex items-center gap-2">
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Link-Nexo</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 hover:text-slate-900">
                        <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
                        <Link href="#themes" className="hover:text-blue-600 transition-colors">Themes</Link>
                        <Link href="#analytics" className="hover:text-blue-600 transition-colors">Analytics</Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden md:block py-2.5 px-6 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-sm font-semibold transition-colors text-slate-700">
                        Log in
                    </Link>
                    <Link href="/login" className="py-2.5 px-6 bg-blue-600 text-white hover:bg-blue-700 rounded-full text-sm font-semibold transition-colors shadow-md">
                        Sign up free
                    </Link>
                    <button className="md:hidden text-slate-800">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 md:px-12 bg-slate-950 text-white min-h-[90vh] flex items-center relative overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-white mt-10">
                            Your Digital Identity, <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Unified & Built for You.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 font-medium">
                            Join thousands using Link-Nexo. The modern, open-source link-in-bio app empowering creators with inline editing, unlimited customizable links, and complete privacy control.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
                            <div className="flex-1 bg-white/10 backdrop-blur-[2px] flex items-center px-4 rounded-full border border-white/20 focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden shadow-2xl">
                                <span className="text-slate-300 font-medium whitespace-nowrap">link-nexo.io/</span>
                                <input
                                    type="text"
                                    placeholder="yourname"
                                    className="w-full py-5 px-2 bg-transparent text-white outline-none font-medium placeholder:text-slate-400"
                                />
                            </div>
                            <button className="py-5 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg whitespace-nowrap transition-colors shadow-lg">
                                Claim your link
                            </button>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="hidden lg:flex justify-center perspective-[1000px]"
                    >
                        <div className="w-[340px] h-[680px] bg-slate-900 rounded-[3rem] p-3 relative overflow-hidden shadow-2xl border-4 border-slate-800 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-700 ease-out z-20">
                            <div className="w-full h-full bg-slate-50 rounded-[2.5rem] shadow-inner relative overflow-hidden">
                                <div className="absolute top-0 w-full h-7 flex justify-center items-start z-10 pt-2">
                                    <div className="w-32 h-6 bg-slate-900 rounded-full"></div>
                                </div>
                                <div className="p-8 pt-16 flex flex-col gap-4 items-center h-full relative z-10">
                                    <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full mb-4 shadow-lg border-4 border-white flex justify-center items-center text-white text-3xl font-bold">LN</div>
                                    <div className="w-48 h-6 bg-slate-200 rounded-full mb-8"></div>
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-full h-14 bg-white shadow-sm border border-slate-100 rounded-xl max-w-[85%] mx-auto hover:scale-105 transition-transform flex items-center px-4">
                                            <div className="w-8 h-8 rounded bg-slate-100 flex-shrink-0"></div>
                                            <div className="w-32 h-4 bg-slate-100 rounded ml-4"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-12 bg-white text-center border-y border-slate-100 overflow-hidden">
                <h2 className="text-xl font-bold mb-8 text-slate-800">Trusted by developers, creators, and modern brands</h2>
                <div className="flex justify-center gap-4 px-4 overflow-hidden mask-image-linear-gradient max-w-7xl mx-auto cursor-default">
                    <div className="flex space-x-6 animate-scroll whitespace-nowrap select-none">
                        {[...Array(2)].map((_, arrayIndex) => (
                            <div key={arrayIndex} className="flex space-x-6 items-center flex-nowrap pr-6">
                                {[
                                    { Icon: Github, color: "text-slate-800", delay: 0 },
                                    { Icon: Twitter, color: "text-blue-400", delay: 0.1 },
                                    { Icon: Youtube, color: "text-red-500", delay: 0.2 },
                                    { Icon: Box, color: "text-indigo-500", delay: 0.3 },
                                    { Icon: Figma, color: "text-pink-500", delay: 0.4 },
                                    { Icon: Framer, color: "text-blue-500", delay: 0.5 },
                                    { Icon: Terminal, color: "text-green-500", delay: 0.6 },
                                    { Icon: Twitch, color: "text-purple-500", delay: 0.7 },
                                    { Icon: Cpu, color: "text-slate-600", delay: 0.8 },
                                    { Icon: Code2, color: "text-blue-600", delay: 0.9 }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
                                        className="w-16 h-16 rounded-2xl bg-white flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm hover:scale-110 hover:shadow-md transition-all"
                                    >
                                        <item.Icon className={`w-8 h-8 ${item.color}`} />
                                    </motion.div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Essential Tools Grid */}
            <section id="features" className="py-24 bg-slate-50 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-extrabold mb-16 text-slate-900">All your essential tools,<br />accessible in one simple link.</motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-slate-900 text-white p-8 rounded-[2rem] min-h-[400px] flex flex-col justify-end relative overflow-hidden group shadow-xl">
                            <div className="absolute top-8 left-8 right-8 h-48 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
                                <Palette className="w-16 h-16 text-blue-400 relative z-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 z-10">Fully customizable themes with intuitive WYSIWYG inline editing.</h3>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }} className="bg-slate-900 text-white p-8 rounded-[2rem] min-h-[400px] flex flex-col justify-end relative overflow-hidden group shadow-xl">
                            <div className="absolute top-8 left-8 right-8 h-48 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent"></div>
                                <BarChart3 className="w-16 h-16 text-indigo-400 relative z-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 z-10">Highlight featured content effortlessly, and view analytics directly.</h3>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} viewport={{ once: true }} className="bg-slate-900 text-white p-8 rounded-[2rem] min-h-[400px] flex flex-col justify-end relative overflow-hidden group shadow-xl">
                            <div className="absolute top-8 left-8 right-8 h-48 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-transparent"></div>
                                <Globe2 className="w-16 h-16 text-violet-400 relative z-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 z-10">Open source and private. Complete control over your audience data.</h3>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="py-24 bg-blue-50 px-6 text-center border-y border-blue-100">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto space-y-8 flex flex-col items-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold max-w-2xl leading-[1.1] tracking-tight text-slate-900 text-balance">"The perfect companion for showcasing my open-source work."</h2>
                    <div className="w-full max-w-xl h-[300px] bg-slate-900 rounded-[3rem] overflow-hidden relative mt-8 mb-8 shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&q=80" alt="Developer setup" className="w-full h-full object-cover opacity-60" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold max-w-3xl px-4 text-slate-800">
                        "Deploying Link-Nexo allowed me to share my GitHub repos, tech blogs, and social links with absolute control and zero ads."
                    </p>
                    <p className="font-bold text-lg mt-8 text-slate-900">Alex Coder<br /><span className="font-normal text-slate-600">Full Stack Developer</span></p>
                </motion.div>
            </section>

            {/* Setup Alternating Sections Wrapper */}
            <div className="flex flex-col">
                {/* Feature Block 1 - Analytics */}
                <section className="py-24 bg-white px-6 border-b border-slate-100">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                            className="bg-blue-600 rounded-[2rem] aspect-square flex items-center justify-center p-8 w-full max-w-md mx-auto relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                            <motion.div
                                initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                                className="w-full h-3/4 bg-slate-900 rounded-2xl relative overflow-hidden shadow-2xl border border-slate-700 p-6 flex flex-col gap-4"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div className="w-24 h-4 bg-slate-700 rounded-full"></div>
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center"><BarChart3 size={16} /></div>
                                </div>
                                <div className="flex gap-4 h-24">
                                    <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-3 flex flex-col justify-end">
                                        <motion.div initial={{ height: 0 }} whileInView={{ height: "60%" }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 1 }} className="w-full bg-blue-500 rounded-t-md"></motion.div>
                                    </div>
                                    <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-3 flex flex-col justify-end">
                                        <motion.div initial={{ height: 0 }} whileInView={{ height: "80%" }} viewport={{ once: true }} transition={{ delay: 0.7, duration: 1 }} className="w-full bg-indigo-500 rounded-t-md"></motion.div>
                                    </div>
                                    <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-3 flex flex-col justify-end">
                                        <motion.div initial={{ height: 0 }} whileInView={{ height: "40%" }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 1 }} className="w-full bg-blue-400 rounded-t-md"></motion.div>
                                    </div>
                                </div>
                                <div className="bg-slate-800 rounded-xl h-12 w-full mt-auto border border-slate-700 flex items-center px-4">
                                    <div className="w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                                </div>
                            </motion.div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center rounded-full border border-blue-200 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50">Insights</div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-900">Understand your audience deeply.</h2>
                            <p className="text-xl font-medium text-slate-600">Stop guessing. Get real-time privacy-centric analytics on clicks, views, and engagement patterns to optimize your digital presence.</p>
                            <Link href="/analytics" className="inline-flex items-center py-4 px-8 bg-slate-900 text-white rounded-full font-bold text-lg transition-colors hover:bg-slate-800 group">
                                Explore Analytics <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Feature Block 2 - Themes */}
                <section className="py-24 bg-indigo-950 text-white px-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />

                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                            className="space-y-6 order-2 md:order-1"
                        >
                            <div className="inline-flex items-center rounded-full border border-purple-500/30 px-3 py-1 text-sm font-medium text-purple-300 bg-purple-500/10">Personalization</div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">Pixel-perfect themes. Zero code required.</h2>
                            <p className="text-xl font-medium text-indigo-200">Express yourself with fully customizable themes. Adjust colors, fonts, button styles, and responsive backgrounds to match your brand exactly.</p>
                            <Link href="/themes" className="inline-flex items-center py-4 px-8 bg-white text-indigo-950 rounded-full font-bold text-lg transition-colors hover:bg-gray-100 group">
                                View Theme Engine <Palette className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </Link>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                            className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] aspect-[3/4] flex flex-col items-center justify-center p-8 w-full max-w-sm mx-auto order-1 md:order-2 relative mt-12 md:mt-0 shadow-2xl"
                        >
                            <div className="w-full h-full bg-white rounded-[2rem] shadow-xl border-8 border-slate-800 relative max-h-[500px] overflow-hidden flex flex-col">
                                <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 flex justify-center items-center z-20">
                                    <div className="w-16 h-1.5 bg-slate-600 rounded-full"></div>
                                </div>
                                <motion.div
                                    initial={{ backgroundColor: "#ffffff" }}
                                    animate={{ backgroundColor: ["#ffffff", "#0f172a", "#170f2a", "#ffffff"] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="flex-1 w-full pt-10 px-4 flex flex-col gap-4 relative"
                                >
                                    <motion.div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 mx-auto mt-4" />
                                    <motion.div animate={{ backgroundColor: ["#f1f5f9", "#1e293b", "#2d1b4e", "#f1f5f9"] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-3/4 h-8 rounded-lg mx-auto" />
                                    <motion.div className="space-y-3 mt-4">
                                        {[1, 2, 3].map(i => (
                                            <motion.div
                                                key={i}
                                                animate={{
                                                    backgroundColor: ["#ffffff", "#cbd5e1", "#8b5cf6", "#ffffff"],
                                                    borderColor: ["#e2e8f0", "#334155", "#4c1d95", "#e2e8f0"]
                                                }}
                                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                                className="w-full h-12 rounded-xl border-2 shadow-sm"
                                            />
                                        ))}
                                    </motion.div>

                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur shadow-2xl rounded-2xl p-4 border flex gap-2 z-30">
                                        <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200"></div>
                                        <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700"></div>
                                        <div className="w-8 h-8 rounded-full bg-purple-900 border-2 border-purple-700"></div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Feature Block 3 - Integration */}
                <section className="py-24 bg-violet-50 text-slate-900 px-6 border-y border-violet-100">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                            className="bg-white rounded-[2rem] aspect-square flex items-center justify-center p-8 w-full max-w-md mx-auto relative overflow-hidden shadow-xl border border-violet-100"
                        >
                            <div className="relative w-full h-full flex items-center justify-center">
                                <div className="absolute w-64 h-64 border border-violet-200 rounded-full animate-[spin_20s_linear_infinite]" />
                                <div className="absolute w-48 h-48 border border-dashed border-violet-300 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                                <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-violet-500 z-10 relative">
                                    <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">LN</span>
                                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-12 w-10 h-10 bg-[#1DA1F2] rounded-full shadow-lg flex items-center justify-center text-white"><Globe2 size={16} /></motion.div>
                                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="absolute -bottom-12 -left-10 w-10 h-10 bg-[#E1306C] rounded-full shadow-lg flex items-center justify-center text-white"><Smartphone size={16} /></motion.div>
                                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="absolute -bottom-12 -right-10 w-10 h-10 bg-[#FF0000] rounded-full shadow-lg flex items-center justify-center text-white"><LinkIcon size={16} /></motion.div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center rounded-full border border-violet-200 px-3 py-1 text-sm font-medium text-violet-600 bg-violet-100">Integrations</div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">Connect your entire ecosystem.</h2>
                            <p className="text-xl font-medium text-slate-600">Embed YouTube videos, fetch latest tweets, display Shopify products, or collect newsletter signups right on your page without anyone leaving.</p>
                            <Link href="/integrations" className="inline-flex items-center py-4 px-8 bg-violet-600 text-white rounded-full font-bold text-lg transition-colors hover:bg-violet-700">
                                See Integrations
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </div>

            {/* Content Block 4 - Developers/API */}
            <section className="py-24 bg-slate-900 text-white px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                        className="space-y-6 order-2 md:order-1"
                    >
                        <div className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-sm font-medium text-slate-300 bg-slate-800">Developers</div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">Built for scale. Open by default.</h2>
                        <p className="text-xl font-medium text-slate-400">Self-host on your own infrastructure or use our edge network. Access full REST APIs, webhooks, and headless CMS capabilities to build custom experiences.</p>
                        <Link href="/docs" className="inline-flex items-center py-4 px-8 bg-blue-600 text-white rounded-full font-bold text-lg transition-colors hover:bg-blue-500">
                            Read the Docs
                        </Link>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                        className="w-full order-1 md:order-2 bg-slate-950 rounded-[2rem] p-6 shadow-2xl border border-slate-800 overflow-hidden relative group"
                    >
                        {/* Fake Code Editor */}
                        <div className="flex gap-2 mb-4 px-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="font-mono text-sm sm:text-base text-slate-300 space-y-2 overflow-x-auto pb-4">
                            <p><span className="text-purple-400">import</span> {'{'} LinkNexo {'}'} <span className="text-purple-400">from</span> <span className="text-emerald-400">'@link-nexo/sdk'</span>;</p>
                            <br />
                            <p><span className="text-purple-400">const</span> client = <span className="text-purple-400">new</span> <span className="text-blue-400">LinkNexo</span>({'{'}</p>
                            <p className="pl-4">apiKey: process.env.<span className="text-blue-300">NEXO_KEY</span>,</p>
                            <p className="pl-4">environment: <span className="text-emerald-400">'production'</span></p>
                            <p>{'}'});</p>
                            <br />
                            <p><span className="text-purple-400">export async function</span> <span className="text-blue-400">getProfile</span>(username) {'{'}</p>
                            <p className="pl-4"><span className="text-purple-400">const</span> profile = <span className="text-purple-400">await</span> client.users.<span className="text-blue-400">fetch</span>(username);</p>
                            <p className="pl-4"><span className="text-purple-400">return</span> profile.links;</p>
                            <p>{'}'}</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none group-hover:opacity-0 transition-opacity"></div>
                    </motion.div>
                </div>
            </section>
            {/* Users Grid Section */}
            <section className="py-24 bg-white px-6">
                <div className="max-w-6xl mx-auto text-center space-y-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 text-balance">
                        Link-Nexo is for creators, developers, and forward-thinking brands.
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                        {[
                            { name: "John Doe", title: "Open Source Developer", bio: "Showcasing my GitHub repos and latest tech blogs.", color: "from-blue-400 to-indigo-500" },
                            { name: "Jane Smith", title: "Product Designer", bio: "Book a consultation and view my Figma templates.", color: "from-pink-400 to-rose-500" },
                            { name: "Alex Jones", title: "Indie Hacker", bio: "Follow my startup journey and MRR updates.", color: "from-emerald-400 to-teal-500" },
                            { name: "Sarah Lee", title: "Tech Content Creator", bio: "Links to my YouTube gear and coding courses.", color: "from-orange-400 to-red-500" },
                            { name: "Mike Ray", title: "Cloud Consultant", bio: "Schedule a 1:1 architecture review call.", color: "from-purple-400 to-violet-500" },
                            { name: "Local DevShop", title: "Agency", bio: "View our portfolio and hire us for your next Next.js app.", color: "from-slate-600 to-slate-800" }
                        ].map((user, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                key={i}
                                className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 hover:shadow-xl transition-all flex flex-col items-center text-center group"
                            >
                                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${user.color} mb-4 flex items-center justify-center border-4 border-white shadow-md group-hover:scale-110 transition-transform`}>
                                    <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt={user.name} className="w-full h-full object-cover rounded-full mix-blend-overlay opacity-80" />
                                </div>
                                <h3 className="font-bold text-xl text-slate-900">{user.name}</h3>
                                <p className="text-blue-600 font-medium mb-4">{user.title}</p>
                                <p className="text-sm text-slate-600 border-t border-slate-200 pt-4 w-full">{user.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                    <Link href="/login" className="inline-flex py-4 px-10 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                        Claim your free link
                    </Link>
                </div>
            </section>

            {/* 3 Easy Steps */}
            <section className="py-32 bg-slate-50 px-6 border-y border-slate-200">
                <div className="max-w-5xl mx-auto text-center space-y-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">Get started in 3 steps.</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white border rounded-[2rem] p-8 relative pt-16 shadow-sm hover:shadow-md transition-shadow">
                            <div className="absolute top-8 left-8 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">1</div>
                            <h3 className="text-xl font-bold mb-4 text-slate-900">Claim</h3>
                            <p className="text-slate-600 font-medium leading-relaxed mb-8 h-16">
                                Sign up securely and claim your unique digital namespace.
                            </p>
                            <div className="w-full h-32 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden relative">
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                                <div className="bg-white rounded-lg shadow-sm p-3 px-5 border text-sm font-bold text-slate-600 flex items-center gap-2 z-10">
                                    <Globe2 className="w-4 h-4 text-slate-400" /> link-nexo.io/you
                                </div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white border rounded-[2rem] p-8 relative pt-16 shadow-sm hover:shadow-md transition-shadow">
                            <div className="absolute top-8 left-8 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">2</div>
                            <h3 className="text-xl font-bold mb-4 text-slate-900">Customize</h3>
                            <p className="text-slate-600 font-medium leading-relaxed mb-8 h-16">
                                Add your links and select a theme that matches your brand perfectly.
                            </p>
                            <div className="w-full h-32 bg-slate-50 rounded-xl border border-slate-200 flex gap-3 items-end justify-center pb-4 px-4 overflow-hidden relative">
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                                <motion.div initial={{ height: 0 }} whileInView={{ height: "66%" }} viewport={{ once: true }} className="w-1/3 bg-slate-800 rounded-t-xl z-10 shadow-lg"></motion.div>
                                <motion.div initial={{ height: 0 }} whileInView={{ height: "100%" }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="w-1/3 bg-blue-600 rounded-t-xl z-10 shadow-lg"></motion.div>
                                <motion.div initial={{ height: 0 }} whileInView={{ height: "80%" }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="w-1/3 bg-indigo-500 rounded-t-xl z-10 shadow-lg"></motion.div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="bg-white border rounded-[2rem] p-8 relative pt-16 shadow-sm hover:shadow-md transition-shadow">
                            <div className="absolute top-8 left-8 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">3</div>
                            <h3 className="text-xl font-bold mb-4 text-slate-900">Share</h3>
                            <p className="text-slate-600 font-medium leading-relaxed mb-8 h-16">
                                Share your URL anywhere and let your unified presence do the work.
                            </p>
                            <div className="w-full h-32 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center gap-4 overflow-hidden relative">
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 z-10 border border-blue-200 shadow-sm"><Globe2 /></motion.div>
                                <motion.div animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 z-10 border border-indigo-200 shadow-sm"><LinkIcon /></motion.div>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center text-violet-600 z-10 border border-violet-200 shadow-sm"><Smartphone /></motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Free Today CTA */}
            <section className="py-24 bg-blue-600 text-white px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">Get started for free today.</h2>
                <Link href="/login" className="inline-flex py-4 px-10 bg-white text-blue-600 hover:bg-slate-50 rounded-full font-bold text-xl transition-colors shadow-xl">
                    Create your Link-Nexo
                </Link>
            </section>

            {/* FAQ Section */}
            <section className="py-32 bg-white px-6">
                <div className="max-w-3xl mx-auto space-y-12">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-16 text-slate-900">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            { q: "Is Link-Nexo really free?", a: "Yes. Our core features are completely free to use and open source. We offer a Pro tier for advanced analytics, premium templates, and custom domain support." },
                            { q: "Can I self-host Link-Nexo?", a: "Absolutely. Link-Nexo is open-source. You can clone the repository from GitHub and deploy it to your own infrastructure (Vercel, AWS, Render) retaining 100% control over your data." },
                            { q: "How do I add my custom domain?", a: "Pro users can easily map their own domains (e.g., links.mybrand.com) via our dashboard by adding a simple CNAME record to their DNS settings." },
                            { q: "Is my data private?", a: "Yes. Unlike other platforms, we don't injecting third-party trackers or ads into your profile. Your audience's privacy is respected." }
                        ].map((faq, i) => (
                            <details key={i} className="group border border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                                <summary className="flex justify-between items-center font-bold text-xl text-slate-800 list-none">
                                    {faq.q}
                                    <span className="transition-transform group-open:rotate-180 text-blue-600">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <p className="text-slate-600 mt-4 leading-relaxed font-medium">
                                    {faq.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-32 bg-slate-950 text-white px-6 text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-blue-500/20 blur-[100px] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
                    <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] max-w-3xl">
                        Claim your corner of the internet today
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Link href="/login" className="py-4 px-10 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-xl transition-colors shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                            Get Started
                        </Link>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="py-4 px-10 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-bold text-xl transition-colors backdrop-blur-sm">
                            View GitHub
                        </a>
                    </div>
                </div>
            </section>

            {/* Actual Footer */}
            <footer className="bg-white py-16 px-6 border-t border-slate-200">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 text-sm">
                    <div className="col-span-2 lg:col-span-2 space-y-6">
                        <Link href="/" className="font-bold text-2xl tracking-tighter flex items-center gap-2 mb-4">
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Link-Nexo</span>
                        </Link>
                        <p className="text-slate-500 max-w-xs text-base">The modern, open-source solution for showcasing your digital presence securely and beautifully.</p>
                        <div className="flex gap-4 pt-4">
                            <Link href="/login" className="py-2.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full font-bold transition-colors">Log in</Link>
                            <Link href="/login" className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-colors">Sign up</Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-lg text-slate-900">Product</h4>
                        <ul className="space-y-3 text-slate-600 font-medium">
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Features</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Themes</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Integrations</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-lg text-slate-900">Resources</h4>
                        <ul className="space-y-3 text-slate-600 font-medium">
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">GitHub Repository</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Community Discord</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-lg text-slate-900">Legal</h4>
                        <ul className="space-y-3 text-slate-600 font-medium">
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 font-medium">
                    <p>&copy; {new Date().getFullYear()} Link-Nexo. MIT License.</p>
                    <div className="flex items-center gap-2">
                        <span>Built with</span>
                        <span className="text-red-500">❤️</span>
                        <span>and Next.js</span>
                    </div>
                </div>
            </footer>
        </div >
    );
}
