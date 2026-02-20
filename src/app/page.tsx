"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, BarChart3, Palette, Globe2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      // ease: "easeOut" - removed to fix type error, default is fine
    },
  },
};

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Navbar */}
      <header className="fixed top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 font-bold text-xl"
          >
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Link-Nexo</span>
          </motion.div>
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Sign In
            </Link>
          </motion.nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-48 md:pb-32 px-4 space-y-8 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-background to-background dark:from-blue-900/20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container max-w-4xl mx-auto space-y-6"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse" />
            v1.0 is now live
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Your Digital Identity, <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Unified & Beautiful.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-muted-foreground max-w-[800px] mx-auto leading-relaxed">
            Link-Nexo is the open-source link-in-bio solution designed for creators who value privacy, speed, and aesthetics.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/sarah.dev"
              className="inline-flex items-center justify-center rounded-full text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-8"
            >
              View Demo Profile
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Why Link-Nexo?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built for performance and designed to convert. Everything you need to showcase your online presence.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<ShieldCheck className="h-10 w-10 text-blue-500" />}
                title="Privacy First"
                description="Open source and transparent. Your data belongs to you, not advertisers."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<BarChart3 className="h-10 w-10 text-indigo-500" />}
                title="Built-in Analytics"
                description="Track clicks and views without invasive tracking scripts or cookies."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<Palette className="h-10 w-10 text-purple-500" />}
                title="Custom Themes"
                description="Dark mode support and customizable colors to match your personal brand."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<Globe2 className="h-10 w-10 text-green-500" />}
                title="Custom Domains"
                description="Connect your own domain name for a fully branded experience."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<CheckCircle2 className="h-10 w-10 text-emerald-500" />}
                title="Verified Status"
                description="Official verification badges for authentic creators and brands."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<ArrowRight className="h-10 w-10 text-orange-500" />}
                title="Fast Performance"
                description="Built on Next.js 14 and Edge Network for lightning fast load times."
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="container max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl"
        >
          <h2 className="text-3xl md:text-5xl font-bold">Ready to claim your link?</h2>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto">
            Join thousands of creators using Link-Nexo to unify their digital presence.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full text-base font-bold text-blue-600 bg-white hover:bg-blue-50 transition-all h-14 px-8 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Construct Your Profile
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/10">
        <div className="container max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Link-Nexo</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Link-Nexo. Open Source. MIT License.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">GitHub</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Twitter</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="mb-4 bg-muted/50 w-16 h-16 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
