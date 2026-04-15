/**
 * @file plateCard.ts
 * @module Frontend
 * @description Estilos centralizados para cards de platos y modales de detalle.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-18, RF-19
 * rnf: RNF-03, RNF-05
 *
 * @business
 * inputs: cards compactas, cards destacadas y vistas modales de nutrición, receta y reseñas
 * outputs: clases reutilizables y variantes estáticas para todo el flujo de platos
 * rules: sostener consistencia visual entre listado, destacados y overlays sin depender de CSS legacy
 *
 * @technical
 * dependencies: class-variance-authority
 * flow: define bases visuales para cards; centraliza la estructura de modales; expone variantes para tonos, chips y estados interactivos.
 *
 * @estimation
 * complexity: High
 * fpa: EQ
 * story_points: 8
 * estimated_hours: 5
 *
 * @testing
 * cases: TC-PLATES-UI-01
 *
 * @notes
 * decisions: se simplifica parte del detalle visual previo para privilegiar un sistema reutilizable y seguro para generación asistida
 */
import { cva } from 'class-variance-authority';

export const featuredChipStyles = cva(
  'inline-flex items-center border px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.08em]',
  {
    variants: {
      tone: {
        default: 'border-qart-border bg-qart-surface-sunken text-qart-primary',
        accent: 'border-qart-accent bg-qart-accent text-qart-text-on-accent',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

export const plateModalPanelStyles = cva(
  'flex max-h-[90vh] w-full flex-col overflow-hidden border-[4px] border-qart-border bg-qart-surface shadow-[12px_12px_0_var(--qart-border)]',
  {
    variants: {
      kind: {
        nutrition: 'max-w-[1100px]',
        recipe: 'max-w-[1040px]',
        reviews: 'max-w-[820px]',
      },
    },
    defaultVariants: {
      kind: 'nutrition',
    },
  },
);

export const plateModalMediaStyles = cva(
  'relative min-h-[260px] overflow-hidden border-2 border-qart-border bg-qart-bg-warm',
  {
    variants: {
      withImage: {
        true: 'bg-qart-surface',
        false: 'flex items-center justify-center',
      },
    },
    defaultVariants: {
      withImage: false,
    },
  },
);

export const reviewStarButtonStyles = cva(
  'inline-flex size-10 items-center justify-center border-2 text-xl transition-all duration-200',
  {
    variants: {
      active: {
        true: 'border-qart-accent bg-qart-accent text-qart-text-on-accent shadow-[3px_3px_0_var(--qart-border)]',
        false:
          'border-qart-border bg-qart-surface text-qart-text-muted hover:border-qart-accent hover:text-qart-accent',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const insightToneStyles = {
  benefit:
    'border-qart-insight-benefit-border bg-qart-insight-benefit-bg text-qart-insight-benefit',
  balanced:
    'border-qart-insight-balanced-border bg-qart-insight-balanced-bg text-qart-insight-balanced',
  caution:
    'border-qart-insight-caution-border bg-qart-insight-caution-bg text-qart-insight-caution',
  danger: 'border-qart-insight-danger-border bg-qart-insight-danger-bg text-qart-insight-danger',
} as const;

export const plateCardStyles = {
  compactCard:
    'flex h-full flex-col overflow-hidden border-2 border-qart-border bg-qart-surface transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-qart-accent hover:shadow-sharp',
  compactMedia:
    'relative aspect-[4/3] overflow-hidden border-b-2 border-qart-border bg-qart-bg-warm',
  compactMediaImage: 'h-full w-full object-cover',
  compactMediaFallback: 'h-full w-full bg-qart-bg-warm',
  compactBody: 'flex flex-1 flex-col gap-3 p-4',
  compactMeta: 'text-[0.58rem] font-black uppercase tracking-[0.14em] text-qart-text-subtle',
  compactTitle: 'text-base font-black uppercase tracking-tight text-qart-primary',
  compactRating: 'flex items-center gap-2',
  compactRatingValue: 'text-[0.7rem] font-black text-qart-primary',
  compactPrice: 'text-xl font-black text-qart-accent',
  compactActions: 'mt-auto flex flex-wrap gap-2',
  iconButton:
    'inline-flex size-10 items-center justify-center border-2 border-qart-border bg-qart-surface text-qart-text transition-all hover:border-qart-accent hover:text-qart-accent',
  addButton:
    'inline-flex min-h-10 flex-1 items-center justify-center gap-2 border-2 border-qart-accent bg-qart-accent px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.14em] text-qart-text-on-accent transition-all hover:bg-qart-accent-hover hover:border-qart-accent-hover disabled:cursor-not-allowed disabled:opacity-50',
  featuredCard:
    'flex h-full flex-col overflow-hidden border-2 border-qart-border bg-qart-surface transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:border-qart-accent hover:shadow-sharp',
  featuredMedia:
    'relative aspect-[5/4] overflow-hidden border-b-2 border-qart-border bg-qart-bg-warm',
  featuredMediaImage: 'absolute inset-0 h-full w-full object-cover',
  featuredMediaOverlay:
    'pointer-events-none absolute inset-0 bg-gradient-to-b from-qart-primary/10 via-transparent to-qart-surface/70',
  featuredMediaBadge:
    'absolute left-3 top-3 z-10 border-2 border-qart-border bg-qart-primary px-3 py-1 text-[0.64rem] font-black uppercase tracking-[0.14em] text-qart-text-on-primary shadow-[4px_4px_0_var(--qart-border)]',
  featuredMediaCopy: 'absolute bottom-3 right-3 flex items-end gap-2',
  featuredMediaSymbol:
    'inline-flex h-11 w-11 items-center justify-center border-2 border-qart-border bg-qart-surface/90 text-qart-primary shadow-[3px_3px_0_var(--qart-border)] backdrop-blur-sm',
  featuredMediaDifficulty:
    'inline-flex items-center justify-center border-2 border-qart-border bg-qart-surface/90 px-3 py-2 text-qart-primary shadow-[3px_3px_0_var(--qart-border)] backdrop-blur-sm',
  featuredMediaSignature:
    'absolute bottom-3 left-3 grid gap-1 border-2 border-qart-border bg-qart-surface/90 px-3 py-2 shadow-[4px_4px_0_var(--qart-border)] backdrop-blur-sm',
  featuredMediaSignatureLabel:
    'text-[0.55rem] font-black uppercase tracking-[0.18em] text-qart-text-muted',
  featuredFloatingActions: 'absolute right-3 top-3 z-20 flex flex-col gap-2',
  featuredContent: 'flex flex-1 flex-col gap-4 p-4',
  featuredTopLine: 'flex flex-wrap items-start justify-between gap-3',
  featuredChips: 'flex flex-wrap gap-2',
  featuredRatingPill: 'grid gap-1 border border-qart-border bg-qart-bg-warm px-3 py-2',
  featuredRatingMeta: 'flex items-center gap-1 text-xs font-black uppercase text-qart-primary',
  featuredCopy: 'space-y-2',
  featuredTitle: 'text-[1.35rem] font-black uppercase tracking-tight text-qart-primary',
  featuredDescription: 'text-sm leading-relaxed text-qart-text-muted',
  featuredStory: 'border border-qart-border-subtle bg-qart-bg-warm p-3',
  featuredQuote: 'text-sm font-semibold italic leading-relaxed text-qart-primary',
  featuredFooter:
    'mt-auto flex flex-wrap items-end justify-between gap-4 border-t-2 border-qart-border-subtle pt-4',
  featuredPriceLabel:
    'block text-[0.6rem] font-black uppercase tracking-[0.14em] text-qart-text-subtle',
  featuredPriceValue: 'text-[1.5rem] font-black text-qart-accent',
  quantityControl: 'flex border-2 border-qart-border',
  quantityButton:
    'inline-flex h-10 w-10 items-center justify-center bg-qart-surface text-lg font-black text-qart-primary transition-colors hover:bg-qart-accent hover:text-qart-text-on-accent',
  quantityInput:
    'h-10 w-12 border-x-2 border-qart-border bg-qart-surface-sunken text-center text-sm font-black text-qart-primary outline-none',
  featuredAddButton:
    'mt-2 inline-flex h-12 w-full items-center justify-center gap-2 border-2 border-qart-primary bg-qart-primary px-4 text-sm font-black uppercase tracking-[0.14em] text-white transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-qart-accent hover:bg-qart-accent hover:shadow-sharp disabled:cursor-not-allowed disabled:opacity-50',
  modalOverlay:
    'fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4 backdrop-blur-md',
  modalHeader:
    'flex flex-col gap-4 border-b-2 border-qart-border px-5 py-5 md:flex-row md:items-start md:justify-between md:px-6',
  modalIdentity: 'space-y-2',
  modalKicker: 'text-[0.68rem] font-black uppercase tracking-[0.22em] text-qart-accent',
  modalTitle: 'text-3xl font-black uppercase tracking-tight text-qart-primary',
  modalDescription: 'max-w-2xl text-sm leading-relaxed text-qart-text-muted',
  modalMeta: 'flex flex-wrap gap-2',
  closeButton:
    'inline-flex items-center justify-center border-2 border-qart-border bg-qart-surface px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-qart-primary transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-qart-accent hover:text-qart-accent hover:shadow-sharp',
  modalScroll: 'overflow-y-auto px-5 py-5 md:px-6',
  modalSection: 'border-b border-qart-border-subtle py-5 last:border-b-0',
  modalHero: 'grid gap-5 lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.05fr)]',
  modalMediaImage: 'absolute inset-0 h-full w-full object-cover',
  modalMediaFallback:
    'flex h-full min-h-[260px] flex-col items-center justify-center gap-3 text-qart-primary',
  modalMediaFallbackIcon: 'size-12',
  modalHeroPanel: 'space-y-4',
  sectionHeading:
    'flex flex-col gap-3 border-b border-qart-border-subtle pb-4 md:flex-row md:items-end md:justify-between',
  sectionHeadingBody: 'space-y-1.5',
  sectionHeadingTitle: 'text-2xl font-black uppercase tracking-tight text-qart-primary',
  sectionHeadingMeta: 'text-[0.68rem] font-black uppercase tracking-[0.18em] text-qart-text-muted',
  modalHeroMeta: 'grid gap-3 sm:grid-cols-2 xl:grid-cols-4',
  metricCard: 'grid gap-2 border border-qart-border bg-qart-bg-warm p-3',
  metricLabel: 'text-[0.62rem] font-black uppercase tracking-[0.14em] text-qart-text-muted',
  metricValue: 'text-base font-black uppercase tracking-tight text-qart-primary',
  metricValueIcon: 'flex items-center',
  metricValueStack: 'grid gap-2',
  modalDifficulty: 'h-5 w-12',
  stack: 'grid gap-3',
  note: 'text-sm leading-relaxed text-qart-text-muted',
  chipRow: 'flex flex-wrap gap-2',
  nutritionHeroGrid: 'grid gap-3 xl:grid-cols-2',
  nutritionHeroCard: 'grid gap-3 border-2 p-4',
  nutritionHeroHead: 'flex items-center justify-between gap-3',
  nutritionIconBox:
    'inline-flex size-10 items-center justify-center border border-current/30 bg-white/60 text-current',
  nutritionHeroIcon: 'size-5',
  nutritionTone: 'text-[0.68rem] font-black uppercase tracking-[0.16em]',
  nutritionHeroCopy: 'grid gap-1',
  nutritionHeroCopySecondary: 'opacity-80',
  totalGrid: 'grid gap-3 md:grid-cols-2 xl:grid-cols-3',
  totalCard: 'grid gap-2 border-2 p-4',
  totalCardHead: 'flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em]',
  totalCardIcon: 'size-5',
  referenceTableShell: 'overflow-x-auto border-2 border-qart-border',
  referenceTable:
    'min-w-[720px] w-full border-collapse bg-qart-surface text-sm [&_th]:border-b [&_th]:border-qart-border [&_th]:bg-qart-bg-warm [&_th]:px-3 [&_th]:py-3 [&_th]:text-left [&_th]:text-[0.68rem] [&_th]:font-black [&_th]:uppercase [&_th]:tracking-[0.14em] [&_th]:text-qart-primary [&_td]:border-b [&_td]:border-qart-border-subtle [&_td]:px-3 [&_td]:py-3 [&_td]:align-top',
  referenceMetric: 'flex items-start gap-3',
  referenceIcon: 'size-5',
  referenceSource:
    'inline-flex w-fit border border-qart-border bg-qart-bg-warm px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em] text-qart-primary',
  referenceNotes: 'mt-4 grid gap-2',
  recipeIngredientGrid: 'grid gap-3 md:grid-cols-2',
  recipeCard: 'grid gap-3 border-2 border-qart-border bg-qart-surface p-4',
  recipeCardHead: 'flex items-start gap-3',
  recipeIconBox:
    'inline-flex size-11 shrink-0 items-center justify-center border border-qart-border bg-qart-bg-warm text-qart-accent',
  recipeIcon: 'size-5',
  subcardEyebrow: 'text-[0.62rem] font-black uppercase tracking-[0.14em] text-qart-text-muted',
  recipeIngredientMeta: 'grid gap-2 sm:grid-cols-2',
  recipePill:
    'flex items-center justify-between gap-3 border border-qart-border bg-qart-bg-warm px-3 py-2 text-xs font-bold uppercase tracking-[0.06em] text-qart-primary',
  recipeStepList: 'grid gap-3',
  recipeStepCard: 'grid gap-3 border-2 border-qart-border bg-qart-surface p-4',
  recipeStepHead: 'flex items-start gap-3',
  recipeStepNumber:
    'inline-flex size-9 shrink-0 items-center justify-center border-2 border-qart-border bg-qart-accent text-sm font-black text-qart-text-on-accent shadow-[3px_3px_0_var(--qart-border)]',
  reviewsHeader: 'border-b-2 border-qart-border',
  reviewsClose:
    'inline-flex size-10 items-center justify-center border-2 border-qart-border bg-qart-surface text-lg font-black text-qart-primary transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-qart-accent hover:text-qart-accent hover:shadow-sharp',
  reviewsBody: 'flex flex-col gap-5 p-5 md:p-6',
  reviewsThread: 'grid gap-4',
  reviewsThreadEmpty:
    'border-2 border-dashed border-qart-border bg-qart-bg-warm px-4 py-6 text-center text-sm font-medium text-qart-text-muted',
  reviewsThreadItem: 'flex gap-3 border-b border-qart-border-subtle pb-4 last:border-b-0',
  reviewsAvatarWrap: 'shrink-0',
  reviewsAvatar: 'size-11 rounded-none border-2 border-qart-border object-cover',
  reviewsAvatarPlaceholder:
    'flex size-11 items-center justify-center border-2 border-qart-border bg-qart-bg-warm text-sm font-black uppercase text-qart-primary',
  reviewsMain: 'min-w-0 flex-1',
  reviewsTop: 'flex flex-wrap items-center justify-between gap-2',
  reviewsName: 'text-sm font-black uppercase tracking-[0.08em] text-qart-primary',
  reviewsTime: 'text-[0.68rem] font-bold uppercase tracking-[0.12em] text-qart-text-muted',
  reviewsText: 'mt-2 text-sm leading-relaxed text-qart-text',
  reviewsEmptyComment: 'mt-2 text-sm italic text-qart-text-muted',
  reviewsRec:
    'mt-2 inline-flex border border-qart-border bg-qart-bg-warm px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em] text-qart-primary',
  reviewsFooter: 'border-t border-qart-border-subtle pt-4',
  reviewsGate: 'grid gap-4 border-2 border-qart-border bg-qart-bg-warm p-5',
  reviewsBack:
    'inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-qart-primary transition-colors hover:text-qart-accent',
  reviewsGateIcon:
    'flex size-12 items-center justify-center border-2 border-qart-border bg-qart-surface text-qart-accent',
  reviewsGateIconWarm:
    'flex size-12 items-center justify-center border-2 border-qart-border bg-qart-accent-warm text-qart-primary',
  reviewsGateIconDot: 'size-4 bg-current',
  reviewsGateTitle: 'text-xl font-black uppercase tracking-tight text-qart-primary',
  reviewsGateLead: 'text-sm leading-relaxed text-qart-text-muted',
  reviewsGateList: 'list-disc space-y-2 pl-5 text-sm leading-relaxed text-qart-text',
  reviewsGateActions: 'flex flex-wrap gap-3',
  reviewsCompose: 'grid gap-4',
  reviewsComposeHint: 'text-sm font-medium text-qart-text-muted',
  reviewsComposeStars: 'flex flex-wrap items-center gap-2',
  reviewsStarLabel: 'ml-1 text-sm font-black uppercase tracking-[0.08em] text-qart-primary',
  reviewsComposeField: 'grid gap-2',
  reviewsComposeFieldLabel:
    'text-[0.68rem] font-black uppercase tracking-[0.16em] text-qart-text-muted',
  reviewsComposeTextarea:
    'min-h-[120px] w-full border-2 border-qart-border bg-qart-surface px-3 py-3 text-sm text-qart-text outline-none transition-all placeholder:text-qart-text-subtle focus:border-qart-accent focus:shadow-[4px_4px_0_var(--qart-accent-soft)]',
  reviewsComposeCheck: 'flex items-center gap-3 text-sm font-bold text-qart-primary',
  reviewsComposeError: 'text-sm font-bold text-qart-error',
} as const;
