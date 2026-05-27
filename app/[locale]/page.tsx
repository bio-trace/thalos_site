import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { WhatThalosIs } from '@/components/sections/WhatThalosIs';
import { System } from '@/components/sections/System';
import { ProductInMotion } from '@/components/sections/ProductInMotion';
import { Science } from '@/components/sections/Science';
import { Athletes } from '@/components/sections/Athletes';
import { Team } from '@/components/sections/Team';
import { PartnerGyms } from '@/components/sections/PartnerGyms';
import { FounderNote } from '@/components/sections/FounderNote';
import { AppDownload } from '@/components/sections/AppDownload';
import { FAQ } from '@/components/sections/FAQ';

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return (
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
      <AppDownload />
      <FAQ />
    </main>
  );
}
