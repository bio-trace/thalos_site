'use client';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import { PhoneScreenshot } from '@/components/ui/PhoneScreenshot';

const SLIDES = [
  { key: 'home', src: '/images/hero-screen.png' },
  { key: 'sleep', src: '/images/screens/data.png' },
  { key: 'meals', src: '/images/screens/makros.jpeg' },
  { key: 'training', src: '/images/screens/workout.png' },
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

  const activeSlide = SLIDES[active];

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
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.key}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
                  transition={{ duration: reduced ? 0 : 0.25, ease: 'easeOut' }}
                >
                  <PhoneScreenshot
                    src={activeSlide.src}
                    alt={`Thalos app — ${t(`slides.${activeSlide.key}.title`)}`}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-4 lg:space-y-6">
            {SLIDES.map((s, i) => (
              <div
                key={s.key}
                data-idx={i}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                className="grid grid-cols-1 gap-6 scroll-mt-24"
              >
                {/* Mobile: each slide shows its own phone inline */}
                <div className="lg:hidden flex justify-center">
                  <PhoneScreenshot src={s.src} alt={`Thalos app — ${t(`slides.${s.key}.title`)}`} />
                </div>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
