# Thalos Landing Page — Design Spec

**Date:** 2026-05-26
**Status:** Approved (pending user review of this document)
**Owner:** patrick@wemos.at
**Repo path:** `/Users/ortner/Workspace Local/Thalos Website`

---

## 1. Goal

Single long-scroll landing page for `thalos.at` go-live. Communicates what Thalos is (AI performance coach, Vienna, DASGYM-built), educates visitors across audiences (athletes, partner gyms, investors, press), and converts via a primary Partner Gym inbound CTA plus secondary early-access waitlist capture.

## 2. Inputs

- **Brand CI:** `THALOS_App_CI_Guideline.pdf` — Deep Navy / Cool Steel Blue / Neon Cyan / White, SF Pro typography, dark-premium-technical aesthetic, anti-fitness-influencer tone.
- **Strategy:** `Thalos_Social_Media_Strategie_2026.docx` — positioning, audience segments, messaging house, tone of voice, KPIs.
- **Current site:** `thalos.at` (English, minimal: "Engineer Performance. Deep Hack the Human Body.") — to be replaced.

## 3. Decisions (locked)

| Topic | Decision |
|---|---|
| Primary CTA | Partner Gym / B2B inbound (with secondary early-access waitlist) |
| Scope | Single long-scroll landing page |
| Languages | DE + EN with toggle (next-intl, routes `/de` and `/en`, default DE) |
| Tech stack | Next.js 14 (App Router) + next-intl |
| Visual direction | Mixture of "Data Cockpit" (Whoop-like, ring + glow) + "Cinematic" (Eight Sleep-like, dramatic gradients, big imagery) |
| Image strategy | Lorem placeholders until real assets: Unsplash w/ Cyan duotone overlay for athlete shots; CSS/HTML phone mockups replicating CI appendix screens; SVG logo approximation until real SVG supplied |
| Hosting | Vercel |
| Form backend | Next.js Route Handler → Resend transactional email (no DB initially) |

## 4. Information Architecture

Top → bottom long scroll:

1. **Sticky nav** — Thalos symbol, anchor links (System · Science · Athletes · Partner Gyms), DE/EN toggle, primary "Apply as Partner Gym" CTA. Transparent at top, backdrop-blur after 24px scroll.
2. **Hero** — cinematic Deep Navy + Cyan gradient. Eyebrow ("AI Performance Coach · Vienna"), display headline, sub. Dual CTA: primary "Apply as Partner Gym", secondary "Get early access". Right side: phone/dashboard mockup with glowing Neon Cyan ring echoing CI Home screen.
3. **What Thalos is** — 3-4 line positioning strip beneath hero. Frames go-live: "AI performance coach. Vienna. DASGYM-built."
4. **The system** — 4 pillars grid: Workouts V2 · Meals · Recovery · Data. Icon (Lucide) + 1-sentence each. Dark cards, Cyan accents.
5. **Product in motion** — sticky scroll storytelling (lg+). 3 phone mockups (Home / Sleep / Mahlzeiten — replicated from CI appendix in HTML/CSS) with side copy explaining each.
6. **Science / data layer** — "What your coach sees" — Polar 360, Laktat, CGM, sleep stages. Large data-ring visualization centerpiece. No medical claims (per strategy doc compliance rule).
7. **Founding Athletes / DASGYM** — Vienna anchor. Athlete portraits (Unsplash + duotone lorem placeholders) + 2-3 testimonial cards (placeholder copy until real testimonials supplied).
8. **Team** — people behind Thalos. Portrait grid w/ name, role, short bio. Lorem until headshots supplied.
9. **Partner Gyms CTA** — primary block. Value prop (what gym gets), application form (name, gym name, city, email, optional message). Background Cyan glow.
10. **Founder note** — short mission strip. Single quote + signature. Emotional close.
11. **FAQ** — 6-8 collapsible items. Includes medical disclaimer, data handling, pricing tease.
12. **Footer** — Impressum / Datenschutz / AGB (legal pages stubbed), social links, contact, secondary nav, language toggle backup.

## 5. Visual system

### 5.1 Color tokens (semantic, no raw hex in components)

```ts
export const color = {
  bg: {
    primary: '#0A1A2F',     // Deep Navy — 70-80% of page
    elevated: '#0A1A2F',    // same fill, 1px Cool Steel Blue border
    overlay: 'rgba(10,26,47,0.85)',
  },
  text: {
    primary: '#FFFFFF',     // headings, numbers
    secondary: '#446C8F',   // body ≥16px, captions
    inactive: '#446C8F',
    onAccent: '#0A1A2F',    // text on Cyan
  },
  border: {
    default: 'rgba(68,108,143,0.45)',
    active: 'rgba(0,224,255,0.85)',
  },
  accent: {
    cyan: '#00E0FF',        // CTA, active, data — capped 5-8% of pixels
    cyanGlow: 'rgba(0,224,255,0.28)',
  },
  gradient: {
    hero: 'linear-gradient(135deg, #0A1A2F 0%, #0A1A2F 45%, #00E0FF 100%)',
  },
} as const;
```

