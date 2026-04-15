import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Input system for QART.
 * Standardizing text inputs, textareas, and select states.
 */
export const inputStyles = cva(
  'w-full px-3.5 py-3.5 border-2 transition-all duration-200 outline-none font-medium text-[0.92rem] rounded-none',
  {
    variants: {
      intent: {
        default:
          'border-qart-border bg-qart-surface-sunken text-qart-text focus:border-qart-accent focus:shadow-[4px_4px_0px_var(--qart-accent)]',
        error:
          'border-qart-error bg-qart-error-bg text-qart-error focus:border-qart-error focus:shadow-[4px_4px_0px_var(--qart-error)]',
        success:
          'border-qart-success bg-qart-success-bg text-qart-success focus:border-qart-success focus:shadow-[4px_4px_0px_var(--qart-success)]',
      },
    },
    defaultVariants: {
      intent: 'default',
    },
  },
);

export type InputStylesProps = VariantProps<typeof inputStyles>;
