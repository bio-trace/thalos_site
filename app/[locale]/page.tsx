import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { System } from '@/components/sections/System';
import { ProductInMotion } from '@/components/sections/ProductInMotion';
import { Science } from '@/components/sections/Science';
import { YouAreUnique } from '@/components/sections/YouAreUnique';
import { Athletes } from '@/components/sections/Athletes';
import { FoundingAthleteBeta } from '@/components/sections/FoundingAthleteBeta';
import { PartnerGyms } from '@/components/sections/PartnerGyms';
import { Team } from '@/components/sections/Team';
import { Contact } from '@/components/sections/Contact';
import { AppDownload } from '@/components/sections/AppDownload';
import { FAQ } from '@/components/sections/FAQ';

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return (
    <main id="main">
      <Hero />
      <System />
      <ProductInMotion />
      <Science />
      <YouAreUnique />
      <Athletes />
      <FoundingAthleteBeta />
      <PartnerGyms />
      <Team />
      <Contact />
      <AppDownload />
      <FAQ />
    </main>
  );
}