### 5.2 Typography

- Font: **Inter** loaded via `next/font/google` (SF Pro not legally usable as web font outside Apple platforms; Inter is closest geometric neo-grotesque match).
- Scale (clamp where indicated):
  - Display: `clamp(48px, 6vw, 88px)` weight 700 tracking -0.02em
  - H1 section: `clamp(36px, 4vw, 56px)` weight 700
  - H2 sub: 28–32px weight 600
  - Body lg: 18–20px weight 400 line-height 1.6
  - Body: 16px weight 400 line-height 1.65
  - Caption: 13–14px weight 400 Cool Steel Blue
  - Eyebrow: 12px uppercase tracking 0.12em Cyan

### 5.3 Spacing scale (4pt, matches CI §7)

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96, 128`

### 5.4 Radius

- Standard card: 24
- Small card: 20
- Button: 18-22
- Pill: 999
- Phone frame: 36

### 5.5 Effects (Cyan glow only, per CI §4)

```ts
shadow: {
  cardSubtle:  '0 0 24px rgba(0,224,255,0.08)',
  cardActive:  '0 0 32px rgba(0,224,255,0.18)',
  ctaGlow:     '0 0 28px rgba(0,224,255,0.32)',
  ringGlow:    '0 0 60px rgba(0,224,255,0.18)',
}
```

### 5.6 Components inventory

Button (primary/secondary/ghost), Card (standard/elevated/glow), NavBar (sticky w/ scroll-blur), RingViz (animated SVG), PhoneFrame (CSS — Home/Sleep/Mahlzeiten variants), QuoteCard, FeaturePill, FAQAccordion, FormInput, FormTextarea, Footer block, LanguageToggle, Icon wrapper (Lucide stroke-width 1.8).

### 5.7 Imagery

- **Athlete portraits:** Unsplash queries (gym / athlete / strength / training), CSS duotone overlay (`mix-blend-mode: multiply` Cyan + `filter: grayscale` to brand-lock).
- **Phone mockups:** built in HTML/CSS replicating CI appendix screens — pixel-faithful, no PNG dependency.
- **Backgrounds:** subtle SVG noise texture + radial gradients.
- **Logo:** inline SVG approximation of Λ-shape symbol from CI cover until real asset supplied.
- All decorative SVGs have `aria-hidden="true"`. Meaningful images get `alt` text.

## 6. Motion

Subtle + precise (per CI §15 — no bouncy, no playful, no glow pulses).

| Element | Animation |
|---|---|
| Hero ring | 0 → target value over 800ms, ease-out, on mount |
| Headline | fade + 8px translateY, 400ms ease-out |
| Scroll reveals | IntersectionObserver, fade + 16px lift, 300ms, stagger 50ms |
| Sticky nav | transparent → backdrop-blur after 24px scroll, 200ms |
| Buttons | hover lift -2px + glow intensify; press scale 0.98; 150ms |
| Phone parallax | subtle 10% scroll-linked, lg+ only |
| FAQ accordion | height + opacity, 250ms ease-out |
| Lang toggle | 120ms crossfade |
| Hero gradient | static (no animated gradient per CI) |

`prefers-reduced-motion`: kill parallax + scroll reveals, keep essential state changes only.

## 7. Responsive

Breakpoints: `sm 375` · `md 768` · `lg 1024` · `xl 1440`. Mobile-first.

- Container: 100% w/ edge padding 16 (sm) / 24 (md) / 32 (lg). Max 1280px xl, 1024 lg.
- Hero stacks on mobile (copy top, phone below). Dual CTAs stack.
- 4-pillar grid: 4col lg → 2col md → 1col sm.
- Sticky scroll storytelling: lg+ only, stacked on mobile.
- Nav: full anchor links lg+, hamburger md-.
- All tap targets ≥44px. Body text min 16px (avoid iOS zoom).
- Images: `<picture>` + srcset, AVIF/WebP, via `next/image`.

## 8. i18n + Accessibility

### 8.1 i18n

- `next-intl` w/ routing `/de` and `/en`. `middleware.ts` handles locale detection (Accept-Language → cookie → fallback `de`).
- Translation files: `messages/de.json`, `messages/en.json`. Single key source per string.
- `hreflang` tags + per-locale OpenGraph meta.
- Language toggle persists choice in cookie + URL.

### 8.2 Accessibility (WCAG AA target)

- Cool Steel Blue (`#446C8F`) on Deep Navy is contrast-borderline (~4.3:1); use only for body text ≥16px or non-essential UI. Below 14px use White at reduced opacity (per CI §14).
- Focus ring: 2px Neon Cyan, 2px offset, visible on all interactive elements.
- Skip-to-content link as first focusable element.
- Semantic HTML: `nav`, `main`, `section[aria-labelledby]`, `footer`.
- `aria-label` on icon-only buttons (lang toggle, hamburger, social).
- Form: visible labels (no placeholder-only), inline error on blur, aria-live region for submit feedback.
- All decorative SVGs `aria-hidden="true"`.
- Reduced-motion respected per §6.
- Keyboard nav: tab order matches visual order; Esc closes modals/mobile nav; Enter submits form.

