import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import * as React from 'react';

const styles = cva(
  'rounded-card bg-navy border p-6',
  {
    variants: {
      variant: {
        standard: 'border-border-default shadow-card-subtle',
        elevated: 'border-border-default shadow-card-active',
        glow: 'border-border-active shadow-cta-glow',
      },
    },
    defaultVariants: { variant: 'standard' },
  },
);

type Props = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof styles>;

export function Card({ variant, className, children, ...rest }: Props) {
  return (
    <div className={clsx(styles({ variant }), className)} {...rest}>
      {children}
    </div>
  );
}
