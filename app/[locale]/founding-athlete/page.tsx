import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  TrendingUp,
  Activity,
  Calendar,
  Watch,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { SoldOutStamp } from '@/components/ui/SoldOutStamp';

export const metadata: Metadata = {
  title: 'Founding Athlete Beta — Thalos',
  description:
    '100 spots. Polar360 device included. Founding pricing with a 24-month price guarantee — and a head start once the forward-looking algorithms go live.',
};

export default function FoundingAthletePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <FoundingAthleteContent />;
}

function FoundingAthleteContent() {
  const t = useTranslations('foundingAthleteBeta');
  const locale = useLocale();
  const applyHref = `/${locale}#contact-first-customer`;
  const passItems = t('pass.items').split('|');

  return (
    <main id="main" className="relative overflow-hidden">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[680px] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(0,224,255,0.12),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[1400px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,224,255,0.06),transparent_65%)]"
      />

      <div className="relative max-w-[1120px] mx-auto px-4 md:px-6 pt-24 md:pt-28 pb-24">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-caption text-steel transition-colors hover:text-cyan"
        >
          <ArrowLeft size={16} />
          {t('backHome')}
        </Link>

        {/* ── Hero: copy + founder pass ───────────────────────────── */}
        <div className="mt-10 md:mt-14 grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 text-eyebrow uppercase tracking-eyebrow text-cyan">
              {t('eyebrow')}
            </span>
            <h1 className="mt-5 text-display font-bold tracking-tight text-white">{t('headline')}</h1>
            <p className="mt-4 text-body-lg font-semibold text-cyan">{t('subheadline')}</p>
            <p className="mt-6 text-body-lg text-steel max-w-[620px]">{t('heroBody')}</p>
            <p className="mt-6 text-h2 font-semibold text-white">{t('uniqueLine')}</p>
            <p className="mt-2 text-caption uppercase tracking-eyebrow text-steel">{t('microcopy')}</p>
          </Reveal>

          {/* Founder pass */}
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-card border border-border-active bg-[rgba(0,224,255,0.04)] p-6 shadow-cta-glow md:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(0,224,255,0.16),transparent_55%)]"
              />
              <SoldOutStamp
                label={t('soldOutStamp')}
                note={t('soldOutNote')}
                className="right-3 top-3 md:right-5 md:top-5"
              />
              <div className="relative">
                <span className="inline-flex items-center rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 text-eyebrow uppercase tracking-eyebrow text-cyan">
                  {t('pass.badge')}
                </span>

                <div className="mt-6">
                  <span className="text-eyebrow uppercase tracking-eyebrow text-steel">
                    {t('pass.priceLabel')}
                  </span>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-[clamp(40px,5vw,56px)] font-bold leading-none text-white">
                      {t('plans.foundingAmount')}
                    </span>
                    <span className="mb-1 text-body text-steel">{t('pass.priceSuffix')}</span>
                  </div>
                  <span className="mt-1 block text-caption text-steel">{t('pass.priceNote')}</span>
                </div>

                <ul className="mt-7 space-y-3">
                  {passItems.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-body text-white/90">
                      <Check size={18} className="mt-0.5 shrink-0 text-cyan" strokeWidth={2.4} />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button href={applyHref} size="lg" className="mt-8 w-full">
                  {t('ctaFirstCustomer')}
                </Button>
                <p className="mt-3 text-center text-caption text-steel">{t('teaserNote')}</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Narrative blocks ────────────────────────────────────── */}
        <div className="mt-24 space-y-16 md:mt-28 md:space-y-24">
          <Block n="01" icon={TrendingUp} eyebrow={t('why.eyebrow')} title={t('why.title')}>
            <p>{t('why.p1')}</p>
            <p>{t('why.p2')}</p>
            <p className="font-semibold text-white">{t('why.highlight')}</p>
          </Block>

          <Block n="02" icon={Activity} eyebrow={t('today.eyebrow')} title={t('today.title')}>
            <p>{t('today.intro')}</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <MiniCard label={t('today.dailyLabel')} body={t('today.daily')} />
              <MiniCard label={t('today.workoutLabel')} body={t('today.workout')} />
              <MiniCard label={t('today.nutritionLabel')} body={t('today.nutrition')} />
            </div>
            <p className="font-semibold text-white">{t('today.outro')}</p>
          </Block>

          <Block n="03" icon={Calendar} eyebrow={t('next.eyebrow')} title={t('next.title')}>
            <p>{t('next.p1')}</p>
            <p>{t('next.p2')}</p>
            <p>{t('next.p3')}</p>
          </Block>

          <Block n="04" icon={Watch} eyebrow={t('device.eyebrow')} title={t('device.title')}>
            <p>{t('device.polar')}</p>
            <p className="text-caption text-steel">{t('device.polarTerms')}</p>
            <p>{t('device.cgm')}</p>
            <p>{t('device.lactate')}</p>
          </Block>
        </div>

        {/* ── Pricing tiers ───────────────────────────────────────── */}
        <section className="mt-24 md:mt-28">
          <Reveal>
            <div className="text-eyebrow uppercase tracking-eyebrow text-cyan">{t('price.eyebrow')}</div>
            <h2 className="mt-2 text-h1 font-bold tracking-tight text-white">{t('price.title')}</h2>
            <p className="mt-4 text-body-lg text-steel max-w-[680px]">{t('plans.heading')}</p>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Reveal className="relative h-full">
              <PlanCard
                featured
                badge={t('plans.foundingBadge')}
                name={t('plans.foundingName')}
                amount={t('plans.foundingAmount')}
                suffix={t('plans.foundingSuffix')}
                feat={t('plans.foundingFeat')}
              />
              <SoldOutStamp
                label={t('soldOutStamp')}
                note={t('soldOutNote')}
                className="-right-2 -top-4 md:-right-3 md:-top-5"
              />
            </Reveal>
            <Reveal delay={0.05} className="h-full">
              <PlanCard
                name={t('plans.fullName')}
                amount={t('plans.fullAmount')}
                suffix={t('plans.fullSuffix')}
                feat={t('plans.fullFeat')}
              />
            </Reveal>
            <Reveal delay={0.1} className="h-full">
              <PlanCard
                name={t('plans.eliteName')}
                amount={t('plans.eliteAmount')}
                suffix={t('plans.eliteSuffix')}
                feat={t('plans.eliteFeat')}
              />
            </Reveal>
          </div>

          <Reveal>
            <p className="mt-6 text-caption text-steel">{t('price.amountIncl')}</p>
            <p className="mt-2 text-body-lg font-semibold text-white">{t('price.close')}</p>
          </Reveal>
        </section>

        {/* ── Thalos Table ────────────────────────────────────────── */}
        <div className="mt-24 md:mt-28">
          <Block n="05" icon={Trophy} eyebrow={t('table.eyebrow')} title={t('table.title')}>
            <p>{t('table.p1')}</p>
            <p>{t('table.p2')}</p>
          </Block>
        </div>

        {/* ── Final CTA band ──────────────────────────────────────── */}
        <Reveal>
          <section className="relative mt-24 overflow-hidden rounded-card border border-border-active bg-[rgba(0,224,255,0.05)] p-8 text-center shadow-cta-glow md:mt-28 md:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,224,255,0.18),transparent_60%)]"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-[760px] text-h1 font-bold tracking-tight text-white">
                {t('headline')}
              </h2>
              <p className="mt-4 text-body-lg font-semibold text-cyan">{t('subheadline')}</p>
              <div className="mt-8 flex justify-center">
                <Button href={applyHref} size="lg">
                  {t('ctaFirstCustomer')}
                </Button>
              </div>
              <p className="mt-4 text-caption text-steel">{t('teaserNote')}</p>
            </div>
          </section>
        </Reveal>

        {/* ── Regulatory ──────────────────────────────────────────── */}
        <div className="mt-12 space-y-2 border-t border-border-default pt-8">
          <p className="text-caption text-steel">{t('regulatory')}</p>
          <p className="text-caption text-steel">{t('deviceTerms')}</p>
        </div>
      </div>
    </main>
  );
}

