import { LegalDocument } from '@/components/ui/LegalDocument';

export const dynamic = 'force-dynamic';

export default function AGB() {
  return <LegalDocument slug="agb" title="Allgemeine Geschäftsbedingungen" />;
}
