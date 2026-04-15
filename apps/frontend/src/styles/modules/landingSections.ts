/**
 * @file landingSections.ts
 * @module Frontend
 * @description Estilos centralizados para secciones de landing, billing y vistas complementarias.
 */
export const landingSectionStyles = {
  heroSection: 'relative flex min-h-[82vh] items-center overflow-hidden bg-qart-bg pt-20',
  heroAccentRail:
    'absolute right-0 top-0 hidden h-full w-1/3 border-l-4 border-qart-border bg-qart-bg-warm lg:block',
  heroGrid:
    'relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2',
  heroCopy: 'text-center lg:text-left',
  heroBadge:
    'mb-5 inline-flex items-center gap-2 border-2 border-qart-accent px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.28em] text-qart-accent',
  heroTitle:
    'mb-6 text-4xl font-display font-black uppercase leading-[0.92] text-qart-primary md:text-5xl lg:text-[4.25rem]',
  heroTitleAccent: 'text-qart-accent',
  heroLead:
    'mx-auto mb-8 max-w-md text-base font-semibold leading-snug text-qart-text-muted lg:mx-0 md:text-lg',
  heroActions: 'flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start',
  heroPrimaryCta: 'w-full sm:w-auto text-center',
  heroSecondaryCta: 'w-full sm:w-auto',
  heroMedia: 'relative lg:flex lg:justify-end',
  heroFrame:
    'relative mx-auto aspect-square w-full max-w-[26rem] border-[6px] border-qart-border bg-qart-bg-warm lg:mx-0',
  heroImage:
    'h-full w-full object-cover grayscale-[0.15] transition-all duration-500 hover:grayscale-0',
  heroBlock: 'absolute -bottom-4 -right-4 z-0 h-20 w-20 border-4 border-qart-border bg-qart-accent',
  heroFooter: 'absolute bottom-0 left-0 h-6 w-full bg-qart-border',
  storySection: 'relative overflow-hidden bg-qart-bg py-20',
  storyDividerWrap: 'absolute bottom-0 left-0 w-full overflow-hidden leading-none',
  storyDividerSvg: 'relative block h-12 w-[calc(100%+1.3px)]',
  storyTopLine:
    'absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-qart-border to-transparent opacity-50',
  storyInner: 'relative z-10 mx-auto max-w-7xl px-6',
  storyHeader: 'mb-14 text-center md:mb-16',
  storyEyebrow:
    'mb-4 inline-block border border-qart-border bg-qart-bg-warm px-3 py-1 text-[0.72rem] font-bold uppercase tracking-widest text-qart-primary',
  storyTitle: 'text-3xl text-qart-primary md:text-4xl',
  storyTitleAccent: 'text-qart-accent',
  storyGrid: 'relative grid grid-cols-1 gap-8 md:grid-cols-3',
  storyConnector:
    'absolute left-[15%] top-12 -z-10 hidden h-0.5 w-[70%] border-t-2 border-dashed border-qart-border md:block',
  storyCard: 'group flex flex-col items-center text-center',
  storyIconWrap:
    'relative mb-5 flex h-16 w-16 shrink-0 items-center justify-center rounded-[2rem] bg-qart-bg-warm p-4 transition-transform duration-500 group-hover:scale-110 sm:h-[4.5rem] sm:w-[4.5rem]',
  storyStepBadge:
    'absolute -right-3.5 -top-3.5 z-20 flex h-10 w-10 items-center justify-center border-4 border-qart-surface bg-qart-accent text-sm font-bold text-qart-text-on-accent shadow-sharp',
  storyCardTitle:
    'mb-2.5 text-lg font-display text-qart-primary transition-colors group-hover:text-qart-accent',
  storyCardCopy: 'px-3 text-[0.9rem] font-medium leading-relaxed text-qart-text-muted',
  serveSection: 'relative overflow-hidden border-b-4 border-qart-border bg-qart-bg py-16 md:py-24',
  serveInner: 'relative z-10 mx-auto max-w-7xl px-6',
  serveEyebrow:
    'mb-3 text-center text-[0.72rem] font-black uppercase tracking-[0.22em] text-qart-accent',
  serveTitle:
    'mx-auto mb-10 max-w-3xl text-center font-display text-2xl font-black uppercase tracking-tight text-qart-primary md:mb-14 md:text-3xl',
  serveGrid: 'grid grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-12',
  serveCard:
    'flex flex-col border-4 border-qart-border p-6 md:p-10 shadow-[var(--qart-shadow-sharp)]',
  serveCardDefault: 'bg-qart-surface',
  serveCardInverse: 'bg-[var(--qart-surface-inverse)]',
  serveCardTitle:
    'mb-2 font-display text-3xl font-black uppercase tracking-tighter text-qart-primary sm:text-4xl md:text-[2.85rem] lg:text-[3.25rem]',
  serveCardTitleInverse:
    'mb-2 font-display text-3xl font-black uppercase tracking-tighter text-[var(--qart-text-on-inverse)] sm:text-4xl md:text-[2.85rem] lg:text-[3.25rem]',
  serveCardKicker: 'mb-6 text-sm font-bold uppercase tracking-wide text-qart-accent md:text-base',
  serveCardKickerInverse:
    'mb-8 text-sm font-bold uppercase tracking-wide text-[var(--qart-accent-warm)] md:text-base',
  serveCardLead:
    'mb-6 text-[0.95rem] font-bold uppercase leading-snug tracking-tight text-qart-text-muted',
  serveList: 'flex-1 space-y-3',
  serveFeature:
    'flex items-center gap-3 border-2 border-qart-border bg-qart-bg-warm/30 px-3.5 py-2',
  serveFeatureDot: 'h-2.5 w-2.5 shrink-0 bg-qart-accent',
  serveFeatureText: 'text-[0.82rem] font-black uppercase tracking-widest text-qart-primary',
  serveInverseBody: 'flex-1 space-y-8',
  serveInverseGroup: 'space-y-4',
  serveInverseGroupTitle:
    'mb-3 text-xs font-black uppercase tracking-[0.2em] text-[var(--qart-text-on-inverse)]',
  serveInverseGroupCopy:
    'mb-4 text-[0.92rem] font-bold uppercase leading-snug tracking-tight text-[var(--qart-text-on-inverse-dim)]',
  serveInverseList: 'space-y-2',
  serveInverseItem:
    'border-l-4 border-qart-accent pl-3 text-[0.78rem] font-black uppercase tracking-widest text-[var(--qart-text-on-inverse)]',
  serveInverseDivider: 'border-t-2 border-[var(--qart-border-on-inverse)] pt-6',
  serveActions: 'mt-8 flex flex-col gap-3 sm:flex-row',
  servePrimaryButton: 'flex-1 justify-center text-center',
  serveOutlineButton: 'flex-1 justify-center text-center',
  craftSection:
    'relative overflow-hidden border-y-4 border-qart-border bg-[var(--qart-surface-inverse)] py-20',
  craftInner: 'relative z-10 mx-auto max-w-7xl px-6 text-center',
  craftTitle:
    'landing-welcome-craft-title mb-6 text-4xl font-display font-black uppercase leading-none text-[var(--qart-text-on-inverse)] md:text-5xl',
  craftTitleAccent: 'text-qart-accent',
  craftLead:
    'mx-auto mb-9 max-w-2xl text-base font-bold uppercase leading-tight tracking-tighter text-[var(--qart-text-on-inverse-dim)] md:text-lg',
  craftButton:
    'border-4 border-qart-border bg-qart-bg px-7 py-3.5 text-base font-black uppercase tracking-[0.16em] text-qart-text shadow-sharp transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hover',
  craftAccentRight:
    'absolute right-0 top-0 hidden h-full w-1/4 border-l-2 border-[var(--qart-border-on-inverse)] bg-[rgba(232,98,26,0.06)] lg:block',
  craftAccentLeft:
    'absolute bottom-0 left-0 hidden h-full w-1/4 border-r-2 border-[var(--qart-border-on-inverse)] bg-[rgba(232,98,26,0.03)] lg:block',
  contactFooter: 'border-t-8 border-qart-border bg-qart-bg pb-10 pt-20',
  contactInner: 'mx-auto max-w-7xl px-6',
  contactGrid: 'grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.9fr_0.8fr] lg:gap-10',
  contactBrand: 'space-y-6',
  contactBrandMark: 'flex items-center gap-3 border-l-4 border-qart-accent pl-4',
  contactBrandText: 'text-3xl font-display font-black uppercase tracking-tighter text-qart-primary',
  contactLead:
    'max-w-xl text-[0.96rem] font-bold uppercase leading-tight tracking-tight text-qart-text-muted',
  contactSocials: 'flex flex-wrap items-center gap-3',
  contactSocialLink:
    'group inline-flex h-11 w-11 items-center justify-center border-2 border-qart-border bg-qart-surface text-qart-text transition-all duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:border-qart-accent hover:bg-qart-accent hover:text-qart-text-on-accent',
  contactColumn: 'space-y-5',
  contactColumnTitle: 'text-xs font-black uppercase tracking-[0.3em] text-qart-primary',
  contactCard: 'flex items-start gap-3 border-2 border-qart-border bg-qart-surface px-4 py-4',
  contactIconBox:
    'inline-flex h-10 w-10 shrink-0 items-center justify-center border-2 border-qart-border bg-qart-bg-warm text-qart-accent',
  contactCardBody:
    'space-y-1 text-[0.92rem] font-bold uppercase leading-snug tracking-tight text-qart-text-muted',
  contactCardPrimary: 'text-qart-primary',
  contactStatus:
    'mt-1 inline-flex border-2 border-qart-accent bg-qart-accent px-3 py-1 text-[0.7rem] tracking-[0.18em] text-qart-text-on-accent',
  contactFooterBar:
    'mt-12 flex flex-col items-center justify-between gap-5 border-t-2 border-qart-border pt-6 md:flex-row',
  contactCopyright: 'text-[10px] font-black uppercase tracking-widest text-qart-text-muted',
  contactLegal: 'flex flex-wrap items-center justify-center gap-6',
  contactLegalLink:
    'text-[10px] font-black uppercase tracking-widest text-qart-text-muted transition-colors duration-200 hover:text-qart-accent',
  featuredSection: 'relative bg-qart-bg py-20',
  featuredInner: 'relative z-10 mx-auto w-full max-w-7xl px-6',
  featuredHead:
    'mb-16 flex flex-col justify-between gap-6 border-b-4 border-qart-border pb-8 md:flex-row md:items-end',
  featuredHeadCopy: 'max-w-3xl',
  featuredTitle:
    'mb-5 text-4xl font-display font-black uppercase leading-none text-qart-primary md:text-5xl',
  featuredLead:
    'max-w-2xl text-base font-bold uppercase leading-snug tracking-tight text-qart-text-muted',
  featuredLink: 'shrink-0',
  featuredBanner: 'max-w-3xl',
  featuredBannerInfo:
    'flex gap-4 border-2 border-qart-border bg-qart-surface-raised p-5 text-qart-text shadow-sharp',
  featuredBannerError:
    'flex gap-4 border-2 border-qart-border bg-qart-error p-5 text-qart-text-on-error shadow-sharp',
  featuredBannerLabel: 'font-black uppercase tracking-[0.2em]',
  featuredBannerBody: 'font-semibold',
  billingPage: 'min-h-screen overflow-x-hidden bg-qart-bg',
  billingMain: 'mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-20 pt-28 md:gap-14',
  billingHero:
    'border-2 border-qart-primary bg-qart-surface p-6 shadow-[12px_12px_0_var(--qart-primary)] md:p-8',
  billingHeroBar: 'mb-5 h-1.5 w-20 bg-qart-accent',
  billingHeroGrid: 'grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)] lg:items-end',
  billingEyebrow: 'text-[11px] font-black uppercase tracking-[0.16em] text-qart-text-muted',
  billingTitle:
    'mt-3 text-4xl font-black uppercase tracking-tight text-qart-primary leading-[0.9] md:text-6xl',
  billingLead: 'mt-4 max-w-3xl text-base leading-relaxed text-qart-text-muted md:text-lg',
  billingStatusCard: 'border border-qart-border bg-qart-bg-warm p-5',
  billingStatusValue: 'mt-2 text-3xl font-black uppercase tracking-tight text-qart-primary',
  billingStatusCopy: 'mt-3 text-sm leading-relaxed text-qart-text-muted',
  billingStatusActions: 'mt-5 flex flex-wrap gap-3',
  billingPlansGrid: 'grid gap-6 xl:grid-cols-3',
  billingPlanCard: 'border-2 p-6 shadow-[10px_10px_0_var(--qart-primary)]',
  billingPlanActive: 'border-qart-primary bg-qart-surface',
  billingPlanInactive: 'border-qart-border bg-qart-surface-sunken/70',
  billingPlanAccentBar: 'mb-5 h-1.5 w-16',
  billingPlanAccentStyles: {
    primary: 'bg-qart-primary',
    accent: 'bg-qart-accent',
    success: 'bg-qart-success',
  },
  billingPlanHead: 'flex items-start justify-between gap-4',
  billingPlanName: 'mt-2 text-3xl font-black uppercase tracking-tight text-qart-primary',
  billingPlanBadge:
    'border border-qart-border bg-qart-primary px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white',
  billingPlanSummary: 'mt-4 min-h-[96px] text-sm leading-relaxed text-qart-text-muted',
  billingPriceCard: 'mt-5 border border-qart-border bg-qart-bg-warm p-4',
  billingPriceValue: 'mt-2 text-4xl font-black tracking-tight text-qart-primary',
  billingPriceCopy: 'mt-2 text-xs text-qart-text-muted',
  billingBlock: 'mt-5 space-y-3',
  billingBlockTitle: 'text-sm font-black uppercase tracking-[0.08em] text-qart-primary',
  billingBlockCard:
    'border border-qart-border bg-qart-surface px-4 py-3 text-sm font-medium text-qart-primary',
  billingFeatureCard:
    'border border-qart-border bg-qart-bg-warm px-4 py-3 text-sm text-qart-primary',
  billingMeta: 'mt-5 grid gap-3 border-t border-qart-border pt-5 text-sm text-qart-text-muted',
  billingMetaStrong: 'font-black text-qart-primary',
  billingButton: 'mt-6 w-full',
  billingDetailGrid: 'grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]',
  billingDetailCard: 'border-2 border-qart-primary bg-qart-surface p-6',
  billingDetailTitle: 'mt-2 text-3xl font-black uppercase tracking-tight text-qart-primary',
  billingDetailGridInner: 'mt-5 grid gap-4 md:grid-cols-3',
  billingMiniCard: 'border border-qart-border bg-qart-bg-warm p-4',
  billingMiniLabel: 'text-xs font-black uppercase tracking-[0.12em] text-qart-primary',
  billingMiniCopy: 'mt-2 text-sm text-qart-text-muted',
  craftViewPage: 'flex min-h-screen flex-col items-center bg-qart-bg px-6 pb-12 pt-24 md:px-12',
  craftViewCard:
    'w-full max-w-3xl border-4 border-qart-border bg-qart-surface p-8 shadow-[12px_12px_0px_var(--qart-border)] md:p-12',
  craftViewHead: 'mb-8 flex items-center gap-4',
  craftViewIconBox:
    'flex h-16 w-16 items-center justify-center border-4 border-qart-border bg-qart-accent',
  craftViewTitle: 'text-3xl font-black uppercase tracking-tighter text-qart-primary md:text-5xl',
  craftViewLead:
    'border-l-4 border-qart-accent bg-qart-surface-sunken p-4 text-lg font-bold text-qart-text md:text-xl',
} as const;
