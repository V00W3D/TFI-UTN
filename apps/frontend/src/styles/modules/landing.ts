/**
 * @file landing.ts
 * @module Frontend
 * @description Estilos centralizados para layout, destacados y panel de orden de la landing.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-18, RF-19
 * rnf: RNF-03, RNF-05
 *
 * @business
 * inputs: layout landing, spotlight comercial, paginación y panel lateral de pedidos
 * outputs: clases reutilizables para las superficies más visibles del sitio público
 * rules: evitar CSS legacy y alinear cards, acciones y estados bajo un sistema centralizado
 *
 * @technical
 * dependencies: class-variance-authority
 * flow: define contenedores del landing; expone variantes para tabs y pills; centraliza tarjetas spotlight y panel de orden.
 *
 * @estimation
 * complexity: High
 * fpa: EQ
 * story_points: 8
 * estimated_hours: 5
 *
 * @testing
 * cases: TC-LANDING-UI-01
 *
 * @notes
 * decisions: se normalizan las zonas públicas más complejas para que el sistema de estilos sea reutilizable por componentes futuros
 */
import { cva } from 'class-variance-authority';
import { buttonStyles } from '@/styles/components/button';

export const featuredPaginationPageStyles = cva(
  'inline-flex min-h-10 min-w-10 items-center justify-center border-2 border-qart-border bg-qart-surface px-3 py-2 text-sm font-black uppercase tracking-[0.08em] text-qart-primary transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-qart-accent hover:text-qart-accent hover:shadow-sharp cursor-pointer',
  {
    variants: {
      active: {
        true: 'border-qart-accent bg-qart-accent text-qart-text-on-accent shadow-sharp hover:text-qart-text-on-accent',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const orderPanelTabStyles = cva(
  'inline-flex flex-1 items-center justify-center gap-2 bg-qart-surface px-3 py-4 text-[0.68rem] font-black uppercase tracking-[0.1em] text-qart-text-muted transition-all cursor-pointer',
  {
    variants: {
      active: {
        true: 'border-b-[3px] border-qart-accent bg-qart-accent-soft text-qart-accent',
        false: 'border-b-[3px] border-transparent hover:bg-qart-bg-warm hover:text-qart-primary',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const orderHistoryStatusStyles = cva(
  'inline-flex border px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em]',
  {
    variants: {
      status: {
        pending: 'border-qart-warning-border bg-qart-warning-bg text-qart-warning',
        completed: 'border-qart-success-border bg-qart-success-bg text-qart-success',
      },
    },
    defaultVariants: {
      status: 'pending',
    },
  },
);

export const orderCheckoutActionStyles = cva('w-full justify-center uppercase tracking-widest', {
  variants: {
    tone: {
      primary: buttonStyles({ variant: 'primary', size: 'md' }),
      secondary: buttonStyles({ variant: 'secondary', size: 'md' }),
    },
    spacing: {
      review: 'mt-4',
      back: 'mt-3 py-3 text-xs',
      done: 'mt-5',
    },
  },
  defaultVariants: {
    tone: 'primary',
    spacing: 'review',
  },
});

export const orderCheckoutFulfillmentButtonStyles = cva(
  'flex min-h-[5rem] w-full items-start justify-start border-2 border-qart-border bg-qart-surface px-4 py-4 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      tone: {
        default: 'text-qart-primary hover:border-qart-accent hover:bg-qart-bg-warm',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

export const landingStyles = {
  layout: 'min-h-screen bg-qart-bg',
  featuredPagination:
    'mb-8 grid gap-4 border-2 border-qart-border bg-qart-surface p-4 shadow-sharp lg:grid-cols-[auto_1fr] lg:items-center',
  featuredPaginationStatus:
    'flex flex-col gap-1 text-[0.72rem] font-black uppercase tracking-[0.12em] text-qart-primary',
  featuredPaginationSlider: 'flex flex-col gap-4 md:flex-row md:items-center md:justify-end',
  featuredPaginationPages: 'flex flex-wrap gap-2',
  plateCollection: 'grid gap-6 lg:grid-cols-3',
  spotlightSection: 'border-y-4 border-qart-border bg-qart-bg-warm/40',
  spotlightContainer: 'mx-auto max-w-7xl px-6 py-16 md:py-20',
  spotlightHead: 'max-w-2xl',
  spotlightKicker: 'text-[0.72rem] font-black uppercase tracking-[0.22em] text-qart-accent',
  spotlightTitle:
    'mt-3 text-4xl font-display font-black uppercase tracking-tight text-qart-primary',
  spotlightSub: 'mt-4 text-sm font-semibold leading-relaxed text-qart-text-muted',
  spotlightCtaLink: 'mt-6 inline-flex',
  spotlightLoading: 'text-sm font-bold uppercase tracking-widest text-qart-text-muted',
  spotlightError: 'text-sm font-semibold text-qart-error',
  spotlightGrid: 'mt-10 grid gap-6 lg:grid-cols-3',
  spotlightCard:
    'relative flex h-full flex-col overflow-hidden border-2 border-qart-border bg-qart-surface transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:border-qart-accent hover:shadow-sharp',
  spotlightMedia:
    'relative aspect-[4/3] overflow-hidden border-b-2 border-qart-border bg-qart-bg-warm',
  spotlightMediaImage: 'h-full w-full object-cover',
  spotlightPlaceholder: 'h-full w-full bg-qart-bg-warm',
  spotlightBody: 'flex flex-1 flex-col gap-3 p-4',
  spotlightBadges: 'flex flex-wrap gap-2',
  spotlightBadge:
    'inline-flex items-center gap-2 border border-qart-border bg-qart-surface px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em] text-qart-primary',
  spotlightRatingValue: 'text-[10px] font-black',
  spotlightBadgeSales:
    'inline-flex items-center border border-qart-accent bg-qart-accent px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em] text-qart-text-on-accent',
  spotlightType: 'text-[0.62rem] font-black uppercase tracking-[0.14em] text-qart-text-subtle',
  spotlightName: 'text-[1.15rem] font-black uppercase tracking-tight text-qart-primary',
  spotlightPrice: 'text-[1.15rem] font-black text-qart-accent',
  spotlightMediaActions: 'absolute right-3 top-3 z-20 flex flex-col gap-2',
  spotlightMediaAction:
    'inline-flex size-10 items-center justify-center border border-qart-border bg-qart-surface/90 text-qart-text shadow-[2px_2px_0_var(--qart-border)] transition-all hover:-translate-y-0.5 hover:border-qart-accent hover:text-qart-accent',
  spotlightDataIcon: 'h-[1.2rem] w-[1.2rem]',
  spotlightActions: 'mt-auto flex flex-wrap gap-2 pt-2',
  spotlightGhost:
    'inline-flex min-h-10 flex-1 items-center justify-center gap-2 border-2 border-qart-border bg-transparent px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.14em] text-qart-primary transition-all hover:border-qart-accent hover:text-qart-accent',
  spotlightPrimary:
    'inline-flex min-h-10 flex-[1.3] items-center justify-center gap-2 border-2 border-qart-accent bg-qart-accent px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.14em] text-qart-text-on-accent transition-all hover:border-qart-accent-hover hover:bg-qart-accent-hover',
  spotlightPlus: 'size-[0.85rem]',
  spotlightReviewsIcon: 'size-5 shrink-0',
  spotlightReviewsCount: 'ml-1 text-[10px] font-black uppercase tracking-widest',
  spotlightHint:
    'mt-12 max-w-xl text-center text-xs font-semibold uppercase tracking-wide text-qart-text-subtle',
  orderPanelBackdrop: 'fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm',
  orderPanel:
    'fixed left-0 top-0 z-[80] flex h-full w-full max-w-[420px] flex-col border-r-[3px] border-qart-border bg-qart-surface shadow-[8px_0_0_var(--qart-border)]',
  orderPanelHeader: 'flex items-stretch border-b-[3px] border-qart-border bg-qart-surface',
  orderPanelTabsWrap: 'flex flex-1 border-r-2 border-qart-border',
  orderPanelTabIcon: 'h-3.5 w-3.5 shrink-0',
  orderPanelCountBadge:
    'inline-flex min-w-[1.1rem] items-center justify-center border border-qart-border bg-qart-accent px-1 text-[0.6rem] font-black text-qart-text-on-accent',
  orderPanelClose:
    'inline-flex min-h-[3rem] w-12 items-center justify-center border-l-2 border-qart-border text-qart-text-muted transition-all hover:bg-qart-error-bg hover:text-qart-error',
  orderPanelCloseIcon: 'h-4 w-4',
  orderPanelBody: 'flex-1 overflow-y-auto',
  orderPanelFooter: 'grid gap-4 border-t-[3px] border-qart-border bg-qart-bg-warm p-4',
  orderPanelTotal: 'flex items-end justify-between gap-4',
  orderPanelTotalLabel:
    'text-[0.68rem] font-black uppercase tracking-[0.16em] text-qart-text-muted',
  orderPanelTotalValue: 'text-xl font-black text-qart-accent',
  orderPanelCheckoutButton: 'w-full justify-center',
  orderPanelEmpty: 'flex min-h-[280px] flex-col items-center justify-center gap-3 px-6 text-center',
  orderPanelEmptyIcon: 'size-10 text-qart-accent',
  orderPanelEmptyTitle: 'text-lg font-black uppercase tracking-tight text-qart-primary',
  orderPanelEmptySub: 'text-sm leading-relaxed text-qart-text-muted',
  orderPanelActionsBar:
    'flex items-center justify-between border-b border-qart-border-subtle bg-qart-bg-warm px-4 py-3',
  orderPanelActionsCount:
    'text-[0.65rem] font-black uppercase tracking-[0.12em] text-qart-text-muted',
  orderPanelClear:
    'inline-flex items-center gap-2 border border-qart-border-soft px-3 py-1.5 text-[0.62rem] font-black uppercase tracking-[0.1em] text-qart-text-muted transition-all hover:border-qart-error-border hover:bg-qart-error-bg hover:text-qart-error',
  orderPanelList: 'grid gap-0',
  orderPanelItem:
    'grid gap-3 border-b border-qart-border-subtle px-4 py-4 transition-colors hover:bg-qart-bg-warm/50',
  orderPanelItemHead: 'flex items-start justify-between gap-3',
  orderPanelItemName: 'text-sm font-black uppercase tracking-[0.06em] text-qart-primary',
  orderPanelItemRemove:
    'inline-flex size-7 items-center justify-center border border-qart-border-soft text-qart-text-muted transition-all hover:border-qart-error-border hover:bg-qart-error-bg hover:text-qart-error',
  orderPanelItemFoot: 'flex items-center justify-between gap-3',
  orderPanelQty: 'flex border-2 border-qart-border bg-qart-surface-sunken',
  orderPanelQtyBtn:
    'inline-flex size-8 items-center justify-center text-qart-text-muted transition-all hover:bg-qart-accent hover:text-qart-text-on-accent',
  orderPanelQtyInput:
    'h-8 w-10 border-x border-qart-border-soft bg-transparent text-center text-sm font-black text-qart-primary outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
  orderPanelItemPricing: 'grid justify-items-end gap-0.5',
  orderPanelItemUnit: 'text-[0.65rem] font-semibold text-qart-text-subtle',
  orderPanelItemSubtotal: 'text-sm font-black text-qart-accent',
  orderHistoryList: 'grid gap-4 p-4',
  orderHistoryCard: 'grid gap-3 border-2 border-qart-border bg-qart-surface p-4',
  orderHistoryCardHead: 'flex items-center justify-between gap-3',
  orderHistoryCardDate:
    'text-[0.68rem] font-black uppercase tracking-[0.12em] text-qart-text-muted',
  orderHistoryCardTotal: 'text-sm font-black text-qart-accent',
  orderHistoryCardMeta: 'flex flex-wrap gap-2',
  orderHistoryCardPill:
    'inline-flex border border-qart-border bg-qart-bg-warm px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em] text-qart-primary',
  orderHistoryLines: 'grid gap-2 border-t border-qart-border-subtle pt-3',
  orderHistoryLine: 'flex items-center justify-between gap-3 text-sm text-qart-primary',
  orderHistoryLineName: 'font-medium',
  orderHistoryLineQty: 'font-black text-qart-text-muted',
  orderHistoryLoadingTitle: 'animate-pulse',
  orderHistoryMenuLink: 'mt-6 justify-center',
  orderCheckoutBackdrop: 'fixed inset-0 z-[88] bg-black/50 backdrop-blur-sm',
  orderCheckoutModal:
    'fixed left-1/2 top-1/2 z-[89] flex w-[calc(100%-2rem)] max-w-[34rem] -translate-x-1/2 -translate-y-1/2 flex-col border-[3px] border-qart-border bg-qart-surface shadow-[12px_12px_0_var(--qart-border)]',
  orderCheckoutHead:
    'flex items-center justify-between gap-4 border-b-[3px] border-qart-border bg-qart-bg-warm px-5 py-4',
  orderCheckoutTitle: 'text-lg font-black uppercase tracking-[0.12em] text-qart-primary md:text-xl',
  orderCheckoutClose:
    'inline-flex size-10 items-center justify-center border-2 border-qart-border bg-qart-surface text-sm font-black text-qart-primary transition-all hover:border-qart-error-border hover:bg-qart-error-bg hover:text-qart-error disabled:cursor-not-allowed disabled:opacity-50',
  orderCheckoutBody: 'grid gap-4 p-5',
  orderCheckoutLead: 'text-sm font-medium leading-relaxed text-qart-text-muted',
  orderCheckoutLines: 'grid gap-3 border-2 border-qart-border bg-qart-bg-warm p-4',
  orderCheckoutLine: 'grid gap-1 border-b border-qart-border-soft pb-3 last:border-b-0 last:pb-0',
  orderCheckoutLineName: 'text-sm font-black uppercase tracking-[0.06em] text-qart-primary',
  orderCheckoutLineMeta: 'text-sm text-qart-text-muted',
  orderCheckoutTotalBar:
    'flex items-end justify-between gap-4 border-2 border-qart-accent bg-qart-accent-soft px-4 py-3',
  orderCheckoutTotalLabel:
    'text-[0.68rem] font-black uppercase tracking-[0.14em] text-qart-primary',
  orderCheckoutTotalValue: 'text-xl font-black text-qart-accent',
  orderCheckoutError: 'text-sm font-semibold text-qart-error',
  orderCheckoutFulfillmentGrid: 'grid gap-3 md:grid-cols-3',
  orderCheckoutFulfillmentTitle: 'text-sm font-black uppercase tracking-[0.08em] text-current',
  orderCheckoutPending:
    'text-[0.72rem] font-black uppercase tracking-[0.14em] text-qart-text-muted',
  orderCheckoutDone: 'grid gap-3 text-left',
  orderCheckoutDoneHighlight:
    'text-[0.72rem] font-black uppercase tracking-[0.16em] text-qart-accent',
  orderCheckoutDoneMessage: 'text-sm font-medium leading-relaxed text-qart-primary',
  orderCheckoutDoneFoot: 'text-sm text-qart-text-muted',
} as const;
