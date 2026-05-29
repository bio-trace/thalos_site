'use client';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import clsx from 'clsx';
import { PhoneScreenshot } from '@/components/ui/PhoneScreenshot';

// Filenames match the i18n slide key (the "section title"). The matching
// screenshots live in public/images/screens/<key>.png.
const SLIDES = [
  { key: 'home', src: '/images/screens/home.png' },
  { key: 'sleep', src: '/images/screens/sleep.png' },
  { key: 'meals', src: '/images/screens/meals.png' },
  { key: 'training', src: '/images/screens/training.png' },
  { key: 'notes', src: '/images/screens/notes.png' },
] as const;

export function ProductInMotion() {
  const t = useTranslations('productInMotion');
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Centre-line scrollspy: the root collapses to a 1px line at viewport
    // middle (top/bottom margins -50%). Whichever slide crosses that line
    // becomes active.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-14 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-h1 font-bold tracking-tight text-white text-center">{t('title')}</h2>
        <div className="mt-16 grid lg:grid-cols-2 gap-12">
          {/* Left column is as tall as the text column. The phone wrapper is
              sticky and offset so it sits vertically centred in the viewport,
              staying pinned for the whole text scroll, then releasing after the
              last slide. (top = 50vh − half the phone height of ~609px.) */}
          <div className="hidden lg:block">
            <div className="sticky" style={{ top: 'calc(50vh - 305px)' }}>
              {/* All slides are pre-mounted and stacked; we crossfade opacity on
                  the active index. Each screenshot loads once (no unmount /
                  refetch) so swaps are instant — the previous image stays until
                  the next is ready, eliminating the blank-frame gap that
                  AnimatePresence's mount/unmount produced while the next big PNG
                  re-optimized. */}
              <div className="relative mx-auto w-[280px] aspect-[1206/2622] rounded-phone overflow-hidden border border-border-default shadow-ring-glow bg-navy">
                {SLIDES.map((s, i) => (
                  <motion.div
                    key={s.key}
                    className="absolute inset-0"
                    initial={false}
                    animate={{ opacity: i === active ? 1 : 0 }}
                    transition={{ duration: reduced ? 0 : 0.35, ease: 'easeOut' }}
                    aria-hidden={i !== active}
                  >
                    <Image
                      src={s.src}
                      alt={`Thalos app — ${t(`slides.${s.key}.title`)}`}
                      fill
                      sizes="280px"
                      priority={i === 0}
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* lg padding shifts the first card down so the swap only begins once
              you scroll to it, and the trailing space keeps the phone pinned
              until the last card (Notizen) is roughly centred before release. */}
          <div className="space-y-4 lg:space-y-6 lg:pt-[22vh] lg:pb-[38vh]">
            {SLIDES.map((s, i) => (
              <div
                key={s.key}
                data-idx={i}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                className="grid grid-cols-1 gap-6 scroll-mt-24"
              >
                {/* Text first so each heading pairs with the phone directly
                    below it on mobile. On lg the phone lives in the sticky
                    left column and this text just highlights when active. */}
                <div
                  className={clsx(
                    'transition-all duration-300 lg:rounded-card lg:border lg:p-6',
                    i === active
                      ? 'lg:border-cyan lg:bg-[rgba(0,224,255,0.05)] lg:opacity-100 lg:shadow-card-subtle'
                      : 'lg:border-transparent lg:opacity-40',
                  )}
                >
                  <h3 className="text-h2 font-semibold text-white">{t(`slides.${s.key}.title`)}</h3>
                  <p className="mt-3 text-body-lg text-steel">{t(`slides.${s.key}.body`)}</p>
                </div>
                {/* Mobile: each slide shows its own phone under its text */}
                <div className="lg:hidden flex justify-center">
                  <PhoneScreenshot src={s.src} alt={`Thalos app — ${t(`slides.${s.key}.title`)}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
