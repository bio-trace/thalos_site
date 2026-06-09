import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Dumbbell,
  Utensils,
  Moon,
  HeartPulse,
  Layers,
  Trophy,
  Gauge,
  Brain,
  Compass,
  Repeat,
  Activity,
  Database,
  LineChart,
  Clock,
  UserCheck,
  Ruler,
  Sparkles,
  User,
  Users,
  Building2,
  type LucideIcon,
} from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { FAQAccordion } from '@/components/ui/FAQAccordion';

export const metadata: Metadata = {
  title: 'Thalos Science — Vienna Performance Study',
  description:
    'How Thalos turns 26 weeks of high-density human performance data — training, nutrition, recovery and biomarkers — into sharper, individual coaching.',
};

export default function SciencePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <ScienceContent />;
}

function ScienceContent() {
  const t = useTranslations('sciencePage');
  const locale = useLocale();

  const home = `/${locale}`;
  const foundingHref = `/${locale}/founding-athlete`;
  const contactHref = `${home}#contact`;

  const figures = t('figures.items')
    .split('|')
    .map((s) => s.split('::'));
  const coreCards = splitPairs(t('core.cards'));
  const layers = splitPairs(t('study.layers'));
  const steps = t('stack.steps')
    .split('|')
    .map((s) => s.split('::'));
  const roadmap = t('roadmap.items')
    .split('|')
    .map((s) => s.split('::'));
  const principles = splitPairs(t('principles.items'));
  const faqItems = t('faq.items')
    .split('|')
    .map((s) => {
      const [q, a] = s.split('::');
      return { q, a };
    });

  const layerIcons: LucideIcon[] = [Dumbbell, Utensils, Moon, HeartPulse, Layers, Trophy];
  const stepIcons: LucideIcon[] = [Gauge, Layers, Brain, Compass, Repeat];
  const roadmapIcons: LucideIcon[] = [Activity, Database, LineChart];
  const principleIcons: LucideIcon[] = [Clock, UserCheck, Layers, Moon, Ruler, Sparkles];

  return (
    <main id="main" className="relative overflow-hidden">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(0,224,255,0.12),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[1600px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,224,255,0.06),transparent_65%)]"
      />

      <div className="relative max-w-[1120px] mx-auto px-4 md:px-6 pt-24 md:pt-28 pb-24">
        <Link
          href={home}
          className="inline-flex items-center gap-1.5 text-caption text-steel transition-colors hover:text-cyan"
        >
          <ArrowLeft size={16} />
          {t('backHome')}
        </Link>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <div className="mt-10 md:mt-14 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 text-eyebrow uppercase tracking-eyebrow text-cyan">
              {t('hero.eyebrow')}
            </span>
            <h1 className="mt-5 text-display font-bold tracking-tight text-white">{t('hero.title')}</h1>
            <p className="mt-6 text-body-lg text-steel max-w-[620px]">{t('hero.lead')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="#data-stack" size="lg" variant="secondary">
                {t('hero.ctaStack')}
              </Button>
              <Button href={foundingHref} size="lg">
                {t('hero.ctaFounding')}
              </Button>
            </div>
          </Reveal>

          {/* Motto card */}
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-card border border-border-active bg-[rgba(0,224,255,0.04)] p-6 shadow-cta-glow md:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(0,224,255,0.16),transparent_55%)]"
              />
              <div className="relative">
                <p className="text-h2 font-bold leading-tight tracking-tight text-white">
                  {t('hero.motto1')}
                  <br />
                  {t('hero.motto2')}
                  <br />
                  <span className="text-cyan">{t('hero.motto3')}</span>
                </p>
                <p className="mt-6 text-body text-steel">{t('hero.uniqueBody')}</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Key figures ──────────────────────────────────────────── */}
        <section className="mt-20 md:mt-24">
          <Reveal>
            <SectionEyebrow>{t('figures.eyebrow')}</SectionEyebrow>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 md:gap-4">
            {figures.map(([num, unit, label], i) => (
              <Reveal key={num + label} delay={i * 0.05} className="h-full">
                <div className="h-full rounded-card border border-border-default bg-navy p-5">
                  <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                    <span className="text-[clamp(24px,2vw,28px)] font-bold leading-none tracking-tight text-cyan tabular-nums">
                      {num}
                    </span>
                    {unit && <span className="text-caption font-semibold uppercase tracking-eyebrow text-cyan/70">{unit}</span>}
                  </div>
                  <p className="mt-3 text-caption leading-body text-steel">{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Core question ────────────────────────────────────────── */}
        <section className="mt-24 md:mt-28">
          <Reveal>
            <SectionEyebrow>{t('core.eyebrow')}</SectionEyebrow>
            <h2 className="mt-3 text-h1 font-bold tracking-tight text-white">{t('core.title')}</h2>
            <p className="mt-4 text-body-lg text-steel max-w-[680px]">{t('core.intro')}</p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {coreCards.map(([label, body], i) => (
              <Reveal key={label} delay={i * 0.05} className="h-full">
                <div className="h-full rounded-card border border-border-default bg-navy p-6">
                  <div className="text-h2 font-semibold text-white">{label}</div>
                  <p className="mt-2 text-body text-steel">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-8 text-h2 font-semibold tracking-tight text-cyan">{t('core.highlight')}</p>
          </Reveal>
        </section>

        {/* ── Vienna Performance Study ─────────────────────────────── */}
        <section className="mt-24 md:mt-28">
          <Reveal>
            <SectionEyebrow>{t('study.eyebrow')}</SectionEyebrow>
            <h2 className="mt-3 text-h1 font-bold tracking-tight text-white">{t('study.title')}</h2>
            <div className="mt-6 grid gap-4 text-body-lg text-steel md:grid-cols-2 md:gap-10">
              <p>{t('study.p1')}</p>
              <p>{t('study.p2')}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {layers.map(([label, body], i) => (
              <Reveal key={label} delay={i * 0.05} className="h-full">
                <div className="h-full rounded-card border border-border-default bg-navy p-6">
                  <div className="flex items-center gap-3">
                    <Icon icon={layerIcons[i] ?? Layers} size={22} active />
                    <span className="text-h2 font-semibold text-white">{label}</span>
                  </div>
                  <p className="mt-3 text-body text-steel">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Data stack loop ──────────────────────────────────────── */}
        <section id="data-stack" className="mt-24 scroll-mt-24 md:mt-28">
          <Reveal>
            <SectionEyebrow>{t('stack.eyebrow')}</SectionEyebrow>
            <h2 className="mt-3 text-h1 font-bold tracking-tight text-white">{t('stack.title')}</h2>
            <p className="mt-4 text-body-lg text-steel max-w-[680px]">{t('stack.lead')}</p>
          </Reveal>
          <ol className="mt-10 space-y-4">
            {steps.map(([num, title, body], i) => (
              <Reveal key={num} delay={i * 0.04}>
                <li className="grid items-start gap-4 rounded-card border border-border-default bg-navy p-6 md:grid-cols-[auto_auto_1fr] md:gap-6">
                  <span className="select-none text-[40px] font-bold leading-none text-cyan/25 tabular-nums">
                    {num}
                  </span>
                  <span className="hidden md:block">
                    <Icon icon={stepIcons[i] ?? Repeat} size={26} active />
                  </span>
                  <div>
                    <h3 className="text-h2 font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-body text-steel">{body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ── AI roadmap ───────────────────────────────────────────── */}
        <section className="mt-24 md:mt-28">
          <Reveal>
            <SectionEyebrow>{t('roadmap.eyebrow')}</SectionEyebrow>
            <h2 className="mt-3 text-h1 font-bold tracking-tight text-white">{t('roadmap.title')}</h2>
            <div className="mt-6 grid gap-4 text-body-lg text-steel md:grid-cols-2 md:gap-10">
              <p>{t('roadmap.p1')}</p>
              <p>{t('roadmap.p2')}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {roadmap.map(([phase, title, body], i) => (
              <Reveal key={title} delay={i * 0.05} className="h-full">
                <div className="relative flex h-full flex-col rounded-card border border-border-default bg-navy p-6">
                  <div className="flex items-center justify-between gap-2">
                    <Icon icon={roadmapIcons[i] ?? Activity} size={22} active />
                    <span className="inline-flex items-center rounded-full border border-cyan/40 bg-cyan/10 px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-cyan">
                      {phase}
                    </span>
                  </div>
                  <h3 className="mt-4 text-h2 font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-body text-steel">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-6 rounded-card border border-border-active bg-[rgba(0,224,255,0.05)] px-6 py-5 text-center shadow-cta-glow">
              <p className="text-body-lg font-semibold text-white">{t('roadmap.advantage')}</p>
            </div>
          </Reveal>
        </section>

        {/* ── Principles ───────────────────────────────────────────── */}
        <section className="mt-24 md:mt-28">
          <Reveal>
            <SectionEyebrow>{t('principles.eyebrow')}</SectionEyebrow>
            <h2 className="mt-3 text-h1 font-bold tracking-tight text-white">{t('principles.title')}</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map(([title, body], i) => (
              <Reveal key={title} delay={i * 0.05} className="h-full">
                <div className="h-full rounded-card border border-border-default bg-navy p-6">
                  <Icon icon={principleIcons[i] ?? Sparkles} size={22} active />
                  <h3 className="mt-4 text-h2 font-semibold tracking-tight text-white">{title}</h3>
                  <p className="mt-2 text-body text-steel">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Audience cards ───────────────────────────────────────── */}
        <section className="mt-24 md:mt-28">
          <Reveal>
            <SectionEyebrow>{t('audience.eyebrow')}</SectionEyebrow>
            <h2 className="mt-3 text-h1 font-bold tracking-tight text-white">{t('audience.title')}</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Reveal className="h-full">
              <AudienceCard
                icon={User}
                title={t('audience.athletesTitle')}
                body={t('audience.athletesBody')}
                cta={t('audience.athletesCta')}
                href={foundingHref}
              />
            </Reveal>
            <Reveal delay={0.05} className="h-full">
              <AudienceCard
                icon={Users}
                title={t('audience.coachesTitle')}
                body={t('audience.coachesBody')}
                cta={t('audience.coachesCta')}
                href={contactHref}
              />
            </Reveal>
            <Reveal delay={0.1} className="h-full">
              <AudienceCard
                icon={Building2}
                title={t('audience.gymsTitle')}
                body={t('audience.gymsBody')}
                cta={t('audience.gymsCta')}
                href={contactHref}
              />
            </Reveal>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section className="mt-24 md:mt-28">
          <Reveal>
            <SectionEyebrow>{t('faq.eyebrow')}</SectionEyebrow>
            <h2 className="mt-3 text-h1 font-bold tracking-tight text-white">{t('faq.title')}</h2>
          </Reveal>
          <Reveal>
            <div className="mt-6">
              <FAQAccordion items={faqItems} />
            </div>
          </Reveal>
        </section>

        {/* ── Final CTA band ───────────────────────────────────────── */}
        <Reveal>
          <section className="relative mt-24 overflow-hidden rounded-card border border-border-active bg-[rgba(0,224,255,0.05)] p-8 text-center shadow-cta-glow md:mt-28 md:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,224,255,0.18),transparent_60%)]"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-[760px] text-h1 font-bold tracking-tight text-white">
                {t('finalCta.title')}
              </h2>
              <p className="mt-4 text-body-lg font-semibold text-cyan">{t('finalCta.motto')}</p>
              <div className="mt-8 flex justify-center">
                <Button href={foundingHref} size="lg">
                  {t('finalCta.cta')}
                </Button>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── Regulatory ───────────────────────────────────────────── */}
        <div className="mt-12 border-t border-border-default pt-8">
          <p className="text-caption text-steel">{t('regulatory')}</p>
        </div>
      </div>
    </main>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-eyebrow uppercase tracking-eyebrow text-cyan">{children}</div>;
}

function AudienceCard({
  icon,
  title,
  body,
  cta,
  href,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-card border border-border-default bg-navy p-6">
      <Icon icon={icon} size={24} active />
      <h3 className="mt-4 text-h2 font-semibold text-white">{title}</h3>
      <p className="mt-2 flex-1 text-body text-steel">{body}</p>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1.5 text-body font-semibold text-cyan transition-colors hover:text-white"
      >
        {cta}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function splitPairs(raw: string): [string, string][] {
  return raw.split('|').map((s) => {
    const [a, b] = s.split('::');
    return [a, b];
  });
}
