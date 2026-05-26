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
