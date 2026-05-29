import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import * as React from 'react';

const wrapper = cva(
  'rounded-card bg-navy border overflow-hidden flex flex-col',
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

type Props = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof wrapper> & {
    media?: React.ReactNode;
    bodyClassName?: string;
  };

export function Card({
  media,
  variant,
  className,
  bodyClassName,
  children,
  ...rest
}: Props) {
  return (
    <div className={clsx(wrapper({ variant }), className)} {...rest}>
      {media}
      <div className={clsx('p-6 flex-1 flex flex-col', bodyClassName)}>
        {children}
      </div>
    </div>
  );
}
