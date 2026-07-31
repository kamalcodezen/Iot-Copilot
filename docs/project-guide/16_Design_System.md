# 16. Design System

IoT Copilot employs a unified, premium design system dubbed "Misty Ocean / Futuristic IoT". The entire visual language is designed to feel highly technical, deeply integrated, and responsive.

## 1. Color Palette (Tailwind Configuration)
Defined in `client/tailwind.config.ts` and `globals.css`:
- **Backgrounds:** Deep, dark teal (`#040d14` mapping to `bg-deep-blue`).
- **Surfaces:** Slightly lighter teal with transparency (`#0a192f`).
- **Accents:** 
  - Primary Accent: Neon Teal/Cyan (`#14b8a6` / `var(--color-accent)`).
  - Hover States: Slightly brighter (`#2dd4bf`).
- **Text:** 
  - Primary: Pure White (`#ffffff`).
  - Secondary: Slate/Gray (`#94a3b8`).
  - Muted: Darker Gray (`#64748b`).

## 2. Typography
- **Primary Font:** `Inter` (sans-serif) for all body text, dashboard numbers, and general UI. Selected for its legibility at small sizes.
- **Monospace Font:** `JetBrains Mono` is used exclusively for code snippets (AI Debugger), log outputs, and technical hardware specifications.
- **Brand Font:** `Sekuya` (Custom local font) used for the Logo text to give it a distinct, futuristic branding.

## 3. Glassmorphism
The platform heavily relies on "Glass" effects to create depth without solid borders.
- **Implementation:** Uses Tailwind classes: `bg-teal-950/40 backdrop-blur-2xl border border-teal-500/20`.
- **Usage:** Navbar, Dashboard Cards, Login Modal, and Chat bubbles.
- **Shadows:** Custom box shadows are used to simulate inner lighting, e.g., `shadow-[inset_0_0_12px_rgba(20,184,166,0.15)]`.

## 4. Animations & Interactions
Powered almost entirely by **Framer Motion**.
- **Page Transitions:** `nextjs-toploader` provides a visual progress bar during App Router navigation.
- **Micro-interactions:** 
  - Buttons scale down slightly on click (`active:scale-95`).
  - The Navbar features a "Magnetic Button" effect on the notifications bell and register CTA, where the button smoothly tracks the user's cursor within a bounding box.
- **Complex SVGs:** The `IoTLoader` and `Hero` components use `motion.circle` to animate pulsating nodes representing data flowing across an IoT network. *Note: SVGs must always have fallback values (e.g., `r={node.r || 10}`) to prevent hydration errors during animation cycles.*

## 5. Spacing & Layout
- Based on an 8px grid system.
- Max-width containers (`max-w-7xl`) constrain the layout on ultra-wide monitors.
- Mobile layouts shift from horizontal sidebars to absolute-positioned, swipeable drawers with bottom navigation bars.

## 6. Iconography
- Uses **Lucide React**.
- Icons are typically sized at `16px` to `20px` with a `strokeWidth` of `1.5` or `2`, maintaining a thin, technical appearance.
