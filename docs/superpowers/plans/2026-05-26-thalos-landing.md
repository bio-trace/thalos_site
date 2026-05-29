# Thalos Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page, long-scroll landing site at `thalos.at` that explains the Thalos AI Performance Coach product, captures Partner Gym inbound + early-access leads, and ships with DE/EN i18n on Vercel.

**Architecture:** Next.js 14 App Router with `next-intl` locale routing (`/de`, `/en`), Tailwind CSS driven by Thalos CI design tokens, framer-motion for reduced-motion-aware interactions, and a single API route (`/api/partner-gym`) that emails form submissions via Resend. All sections are isolated React components composed in `app/[locale]/page.tsx`.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, next-intl, framer-motion, lucide-react, zod, resend, Vitest + React Testing Library, Playwright (smoke).

---

## File Structure

Created files mapped to responsibility:

- `app/[locale]/layout.tsx` — root locale layout, fonts, html lang
- `app/[locale]/page.tsx` — assembles all sections in order
- `app/[locale]/(legal)/{impressum,datenschutz,agb}/page.tsx` — legal stubs
- `app/api/partner-gym/route.ts` — POST handler, zod validation, Resend send
- `app/globals.css` — reset + token CSS vars
- `app/opengraph-image.tsx` — OG image generator
- `app/icon.tsx` — favicon
- `middleware.ts` — locale detection + redirect
- `lib/i18n.ts` — next-intl config
- `lib/validation.ts` — zod form schemas
- `design-system/tokens/{color,typography,spacing,radius,shadow}.ts` — CI tokens
- `components/ui/{Button,Card,Icon,LanguageToggle,FormInput,FormTextarea,FAQAccordion,QuoteCard}.tsx`
- `components/ui/{RingViz,PhoneFrame}.tsx` — data viz + phone mockups
- `components/motion/Reveal.tsx` — IntersectionObserver fade-lift wrapper
- `components/sections/{Nav,Hero,WhatThalosIs,System,ProductInMotion,Science,Athletes,Team,PartnerGyms,FounderNote,FAQ,Footer}.tsx`
- `messages/{de,en}.json` — translation strings
- `public/images/` — placeholder hero / og images
- `tests/unit/*.test.tsx` — component tests (colocated alternative: `<Component>.test.tsx`)

Test colocation: tests live next to components as `<Name>.test.tsx`. Integration tests live in `tests/integration/`.

---

## Task 1: Project scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `.gitignore`, `.env.example`, `README.md`

- [ ] **Step 1: Init Next.js project (non-interactive)**

Run in `/Users/ortner/Workspace Local/Thalos Website`:

```bash
npx create-next-app@14 . --typescript --tailwind --app --src-dir=false --import-alias="@/*" --no-eslint --no-turbo --yes
```

Expected: scaffold created with `app/`, `tailwind.config.ts`, `tsconfig.json`, `package.json`, `next.config.mjs`.

- [ ] **Step 2: Install runtime deps**

```bash
npm install next-intl@^3 framer-motion@^11 lucide-react@^0.400 class-variance-authority@^0.7 clsx@^2 zod@^3 resend@^3
```

- [ ] **Step 3: Install dev deps**

```bash
npm install -D vitest@^1 @vitejs/plugin-react @testing-library/react@^16 @testing-library/jest-dom @testing-library/user-event jsdom @types/node prettier prettier-plugin-tailwindcss eslint eslint-config-next @playwright/test
```

- [ ] **Step 4: Create `.env.example`**

Write `/Users/ortner/Workspace Local/Thalos Website/.env.example`:

```
# Resend transactional email
RESEND_API_KEY=
PARTNER_GYM_INBOX=hello@thalos.at
```

- [ ] **Step 5: Add npm scripts to `package.json`**

Edit `package.json` `scripts`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test",
    "format": "prettier --write ."
  }
}
```

- [ ] **Step 6: Commit**

```bash
git init && git add -A && git commit -m "chore: scaffold next.js 14 app with deps"
```

---

## Task 2: Vitest config

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`

- [ ] **Step 1: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: false,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
```

- [ ] **Step 2: Write `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 3: Smoke test**

Write `tests/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
describe('smoke', () => {
  it('runs', () => expect(1 + 1).toBe(2));
});
```

- [ ] **Step 4: Run + verify**

