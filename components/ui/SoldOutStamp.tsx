import clsx from 'clsx';

type Props = {
  label: string;
  note: string;
  className?: string;
};

/**
 * Rubber-stamp style "sold out" overlay for the Founding Athlete beta.
 * Decorative only — pointer-events disabled so it never blocks the card beneath.
 */
export function SoldOutStamp({ label, note, className }: Props) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        'pointer-events-none absolute z-20 -rotate-[9deg] select-none',
        className,
      )}
    >
      <div className="rounded-xl border-2 border-cyan/70 bg-navy/60 px-4 py-2 text-center shadow-cta-glow backdrop-blur-sm md:px-5 md:py-2.5">
        <div className="text-[15px] font-bold uppercase leading-none tracking-[0.18em] text-cyan md:text-[19px]">
          {label}
        </div>
        <div className="mt-1.5 text-[9px] uppercase leading-none tracking-eyebrow text-steel md:text-[11px]">
          {note}
        </div>
      </div>
    </div>
  );
}
