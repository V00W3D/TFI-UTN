import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Button system for QART.
 * Centralizing all variants (primary, secondary, nav, etc.)
 */
export const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 font-black uppercase tracking-[0.12em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-qart-accent text-qart-text-on-accent border-[3px] border-qart-border shadow-sharp hover:bg-qart-accent-hover hover:-translate-x-1 hover:-translate-y-1 hover:shadow-accent-hover active:translate-x-0 active:translate-y-0 active:shadow-none',
        secondary:
          'bg-qart-surface text-qart-primary border-[3px] border-qart-border hover:bg-qart-bg-warm hover:border-qart-accent hover:text-qart-accent hover:-translate-x-1 hover:-translate-y-1 hover:shadow-sharp active:translate-x-0 active:translate-y-0 active:shadow-none',
        ghost:
          'border border-qart-border bg-qart-surface text-qart-primary hover:bg-qart-primary hover:text-qart-text-on-primary cursor-pointer',
        nav: 'p-3 border-[3px] border-qart-border bg-qart-surface text-qart-text-muted hover:bg-qart-bg-warm hover:border-qart-accent hover:text-qart-accent hover:-translate-x-1 hover:-translate-y-1 hover:shadow-sharp cursor-pointer',
        simple:
          'border border-qart-border bg-qart-surface px-3 py-2 text-[10px] text-qart-primary hover:bg-qart-primary hover:text-qart-text-on-primary cursor-pointer',
      },
      size: {
        default: 'px-8 py-3.5 min-h-[3.5rem] text-[0.82rem]',
        md: 'px-6 py-2.5 min-h-[3.2rem] text-[0.76rem]',
        sm: 'px-4 py-2 text-[10px]',
        icon: 'w-10 h-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export type ButtonStylesProps = VariantProps<typeof buttonStyles>;
