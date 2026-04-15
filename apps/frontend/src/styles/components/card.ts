import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Card system for QART.
 * Standardizing cards for dishes, profiles, and auth containers.
 */
export const cardStyles = cva('transition-all duration-300 rounded-none', {
  variants: {
    variant: {
      base: 'bg-qart-surface border-2 border-qart-border hover:border-qart-accent hover:shadow-sharp hover:-translate-x-0.5 hover:-translate-y-0.5',
      elevated:
        'bg-qart-surface border-4 border-qart-border shadow-[10px_10px_0_var(--qart-border)]',
      outline: 'border border-qart-border bg-qart-surface',
      ghost: 'border border-qart-border bg-transparent',
      interactive:
        'bg-qart-surface border border-qart-border hover:border-qart-accent hover:shadow-sharp hover:-translate-x-1 hover:-translate-y-1',
    },
    padding: {
      none: 'p-0',
      xs: 'p-2',
      sm: 'p-4',
      md: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'base',
    padding: 'sm',
  },
});

export type CardStylesProps = VariantProps<typeof cardStyles>;
