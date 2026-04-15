/**
 * @file customer.ts
 * @module Frontend
 * @description Estilos centralizados para la experiencia customer y el explorador de platos.
 */
import { cva } from 'class-variance-authority';

export const customerListItemStyles = cva(
  'grid w-full gap-4 border-2 p-4 text-left transition-all duration-200',
  {
    variants: {
      active: {
        true: 'border-qart-accent bg-qart-accent-soft shadow-sharp',
        false:
          'border-qart-border bg-qart-surface hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-qart-accent hover:shadow-sharp',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const customerSectionStyles = cva(
  'grid gap-5 border-2 border-qart-primary bg-qart-surface p-5 shadow-[10px_10px_0_var(--qart-primary)]',
  {
    variants: {
      tone: {
        default: '',
        subtle: 'border-qart-border bg-qart-surface shadow-sharp',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

export const customerStyles = {
  page: 'min-h-screen bg-qart-bg px-4 pb-16 pt-28 md:px-6',
  shell: 'mx-auto flex max-w-[1500px] flex-col gap-8',
  hero: 'grid gap-6 border-2 border-qart-primary bg-qart-surface p-6 shadow-[12px_12px_0_var(--qart-primary)] lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] lg:items-end',
  heroCopy: 'space-y-4',
  heroKicker: 'text-[0.72rem] font-black uppercase tracking-[0.22em] text-qart-accent',
  heroTitle: 'text-4xl font-black uppercase tracking-tight text-qart-primary md:text-6xl',
  heroLead: 'max-w-3xl text-sm font-semibold leading-relaxed text-qart-text-muted md:text-base',
  heroLinks: 'flex flex-wrap items-center gap-3',
  heroLinksLabel: 'text-[0.65rem] font-black uppercase tracking-[0.14em] text-qart-text-muted',
  heroStats: 'grid gap-4 sm:grid-cols-3 lg:grid-cols-1',
  summaryGrid: 'grid gap-4 md:grid-cols-3',
  summaryCard: 'grid gap-2 border border-qart-border bg-qart-bg-warm p-4',
  summaryLabel: 'text-[0.65rem] font-black uppercase tracking-[0.16em] text-qart-text-muted',
  summaryValue: 'text-2xl font-black uppercase tracking-tight text-qart-primary',
  summaryText: 'text-sm font-semibold leading-relaxed text-qart-text-muted',
  quickLink:
    'inline-flex items-center justify-center border-2 border-qart-border bg-qart-surface px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.16em] text-qart-primary transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-qart-accent hover:text-qart-accent hover:shadow-sharp',
  filters: 'grid gap-5 border-2 border-qart-border bg-qart-surface p-5 shadow-sharp',
  filtersHeader: 'flex flex-col gap-3 md:flex-row md:items-end md:justify-between',
  filtersTitle: 'text-2xl font-black uppercase tracking-tight text-qart-primary',
  filtersSubtitle: 'text-sm font-semibold leading-relaxed text-qart-text-muted',
  filtersGrid: 'grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]',
  searchField: 'grid gap-2',
  fieldLabel: 'text-[0.68rem] font-black uppercase tracking-[0.16em] text-qart-text-muted',
  searchInput:
    'w-full border-2 border-qart-border bg-qart-surface-sunken px-4 py-3 text-sm font-semibold text-qart-text outline-none transition-all placeholder:text-qart-text-subtle focus:-translate-x-0.5 focus:-translate-y-0.5 focus:border-qart-accent focus:bg-qart-surface focus:shadow-sharp',
  toggleRow:
    'flex items-center gap-4 border-2 border-qart-border bg-qart-bg-warm px-4 py-3 transition-colors hover:border-qart-accent',
  toggleInput: 'size-5 accent-qart-accent',
  toggleLabel: 'text-[0.72rem] font-black uppercase tracking-[0.14em] text-qart-primary',
  filtersMeta:
    'inline-flex w-fit border border-qart-border bg-qart-surface px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.14em] text-qart-text-muted',
  stateCard: 'grid gap-2 border-2 border-qart-border bg-qart-surface p-6 text-center shadow-sharp',
  stateTitle: 'text-xl font-black uppercase tracking-tight text-qart-primary',
  stateCopy: 'text-sm font-semibold leading-relaxed text-qart-text-muted',
  workspace: 'grid gap-6 xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)]',
  sectionHeader: 'flex flex-col gap-2 border-b border-qart-border-subtle pb-4',
  sectionKicker: 'text-[0.68rem] font-black uppercase tracking-[0.16em] text-qart-accent',
  sectionTitle: 'text-2xl font-black uppercase tracking-tight text-qart-primary',
  sectionCopy: 'text-sm font-semibold leading-relaxed text-qart-text-muted',
  list: 'grid gap-4',
  listMeta: 'flex flex-wrap items-center gap-2',
  listMetaDivider: 'text-qart-text-subtle',
  listDescription: 'text-sm font-medium leading-relaxed text-qart-text-muted',
  ingredientRow: 'flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold text-qart-primary',
  ingredientPill:
    'inline-flex items-center border border-qart-border bg-qart-bg-warm px-2 py-1 text-[0.68rem] font-black uppercase tracking-[0.08em] text-qart-primary',
  listEmpty: 'text-sm font-semibold leading-relaxed text-qart-text-muted',
  listButtonTitle: 'text-lg font-black uppercase tracking-tight text-qart-primary',
  listButtonTop: 'flex items-start justify-between gap-4',
  listButtonBody: 'grid gap-3',
  listRating: 'flex items-center gap-2',
  detailsStack: 'grid gap-6',
  detailsHeader: 'grid gap-3 border-b border-qart-border-subtle pb-4',
  detailsEyebrow: 'text-[0.68rem] font-black uppercase tracking-[0.16em] text-qart-accent',
  detailsTitle: 'text-3xl font-black uppercase tracking-tight text-qart-primary',
  detailsLead: 'text-sm font-semibold leading-relaxed text-qart-text-muted',
  detailsSection: 'grid gap-4 border-b border-qart-border-subtle pb-5 last:border-b-0',
  detailsSectionTitle:
    'flex items-center gap-2 text-lg font-black uppercase tracking-tight text-qart-primary',
  detailsSubTitle:
    'flex items-center gap-2 text-[0.82rem] font-black uppercase tracking-[0.14em] text-qart-text-muted',
  dataList: 'grid gap-3 sm:grid-cols-2',
  taggedList: 'grid gap-2',
  orderedList: 'grid gap-4',
  orderedItem: 'grid gap-3 border border-qart-border bg-qart-bg-warm p-4',
  orderedHead:
    'flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-qart-primary',
  bodyText: 'text-sm leading-relaxed text-qart-text-muted',
  reviewList: 'grid gap-4',
  reviewItem: 'grid gap-3 border border-qart-border bg-qart-bg-warm p-4',
  reviewText: 'text-sm leading-relaxed text-qart-text-muted',
  dataPoint:
    'inline-flex flex-wrap items-center gap-1 text-sm font-medium leading-relaxed text-qart-primary',
  dataPointStrong: 'font-black uppercase tracking-[0.05em] text-qart-primary',
  inlineIcon: 'mr-[7px] inline-block align-text-bottom text-qart-accent',
  detailIcon: 'mr-[7px] inline-block align-text-bottom text-qart-accent',
  sectionIcon: 'size-5 text-qart-accent',
  starRating: 'text-qart-primary',
  difficultyInline: 'mr-[7px] inline-block align-text-bottom',
  helperPill:
    'inline-flex items-center border border-qart-border bg-qart-surface px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em] text-qart-text-muted',
} as const;
