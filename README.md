# Link-Nexo

**A full-stack, conversion-first creator monetization platform.**

Link-Nexo empowers creators to own their digital storefront—showcasing links, selling digital products, capturing leads, and driving conversions through an authenticated, performance-optimized dashboard.

*(Demonstrates end-to-end ownership of a monetized creator platform architecture.)*

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## Product Overview

Creators are outgrowing basic link-in-bio directories. They need proper funnels, data ownership, and instant monetization paths.

Link-Nexo solves this by providing a unified destination where social traffic is captured and converted. Unlike static link lists, this platform is architected around actionable blocks—primary offers, lead capture forms, and dynamic layouts—giving creators deep control over their end-user journey and revenue streams.

---

## ✨ Core Features

### Creator Monetization
- **Primary Offer Card:** Highlight high-ticket items or immediate actions with dedicated styling and positioning.
- **Digital Product Promotion:** Architected to support direct digital sales flows.
- **Lead Capture Blocks:** Integrated data collection points to build creator-owned mailing lists.

### Customizable Profile System
- **Layout Variants:** Seamlessly shift between distinct visual hierarchies optimized for different creator niches.
- **Dynamic Theming:** Deeply customizable color palettes and visual language.
- **Section-Based Composition:** Modular drag-and-drop structure handling links, social icons, and heavy content.

### Analytics & Growth
- **Tracking Architecture:** Built to support granular click and conversion tracking pipelines.
- **Conversion-Focused Layout:** UI engineered specifically to drive end-user action over passive scrolling.

### Dashboard Experience
- **Unified Management:** Secure, session-based dashboard (NextAuth.js v5) for controlling all profile assets.
- **Inline WYSIWYG Editing:** Edit profile metadata, visuals, and links directly on the page—no separate forms.
- **Live Preview Environment:** Instant asynchronous rendering of changes before hitting the public edge.
- **Drag-and-Drop Organization:** Reorder links and social icons visually using an optimized dnd-kit interface.
- **Offer Management:** Granular control over active promotions, including scheduling and visibility toggles.

---

## 🧩 Block / Section System

Link-Nexo leverages a highly modular, component-driven block architecture. This allows the UI to remain highly extensible without bloating the core payload.

- **Primary Offer Block:** A high-visibility component designed to render rich media alongside direct call-to-actions, bypassing standard link lists.
- **Link List Block:** Optimized arrays of standard URL routing with support for scheduling and visual badges.
- **Media Block:** Asynchronous loading containers for embedded rich content.
- **Lead Form Block:** Client-side validated, server-action processed data ingestion forms.
- **Extensibility Matrix:** New block types can be registered and rendered via the central composition engine without modifying existing data schemas.

---

## 🏗️ Architecture

- **Public/Private Boundary:** Strict separation between the highly cached, edge-optimized public profile rendering paths (`/[handle]`) and the secure, dynamic mutations of the authenticated dashboard (`/admin`).
- **Rendering Strategy:** Utilizes Next.js App Router for a hybrid approach—Server Components (RSC) handle heavy data fetching and layout structure, while Client Components are isolated to interactive islands (like DnD ordering and live previews).
- **Data Flow:** Type-safe end-to-end data pipeline moving from generic relational database schemas through strongly typed ORM layers (Drizzle ORM), validated by Zod at the boundary, and executed via Next.js Server Actions to minimize client payload.
- **Database Architecture:** Runs on Neon Serverless Postgres, designed for quick connection ramping and high availability under traffic spikes from viral social media posts.

### 🗄️ Relational Data Model

The application uses an optimized relational schema ensuring atomic updates:

```text
users ──────< accounts
  │
  └──────── profiles ──────< links
                     └──────< socials
```

- **`user` & `account`**: Powered by NextAuth for session and OAuth strategy management.
- **`profile`**: Central hub storing `handle`, `bio`, `theme`, and `sectionVisibility` states.
- **`link` & `social`**: Actionable blocks linked to a profile, containing `order` indices for DnD sorting and scheduling metadata.

### 📁 Project Structure Highlights

```text
src/
├── app/
│   ├── [handle]/        # Public profile pages (dynamic route, heavily cached)
│   ├── admin/           # Authenticated admin dashboard & WYSIWYG editor
│   ├── api/             # API route handlers (NextAuth)
│   └── actions.ts       # Centralized Server Actions for CRUD operations
├── db/
│   ├── schema.ts        # Drizzle ORM schema definitions
│   └── index.ts         # Neon DB serverless edge-connection pool
├── components/          # Reusable UI Blocks (PrimaryOffer, LinkCard, etc.)
└── types/               # TypeScript interfaces shared effectively across boundaries
```

---

## 🎨 UX & Design Philosophy

- **Conversion-First Layout:** Every pixel serves to guide the user towards the creator's primary goal, leveraging Stan.store-inspired monetization principles.
- **Mobile-First Design:** Since 90%+ of traffic originates from social platforms (Instagram, TikTok), the UI is engineered exclusively around the mobile viewport experience first, scaling gracefully to desktop.
- **Frictionless Creator Funnel:** The dashboard experience removes technical overhead, allowing creators to update offers and links in seconds without breaking layout constraints. Micro-interactions and drag-and-drop state changes are smoothed over using Framer Motion.

---

## ⚙️ Getting Started

```bash
# 1. Clone the repository
git clone <repo-url>
cd link-nexo-app

# 2. Install dependencies
npm install

# 3. Setup Environment Variables
cp .env.example .env.local
```

Populate `.env.local` with your database and auth credentials:
```env
# Database (Neon Postgres)
DATABASE_URL="postgresql://..."

# Auth
AUTH_SECRET="your-secret-here" # generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

```bash
# 4. Push the database schema
npx drizzle-kit push

# 5. (Optional) Seed the database
npx tsx scripts/seed.ts

# 6. Run the development server
npm run dev
```

Build for production:
```bash
npm run build
npm run start
```

---

## 🧪 Future Roadmap

- **Payments Integration:** Native Stripe Connect flows for instant, in-profile digital product checkout.
- **Automated Email Sequences:** Deep integration with email providers (Resend/Sendgrid) triggered via the Lead Form block.
- **Comprehensive Analytics Dashboard:** Real-time visualization of traffic sources, CTRs, and revenue.
- **A/B Testing Engine:** Automated multivariate testing for Primary Offers to optimize creator CTR.
- **Theme Marketplace:** An ecosystem allowing customized, premium themes to be applied per-profile.

---

## 📸 Previews

### Dashboard & Public Profile
![App Preview](/public/app-preview.png)

---

## 👤 Author

**Femi Sowemimo** — Senior Frontend / AI Product Engineer  
*Brand:* StarterDev  
*Portfolio:* [ssowemimo.com](https://ssowemimo.com)  

**Focus Areas:**
- AI-Powered SaaS Applications
- Monetization Systems & Creator Economy
- UX-Driven Frontend Architecture
