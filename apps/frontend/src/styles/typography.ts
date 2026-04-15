/**
 * Typography systems for QART.
 */

export const typography = {
  display: 'font-display font-black uppercase tracking-tight',
  displayLg: 'text-3xl md:text-5xl font-black uppercase tracking-tight leading-none',
  displayMd: 'text-xl md:text-3xl font-black uppercase tracking-tight leading-tight',
  displaySm: 'text-base md:text-lg font-black uppercase tracking-tight',

  lead: 'text-lg font-semibold text-qart-text-muted leading-relaxed',
  body: 'text-base font-medium leading-relaxed',
  bodySm: 'text-sm font-medium leading-relaxed',

  label: 'text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted',
  badge: 'px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white',
} as const;
