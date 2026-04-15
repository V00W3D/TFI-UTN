/**
 * @file settings.ts
 * @module Frontend
 * @description Estilos centralizados para settings, credenciales y apariencia.
 */
import { cva } from 'class-variance-authority';

export const settingsTabButtonStyles = cva('w-full border-2 px-4 py-3 text-left transition-all', {
  variants: {
    active: {
      true: 'translate-x-1 border-qart-primary bg-qart-primary text-white shadow-sharp',
      false:
        'border-transparent bg-transparent text-qart-text-muted hover:border-qart-border hover:bg-qart-bg-warm',
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const settingsTabSummaryStyles = cva(
  'mt-1.5 block text-[10px] font-bold tracking-[0.04em]',
  {
    variants: {
      active: {
        true: 'text-white/75',
        false: 'text-qart-text-subtle',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const settingsVerificationBadgeStyles = cva(
  'px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white',
  {
    variants: {
      verified: {
        true: 'bg-qart-success',
        false: 'bg-qart-error',
      },
    },
    defaultVariants: {
      verified: true,
    },
  },
);

export const settingsActionButtonStyles = cva(
  'inline-flex min-h-[38px] items-center justify-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] transition-colors disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      tone: {
        primary:
          'border-[3px] border-qart-border bg-qart-accent px-4 py-2.5 text-white shadow-sharp hover:bg-qart-accent-hover',
        secondary:
          'border-[3px] border-qart-border bg-qart-surface px-4 py-2.5 text-qart-primary hover:bg-qart-bg-warm hover:text-qart-accent',
        ghost:
          'border border-qart-border bg-qart-surface text-qart-primary hover:bg-qart-primary hover:text-white',
      },
    },
    defaultVariants: {
      tone: 'ghost',
    },
  },
);

export const settingsToggleTrackStyles = cva(
  'relative flex h-11 w-24 items-center border-[3px] border-qart-primary shadow-sharp transition-all active:translate-x-1 active:translate-y-1 active:shadow-none',
  {
    variants: {
      checked: {
        true: 'bg-qart-success',
        false: 'bg-qart-surface',
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
);

export const settingsToggleThumbStyles = cva(
  'absolute flex h-7 w-7 items-center justify-center border-[3px] border-qart-primary bg-white transition-all',
  {
    variants: {
      checked: {
        true: 'translate-x-14 shadow-[-4px_0px_0px_var(--qart-primary)]',
        false: 'translate-x-1 shadow-[4px_0px_0px_var(--qart-primary)]',
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
);

export const settingsToggleDotStyles = cva('h-2 w-2 rounded-full', {
  variants: {
    checked: {
      true: 'bg-qart-success',
      false: 'bg-qart-border',
    },
  },
  defaultVariants: {
    checked: false,
  },
});

export const settingsStyles = {
  layoutRoot: 'min-h-screen bg-qart-bg-warm/10 px-4 pb-24 pt-24 lg:px-8 xl:px-10',
  layoutShell: 'mx-auto max-w-[1400px]',
  layoutGrid: 'grid grid-cols-1 items-start gap-6 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-8',
  contentShell:
    'w-full border-2 border-qart-primary bg-qart-surface p-1 shadow-[12px_12px_0px_var(--qart-primary)]',
  contentPanel: 'min-h-[680px] border border-qart-border-subtle bg-qart-surface p-5 md:p-7 xl:p-8',
  header: 'mb-8 flex flex-col gap-5',
  headerAccent: 'h-1.5 w-20 bg-qart-accent',
  headerRow: 'flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between',
  headerCopy: 'max-w-4xl',
  headerTitle:
    'mb-3 text-4xl font-black uppercase tracking-tight text-qart-primary leading-[0.88] md:text-6xl',
  headerTitleAccent: 'text-qart-accent',
  headerSubtitle:
    'flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-[0.16em] text-qart-text-muted md:text-xs md:tracking-[0.22em]',
  headerSubtitleRule: 'h-0.5 w-8 bg-qart-primary',
  headerMeta: 'flex flex-col items-start gap-2 lg:items-end',
  headerModule:
    'border border-qart-accent/20 bg-qart-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-qart-primary',
  headerVersion: 'font-mono text-xs font-black text-qart-primary',
  sidebar:
    'w-full overflow-hidden border-2 border-qart-primary bg-qart-surface xl:sticky xl:top-[108px]',
  sidebarHead: 'border-b border-qart-border bg-qart-bg-warm px-5 py-5',
  sidebarIconBox:
    'mb-4 flex h-12 w-12 items-center justify-center border-2 border-white bg-qart-primary text-white shadow-sharp',
  sidebarTitle: 'text-2xl font-black uppercase tracking-tight text-qart-primary leading-none',
  sidebarLead: 'mt-2 text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted',
  sidebarNav: 'flex flex-col gap-2 bg-qart-surface p-3',
  sidebarTabLabel: 'flex items-center gap-3 text-sm font-black uppercase tracking-[0.14em]',
  sidebarTabDot: 'h-2 w-2 bg-qart-accent',
  sidebarFooter: 'border-t border-qart-border bg-qart-bg-warm/40 px-4 py-4',
  sidebarFooterText: 'text-[10px] font-black uppercase tracking-[0.14em] text-qart-primary',
  visualStack: 'space-y-10',
  visualHeader: 'flex items-center gap-4 mb-4',
  visualAccent: 'h-8 w-1.5 bg-qart-accent',
  visualTitle: 'text-2xl font-black uppercase tracking-tight text-qart-primary',
  visualLead: 'max-w-xl text-xs font-bold uppercase tracking-widest text-qart-text-muted',
  visualList: 'space-y-6',
  visualCard:
    'flex flex-col items-start justify-between gap-10 border-[3px] border-qart-border bg-qart-surface-sunken p-8 shadow-sharp md:flex-row md:items-center md:p-10',
  visualCopy: 'flex-1',
  visualCardTitle: 'mb-3 text-xl font-black uppercase tracking-tighter text-qart-primary',
  visualCardText: 'max-w-sm text-sm font-bold leading-relaxed text-qart-text-muted',
  visualRecommendation: 'mt-2 block text-xs font-black uppercase italic text-qart-accent',
  visualToggleGroup: 'flex flex-col items-center gap-3',
  visualToggleState: 'text-[10px] font-black uppercase tracking-[0.2em] text-qart-text-muted',
  visualInfo: 'flex items-start gap-4 border-2 border-qart-border-subtle bg-qart-surface p-8',
  visualInfoIcon: 'text-qart-accent',
  visualInfoText:
    'text-[11px] font-bold uppercase leading-relaxed tracking-wide text-qart-text-muted',
  credentialsLoading:
    'flex flex-col items-center justify-center border-4 border-dashed border-qart-primary bg-qart-bg-warm p-20 animate-pulse',
  credentialsLoadingText: 'text-2xl font-black uppercase tracking-[0.3em] text-qart-primary',
  sidePanel: 'space-y-4',
  sidePanelHead: 'flex items-center gap-3',
  sidePanelRule: 'h-1.5 w-8 bg-qart-primary',
  sidePanelTitle: 'text-xs font-black uppercase tracking-[0.18em] text-qart-text-muted',
  fieldEditorGrid:
    'grid grid-cols-1 gap-3 border-t border-qart-border-subtle pt-2 sm:grid-cols-[minmax(0,1fr)_auto]',
  actionRow: 'flex flex-wrap gap-2',
  panel:
    'overflow-hidden border-2 border-qart-primary bg-qart-surface shadow-[12px_12px_0_var(--qart-primary)]',
  panelBody: 'space-y-4 p-5 md:p-6',
  panelHeader: 'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
  panelEyebrow: 'text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted',
  panelTitle: 'mt-2 text-2xl font-black uppercase tracking-tight text-qart-primary',
  panelCopy: 'mt-2 text-sm text-qart-text-muted',
  sectionTitleRow: 'flex items-start gap-4',
  sectionAccent: 'mt-1 h-8 w-1.5 bg-qart-accent',
  sectionTitle: 'text-2xl font-black uppercase tracking-tight text-qart-primary md:text-3xl',
  sectionCopy: 'mt-2 text-sm text-qart-text-muted',
  rowsPanel:
    'overflow-hidden border-2 border-qart-primary bg-qart-surface shadow-[10px_10px_0_var(--qart-primary)]',
  rowsPanelBody: 'space-y-3 p-4 md:p-5',
  rowCard: 'overflow-hidden border border-qart-border bg-qart-surface',
  rowGrid: 'grid grid-cols-1 lg:grid-cols-[190px_minmax(0,1fr)]',
  rowLabelWrap: 'border-b border-qart-border bg-qart-surface px-4 py-3.5 lg:border-b-0 lg:border-r',
  rowLabel: 'text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted',
  rowBody: 'space-y-3 px-4 py-4 md:px-5',
  rowBodyTop: 'flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between',
  rowValueWrap: 'min-w-0 space-y-1.5',
  rowValueTop: 'flex flex-wrap items-center gap-3',
  rowValue: 'wrap-break-word text-base font-black tracking-tight text-qart-primary md:text-lg',
  rowHelper: 'text-sm font-medium leading-relaxed text-qart-text-muted',
  addressEmpty:
    'border-2 border-dashed border-qart-border bg-qart-surface p-10 text-center text-xs font-black uppercase tracking-[0.18em] text-qart-text-muted',
  addressGrid: 'grid grid-cols-1 gap-4',
  addressCard:
    'flex flex-col gap-4 border border-qart-border bg-qart-surface p-5 md:flex-row md:items-start md:justify-between',
  addressCardBody: 'space-y-3',
  addressCardTitle: 'text-xl font-black uppercase tracking-tight text-qart-primary',
  addressPills:
    'flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-qart-text-muted',
  addressPill: 'border border-qart-border bg-qart-surface px-2 py-1',
  addressPillPrimary: 'border border-qart-border bg-qart-accent px-2 py-1 text-white',
  addressForm:
    'space-y-6 border-2 border-qart-primary bg-qart-surface p-6 shadow-[10px_10px_0_var(--qart-primary)]',
  addressFormHead: 'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
  addressFormGrid: 'grid grid-cols-1 gap-6 sm:grid-cols-2',
  fieldStack: 'space-y-2',
  fieldLabel: 'text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted',
  checkboxRow: 'flex items-center gap-4 border border-qart-border bg-qart-surface p-4',
  checkboxInput: 'h-6 w-6 accent-qart-accent',
  checkboxLabel: 'text-[10px] font-black uppercase tracking-[0.14em] text-qart-primary',
  securityShell:
    'space-y-6 border-2 border-qart-primary bg-qart-surface p-6 shadow-[12px_12px_0_var(--qart-primary)]',
  securityHero: 'flex items-center gap-4',
  securityHeroIcon:
    'flex h-11 w-11 items-center justify-center border border-qart-border bg-qart-accent',
  securityHeroBang: 'text-2xl font-black text-white',
  securityCallout: 'border-l-4 border-qart-accent bg-qart-surface p-5',
  securityCalloutText: 'text-sm font-black leading-relaxed text-qart-primary',
  securityDevNote: 'mt-3 text-xs text-qart-text-muted',
  successCallout: 'border-l-4 border-qart-success bg-qart-success/10 p-5',
  successCalloutText: 'text-sm font-black leading-relaxed text-qart-success',
  codeInput: 'font-mono text-center text-3xl font-black tracking-[0.6em] h-20',
  credentialsGrid:
    'grid grid-cols-1 items-start gap-6 pb-20 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8 2xl:grid-cols-[minmax(0,1fr)_320px]',
  credentialsMain: 'order-2 min-w-0 space-y-8 xl:order-1',
  credentialsSections: 'space-y-10',
  credentialsAside: 'order-1 min-w-0 xl:order-2 xl:sticky xl:top-[112px] xl:self-start',
} as const;
