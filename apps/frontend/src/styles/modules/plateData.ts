/**
 * @file plateData.ts
 * @module Frontend
 * @description Estilos centralizados para íconos y métricas visuales de platos.
 */
export const plateDataStyles = {
  ratingRoot: 'inline-flex items-center gap-1.5',
  ratingSvg: 'shrink-0 overflow-visible text-[#f5b301]',
  ratingStarEmpty:
    'fill-transparent stroke-[color-mix(in_srgb,var(--qart-border-soft)_92%,transparent)]',
  ratingStarFilled: 'fill-current stroke-current',
  ratingMeta: 'inline-flex items-center gap-1.5',
  ratingValue: 'text-[0.82rem] font-black leading-none text-qart-primary',
  ratingCount: 'text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-qart-text-muted',
} as const;
