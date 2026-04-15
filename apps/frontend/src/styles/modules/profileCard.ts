/**
 * @file profileCard.ts
 * @module Frontend
 * @description Variantes centralizadas para las tarjetas de perfil.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-05
 * rnf: RNF-03, RNF-05
 *
 * @business
 * inputs: variantes lite y default del perfil del usuario
 * outputs: clases reutilizables para mostrar identidad, metadata y acciones
 * rules: mantener consistencia visual entre navbar y paneles internos
 *
 * @technical
 * dependencies: class-variance-authority
 * flow: define la base visual; expone variantes por contexto; centraliza avatares, badges y acciones.
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: se reutiliza una sola familia de estilos para evitar divergencia entre perfiles
 */
import { cva } from 'class-variance-authority';

export const profileCardStyles = cva(
  'border-[3px] border-qart-border bg-qart-surface transition-all duration-200',
  {
    variants: {
      variant: {
        lite: 'flex items-center gap-2 p-1.5 shadow-sharp',
        default:
          'relative flex w-full flex-col gap-5 overflow-hidden p-6 shadow-[6px_6px_0_var(--qart-primary)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const profileCardTokens = {
  liteAvatar:
    'flex size-9 items-center justify-center border-2 border-qart-border bg-qart-accent text-lg font-black uppercase text-qart-text-on-accent',
  liteInfo: 'flex min-w-[8rem] flex-col',
  liteName: 'text-[0.7rem] font-black uppercase leading-none tracking-[0.05em] text-qart-primary',
  liteMeta: 'mt-1 flex items-center gap-1.5 text-[0.6rem] font-extrabold text-qart-text-muted',
  liteMetaAction: 'transition-colors hover:text-qart-accent',
  liteAction:
    'inline-flex size-9 items-center justify-center text-qart-text transition-colors hover:bg-qart-error-bg hover:text-qart-error disabled:cursor-not-allowed disabled:opacity-50',
  liteDivider: 'border-l-2 border-qart-border',
  defaultLine: 'absolute inset-x-0 top-0 h-1.5 bg-qart-accent',
  defaultHeader: 'flex items-center gap-5 border-b-2 border-qart-border pb-5',
  defaultAvatar:
    'flex size-20 items-center justify-center border-[3px] border-qart-border bg-qart-primary text-[2.5rem] font-black text-white shadow-sharp',
  defaultIdentity: 'flex flex-col gap-2',
  defaultBadgeRow: 'flex gap-2',
  defaultTitle: 'text-xl font-black uppercase tracking-tight text-qart-primary',
  badgePrimary:
    'border border-qart-border bg-qart-primary px-3 py-1 text-[0.6rem] font-black uppercase text-white shadow-[2px_2px_0_var(--qart-border)]',
  badgeAccent:
    'border border-qart-border bg-qart-accent px-3 py-1 text-[0.6rem] font-black uppercase text-white shadow-[2px_2px_0_var(--qart-border)]',
  usernameBadge:
    'flex w-fit items-center gap-1.5 border border-qart-border-subtle bg-qart-bg-warm px-2 py-1 text-[0.65rem] font-black text-qart-text-muted',
  infoGrid: 'space-y-3',
  infoRow: 'flex items-center gap-3',
  infoIconBox:
    'flex size-8 items-center justify-center border border-qart-border bg-qart-bg-warm text-qart-primary',
  infoText: 'flex flex-col',
  infoIcon: 'text-qart-primary',
  infoLabel: 'text-[0.55rem] font-black uppercase text-qart-text-muted',
  infoValue: 'text-xs font-bold text-qart-primary',
  footer:
    'mt-2 flex items-center justify-between border-t border-qart-border-subtle pt-2 text-[0.6rem] font-black uppercase tracking-widest text-qart-primary/60',
  footerId: 'text-[0.6rem] font-black uppercase tracking-widest',
  footerAction:
    'inline-flex items-center gap-1 text-[0.6rem] font-black uppercase tracking-widest text-qart-primary/70 transition-colors hover:text-qart-accent',
  footerActionActive: 'text-qart-accent',
} as const;
