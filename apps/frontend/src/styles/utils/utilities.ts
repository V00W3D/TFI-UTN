import { cva } from 'class-variance-authority';

export const glassHeaderStyles = 'bg-[var(--qart-nav-bg)] backdrop-blur-[12px] border-b-[var(--qart-border-width)] border-qart-border transition-all duration-300';

export const cardBaseStyles = cva('transition-all duration-300', {
  variants: {
    interactive: {
      true: 'border-2 border-qart-border hover:border-qart-accent hover:shadow-accent hover:-translate-x-1 hover:-translate-y-1',
    },
  },
  defaultVariants: {
    interactive: false,
  },
});

export const badgeAccentStyles = 'inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 border-2 border-qart-accent bg-transparent text-qart-accent';

export const inputBaseStyles = cva('w-full px-3.5 py-3.5 border-2 text-[0.92rem] font-medium transition-all duration-200 outline-none rounded-none', {
  variants: {
    intent: {
      default: 'border-qart-border bg-qart-surface-sunken text-qart-text focus:border-qart-accent focus:shadow-[4px_4px_0px_var(--qart-accent)]',
      error: 'border-qart-error bg-qart-error-bg text-qart-text',
    },
  },
  defaultVariants: {
    intent: 'default',
  },
});

export const authContainerStyles = 'min-h-screen flex flex-col transition-all duration-300 bg-qart-bg';
export const authNavbarStyles = 'flex items-center justify-center gap-3 px-5 h-14 sticky top-0 z-50 bg-[var(--qart-nav-bg)] backdrop-blur-[8px] border-b-2 border-qart-border';
export const authLinkStyles = cva('px-4 py-1.5 border-2 text-[0.88rem] font-bold tracking-tight transition-all duration-300', {
  variants: {
    active: {
      true: 'border-qart-accent bg-qart-accent text-qart-text-on-accent shadow-sharp',
      false: 'border-transparent text-qart-text-muted hover:border-qart-border hover:text-qart-text',
    },
  },
  defaultVariants: {
    active: false,
  },
});
export const authContentStyles = 'flex-1 flex items-center justify-center p-4 md:p-8';
export const authCardStyles = 'w-full max-w-md p-8 relative overflow-hidden bg-qart-surface border-4 border-qart-border shadow-[10px_10px_0px_var(--qart-border)]';

export const searchShellStyles = {
  wrapper: 'grid min-h-screen',
  aside: 'border-r-[3px] border-qart-border bg-qart-surface',
  main: 'bg-qart-bg p-[1.15rem] pb-[2.5rem]',
};

export const searchBarStyles = {
  wrap: 'relative flex items-center border-2 border-qart-border bg-qart-surface mb-[0.65rem] shadow-sharp transition-colors focus-within:border-qart-accent',
  ico: 'flex items-center px-[0.55rem] text-qart-text-muted shrink-0',
  input: 'flex-1 border-0 bg-transparent p-[0.65rem] text-[0.9rem] text-qart-text outline-none',
  resultsGrid: 'grid gap-1rem [grid-template-columns:repeat(auto-fill,minmax(15.5rem,1fr))]',
};

export const floatingBarStyles = {
  bar: 'fixed bottom-[2rem] right-[2rem] flex flex-col gap-[0.85rem] z-[9999] pointer-events-none',
  item: 'pointer-events-auto',
  btn: 'w-[3.25rem] h-[3.25rem] flex items-center justify-center border-[3px] border-qart-border bg-qart-surface text-qart-text cursor-pointer transition-all duration-200 shadow-[4px_4px_0px_var(--qart-border)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_var(--qart-border)] hover:border-qart-accent hover:text-qart-accent',
  btnAccent: 'bg-qart-accent text-qart-text-on-accent border-qart-border hover:bg-qart-accent-hover hover:text-qart-text-on-accent',
  badge: 'absolute -top-[0.45rem] -right-[0.45rem] min-w-[1.1rem] h-[1.1rem] p-[0_0.2rem] bg-qart-primary text-qart-text-on-primary text-[0.6rem] font-black flex items-center justify-center border-2 border-qart-text-on-accent',
};

export const navLinkStyles = cva('relative text-[0.72rem] font-bold uppercase tracking-[0.1em] no-underline py-[0.45rem] px-[0.6rem] transition-colors whitespace-nowrap', {
  variants: {
    active: {
      true: 'text-qart-accent after:scale-x-100',
      false: 'text-qart-text-muted hover:text-qart-primary hover:after:scale-x-100',
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const navSearchStyles = {
  field: 'flex items-center border-2 border-qart-border bg-qart-surface-sunken transition-all focus-within:border-qart-accent focus-within:shadow-[3px_3px_0px_var(--qart-border)] focus-within:bg-qart-surface',
  dropdown: 'absolute top-full left-0 right-0 z-[9999] bg-qart-surface border-2 border-qart-border shadow-[6px_6px_0px_var(--qart-border)] list-none p-0 m-0 overflow-hidden',
  suggestion: 'flex items-center gap-3 p-[0.55rem_0.75rem] cursor-pointer border-b border-qart-border-subtle transition-colors hover:bg-[var(--qart-accent-soft)]',
  suggestionImg: 'w-[2.6rem] h-[2.6rem] shrink-0 border-2 border-qart-border-subtle overflow-hidden bg-qart-surface-sunken',
  suggestionName: 'font-display text-[0.82rem] font-black text-qart-primary truncate',
  suggestionPrice: 'text-[0.75rem] font-black text-qart-accent',
};

export const orderPanelStyles = {
  backdrop: 'fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm',
  panel: 'fixed left-0 top-0 z-[80] flex flex-col h-full w-full max-w-[420px] border-r-[3px] border-qart-border bg-qart-surface shadow-[8px_0_0_var(--qart-border)]',
  header: 'flex items-stretch border-b-[3px] border-qart-border bg-qart-surface',
  tabsWrap: 'flex flex-1 border-r-2 border-qart-border',
  closeBtn: 'inline-flex min-h-[3rem] w-12 items-center justify-center border-l-2 border-qart-border text-qart-text-muted transition-all hover:bg-qart-error-bg hover:text-qart-error',
  footer: 'grid gap-4 border-t-[3px] border-qart-border bg-qart-bg-warm p-4',
  empty: 'flex min-h-[280px] flex-col items-center justify-center gap-3 px-6 text-center',
};

export const insightStyles = cva('border-2', {
  variants: {
    tone: {
      benefit: 'border-qart-insight-benefit-border bg-qart-insight-benefit-bg text-qart-insight-benefit',
      balanced: 'border-qart-insight-balanced-border bg-qart-insight-balanced-bg text-qart-insight-balanced',
      caution: 'border-qart-insight-caution-border bg-qart-insight-caution-bg text-qart-insight-caution',
      danger: 'border-qart-insight-danger-border bg-qart-insight-danger-bg text-qart-insight-danger',
    },
    kind: {
      pill: 'inline-flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-[0.12em]',
      panel: 'grid gap-2 p-4',
    },
  },
});

export const bannerStyles = cva('border-2 p-5 flex gap-4 shadow-sharp', {
  variants: {
    tone: {
      error: 'border-qart-border bg-qart-error text-qart-text-on-error',
      success: 'border-qart-border bg-qart-success text-qart-text-on-success',
      info: 'border-qart-border bg-qart-surface-raised text-qart-text',
    },
  },
});
