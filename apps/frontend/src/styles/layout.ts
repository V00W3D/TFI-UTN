/**
 * Layout helper constants for QART.
 */

export const layout = {
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexCol: 'flex flex-col',

  stack: 'flex flex-col gap-4',
  stackLg: 'flex flex-col gap-8',

  gridCol1: 'grid grid-cols-1',
  gridCol2: 'grid grid-cols-1 md:grid-cols-2 gap-6',

  sectionWarm: 'bg-qart-bg-warm border-y-(--qart-border-width) border-qart-border',

  pageShell: 'min-h-screen pt-[calc(4rem+3px)]',
} as const;
