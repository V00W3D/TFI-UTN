/**
 * @file search.ts
 * @module Frontend
 * @description Estilos centralizados para la experiencia de búsqueda y filtrado.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-19
 * rnf: RNF-03, RNF-05
 *
 * @business
 * inputs: layout del buscador, controles de filtro y estados de listado
 * outputs: clases reutilizables para vistas y filtros del módulo Search
 * rules: preservar una estructura consistente y evitar clases inline repetidas
 *
 * @technical
 * dependencies: class-variance-authority
 * flow: centraliza el layout de la vista; define estilos de secciones y controles; expone variantes para toggles de filtros.
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-SEARCH-UI-01
 *
 * @notes
 * decisions: se simplifican los controles legacy hacia una base Tailwind estática y predecible
 */
import { cva } from 'class-variance-authority';

export const searchStyles = {
  shell: 'grid min-h-screen gap-0 pt-[calc(4rem+3px)] lg:grid-cols-[17.5rem_minmax(0,1fr)]',
  aside:
    'relative border-b-[3px] border-qart-border bg-qart-surface lg:sticky lg:top-[calc(4rem+3px)] lg:max-h-[calc(100vh-4rem-3px)] lg:self-start lg:overflow-y-auto lg:border-b-0 lg:border-r-[3px] [&::-webkit-scrollbar]:hidden [scrollbar-width:none]',
  main: 'bg-qart-bg px-[1.15rem] pb-10 pt-[1.15rem]',
  header: 'mb-4 max-w-[40rem]',
  headerRow: 'mb-3',
  backLink:
    'inline-flex items-center gap-2 border-2 border-qart-border-soft bg-qart-surface/70 px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.16em] text-qart-text-muted transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-qart-accent hover:bg-qart-surface hover:text-qart-accent hover:shadow-[4px_4px_0_color-mix(in_srgb,var(--qart-accent)_20%,transparent)]',
  title:
    'font-display text-[1.65rem] font-black uppercase leading-none tracking-tight text-qart-primary',
  lead: 'mb-4 mt-2 text-sm font-semibold leading-relaxed text-qart-text-muted',
  barWrap:
    'mb-3 flex items-center border-2 border-qart-border bg-qart-surface shadow-sharp transition-colors focus-within:border-qart-accent',
  barIcon: 'ml-3 size-[1.1rem] shrink-0 text-qart-text-muted',
  barInput:
    'min-w-0 flex-1 border-none bg-transparent px-3 py-3 text-sm text-qart-text outline-none placeholder:text-qart-text-subtle',
  resultsGrid: 'grid grid-cols-[repeat(auto-fit,minmax(15.5rem,1fr))] gap-4',
  stateText: 'p-4 text-sm font-black uppercase tracking-widest text-qart-primary',
  filtersRoot: 'w-full',
  filtersHead:
    'flex items-center justify-between border-b-[3px] border-qart-border bg-qart-accent px-4 py-3',
  filtersHeading:
    'font-display text-[0.85rem] font-black uppercase tracking-[0.25em] text-qart-text-on-accent',
  filtersClear:
    'border-2 border-qart-border bg-qart-surface px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.1em] text-qart-text shadow-[2px_2px_0_var(--qart-border)] transition-all hover:bg-qart-bg-warm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
  section: 'border-b-2 border-qart-border',
  sectionTitle:
    'flex w-full items-center gap-3 bg-transparent px-4 py-3 text-left text-[0.72rem] font-black uppercase tracking-[0.1em] text-qart-primary transition-colors hover:bg-qart-bg-warm',
  sectionMarker: 'min-h-[1.25rem] w-[0.35rem] shrink-0 bg-qart-accent',
  sectionBody: 'grid gap-3 px-4 pb-4',
  field: 'grid gap-1.5',
  fieldLabel: 'text-[0.62rem] font-bold uppercase tracking-[0.08em] text-qart-text-muted',
  fieldInput:
    'w-full border-2 border-qart-border bg-[color-mix(in_srgb,var(--qart-bg-warm)_50%,var(--qart-surface))] px-3 py-2 text-sm font-semibold text-qart-text transition-all outline-none placeholder:text-qart-text-subtle focus:-translate-x-0.5 focus:-translate-y-0.5 focus:border-qart-accent focus:bg-qart-surface focus:shadow-[4px_4px_0_var(--qart-accent-soft)]',
  fieldRow: 'grid grid-cols-2 gap-2',
  optionList: 'flex flex-col gap-1.5',
  checkboxLabel:
    'flex cursor-pointer items-center gap-2 rounded-none border border-transparent px-2 py-1.5 text-[0.78rem] font-bold uppercase tracking-[0.05em] text-qart-text-muted transition-all hover:border-qart-border-soft hover:bg-qart-accent/10 hover:text-qart-text',
  checkboxInput: 'size-4 shrink-0 accent-qart-accent',
  selectWrap: 'relative',
  select:
    'w-full appearance-none border-2 border-qart-border bg-[color-mix(in_srgb,var(--qart-bg-warm)_50%,var(--qart-surface))] px-3 py-2 pr-10 text-sm font-semibold text-qart-text outline-none transition-all focus:-translate-x-0.5 focus:-translate-y-0.5 focus:border-qart-accent focus:bg-qart-surface focus:shadow-[4px_4px_0_var(--qart-accent-soft)]',
  selectArrow:
    'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-qart-text-muted',
} as const;

export const searchPaginationButtonStyles = cva(
  'inline-flex items-center justify-center border-2 border-qart-border bg-qart-surface px-3 py-2 text-[0.7rem] font-black uppercase tracking-[0.1em] text-qart-primary transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-qart-accent hover:text-qart-accent hover:shadow-[3px_3px_0_var(--qart-border)]',
  {
    variants: {
      active: {
        true: 'bg-qart-accent text-qart-text-on-accent shadow-[3px_3px_0_var(--qart-border)] hover:text-qart-text-on-accent',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);