function Block({
  n,
  icon,
  eyebrow,
  title,
  children,
}: {
  n: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section className="grid max-w-[900px] gap-4 md:grid-cols-[auto_1fr] md:gap-8">
        <div className="hidden select-none text-[44px] font-bold leading-none text-cyan/25 tabular-nums md:block">
          {n}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <Icon icon={icon} size={22} active />
            <span className="text-eyebrow uppercase tracking-eyebrow text-cyan">{eyebrow}</span>
          </div>
          <h2 className="mt-3 text-h2 font-bold tracking-tight text-white">{title}</h2>
          <div className="mt-4 space-y-4 text-body-lg text-steel">{children}</div>
        </div>
      </section>
    </Reveal>
  );
}

function PlanCard({
  featured = false,
  badge,
  name,
  amount,
  suffix,
  feat,
}: {
  featured?: boolean;
  badge?: string;
  name: string;
  amount: string;
  suffix: string;
  feat: string;
}) {
  return (
    <div
      className={
        'relative flex h-full flex-col overflow-hidden rounded-card p-6 ' +
        (featured
          ? 'border border-border-active bg-[rgba(0,224,255,0.05)] shadow-cta-glow'
          : 'border border-border-default bg-navy')
      }
    >
      {featured && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,224,255,0.14),transparent_60%)]"
        />
      )}
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-white text-h2 font-semibold">{name}</h3>
          {badge && (
            <span className="inline-flex items-center rounded-full border border-cyan/40 bg-cyan/10 px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-cyan">
              {badge}
            </span>
          )}
        </div>
        <div className="mt-4">
          <span
            className={
              'block text-[clamp(32px,4vw,44px)] font-bold leading-none ' +
              (featured ? 'text-cyan' : 'text-white')
            }
          >
            {amount}
          </span>
          <span className="mt-1.5 block text-caption text-steel">{suffix}</span>
        </div>
        <p className="mt-4 text-body text-steel">{feat}</p>
      </div>
    </div>
  );
}

function MiniCard({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-card border border-border-default bg-navy p-5">
      <div className="text-eyebrow uppercase tracking-eyebrow text-cyan">{label}</div>
      <p className="mt-2 text-body text-steel">{body}</p>
    </div>
  );
}