## 9. File structure

```
thalos-website/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                 # landing
│   │   ├── layout.tsx               # locale layout, fonts, html lang
│   │   └── (legal)/
│   │       ├── impressum/page.tsx
│   │       ├── datenschutz/page.tsx
│   │       └── agb/page.tsx
│   ├── api/
│   │   └── partner-gym/route.ts     # POST handler + Resend email
│   ├── globals.css
│   ├── opengraph-image.tsx
│   └── icon.tsx                     # favicon
├── components/
│   ├── sections/
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── WhatThalosIs.tsx
│   │   ├── System.tsx
│   │   ├── ProductInMotion.tsx
│   │   ├── Science.tsx
│   │   ├── Athletes.tsx
│   │   ├── Team.tsx
│   │   ├── PartnerGyms.tsx
│   │   ├── FounderNote.tsx
│   │   ├── FAQ.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── RingViz.tsx
│   │   ├── PhoneFrame.tsx
│   │   ├── QuoteCard.tsx
│   │   ├── FAQAccordion.tsx
│   │   ├── FormInput.tsx
│   │   ├── LanguageToggle.tsx
│   │   └── Icon.tsx
│   └── motion/
│       └── Reveal.tsx               # IntersectionObserver wrapper
├── design-system/
│   └── tokens/
│       ├── color.ts
│       ├── typography.ts
│       ├── spacing.ts
│       ├── radius.ts
│       └── shadow.ts
├── messages/
│   ├── de.json
│   └── en.json
├── lib/
│   ├── i18n.ts
│   └── validation.ts                # zod schemas
├── public/
│   ├── images/                      # athlete portraits, og-image
│   └── icons/
├── middleware.ts                    # next-intl locale routing
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 10. Dependencies

```json
{
  "next": "^14",
  "react": "^18",
  "react-dom": "^18",
  "next-intl": "^3",
  "tailwindcss": "^3",
  "class-variance-authority": "^0.7",
  "clsx": "^2",
  "lucide-react": "^0.400",
  "framer-motion": "^11",
  "zod": "^3",
  "resend": "^3"
}
```

Dev: `typescript`, `@types/*`, `eslint`, `eslint-config-next`, `prettier`, `prettier-plugin-tailwindcss`.

## 11. Out of scope

- Real copy in DE/EN (lorem until provided)
- Real athlete photos (Unsplash placeholders)
- Real testimonials (placeholder)
- Real team headshots and bios
- Analytics integration (defer; add Plausible/PostHog post-launch)
- Cookie consent banner (Austria/EU requires — add as follow-up task before public launch)
- Legal page content (Impressum/Datenschutz/AGB stubbed only)
- CMS integration (static for now)
- Blog / changelog
- Newsletter capture beyond email form
- A/B testing infra

## 12. Risks / open questions

- **SF Pro fallback:** Inter chosen as web-safe substitute. If brand requires SF Pro look, accept slight visual drift or license SF Pro web embed (Apple permits limited cases).
- **Cool Steel Blue body contrast:** ~4.3:1 on Deep Navy — borderline WCAG AA. Body text held at ≥16px to stay within tolerance; small captions use White-at-reduced-opacity.
- **No-medical-advice compliance:** Science section copy needs Compliance review before publish (strategy doc §2 + §8 mandate).
- **Cookie consent:** Austrian/EU law requires banner before any tracking. Out of MVP scope, MUST land before public launch.
- **Logo SVG:** placeholder Λ-shape used; replace with real asset when supplied.

## 13. Success criteria

- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 (mobile).
- LCP < 2.5s on 4G simulated.
- CLS < 0.1.
- All sections render correctly at 375, 768, 1024, 1440px.
- DE ↔ EN toggle works, persists across navigation.
- Partner Gym form: validates, submits, sends email, shows success state.
- Keyboard-only navigation completes hero → CTA in <10 tabs.
- VoiceOver/NVDA reads sections in order with meaningful labels.
