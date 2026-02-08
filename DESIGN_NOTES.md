# Link-Nexo Design Notes

## Core Philosophy
Link-Nexo is built with a **Content-First** and **Mobile-First** approach. The goal is to reduce friction between the user and the content they want to access, while maintaining a premium aesthetic.

## Architecture Decisions

### Framework & Styling
- **Next.js App Router**: Chosen for server-side rendering (SEO) and performance. Initial load is critical for link-in-bio pages.
- **TailwindCSS**: Used for utility-first styling. It allows for rapid iteration and ensures consistency via the theme configuration. Confirgured with `tailwindcss` v4 which uses standard CSS variables.
- **CSS Variables**: Theme colors are defined in `globals.css` as standard variables, making it trivial to implement theming (dark mode, custom brand colors) without rebuilding the JS bundle.

### Component Structure
- **Atomic Design**: Components are split into logical units (`LinkCard`, `ProfileHeader`) to allow for independent testing and maintenance.
- **Composition**: `LinkList` handles the layout and staggering logic, while `LinkCard` handles the individual interaction and presentation. This separation of concerns simplifies complex animations.

### Performance & Interactions
- **Framer Motion**: Used for micro-interactions (hover lift, tap scale) and entrance animations.
- **Optimization**:
    - `layout` prop on `LinkCard` mapping ensures smooth reordering if data changes.
    - `will-change` (handled by Framer Motion) optimizes GPU layer usage.
- **Dynamic Imports**: Components are client-side only where interaction is needed (`"use client"` directive), keeping the server payload small.

### Accessibility (A11y)
- **Semantic HTML**: `<nav>`, `<ul>`, `<li>`, `<a>` tags are used for screen reader navigation.
- **Focus Management**: `focus-visible` styles ensure keyboard users can navigate clearly.
- **Reduced Motion**: Framer Motion's `layout` animations respect `prefers-reduced-motion` settings automatically or can be configured to disabled.

## Future Improvements
- **CMS Integration**: Validating the `handle` against a database (PostgreSQL/Supabase).
- **Real Analytics**: Replace `console.log` in `lib/analytics.ts` with Vercel Analytics or specialized tracking.
- **Custom Themes**: Allow users to select font pairings and color palettes via a settings panel.