```bash
npm test
```

Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts vitest.setup.ts tests/smoke.test.ts package.json
git commit -m "chore: configure vitest + RTL"
```

---

## Task 3: Design system tokens

**Files:**
- Create: `design-system/tokens/color.ts`, `typography.ts`, `spacing.ts`, `radius.ts`, `shadow.ts`, `index.ts`

- [ ] **Step 1: Write `design-system/tokens/color.ts`**

```ts
export const color = {
  bg: {
    primary: '#0A1A2F',
    elevated: '#0A1A2F',
    overlay: 'rgba(10,26,47,0.85)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#446C8F',
    inactive: '#446C8F',
    onAccent: '#0A1A2F',
  },
  border: {
    default: 'rgba(68,108,143,0.45)',
    active: 'rgba(0,224,255,0.85)',
  },
  accent: {
    cyan: '#00E0FF',
    cyanGlow: 'rgba(0,224,255,0.28)',
  },
  gradient: {
    hero: 'linear-gradient(135deg, #0A1A2F 0%, #0A1A2F 45%, #00E0FF 100%)',
  },
} as const;
```

- [ ] **Step 2: Write `design-system/tokens/typography.ts`**

```ts
export const fontSize = {
  display: 'clamp(48px, 6vw, 88px)',
  h1: 'clamp(36px, 4vw, 56px)',
  h2: 'clamp(24px, 2.5vw, 32px)',
  bodyLg: '20px',
  body: '16px',
  caption: '13px',
  eyebrow: '12px',
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const tracking = {
  tight: '-0.02em',
  normal: '0',
  eyebrow: '0.12em',
} as const;

export const leading = {
  tight: 1.1,
  body: 1.65,
} as const;
```

- [ ] **Step 3: Write `design-system/tokens/spacing.ts`**

```ts
export const space = {
  1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24,
  8: 32, 10: 40, 12: 48, 16: 64, 24: 96, 32: 128,
} as const;
```

- [ ] **Step 4: Write `design-system/tokens/radius.ts`**

```ts
export const radius = {
  card: 24,
  cardSm: 20,
  button: 20,
  pill: 999,
  phone: 36,
} as const;
```

- [ ] **Step 5: Write `design-system/tokens/shadow.ts`**

```ts
export const shadow = {
  cardSubtle: '0 0 24px rgba(0,224,255,0.08)',
  cardActive: '0 0 32px rgba(0,224,255,0.18)',
  ctaGlow: '0 0 28px rgba(0,224,255,0.32)',
  ringGlow: '0 0 60px rgba(0,224,255,0.18)',
} as const;
```

- [ ] **Step 6: Write `design-system/tokens/index.ts`**

```ts
export * from './color';
export * from './typography';
export * from './spacing';
export * from './radius';
export * from './shadow';
```

- [ ] **Step 7: Token test**

Write `design-system/tokens/tokens.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { color, fontSize, radius, shadow } from './index';

describe('design tokens', () => {
  it('exposes brand colors', () => {
    expect(color.bg.primary).toBe('#0A1A2F');
    expect(color.accent.cyan).toBe('#00E0FF');
    expect(color.text.secondary).toBe('#446C8F');
  });
  it('exposes type scale', () => {
    expect(fontSize.body).toBe('16px');
  });
  it('exposes radius and shadows', () => {
    expect(radius.button).toBe(20);
    expect(shadow.ctaGlow).toContain('rgba(0,224,255');
  });
});
```

- [ ] **Step 8: Run + commit**

```bash
npm test -- design-system/tokens
git add design-system/
git commit -m "feat(design-system): add Thalos CI tokens"
```

---

## Task 4: Tailwind config wired to tokens

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';
import { color, fontSize, fontWeight, tracking, leading, radius, shadow } from './design-system/tokens';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: color.bg.primary,
        steel: color.text.secondary,
        cyan: color.accent.cyan,
        'border-default': color.border.default,
        'border-active': color.border.active,
      },
      backgroundImage: {
        'hero-gradient': color.gradient.hero,
      },
      fontSize: {
        display: fontSize.display,
        h1: fontSize.h1,
        h2: fontSize.h2,
        'body-lg': fontSize.bodyLg,
        body: fontSize.body,
        caption: fontSize.caption,
        eyebrow: fontSize.eyebrow,
      },
      fontWeight: {
        regular: fontWeight.regular.toString(),
        medium: fontWeight.medium.toString(),
        semibold: fontWeight.semibold.toString(),
        bold: fontWeight.bold.toString(),
      },
      letterSpacing: {
        tight: tracking.tight,
        eyebrow: tracking.eyebrow,
      },
      lineHeight: {
        tight: String(leading.tight),
        body: String(leading.body),
      },
      borderRadius: {
        card: `${radius.card}px`,
        'card-sm': `${radius.cardSm}px`,
        button: `${radius.button}px`,
        pill: '999px',
        phone: `${radius.phone}px`,
      },
      boxShadow: {
        'card-subtle': shadow.cardSubtle,
        'card-active': shadow.cardActive,
        'cta-glow': shadow.ctaGlow,
        'ring-glow': shadow.ringGlow,
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Replace `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

html, body {
  background-color: #0A1A2F;
  color: #FFFFFF;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

*:focus-visible {
  outline: 2px solid #00E0FF;
  outline-offset: 2px;
  border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Build to verify**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: wire Tailwind to Thalos tokens + base reset"
```

---

## Task 5: i18n routing (next-intl)

**Files:**
- Create: `lib/i18n.ts`, `middleware.ts`, `messages/de.json`, `messages/en.json`

- [ ] **Step 1: Write `lib/i18n.ts`**

```ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'de';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 2: Write `middleware.ts`**

```ts
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n';

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
```

- [ ] **Step 3: Update `next.config.mjs`**

```js
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { formats: ['image/avif', 'image/webp'] },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 4: Write `messages/de.json`** (lorem placeholders flagged with `[LOREM]`)

```json
{
  "nav": {
    "system": "System",
    "science": "Wissenschaft",
    "athletes": "Athleten",
    "team": "Team",
    "partnerGyms": "Partner Gyms",
    "applyCta": "Als Partner Gym bewerben",
    "earlyAccess": "Early Access",
    "openMenu": "Menü öffnen",
    "closeMenu": "Menü schließen",
    "switchLang": "Sprache wechseln"
  },
  "hero": {
    "eyebrow": "AI Performance Coach · Vienna",
    "headline": "Hör auf zu raten. Fang an dich anzupassen.",
    "sub": "Workout. Ernährung. Regeneration. Ein Coach, der deine Daten versteht.",
    "ctaPrimary": "Als Partner Gym bewerben",
    "ctaSecondary": "Early Access sichern"
  },
  "what": {
    "title": "AI performance coach. Vienna. DASGYM-built.",
    "body": "Thalos verbindet Training, Ernährung, Regeneration und Messdaten zu einem personalisierten Coaching-System."
  },
  "system": {
    "title": "Das System",
    "pillars": {
      "workouts": { "title": "Workouts V2", "body": "Strukturiertes Training. Planbar. Auswertbar." },
      "meals": { "title": "Mahlzeiten", "body": "Ernährung als Protokoll. Foto, Makros, Korrektur." },
      "recovery": { "title": "Regeneration", "body": "Schlaf und Recovery als Trainingssignal." },
      "data": { "title": "Daten", "body": "Wearable, Laktat und CGM zusammengeführt." }
    }
  },
  "productInMotion": {
    "title": "So sieht Coaching mit Thalos aus",
    "slides": {
      "home": { "title": "Dein Tag im Überblick", "body": "[LOREM] Heart Rate, Sleep Score, Active Energy, Steps." },
      "sleep": { "title": "Schlaf, der zählt", "body": "[LOREM] Sleep Score, Bedtime, Efficiency." },
      "meals": { "title": "Makros im Kontext", "body": "[LOREM] Kalorien, Protein, Kohlenhydrate, Fett." }
    }
  },
  "science": {
    "eyebrow": "Wissenschaft",
    "title": "Was dein Coach sieht",
    "body": "[LOREM] Polar 360, Laktat, CGM via Apple Health.",
    "disclaimer": "Thalos stellt keine medizinischen Diagnosen und keine Therapieempfehlungen."
  },
  "athletes": {
    "title": "Founding Athletes",
    "subtitle": "Trainiert. Gemessen. Validiert in Wien.",
    "quote1": "[LOREM] Dieser eine Log macht mein Training wertvoller.",
    "quote2": "[LOREM] Endlich ein System statt einzelner Zahlen.",
    "quote3": "[LOREM] Mein Coach sieht jetzt, was ich sehe."
  },
  "team": {
    "title": "Team",
    "subtitle": "Gebaut, wo ernsthaft trainiert wird.",
    "members": {
      "1": { "name": "[LOREM] Name", "role": "CEO" },
      "2": { "name": "[LOREM] Name", "role": "Head of Fitness" },
      "3": { "name": "[LOREM] Name", "role": "Head of AI" },
      "4": { "name": "[LOREM] Name", "role": "Head of Data" }
    }
  },
  "partnerGyms": {
    "eyebrow": "Für Studios",
    "title": "Werde Thalos Partner Gym",
    "body": "[LOREM] Bringe AI-Coaching in dein Studio. Premium-Mitgliedschaft, Daten-Differenzierung, lokale Sichtbarkeit.",
    "form": {
      "name": "Dein Name",
      "gym": "Studio Name",
      "city": "Stadt",
      "email": "E-Mail",
      "message": "Nachricht (optional)",
      "submit": "Bewerbung senden",
      "success": "Vielen Dank. Wir melden uns innerhalb von 48 Stunden.",
      "error": "Etwas ist schiefgelaufen. Bitte versuche es erneut."
    }
  },
  "founder": {
    "quote": "[LOREM] Every serious athlete deserves a world-class coach in their pocket.",
    "name": "Patrick Ortner",
    "role": "Gründer, Thalos"
  },
  "faq": {
    "title": "FAQ",
    "items": [
      { "q": "Was ist Thalos?", "a": "[LOREM] Thalos ist ein AI Performance Coach, der Training, Ernährung und Regeneration verbindet." },
      { "q": "Gibt Thalos medizinische Beratung?", "a": "Nein. Thalos stellt keine Diagnosen und keine Therapieempfehlungen." },
      { "q": "Welche Daten nutzt Thalos?", "a": "[LOREM] Wearables, manuelle Logs, optional CGM und Laktat." },
      { "q": "Was kostet Thalos?", "a": "[LOREM] Premium Mitgliedschaft. Details folgen zum Launch." },
      { "q": "Wo ist Thalos verfügbar?", "a": "[LOREM] Start in Wien mit DASGYM. Expansion in DACH geplant." },
      { "q": "Wie werde ich Founding Athlete?", "a": "[LOREM] Trage dich für Early Access ein." }
    ]
  },
  "footer": {
    "rights": "© 2026 Thalos. Alle Rechte vorbehalten.",
    "impressum": "Impressum",
    "datenschutz": "Datenschutz",
    "agb": "AGB",
    "contact": "Kontakt"
  }
}
```

- [ ] **Step 5: Write `messages/en.json`** (mirror DE keys, English copy, same `[LOREM]` placeholders)

```json
{
  "nav": {
    "system": "System",
    "science": "Science",
    "athletes": "Athletes",
    "team": "Team",
    "partnerGyms": "Partner Gyms",
    "applyCta": "Apply as Partner Gym",
    "earlyAccess": "Early access",
    "openMenu": "Open menu",
    "closeMenu": "Close menu",
    "switchLang": "Switch language"
  },
  "hero": {
    "eyebrow": "AI Performance Coach · Vienna",
    "headline": "Stop guessing. Start adapting.",
    "sub": "Workout. Nutrition. Recovery. One coach that understands your data.",
    "ctaPrimary": "Apply as Partner Gym",
    "ctaSecondary": "Get early access"
  },
  "what": {
    "title": "AI performance coach. Vienna. DASGYM-built.",
    "body": "Thalos unifies training, nutrition, recovery and sensor data into one personalized coaching system."
  },
  "system": {
    "title": "The system",
    "pillars": {
      "workouts": { "title": "Workouts V2", "body": "Structured training. Plannable. Reviewable." },
      "meals": { "title": "Meals", "body": "Nutrition as a protocol. Photo, macros, correction." },
      "recovery": { "title": "Recovery", "body": "Sleep and recovery as a training signal." },
      "data": { "title": "Data", "body": "Wearable, lactate and CGM unified." }
    }
  },
  "productInMotion": {
    "title": "Coaching, in motion",
    "slides": {
      "home": { "title": "Your day at a glance", "body": "[LOREM] Heart Rate, Sleep Score, Active Energy, Steps." },
      "sleep": { "title": "Sleep that counts", "body": "[LOREM] Sleep Score, Bedtime, Efficiency." },
      "meals": { "title": "Macros in context", "body": "[LOREM] Calories, Protein, Carbs, Fat." }
    }
  },
  "science": {
    "eyebrow": "Science",
    "title": "What your coach sees",
    "body": "[LOREM] Polar 360, Lactate, CGM via Apple Health.",
    "disclaimer": "Thalos does not provide medical diagnoses or therapy recommendations."
  },
  "athletes": {
    "title": "Founding Athletes",
    "subtitle": "Trained. Measured. Validated in Vienna.",
    "quote1": "[LOREM] This single log makes my training more valuable.",
    "quote2": "[LOREM] Finally a system instead of scattered numbers.",
    "quote3": "[LOREM] My coach now sees what I see."
  },
  "team": {
    "title": "Team",
    "subtitle": "Built where serious people train.",
    "members": {
      "1": { "name": "[LOREM] Name", "role": "CEO" },
      "2": { "name": "[LOREM] Name", "role": "Head of Fitness" },
      "3": { "name": "[LOREM] Name", "role": "Head of AI" },
      "4": { "name": "[LOREM] Name", "role": "Head of Data" }
    }
  },
  "partnerGyms": {
    "eyebrow": "For studios",
    "title": "Become a Thalos Partner Gym",
    "body": "[LOREM] Bring AI coaching to your studio. Premium membership, data differentiation, local visibility.",
    "form": {
      "name": "Your name",
      "gym": "Gym name",
      "city": "City",
      "email": "Email",
      "message": "Message (optional)",
      "submit": "Send application",
      "success": "Thanks. We'll be in touch within 48 hours.",
      "error": "Something went wrong. Please try again."
    }
  },
  "founder": {
    "quote": "[LOREM] Every serious athlete deserves a world-class coach in their pocket.",
    "name": "Patrick Ortner",
    "role": "Founder, Thalos"
  },
  "faq": {
    "title": "FAQ",
    "items": [
      { "q": "What is Thalos?", "a": "[LOREM] Thalos is an AI Performance Coach that unifies training, nutrition and recovery." },
      { "q": "Does Thalos give medical advice?", "a": "No. Thalos does not provide diagnoses or therapy recommendations." },
      { "q": "What data does Thalos use?", "a": "[LOREM] Wearables, manual logs, optional CGM and lactate." },
      { "q": "What does Thalos cost?", "a": "[LOREM] Premium membership. Details at launch." },
      { "q": "Where is Thalos available?", "a": "[LOREM] Starting in Vienna with DASGYM. DACH expansion planned." },
      { "q": "How do I become a Founding Athlete?", "a": "[LOREM] Sign up for early access." }
    ]
  },
  "footer": {
    "rights": "© 2026 Thalos. All rights reserved.",
    "impressum": "Imprint",
    "datenschutz": "Privacy",
    "agb": "Terms",
    "contact": "Contact"
  }
}
```

- [ ] **Step 6: Delete default `app/page.tsx` + `app/layout.tsx`**

```bash
rm app/page.tsx app/layout.tsx
```

- [ ] **Step 7: Commit**

```bash
git add lib/ middleware.ts messages/ next.config.mjs
git rm app/page.tsx app/layout.tsx
git commit -m "feat(i18n): add next-intl routing + de/en messages"
```

---

## Task 6: Locale layout + root page shell

**Files:**
- Create: `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`

- [ ] **Step 1: Write `app/[locale]/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Thalos — AI Performance Coach',
  description: 'AI performance coach for serious athletes. Built in Vienna.',
  metadataBase: new URL('https://thalos.at'),
  openGraph: {
    title: 'Thalos — AI Performance Coach',
    description: 'AI performance coach for serious athletes. Built in Vienna.',
    type: 'website',
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(params.locale as Locale)) notFound();
  const messages = await getMessages();
  return (
    <html lang={params.locale} className={inter.variable}>
      <body className="bg-navy text-white font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-cyan focus:text-navy focus:px-3 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Write a temporary `app/[locale]/page.tsx`**

```tsx
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('hero');
  return (
    <main id="main" className="min-h-screen flex items-center justify-center">
      <h1 className="text-display font-bold tracking-tight">{t('headline')}</h1>
    </main>
  );
}
```

- [ ] **Step 3: Run dev + smoke-check**

```bash
npm run dev
```

Visit `http://localhost:3000` → should redirect to `/de` and render the headline. Stop server.

- [ ] **Step 4: Commit**

```bash
git add app/[locale]/
git commit -m "feat: locale layout with Inter font + skip-to-content"
```

---

## Task 7: Button component

**Files:**
- Create: `components/ui/Button.tsx`, `components/ui/Button.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Apply</Button>);
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });
  it('applies primary variant by default', () => {
    render(<Button>X</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-cyan');
  });
  it('applies secondary variant', () => {
    render(<Button variant="secondary">X</Button>);
    expect(screen.getByRole('button')).toHaveClass('border');
  });
  it('renders as anchor when href provided', () => {
    render(<Button href="/foo">X</Button>);
    expect(screen.getByRole('link', { name: 'X' })).toHaveAttribute('href', '/foo');
  });
});
```

- [ ] **Step 2: Run test → fail**

```bash
npm test -- Button
```

Expected: FAIL (module not found).

- [ ] **Step 3: Implement `components/ui/Button.tsx`**

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import Link from 'next/link';
import * as React from 'react';

const styles = cva(
  'inline-flex items-center justify-center font-semibold rounded-button transition-all duration-150 ease-out min-h-[44px] px-6 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan focus-visible:outline-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-cyan text-navy shadow-cta-glow hover:-translate-y-0.5 active:scale-[0.98]',
        secondary: 'border border-steel text-white hover:border-cyan active:scale-[0.98]',
        ghost: 'text-steel hover:text-white',
      },
      size: {
        md: 'text-[15px] h-12',
        lg: 'text-[17px] h-14 px-8',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type CommonProps = VariantProps<typeof styles> & { className?: string; children: React.ReactNode };
type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = CommonProps & { href: string };

export function Button(props: ButtonProps | LinkProps) {
  const { variant, size, className, children } = props;
  const cls = clsx(styles({ variant, size }), className);
  if ('href' in props && props.href) {
    return <Link href={props.href} className={cls}>{children}</Link>;
  }
  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as ButtonProps;
  return <button className={cls} {...rest}>{children}</button>;
}
```

- [ ] **Step 4: Run test → pass**

```bash
npm test -- Button
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add components/ui/Button.tsx components/ui/Button.test.tsx
git commit -m "feat(ui): Button with primary/secondary/ghost variants"
```

---

## Task 8: Card component

**Files:**
- Create: `components/ui/Card.tsx`, `components/ui/Card.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card><p>hello</p></Card>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
  it('applies elevated variant', () => {
    render(<Card variant="elevated" data-testid="c">x</Card>);
    expect(screen.getByTestId('c')).toHaveClass('shadow-card-active');
  });
});
```

- [ ] **Step 2: Run → fail**

```bash
npm test -- Card
```

- [ ] **Step 3: Implement `components/ui/Card.tsx`**

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import * as React from 'react';

const styles = cva(
  'rounded-card bg-navy border p-6',
  {
    variants: {
      variant: {
        standard: 'border-border-default shadow-card-subtle',
        elevated: 'border-border-default shadow-card-active',
        glow: 'border-border-active shadow-cta-glow',
      },
    },
    defaultVariants: { variant: 'standard' },
  },
);

type Props = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof styles>;

export function Card({ variant, className, children, ...rest }: Props) {
  return (
    <div className={clsx(styles({ variant }), className)} {...rest}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Run → pass + commit**

```bash
npm test -- Card
git add components/ui/Card.tsx components/ui/Card.test.tsx
git commit -m "feat(ui): Card with standard/elevated/glow variants"
```

---

## Task 9: Icon wrapper

**Files:**
- Create: `components/ui/Icon.tsx`

- [ ] **Step 1: Write `components/ui/Icon.tsx`**

```tsx
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

export function Icon({
  icon: I,
  size = 24,
  active = false,
  className,
  label,
}: {
  icon: LucideIcon;
  size?: number;
  active?: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <I
      size={size}
      strokeWidth={1.8}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={clsx(active ? 'text-cyan' : 'text-steel', className)}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/Icon.tsx
git commit -m "feat(ui): Icon wrapper with active state + stroke-1.8"
```

---

## Task 10: LanguageToggle

**Files:**
- Create: `components/ui/LanguageToggle.tsx`, `components/ui/LanguageToggle.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LanguageToggle } from './LanguageToggle';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/de',
}));
vi.mock('next-intl', () => ({
  useLocale: () => 'de',
  useTranslations: () => (k: string) => k,
}));

describe('LanguageToggle', () => {
  it('renders both locales', () => {
    render(<LanguageToggle />);
    expect(screen.getByRole('button', { name: /DE/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /EN/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement `components/ui/LanguageToggle.tsx`**

```tsx
'use client';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';

const LOCALES = ['de', 'en'] as const;

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('nav');

  const switchTo = (next: string) => {
    if (next === locale) return;
    const segments = pathname.split('/');
    segments[1] = next;
    router.replace(segments.join('/'));
  };

  return (
    <div role="group" aria-label={t('switchLang')} className="inline-flex items-center gap-1 rounded-pill border border-border-default p-1">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-pressed={locale === l}
          className={clsx(
            'min-h-[36px] min-w-[44px] px-3 rounded-pill text-caption font-medium transition-colors',
            locale === l ? 'bg-cyan text-navy' : 'text-steel hover:text-white',
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Run → pass + commit**

```bash
npm test -- LanguageToggle
git add components/ui/LanguageToggle.tsx components/ui/LanguageToggle.test.tsx
git commit -m "feat(ui): LanguageToggle with route swap"
```

---

## Task 11: Reveal motion wrapper

**Files:**
- Create: `components/motion/Reveal.tsx`

- [ ] **Step 1: Write `components/motion/Reveal.tsx`**

```tsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';
import * as React from 'react';

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/motion/
git commit -m "feat(motion): Reveal wrapper with reduced-motion guard"
```

---

## Task 12: RingViz

**Files:**
- Create: `components/ui/RingViz.tsx`, `components/ui/RingViz.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RingViz } from './RingViz';

describe('RingViz', () => {
  it('renders value as center label', () => {
    render(<RingViz value={87} max={100} label="Sleep Score" />);
    expect(screen.getByText('87')).toBeInTheDocument();
    expect(screen.getByText('Sleep Score')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement `components/ui/RingViz.tsx`**

```tsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';

export function RingViz({
  value,
  max = 100,
  label,
  size = 200,
  strokeWidth = 12,
}: {
  value: number;
  max?: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}) {
  const reduced = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(68,108,143,0.35)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#00E0FF"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: reduced ? offset : circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0 : 0.8, ease: 'easeOut' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: 'drop-shadow(0 0 12px rgba(0,224,255,0.45))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white font-bold text-[44px] leading-none">{value}</span>
        <span className="text-steel text-caption mt-1">{label}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run → pass + commit**

```bash
npm test -- RingViz
git add components/ui/RingViz.tsx components/ui/RingViz.test.tsx
git commit -m "feat(ui): RingViz animated progress ring"
```

---

## Task 13: PhoneFrame + variants

**Files:**
- Create: `components/ui/PhoneFrame.tsx`

- [ ] **Step 1: Write `components/ui/PhoneFrame.tsx`**

```tsx
import * as React from 'react';
import clsx from 'clsx';
import { RingViz } from './RingViz';

function FrameShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('relative mx-auto w-[280px] h-[580px] rounded-phone bg-navy border border-border-default overflow-hidden shadow-ring-glow', className)}>
      <div className="absolute top-0 left-0 right-0 h-6 flex items-center justify-center text-[10px] text-steel">9:41</div>
      <div className="pt-8 px-4 h-full">{children}</div>
    </div>
  );
}

export function PhoneHome() {
  return (
    <FrameShell>
      <div className="text-eyebrow text-cyan tracking-eyebrow uppercase mb-1">Today Overview</div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-white text-[36px] font-bold leading-none">1816 <span className="text-body text-steel">kcal</span></div>
          <div className="text-steel text-caption mt-1">94 kcal übrig</div>
        </div>
        <RingViz value={87} max={100} label="" size={84} strokeWidth={8} />
      </div>
      <div className="grid grid-cols-4 gap-2 mt-6">
        {['HR 56', 'Sleep 87', 'Energy 623', 'Steps 7,842'].map((t) => (
          <div key={t} className="rounded-card-sm border border-border-default p-2 text-[10px] text-steel">{t}</div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {['Lactate', 'Sleep Mode', 'Supplements'].map((t) => (
          <div key={t} className="rounded-card-sm border border-border-default p-3 text-[11px] text-white">{t}</div>
        ))}
      </div>
    </FrameShell>
  );
}

export function PhoneSleep() {
  return (
    <FrameShell>
      <div className="text-white text-h2 font-bold">Sleep</div>
      <div className="flex justify-center mt-6">
        <RingViz value={87} label="Sleep Score" size={160} strokeWidth={10} />
      </div>
      <div className="text-center text-steel text-caption mt-3">6h 53m of 8h 0m</div>
      <div className="grid grid-cols-2 gap-2 mt-6">
        {[['Bedtime', '00:20'], ['Wake', '07:52'], ['Efficiency', '91%'], ['Awakenings', '16']].map(([k, v]) => (
          <div key={k} className="rounded-card-sm border border-border-default p-3">
            <div className="text-steel text-[10px]">{k}</div>
            <div className="text-white text-body font-semibold">{v}</div>
          </div>
        ))}
      </div>
    </FrameShell>
  );
}

export function PhoneMeals() {
  return (
    <FrameShell>
      <div className="text-white text-h2 font-bold">Mahlzeiten</div>
      <div className="flex justify-center mt-6">
        <RingViz value={1816} max={1910} label="kcal" size={160} strokeWidth={10} />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-6">
        {[['Protein', '63 g'], ['KH', '239 g'], ['Fett', '67 g']].map(([k, v]) => (
          <div key={k} className="rounded-card-sm border border-border-default p-3 text-center">
            <div className="text-steel text-[10px]">{k}</div>
            <div className="text-white text-body font-semibold">{v}</div>
          </div>
        ))}
      </div>
    </FrameShell>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/PhoneFrame.tsx
git commit -m "feat(ui): PhoneHome/Sleep/Meals mockup frames"
```

---

## Task 14: Nav section

**Files:**
- Create: `components/sections/Nav.tsx`

- [ ] **Step 1: Implement**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import clsx from 'clsx';

const anchors = ['system', 'science', 'athletes', 'team', 'partnerGyms'] as const;

export function Nav() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 inset-x-0 z-40 transition-all duration-200',
        scrolled ? 'bg-navy/80 backdrop-blur border-b border-border-default' : 'bg-transparent',
      )}
    >
      <nav className="max-w-[1280px] mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8 h-16">
        <Link href="#top" className="flex items-center gap-2" aria-label="Thalos">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 4 L12 16 L20 4" stroke="#00E0FF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white font-semibold tracking-tight">Thalos</span>
        </Link>
        <ul className="hidden lg:flex items-center gap-8 text-steel text-body">
          {anchors.map((a) => (
            <li key={a}><a href={`#${a}`} className="hover:text-white transition-colors">{t(a)}</a></li>
          ))}
        </ul>
        <div className="hidden lg:flex items-center gap-3">
          <LanguageToggle />
          <Button href="#partnerGyms" size="md">{t('applyCta')}</Button>
        </div>
        <button
          className="lg:hidden p-2 text-white"
          aria-label={open ? t('closeMenu') : t('openMenu')}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="lg:hidden border-t border-border-default bg-navy px-4 py-6 space-y-4">
          {anchors.map((a) => (
            <a key={a} href={`#${a}`} onClick={() => setOpen(false)} className="block text-white text-body-lg">{t(a)}</a>
          ))}
          <LanguageToggle />
          <Button href="#partnerGyms" size="md" className="w-full">{t('applyCta')}</Button>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Nav.tsx
git commit -m "feat(sections): sticky Nav with scroll-blur, mobile menu, lang toggle"
```

---

## Task 15: Hero section

**Files:**
- Create: `components/sections/Hero.tsx`

- [ ] **Step 1: Implement**

```tsx
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { PhoneHome } from '@/components/ui/PhoneFrame';
import { Reveal } from '@/components/motion/Reveal';

export function Hero() {
  const t = useTranslations('hero');
  return (
    <section id="top" className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="absolute inset-0 bg-hero-gradient opacity-90 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(0,224,255,0.18),transparent_60%)] pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div>
            <div className="text-eyebrow uppercase tracking-eyebrow text-cyan mb-4">{t('eyebrow')}</div>
            <h1 className="text-display font-bold tracking-tight leading-tight text-white">{t('headline')}</h1>
            <p className="mt-6 text-body-lg text-steel max-w-[540px]">{t('sub')}</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button href="#partnerGyms" size="lg">{t('ctaPrimary')}</Button>
              <Button href="#partnerGyms" size="lg" variant="secondary">{t('ctaSecondary')}</Button>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex justify-center lg:justify-end">
            <PhoneHome />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "feat(sections): cinematic Hero with phone mockup + dual CTA"
```

---

## Task 16: WhatThalosIs strip

**Files:**
- Create: `components/sections/WhatThalosIs.tsx`

- [ ] **Step 1: Implement**

```tsx
import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/Reveal';

export function WhatThalosIs() {
  const t = useTranslations('what');
  return (
    <section className="border-y border-border-default py-12 md:py-16">
      <div className="max-w-[1024px] mx-auto px-4 md:px-6 lg:px-8 text-center">
        <Reveal>
          <h2 className="text-h2 font-semibold text-white">{t('title')}</h2>
          <p className="mt-4 text-body-lg text-steel">{t('body')}</p>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/WhatThalosIs.tsx
git commit -m "feat(sections): WhatThalosIs positioning strip"
```

---

## Task 17: System (4 pillars)

**Files:**
- Create: `components/sections/System.tsx`

- [ ] **Step 1: Implement**

```tsx
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Dumbbell, Utensils, Moon, BarChart3 } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';

const PILLARS = [
  { key: 'workouts', icon: Dumbbell },
  { key: 'meals', icon: Utensils },
  { key: 'recovery', icon: Moon },
  { key: 'data', icon: BarChart3 },
] as const;

export function System() {
  const t = useTranslations('system');
  return (
    <section id="system" className="py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-h1 font-bold tracking-tight text-white">{t('title')}</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.key} delay={i * 0.05}>
              <Card className="h-full">
                <Icon icon={p.icon} size={28} active className="mb-4" />
                <h3 className="text-white text-h2 font-semibold mb-2">{t(`pillars.${p.key}.title`)}</h3>
                <p className="text-steel text-body">{t(`pillars.${p.key}.body`)}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/System.tsx
git commit -m "feat(sections): System 4-pillar grid"
```

---

## Task 18: ProductInMotion sticky scroll

**Files:**
- Create: `components/sections/ProductInMotion.tsx`

- [ ] **Step 1: Implement**

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { PhoneHome, PhoneSleep, PhoneMeals } from '@/components/ui/PhoneFrame';

const SLIDES = ['home', 'sleep', 'meals'] as const;
const PHONES = { home: PhoneHome, sleep: PhoneSleep, meals: PhoneMeals } as const;

export function ProductInMotion() {
  const t = useTranslations('productInMotion');
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-h1 font-bold tracking-tight text-white text-center">{t('title')}</h2>
        <div className="mt-16 grid lg:grid-cols-2 gap-12 items-start">
          <div className="hidden lg:block sticky top-24 self-start">
            <PhoneHome />
          </div>
          <div className="space-y-24">
            {SLIDES.map((s) => {
              const Phone = PHONES[s];
              return (
                <div key={s} className="grid grid-cols-1 gap-6">
                  <div className="lg:hidden flex justify-center"><Phone /></div>
                  <div>
                    <h3 className="text-h2 font-semibold text-white">{t(`slides.${s}.title`)}</h3>
                    <p className="mt-3 text-body-lg text-steel">{t(`slides.${s}.body`)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/ProductInMotion.tsx
git commit -m "feat(sections): ProductInMotion sticky-scroll storytelling"
```

---

## Task 19: Science section

**Files:**
- Create: `components/sections/Science.tsx`

- [ ] **Step 1: Implement**

```tsx
import { useTranslations } from 'next-intl';
import { RingViz } from '@/components/ui/RingViz';
import { Reveal } from '@/components/motion/Reveal';

export function Science() {
  const t = useTranslations('science');
  return (
    <section id="science" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,224,255,0.08),transparent_60%)] pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div>
            <div className="text-eyebrow uppercase tracking-eyebrow text-cyan mb-4">{t('eyebrow')}</div>
            <h2 className="text-h1 font-bold tracking-tight text-white">{t('title')}</h2>
            <p className="mt-6 text-body-lg text-steel">{t('body')}</p>
            <p className="mt-6 text-caption text-steel">{t('disclaimer')}</p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex justify-center">
            <RingViz value={87} label="Recovery" size={280} strokeWidth={14} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Science.tsx
git commit -m "feat(sections): Science section with RingViz centerpiece"
```

---

## Task 20: Athletes section

**Files:**
- Create: `components/sections/Athletes.tsx`, `components/ui/QuoteCard.tsx`

- [ ] **Step 1: Write `components/ui/QuoteCard.tsx`**

```tsx
import { Card } from './Card';

export function QuoteCard({ quote, name, role, image }: {
  quote: string; name: string; role: string; image?: string;
}) {
  return (
    <Card>
      <p className="text-body-lg text-white">&ldquo;{quote}&rdquo;</p>
      <div className="mt-6 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full bg-border-default"
          style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', filter: 'grayscale(1) sepia(0.2) hue-rotate(170deg)' } : undefined}
          aria-hidden="true"
        />
        <div>
          <div className="text-white text-caption font-semibold">{name}</div>
          <div className="text-steel text-caption">{role}</div>
        </div>
      </div>
    </Card>
  );
}
```

- [ ] **Step 2: Write `components/sections/Athletes.tsx`**

```tsx
import { useTranslations } from 'next-intl';
import { QuoteCard } from '@/components/ui/QuoteCard';
import { Reveal } from '@/components/motion/Reveal';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format';

export function Athletes() {
  const t = useTranslations('athletes');
  return (
    <section id="athletes" className="py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-h1 font-bold tracking-tight text-white">{t('title')}</h2>
          <p className="mt-3 text-body-lg text-steel">{t('subtitle')}</p>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {([1, 2, 3] as const).map((i) => (
            <Reveal key={i} delay={i * 0.05}>
              <QuoteCard
                quote={t(`quote${i}` as 'quote1' | 'quote2' | 'quote3')}
                name="[LOREM] Athlete"
                role="DASGYM"
                image={PLACEHOLDER}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/Athletes.tsx components/ui/QuoteCard.tsx
git commit -m "feat(sections): Athletes section with QuoteCard"
```

---

## Task 21: Team section

**Files:**
- Create: `components/sections/Team.tsx`

- [ ] **Step 1: Implement**

```tsx
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/motion/Reveal';

const MEMBERS = ['1', '2', '3', '4'] as const;

export function Team() {
  const t = useTranslations('team');
  return (
    <section id="team" className="py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-h1 font-bold tracking-tight text-white">{t('title')}</h2>
          <p className="mt-3 text-body-lg text-steel">{t('subtitle')}</p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MEMBERS.map((id, i) => (
            <Reveal key={id} delay={i * 0.05}>
              <Card>
                <div className="aspect-square w-full rounded-card-sm bg-[#0F2640] mb-4" aria-hidden="true" />
                <div className="text-white font-semibold">{t(`members.${id}.name`)}</div>
                <div className="text-steel text-caption">{t(`members.${id}.role`)}</div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Team.tsx
git commit -m "feat(sections): Team grid with portrait placeholders"
```

---

## Task 22: Form validation + inputs

**Files:**
- Create: `lib/validation.ts`, `components/ui/FormInput.tsx`, `components/ui/FormTextarea.tsx`, `lib/validation.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from 'vitest';
import { partnerGymSchema } from './validation';

describe('partnerGymSchema', () => {
  it('passes valid input', () => {
    const r = partnerGymSchema.safeParse({
      name: 'Max', gym: 'DASGYM', city: 'Vienna', email: 'max@example.com', message: '',
    });
    expect(r.success).toBe(true);
  });
  it('rejects invalid email', () => {
    const r = partnerGymSchema.safeParse({
      name: 'Max', gym: 'DASGYM', city: 'Vienna', email: 'nope', message: '',
    });
    expect(r.success).toBe(false);
  });
  it('rejects missing required', () => {
    const r = partnerGymSchema.safeParse({ name: '', gym: '', city: '', email: '', message: '' });
    expect(r.success).toBe(false);
  });
});
```

- [ ] **Step 2: Implement `lib/validation.ts`**

```ts
import { z } from 'zod';

export const partnerGymSchema = z.object({
  name: z.string().min(2).max(120),
  gym: z.string().min(2).max(160),
  city: z.string().min(2).max(120),
  email: z.string().email(),
  message: z.string().max(2000).optional().default(''),
});

export type PartnerGymInput = z.infer<typeof partnerGymSchema>;
```

- [ ] **Step 3: Run → pass**

```bash
npm test -- validation
```

- [ ] **Step 4: Write `components/ui/FormInput.tsx`**

```tsx
import * as React from 'react';
import clsx from 'clsx';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const FormInput = React.forwardRef<HTMLInputElement, Props>(function FormInput(
  { label, error, id, className, ...rest },
  ref,
) {
  const inputId = id ?? rest.name;
  const errId = error ? `${inputId}-err` : undefined;
  return (
    <label className="block">
      <span className="block text-caption text-steel mb-2">{label}</span>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={errId}
        className={clsx(
          'w-full min-h-[48px] rounded-card-sm bg-navy border border-border-default px-4 text-white placeholder:text-steel focus:border-cyan outline-none transition-colors',
          error && 'border-[#FFFFFF]',
          className,
        )}
        {...rest}
      />
      {error && <span id={errId} className="block mt-1 text-caption text-white">{error}</span>}
    </label>
  );
});
```

- [ ] **Step 5: Write `components/ui/FormTextarea.tsx`**

```tsx
import * as React from 'react';
import clsx from 'clsx';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, Props>(function FormTextarea(
  { label, error, id, className, ...rest },
  ref,
) {
  const ta = id ?? rest.name;
  return (
    <label className="block">
      <span className="block text-caption text-steel mb-2">{label}</span>
      <textarea
        ref={ref}
        id={ta}
        aria-invalid={!!error}
        rows={4}
        className={clsx(
          'w-full rounded-card-sm bg-navy border border-border-default p-4 text-white placeholder:text-steel focus:border-cyan outline-none transition-colors',
          className,
        )}
        {...rest}
      />
      {error && <span className="block mt-1 text-caption text-white">{error}</span>}
    </label>
  );
});
```

- [ ] **Step 6: Commit**

```bash
git add lib/validation.ts lib/validation.test.ts components/ui/FormInput.tsx components/ui/FormTextarea.tsx
git commit -m "feat: zod schema + form inputs for Partner Gym"
```

---

## Task 23: Partner Gym API route

**Files:**
- Create: `app/api/partner-gym/route.ts`, `tests/integration/partner-gym-route.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const sendMock = vi.fn().mockResolvedValue({ id: 'mock' });
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({ emails: { send: sendMock } })),
}));

import { POST } from '@/app/api/partner-gym/route';

function req(body: unknown) {
  return new Request('http://localhost/api/partner-gym', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  sendMock.mockClear();
  process.env.RESEND_API_KEY = 'test';
  process.env.PARTNER_GYM_INBOX = 'hello@thalos.at';
});

describe('POST /api/partner-gym', () => {
  it('400 on invalid payload', async () => {
    const res = await POST(req({ name: '', gym: '', city: '', email: 'bad' }));
    expect(res.status).toBe(400);
  });
  it('200 + sends email on valid payload', async () => {
    const res = await POST(req({ name: 'Max', gym: 'DASGYM', city: 'Vienna', email: 'max@example.com', message: 'hi' }));
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run → fail**

```bash
npm test -- partner-gym-route
```

- [ ] **Step 3: Implement `app/api/partner-gym/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { partnerGymSchema } from '@/lib/validation';

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }

  const parsed = partnerGymSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', issues: parsed.error.issues }, { status: 400 });
  }

  const { name, gym, city, email, message } = parsed.data;
  const resend = new Resend(process.env.RESEND_API_KEY!);
  await resend.emails.send({
    from: 'Thalos <noreply@thalos.at>',
    to: [process.env.PARTNER_GYM_INBOX!],
    replyTo: email,
    subject: `Partner Gym Application — ${gym} (${city})`,
    text: `Name: ${name}\nGym: ${gym}\nCity: ${city}\nEmail: ${email}\n\n${message}`,
  });

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Run → pass + commit**

```bash
npm test -- partner-gym-route
git add app/api/ tests/integration/
git commit -m "feat(api): partner-gym route with zod validation + Resend"
```

---

## Task 24: PartnerGyms section + form

**Files:**
- Create: `components/sections/PartnerGyms.tsx`

- [ ] **Step 1: Implement**

```tsx
'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { partnerGymSchema } from '@/lib/validation';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function PartnerGyms() {
  const t = useTranslations('partnerGyms');
  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = partnerGymSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[i.path[0] as string] = i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setState('submitting');
    try {
      const res = await fetch('/api/partner-gym', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      setState(res.ok ? 'success' : 'error');
    } catch {
      setState('error');
    }
  }

  return (
    <section id="partnerGyms" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,224,255,0.12),transparent_60%)] pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-[960px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-eyebrow uppercase tracking-eyebrow text-cyan mb-3">{t('eyebrow')}</div>
        <h2 className="text-h1 font-bold tracking-tight text-white">{t('title')}</h2>
        <p className="mt-4 text-body-lg text-steel max-w-[640px]">{t('body')}</p>

        <form onSubmit={onSubmit} className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4" noValidate aria-live="polite">
          <FormInput name="name" label={t('form.name')} required error={errors.name} />
          <FormInput name="gym" label={t('form.gym')} required error={errors.gym} />
          <FormInput name="city" label={t('form.city')} required error={errors.city} />
          <FormInput name="email" type="email" label={t('form.email')} required error={errors.email} />
          <div className="md:col-span-2">
            <FormTextarea name="message" label={t('form.message')} />
          </div>
          <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button size="lg" disabled={state === 'submitting'}>{t('form.submit')}</Button>
            {state === 'success' && <span role="status" className="text-cyan text-caption">{t('form.success')}</span>}
            {state === 'error' && <span role="status" className="text-white text-caption">{t('form.error')}</span>}
          </div>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/PartnerGyms.tsx
git commit -m "feat(sections): PartnerGyms CTA + form"
```

---

## Task 25: FounderNote

**Files:**
- Create: `components/sections/FounderNote.tsx`

- [ ] **Step 1: Implement**

```tsx
import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/Reveal';

export function FounderNote() {
  const t = useTranslations('founder');
  return (
    <section className="py-20 md:py-28 border-t border-border-default">
      <div className="max-w-[800px] mx-auto px-4 md:px-6 lg:px-8 text-center">
        <Reveal>
          <p className="text-h2 font-semibold text-white italic">&ldquo;{t('quote')}&rdquo;</p>
          <div className="mt-6 text-caption text-steel">
            <div className="text-white font-semibold">{t('name')}</div>
            <div>{t('role')}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/FounderNote.tsx
git commit -m "feat(sections): FounderNote closing strip"
```

---

## Task 26: FAQ accordion

**Files:**
- Create: `components/sections/FAQ.tsx`, `components/ui/FAQAccordion.tsx`

- [ ] **Step 1: Write `components/ui/FAQAccordion.tsx`**

```tsx
'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ul className="divide-y divide-border-default">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `faq-panel-${i}`;
        const btnId = `faq-btn-${i}`;
        return (
          <li key={i}>
            <button
              id={btnId}
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full text-left py-5 flex items-center justify-between gap-4 min-h-[56px] text-white"
            >
              <span className="text-body-lg font-medium">{item.q}</span>
              <ChevronDown className={clsx('transition-transform duration-250 text-cyan', isOpen && 'rotate-180')} />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="pb-5 text-body text-steel"
            >
              {item.a}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 2: Write `components/sections/FAQ.tsx`**

```tsx
import { useTranslations } from 'next-intl';
import { FAQAccordion } from '@/components/ui/FAQAccordion';

export function FAQ() {
  const t = useTranslations('faq');
  const items = t.raw('items') as { q: string; a: string }[];
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[800px] mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-h1 font-bold tracking-tight text-white mb-10">{t('title')}</h2>
        <FAQAccordion items={items} />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/FAQ.tsx components/ui/FAQAccordion.tsx
git commit -m "feat(sections): FAQ with accessible accordion"
```

---

## Task 27: Footer

**Files:**
- Create: `components/sections/Footer.tsx`

- [ ] **Step 1: Implement**

```tsx
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  return (
    <footer className="border-t border-border-default py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 4 L12 16 L20 4" stroke="#00E0FF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white font-semibold">Thalos</span>
        </div>
        <nav className="flex flex-wrap gap-6 text-caption text-steel">
          <Link href={`/${locale}/impressum`} className="hover:text-white">{t('impressum')}</Link>
          <Link href={`/${locale}/datenschutz`} className="hover:text-white">{t('datenschutz')}</Link>
          <Link href={`/${locale}/agb`} className="hover:text-white">{t('agb')}</Link>
          <a href="mailto:hello@thalos.at" className="hover:text-white">{t('contact')}</a>
        </nav>
        <div className="flex items-center gap-4">
          <LanguageToggle />
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 mt-8 text-caption text-steel">{t('rights')}</div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Footer.tsx
git commit -m "feat(sections): Footer with legal links + lang toggle"
```

---

## Task 28: Legal page stubs

**Files:**
- Create: `app/[locale]/(legal)/impressum/page.tsx`, `datenschutz/page.tsx`, `agb/page.tsx`

- [ ] **Step 1: Write all three with the same shell**

`app/[locale]/(legal)/impressum/page.tsx`:

```tsx
export default function Impressum() {
  return (
    <main id="main" className="max-w-[800px] mx-auto px-4 md:px-6 py-32">
      <h1 className="text-h1 font-bold text-white">Impressum</h1>
      <p className="mt-6 text-body text-steel">[LOREM] Impressum content to be supplied.</p>
    </main>
  );
}
```

`datenschutz/page.tsx`:

```tsx
export default function Datenschutz() {
  return (
    <main id="main" className="max-w-[800px] mx-auto px-4 md:px-6 py-32">
      <h1 className="text-h1 font-bold text-white">Datenschutz</h1>
      <p className="mt-6 text-body text-steel">[LOREM] Privacy policy to be supplied.</p>
    </main>
  );
}
```

`agb/page.tsx`:

```tsx
export default function AGB() {
  return (
    <main id="main" className="max-w-[800px] mx-auto px-4 md:px-6 py-32">
      <h1 className="text-h1 font-bold text-white">AGB</h1>
      <p className="mt-6 text-body text-steel">[LOREM] Terms to be supplied.</p>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add 'app/[locale]/(legal)'
git commit -m "feat: legal page stubs (Impressum/Datenschutz/AGB)"
```

---

## Task 29: Assemble landing page

**Files:**
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Replace with full assembly**

```tsx
import { Nav } from '@/components/sections/Nav';
import { Hero } from '@/components/sections/Hero';
import { WhatThalosIs } from '@/components/sections/WhatThalosIs';
import { System } from '@/components/sections/System';
import { ProductInMotion } from '@/components/sections/ProductInMotion';
import { Science } from '@/components/sections/Science';
import { Athletes } from '@/components/sections/Athletes';
import { Team } from '@/components/sections/Team';
import { PartnerGyms } from '@/components/sections/PartnerGyms';
import { FounderNote } from '@/components/sections/FounderNote';
import { FAQ } from '@/components/sections/FAQ';
import { Footer } from '@/components/sections/Footer';

export default function Page() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <WhatThalosIs />
        <System />
        <ProductInMotion />
        <Science />
        <Athletes />
        <Team />
        <PartnerGyms />
        <FounderNote />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Run dev server + visual smoke**

```bash
npm run dev
```

Visit `http://localhost:3000/de` and `http://localhost:3000/en`. Scroll all sections. Verify lang toggle, mobile menu, FAQ open/close, form validation (submit empty form → see field errors).

- [ ] **Step 3: Build to verify production**

```bash
npm run build
```

Expected: build succeeds without warnings on locales or types.

- [ ] **Step 4: Commit**

```bash
git add app/[locale]/page.tsx
git commit -m "feat: assemble landing page sections"
```

---

## Task 30: OG image + favicon

**Files:**
- Create: `app/opengraph-image.tsx`, `app/icon.tsx`

- [ ] **Step 1: Write `app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(135deg, #0A1A2F 0%, #0A1A2F 45%, #00E0FF 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80,
          color: 'white', fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 4, color: '#00E0FF', textTransform: 'uppercase' }}>
          AI PERFORMANCE COACH · VIENNA
        </div>
        <div style={{ fontSize: 92, fontWeight: 700, marginTop: 24, lineHeight: 1.05 }}>
          Stop guessing.<br />Start adapting.
        </div>
        <div style={{ fontSize: 30, color: '#446C8F', marginTop: 32 }}>thalos.at</div>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 2: Write `app/icon.tsx`**

```tsx
import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', background: '#0A1A2F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 4 L12 16 L20 4" stroke="#00E0FF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/opengraph-image.tsx app/icon.tsx
git commit -m "feat: dynamic OG image + favicon"
```

---

## Task 31: Playwright smoke

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/landing.spec.ts`

- [ ] **Step 1: Init Playwright**

```bash
npx playwright install --with-deps chromium
```

- [ ] **Step 2: Write `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:3000' },
  webServer: { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: true, timeout: 60_000 },
});
```

- [ ] **Step 3: Write `tests/e2e/landing.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('hero renders and lang toggle switches locale', async ({ page }) => {
  await page.goto('/de');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.getByRole('button', { name: 'EN', exact: true }).first().click();
  await expect(page).toHaveURL(/\/en/);
  await expect(page.getByText('AI Performance Coach', { exact: false })).toBeVisible();
});

test('partner gym form validates empty submit', async ({ page }) => {
  await page.goto('/de');
  await page.getByRole('link', { name: /Partner Gym/i }).first().click();
  await page.getByRole('button', { name: /Bewerbung senden|Send application/i }).click();
  await expect(page.locator('[aria-invalid="true"]').first()).toBeVisible();
});
```

- [ ] **Step 4: Run + commit**

```bash
npm run e2e
git add playwright.config.ts tests/e2e/
git commit -m "test(e2e): playwright smoke for hero + form"
```

---

## Task 32: README + deploy notes

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace README**

```markdown
# Thalos Website

Single-page long-scroll landing at [thalos.at](https://thalos.at). Next.js 14 + next-intl (DE/EN).

## Stack
Next.js 14 (App Router), TypeScript, Tailwind, next-intl, framer-motion, lucide-react, zod, resend. Tests: Vitest + RTL, Playwright.

## Develop
```
npm install
cp .env.example .env.local   # fill in RESEND_API_KEY + PARTNER_GYM_INBOX
npm run dev                  # http://localhost:3000
```

## Test
```
npm test            # unit + integration (vitest)
npm run e2e         # playwright smoke
```

## Deploy
Vercel. Set env vars `RESEND_API_KEY`, `PARTNER_GYM_INBOX` in project settings. Push to `main` → auto-deploy. Add custom domain `thalos.at`.

## Design tokens
Edit `design-system/tokens/*` — Tailwind picks them up via `tailwind.config.ts`. Do not introduce raw hex outside tokens.

## Content
Translation strings live in `messages/{de,en}.json`. Placeholder copy is flagged with `[LOREM]` — replace before public launch.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: README with stack, dev, test, deploy"
```

---

## Self-Review

**Spec coverage** — every section in spec §4 (IA) has a task: Nav (14), Hero (15), WhatThalosIs (16), System (17), ProductInMotion (18), Science (19), Athletes (20), Team (21), PartnerGyms (24), FounderNote (25), FAQ (26), Footer (27). Visual system tokens (3, 4). i18n (5). Motion (11). Form + API (22, 23, 24). Legal stubs (28). Assembly (29). OG + favicon (30). Tests (2, 7, 8, 10, 12, 22, 23, 31). README (32).

**Placeholder scan** — no "TBD/TODO", every code step shows actual code, every test step shows actual test code, all `[LOREM]` markers in copy are intentional and flagged.

**Type consistency** — `partnerGymSchema` defined in Task 22, consumed identically in Tasks 23, 24. `PhoneHome/Sleep/Meals` exported from `PhoneFrame.tsx` (Task 13) and imported same way in Hero (15) and ProductInMotion (18). `Reveal` component signature consistent across Tasks 15, 16, 17, 19, 20, 21, 25. Color token names (`color.bg.primary`, `color.accent.cyan`) match between Tasks 3 and 4. Tailwind class aliases (`bg-navy`, `text-cyan`, `border-border-default`) match between Task 4 config and all section usages.

---

Plan complete and saved to [docs/superpowers/plans/2026-05-26-thalos-landing.md](docs/superpowers/plans/2026-05-26-thalos-landing.md). Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
