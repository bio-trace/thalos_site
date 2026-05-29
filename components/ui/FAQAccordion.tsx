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
