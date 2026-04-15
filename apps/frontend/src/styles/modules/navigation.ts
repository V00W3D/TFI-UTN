/**
 * @file navigation.ts
 * @module Frontend
 * @description Centralized navigation, search, sidebar, and floating action styles.
 */
import { cva } from 'class-variance-authority';

export const navActionButtonStyles = cva(
  'relative inline-flex min-h-[3.2rem] min-w-[3.2rem] items-center justify-center border-[3px] border-qart-border bg-qart-surface text-qart-text-muted transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-qart-accent hover:bg-qart-bg-warm hover:text-qart-accent hover:shadow-sharp cursor-pointer',
  {
    variants: {
      tone: {
        default: '',
        accent:
          'bg-qart-accent text-qart-text-on-accent hover:border-qart-border hover:bg-qart-accent-hover hover:text-qart-text-on-accent hover:shadow-[7px_7px_0_var(--qart-border)]',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

export const navAuthButtonStyles = cva(
  'inline-flex min-h-[3.2rem] items-center justify-center gap-2 border-[3px] px-6 py-2.5 text-[0.76rem] font-black uppercase tracking-[0.18em] transition-all duration-200',
  {
    variants: {
      tone: {
        ghost:
          'border-qart-border bg-qart-surface text-qart-primary hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-qart-accent hover:bg-qart-bg-warm hover:text-qart-accent hover:shadow-sharp',
        solid:
          'border-qart-border bg-qart-accent text-qart-text-on-accent shadow-sharp hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-qart-accent-hover hover:shadow-[7px_7px_0_var(--qart-border)]',
      },
    },
    defaultVariants: {
      tone: 'ghost',
    },
  },
);

export const navSearchFieldStyles = cva(
  'flex items-center border-2 border-qart-border bg-qart-surface-sunken transition-all duration-200',
  {
    variants: {
      open: {
        true: 'border-qart-accent bg-qart-surface shadow-[3px_3px_0_var(--qart-border)]',
        false: '',
      },
    },
    defaultVariants: {
      open: false,
    },
  },
);

export const floatingActionButtonStyles = cva(
  'inline-flex size-[3.25rem] items-center justify-center border-[3px] border-qart-border transition-all duration-200 cursor-pointer',
  {
    variants: {
      tone: {
        default:
          'bg-qart-surface text-qart-text hover:-translate-x-[3px] hover:-translate-y-[3px] hover:border-qart-accent hover:text-qart-accent hover:shadow-[7px_7px_0_var(--qart-border)]',
        accent:
          'bg-qart-accent text-qart-text-on-accent shadow-sharp hover:-translate-x-[3px] hover:-translate-y-[3px] hover:bg-qart-accent-hover hover:text-qart-text-on-accent hover:shadow-[7px_7px_0_var(--qart-border)]',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

export const sidebarThemeTrackStyles = cva(
  'relative h-6 w-12 border-2 border-qart-border transition-colors duration-300',
  {
    variants: {
      active: {
        true: 'bg-qart-accent',
        false: 'bg-qart-border',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const sidebarThemeThumbStyles = cva(
  'absolute top-1 h-4 w-4 bg-qart-surface shadow-sm transition-transform duration-300',
  {
    variants: {
      active: {
        true: 'translate-x-[26px]',
        false: 'translate-x-[2px]',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const sidebarNavLinkStyles = cva(
  'block border border-transparent px-4 py-4 text-xl font-display font-black uppercase tracking-tight text-qart-primary transition-all duration-200 hover:border-qart-border-soft hover:text-qart-accent',
  {
    variants: {
      active: {
        true: 'border-qart-border bg-qart-bg-warm text-qart-accent',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const logoRootStyles = cva('inline-flex items-center uppercase text-qart-primary', {
  variants: {
    size: {
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const logoTextStyles = cva(
  'font-display font-black uppercase tracking-tight text-qart-primary',
  {
    variants: {
      size: {
        sm: 'text-xl',
        md: 'text-2xl',
        lg: 'text-[2.4rem]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const navigationStyles = {
  navbarShell:
    'fixed left-0 top-0 z-50 w-full border-b-[3px] border-qart-border bg-[var(--qart-nav-bg)] backdrop-blur-md',
  navbarInner:
    'mx-auto grid min-h-16 w-full max-w-[1600px] grid-cols-[auto_1fr_auto] items-center gap-4 px-5',
  navbarBrandButton: 'group inline-flex items-center',
  navbarSearchZone: 'mx-auto flex w-full max-w-[28rem] items-center justify-center',
  navbarRight: 'flex items-center gap-4',
  navActionsGroup: 'mr-1 flex items-center gap-2',
  navActionIcon: 'size-[1.1rem]',
  navStatusBadge:
    'absolute right-1 top-1 size-2.5 rounded-full border border-qart-surface bg-qart-error shadow-sharp',
  navbarLinks: 'hidden items-center gap-1 xl:flex',
  navbarLink:
    'group relative px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-qart-text-muted transition-colors duration-200 hover:text-qart-primary',
  navbarLinkUnderline:
    'pointer-events-none absolute inset-x-3 bottom-0 h-0.5 origin-left scale-x-0 bg-qart-accent transition-transform duration-200 group-hover:scale-x-100',
  navbarAuth: 'flex items-center gap-2',
  navbarGuest: 'flex gap-2',
  navSearchWrap: 'relative w-full',
  navSearchIcon: 'flex items-center px-2.5 text-qart-text-muted',
  navSearchInput:
    'min-w-0 flex-1 border-none bg-transparent px-0 py-2.5 text-[0.82rem] text-qart-text outline-none placeholder:text-qart-text-subtle',
  navSearchDropdown:
    'absolute left-0 right-0 top-[calc(100%+4px)] z-[90] overflow-hidden border-2 border-qart-border bg-qart-surface shadow-[6px_6px_0_var(--qart-border)]',
  navSearchSuggestion:
    'flex cursor-pointer items-center gap-3 border-b border-qart-border-subtle px-3 py-2.5 transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--qart-accent-soft)_36%,var(--qart-surface))] last:border-b-0',
  navSearchSuggestionState: 'cursor-default py-3.5 hover:bg-transparent',
  navSearchStateText: 'text-[0.75rem] italic text-qart-text-muted',
  navSearchSuggestionImageWrap:
    'flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border-2 border-qart-border-subtle bg-qart-surface-sunken',
  navSearchSuggestionImage: 'h-full w-full object-cover',
  navSearchSuggestionPlaceholder:
    'h-full w-full bg-[repeating-linear-gradient(-12deg,var(--qart-surface-sunken),var(--qart-surface-sunken)_4px,var(--qart-bg-warm)_4px,var(--qart-bg-warm)_8px)]',
  navSearchSuggestionBody: 'min-w-0 flex-1 space-y-1',
  navSearchSuggestionName:
    'block truncate font-display text-[0.82rem] font-black text-qart-primary',
  navSearchSuggestionMeta: 'flex items-center gap-2',
  navSearchSuggestionType:
    'border border-qart-border-subtle bg-qart-bg-warm px-1.5 py-0.5 text-[0.62rem] font-black uppercase tracking-[0.1em] text-qart-text-subtle',
  navSearchSuggestionPrice: 'text-[0.75rem] font-black text-qart-accent',
  navSearchFooter:
    'group flex cursor-pointer items-center justify-between gap-3 border-t-2 border-qart-border-subtle bg-qart-bg-warm px-3 py-2 text-[0.7rem] font-bold text-qart-text-muted transition-colors duration-150 hover:bg-qart-surface hover:text-qart-accent',
  navSearchFooterArrow: 'text-base transition-transform duration-150 group-hover:translate-x-1',
  floatingBar:
    'pointer-events-none fixed bottom-8 right-8 z-[85] flex flex-col gap-3 supports-[padding:max(0px)]:bottom-[max(2rem,env(safe-area-inset-bottom))]',
  floatingBarItem: 'pointer-events-auto',
  floatingIconWrap: 'relative',
  floatingBadge:
    'absolute -right-2 -top-2 inline-flex min-h-[1.1rem] min-w-[1.1rem] items-center justify-center border-2 border-qart-text-on-accent bg-qart-primary px-1 text-[0.6rem] font-black text-qart-text-on-primary',
  sidebarBackdrop: 'fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm',
  sidebarPanel:
    'fixed left-0 top-0 z-[70] flex h-full w-80 flex-col overflow-y-auto border-r border-qart-border bg-qart-surface shadow-2xl',
  sidebarContent: 'flex flex-1 flex-col gap-12 p-8',
  sidebarHeader: 'flex items-center justify-between gap-4',
  sidebarBrand: 'group flex items-center gap-2',
  sidebarBrandMark:
    'flex h-8 w-8 items-center justify-center -rotate-[6deg] border-2 border-qart-border bg-qart-accent transition-transform duration-200 group-hover:rotate-0',
  sidebarBrandBar: 'h-4 w-1.5 bg-qart-bg',
  sidebarBrandText: 'text-2xl font-display font-black tracking-tight text-qart-primary',
  sidebarCloseButton:
    'inline-flex items-center justify-center bg-transparent p-2 text-qart-text-muted transition-colors duration-200 hover:bg-qart-bg-warm hover:text-qart-primary',
  sidebarCloseIcon: 'size-6',
  sidebarSection: 'space-y-4',
  sidebarSectionLabel: 'text-xs font-black uppercase tracking-[0.18em] text-qart-text-muted',
  sidebarThemePanel:
    'group flex w-full items-center justify-between border border-qart-border bg-qart-bg-warm px-4 py-4 transition-colors duration-200 hover:bg-qart-border-subtle',
  sidebarThemeBody: 'flex items-center gap-4',
  sidebarThemeIconBox:
    'flex h-10 w-10 items-center justify-center border border-qart-border bg-qart-surface transition-transform duration-200 group-hover:scale-110',
  sidebarThemeLabel: 'font-bold text-qart-primary',
  sidebarNavigationList: 'space-y-3',
  sidebarFooter: 'pointer-events-none mt-auto p-8 opacity-20',
  sidebarFooterMark: 'text-6xl font-display font-black text-qart-primary',
  logoSvg: 'shrink-0',
  logoDot: 'text-qart-accent',
} as const;

export const logoSizes = {
  sm: 32,
  md: 44,
  lg: 64,
} as const;
