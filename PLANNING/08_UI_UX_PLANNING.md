# UI/UX Planning — IoT Copilot AI

## Design System Tokens

### Colors
```css
--color-dark-navy: #0a0e1a;
--color-deep-blue: #0d1b2a;
--color-mid-blue: #1b2838;
--color-cyan: #00d4ff;
--color-cyan-glow: rgba(0, 212, 255, 0.3);
--color-neon-cyan: #00f0ff;
--color-blue-accent: #0066ff;
--color-white: #ffffff;
--color-gray-100: #e0e6ed;
--color-gray-300: #8892a4;
--color-gray-500: #4a5568;
--color-success: #00e676;
--color-warning: #ffab00;
--color-error: #ff1744;
--color-card-bg: rgba(13, 27, 42, 0.8);
--color-glass: rgba(255, 255, 255, 0.05);
--color-glass-border: rgba(255, 255, 255, 0.1);
```

### Typography
```css
--font-primary: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;

--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
--text-5xl: 3rem;
--text-6xl: 3.75rem;
```

### Glassmorphism
```css
.glass {
  background: rgba(13, 27, 42, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}
```

### Animations
- Page transitions: 0.3s ease
- Hover glow: 0.2s ease
- Particle float: infinite 20s linear
- Card hover: translateY(-4px) + shadow increase
- Loading skeleton: shimmer animation
- Chat message: fadeIn + slideUp

## Page Layouts

### Landing Page
```
┌─────────────────────────────────────────────────┐
│ Navbar (sticky, glass, logo + nav links + CTA) │
├─────────────────────────────────────────────────┤
│ Hero: Big text, animated bg, particles, CTA btn │
├─────────────────────────────────────────────────┤
│ Features Grid: 3x2 cards with icons             │
├─────────────────────────────────────────────────┤
│ How It Works: 4 step horizontal timeline        │
├─────────────────────────────────────────────────┤
│ AI Features: alternating image-text sections    │
├─────────────────────────────────────────────────┤
│ Popular Projects: card grid with hover effects  │
├─────────────────────────────────────────────────┤
│ Roadmap Preview: interactive timeline preview   │
├─────────────────────────────────────────────────┤
│ Testimonials: carousel/slider                   │
├─────────────────────────────────────────────────┤
│ FAQ: accordion with animated expand             │
├─────────────────────────────────────────────────┤
│ CTA: big banner with gradient background        │
├─────────────────────────────────────────────────┤
│ Footer: links, social, copyright                │
└─────────────────────────────────────────────────┘
```

### Dashboard Layout
```
┌──────────────┬──────────────────────────────────────┐
│              │  Header: greeting + search + avatar   │
│  Sidebar     ├──────────────────────────────────────┤
│  (glass,     │  Stats Bar: 4 metric cards            │
│  collapsible)├──────────────────────────────────────┤
│  - Logo      │  ┌──────────────┐  ┌──────────────┐ │
│  - Dashboard │  │Progress Chart│  │ Skill Radar   │ │
│  - AI Mentor │  │  (30d line)  │  │  (radar)      │ │
│  - Learning  │  └──────────────┘  └──────────────┘ │
│  - Projects  ├──────────────────────────────────────┤
│  - Explore   │  Recent Activity (timeline feed)     │
│  - Debugger  ├──────────────────────────────────────┤
│  - Interview │  AI Suggestions (3 smart cards)       │
│  - Community ├──────────────────────────────────────┤
│  - Profile   │  Project Progress (horizontal cards) │
│  - Settings  └──────────────────────────────────────┘
└──────────────┘
```

### AI Mentor Chat
```
┌──────────────┬──────────────────────────────────────┐
│  Sidebar     │  Chat Header: "AI IoT Mentor" + info │
│  (same)      ├──────────────────────────────────────┤
│              │  Messages (scrollable)                │
│              │  ┌──────────────────────────────────┐│
│              │  │ User: "How do I connect DHT11?" ─││
│              │  │ AI: "Great question! Here's how: ││
│              │  │ [code block] [wiring diagram]    ││
│              │  │ [step-by-step explanation]"      ││
│              │  └──────────────────────────────────┘│
│              │  Suggested Questions (chips)          │
│              ├──────────────────────────────────────┤
│              │  Chat Input (with send + attach btn) │
└──────────────┴──────────────────────────────────────┘
```

## Responsive Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px  
- Desktop: 1024px+
- Wide: 1440px+

On mobile, sidebar becomes bottom nav or hamburger menu.
