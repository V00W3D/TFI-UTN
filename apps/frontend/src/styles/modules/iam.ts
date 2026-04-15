/**
 * @file iam.ts
 * @module Frontend
 * @description Estilos centralizados para el módulo de autenticación QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-01, RF-02
 * rnf: RNF-03, RNF-05
 *
 * @business
 * inputs: layout auth, estados de navegación y paneles contextuales de identidad
 * outputs: clases reutilizables para login, registro y acceso QR
 * rules: mantener una experiencia consistente y predecible entre todos los flujos IAM
 *
 * @technical
 * dependencies: class-variance-authority
 * flow: define el layout principal; expone variantes para tabs de navegación; centraliza el sistema visual del hero, formularios y QR.
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 5
 * estimated_hours: 3
 *
 * @testing
 * cases: TC-AUTH-UI-01
 *
 * @notes
 * decisions: se reduce la dependencia de hojas CSS legacy y se priorizan variantes estáticas compatibles con Tailwind JIT
 */
import { cva } from 'class-variance-authority';

export const authNavLinkStyles = cva(
  'border-2 px-4 py-1.5 text-[0.88rem] font-bold tracking-tight transition-all duration-200 cursor-pointer',
  {
    variants: {
      active: {
        true: 'border-qart-accent bg-qart-accent text-qart-text-on-accent shadow-sharp',
        false:
          'border-transparent text-qart-text-muted hover:border-qart-border hover:text-qart-text',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const iamStyles = {
  layout: 'flex min-h-screen flex-col bg-qart-bg transition-all duration-300',
  navBar:
    'sticky top-0 z-50 flex h-14 items-center justify-center gap-3 border-b-2 border-qart-border bg-qart-surface/90 px-5 backdrop-blur-sm',
  content: 'flex flex-1 items-center justify-center p-4 md:p-8',
  shell: 'w-full max-w-[1440px] px-6 py-12 md:px-8 md:py-20',
  panel:
    'grid overflow-hidden border-[4px] border-qart-border bg-qart-surface shadow-[24px_24px_0_var(--qart-border)] lg:grid-cols-[1.02fr_0.98fr]',
  hero: 'relative flex flex-col gap-10 overflow-hidden border-b-[4px] border-qart-border bg-[linear-gradient(160deg,color-mix(in_srgb,var(--qart-primary)_8%,transparent)_0%,transparent_40%),linear-gradient(135deg,color-mix(in_srgb,var(--qart-bg-warm)_60%,var(--qart-surface))_0%,var(--qart-surface)_100%)] p-8 md:p-12 lg:border-b-0 lg:border-r-[4px] lg:p-16',
  heroAccentLine: 'absolute left-0 top-0 h-full w-[3px] bg-[linear-gradient(180deg,var(--qart-accent)_0%,var(--qart-accent-warm)_50%,transparent_100%)]',
  heroPattern: 'pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(var(--qart-text)_1px,transparent_1px),linear-gradient(90deg,var(--qart-text)_1px,transparent_1px)] [background-size:28px_28px]',
  backButton:
    'cursor-pointer inline-flex items-center gap-2 self-start border-2 border-qart-border bg-qart-surface px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-qart-primary transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-x-1 hover:-translate-y-1 hover:border-qart-accent hover:text-qart-accent hover:shadow-sharp',
  backIcon: 'size-3 shrink-0',
  backIconFixed: 'size-3 min-h-3 min-w-3 shrink-0',
  badge:
    'self-start border-[3px] border-qart-accent bg-qart-accent px-6 py-2 text-xs font-black uppercase tracking-[0.3em] text-qart-text-on-accent shadow-[8px_8px_0_var(--qart-border)] [box-shadow:8px_8px_0_var(--qart-border),4px_4px_16px_var(--color-primary-glow)]',
  heroCopy: 'max-w-2xl space-y-4',
  kicker: 'text-[0.75rem] font-black uppercase tracking-[0.38em] text-qart-accent',
  title: 'font-display text-4xl font-black uppercase leading-[0.88] text-qart-primary md:text-6xl',
  heroExtra: 'mt-auto',
  formPanel:
    'relative flex min-h-full flex-col gap-10 bg-qart-surface/80 p-8 backdrop-blur-md md:p-12 lg:p-16',
  panelHeader: 'flex items-center justify-between gap-4 border-b-[3px] border-qart-border pb-6',
  sectionHeading: 'text-3xl font-black uppercase tracking-tight text-qart-primary md:text-4xl',
  panelMark:
    'flex size-14 shrink-0 items-center justify-center border-[4px] border-qart-border bg-qart-accent text-2xl font-black text-qart-text-on-accent shadow-[8px_8px_0_var(--qart-border)]',
  form: 'flex flex-col gap-8',
  formSection: 'grid gap-5',
  formGrid: 'grid gap-8',
  formSections: 'contents',
  formSectionHeader:
    'mb-4 flex items-end justify-between gap-4 border-b border-qart-border-subtle pb-3',
  formSectionEyebrow: 'text-[10px] font-black uppercase tracking-[0.18em] text-qart-text-muted',
  formSectionTitle: 'text-xl font-black uppercase tracking-tight text-qart-primary',
  submitButton:
    'mt-2 flex w-full items-center justify-between gap-4 border-[5px] border-qart-border bg-qart-accent px-6 py-5 text-left text-base font-black uppercase tracking-[0.22em] text-qart-text-on-accent shadow-[16px_16px_0_var(--qart-border)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-x-1.5 hover:-translate-y-1.5 hover:bg-qart-accent-hover hover:shadow-[22px_22px_0_var(--qart-border)] hover:[box-shadow:22px_22px_0_var(--qart-border),0_0_32px_var(--color-primary-glow)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:bg-qart-accent disabled:hover:shadow-[16px_16px_0_var(--qart-border)]',
  metaRow: 'mt-auto flex flex-col gap-4 border-t-2 border-qart-border-subtle pt-8',
  footnote: 'text-xs font-bold uppercase tracking-[0.14em] text-qart-text-muted',
  switch: 'text-sm font-black uppercase tracking-[0.14em] text-qart-text-muted',
  inlineLink:
    'cursor-pointer border-b-2 border-qart-accent px-1 text-qart-accent transition-all duration-200 hover:bg-qart-accent hover:text-qart-text-on-accent hover:shadow-[0_2px_0_var(--qart-accent)]',
  alert:
    'grid gap-3 border-[4px] border-qart-border bg-qart-error p-5 text-white shadow-[12px_12px_0_var(--qart-border)]',
  contextPanel: 'relative grid gap-4 border-2 border-qart-border bg-qart-surface/95 p-5 shadow-[6px_6px_0_var(--qart-border)] backdrop-blur-sm',
  contextKicker: 'text-[10px] font-black uppercase tracking-[0.24em] text-qart-text-muted',
  contextHeader:
    'flex flex-wrap items-center justify-between gap-3 border-b border-qart-border-subtle pb-3',
  contextTitle: 'text-xl font-black uppercase tracking-tight text-qart-primary',
  contextBadge:
    'border border-qart-accent bg-qart-accent px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-on-accent',
  contextScroll: 'max-h-[16rem] overflow-auto pr-1',
  contextRules: 'grid gap-2',
  contextRule:
    'border-l-4 border-qart-accent bg-qart-bg-warm px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-qart-primary',
  qrPanel: 'border-2 border-qart-border bg-qart-surface p-5 shadow-sharp',
  qrContent: 'grid gap-5',
  qrHeader: 'grid gap-1.5',
  qrTitle: 'text-lg font-black uppercase tracking-tight text-qart-primary',
  qrSubtitle: 'text-sm text-qart-text-muted',
  qrCanvas:
    'flex min-h-[220px] items-center justify-center border-2 border-dashed border-qart-border bg-qart-bg-warm p-4',
  qrPlaceholder:
    'flex min-h-[180px] flex-col items-center justify-center gap-3 text-qart-text-muted',
  qrPlaceholderExpired: 'text-qart-warning',
  qrPlaceholderError: 'text-qart-error',
  qrSpinner: 'size-10 animate-spin rounded-full border-2 border-qart-border border-t-qart-accent',
  qrWrap: 'relative flex flex-col items-center justify-center gap-4',
  qrFrame: 'border-[3px] border-qart-border bg-white p-3 shadow-sharp',
  qrRing: 'pointer-events-none absolute -inset-3',
  qrRingProgress: '[transition:stroke-dasharray_0.5s_linear,stroke_0.4s_ease]',
  qrTimer:
    'border border-qart-border bg-qart-surface px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-qart-primary',
  qrStateLabel: 'text-xs font-black uppercase tracking-[0.14em]',
  qrRefresh:
    'inline-flex items-center justify-center border-2 border-qart-border bg-qart-surface px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-qart-primary transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-qart-accent hover:text-qart-accent hover:shadow-sharp',
  qrSteps:
    'grid gap-2 border-t border-qart-border-subtle pt-4 text-xs font-bold uppercase tracking-[0.08em] text-qart-text-muted',
} as const;
