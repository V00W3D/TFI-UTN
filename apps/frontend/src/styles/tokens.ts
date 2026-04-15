/**
 * Design tokens for the QART system.
 * Ported from the legacy stylesheet layer into centralized, programmatic access.
 */

export const colors = {
  primary: 'text-qart-primary',
  accent: 'text-qart-accent',
  muted: 'text-qart-text-muted',
  bg: 'bg-qart-bg',
  bgWarm: 'bg-qart-bg-warm',
  surface: 'bg-qart-surface',
  surfaceRaised: 'bg-qart-surface-raised',
  surfaceSunken: 'bg-qart-surface-sunken',
} as const;

export const borderBase = 'border-(--qart-border-width) border-qart-border';
export const shadowSharp = 'shadow-sharp';
export const shadowAccent = 'shadow-accent';
