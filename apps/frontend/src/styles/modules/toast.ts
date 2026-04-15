/**
 * @file toast.ts
 * @module Frontend
 * @description Estilos centralizados para el sistema de notificaciones toast.
 */
import { cva } from 'class-variance-authority';

export const toastItemStyles = cva(
  'z-50 flex gap-4 border-[3px] p-4 text-white shadow-[6px_6px_0_var(--toast-shadow)]',
  {
    variants: {
      tone: {
        success: 'border-qart-success bg-qart-success [--toast-shadow:var(--qart-success)]',
        error: 'border-qart-error bg-qart-error [--toast-shadow:var(--qart-error)]',
        warning: 'border-qart-warning bg-qart-warning [--toast-shadow:var(--qart-warning)]',
      },
    },
    defaultVariants: {
      tone: 'success',
    },
  },
);

export const toastStyles = {
  portal: 'fixed bottom-6 right-6 z-[9999] flex w-full max-w-sm flex-col gap-4 font-body',
  iconWrap: 'shrink-0 self-start',
  message: 'self-center text-[0.88rem] font-bold leading-tight',
  close: 'ml-auto shrink-0 cursor-pointer opacity-70 transition-opacity hover:opacity-100',
} as const;
