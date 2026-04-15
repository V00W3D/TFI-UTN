/**
 * @file app.ts
 * @module Frontend
 * @description Runtime-safe application shell styles shared by the frontend bootstrap.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: shell wrappers, document roots and background overlays
 * outputs: centralized classes for the global frontend frame
 * rules: keep global styling in TypeScript; avoid local CSS files; expose static Tailwind classes only
 *
 * @technical
 * dependencies: none
 * flow: defines html and body classes; exposes the app frame wrappers; provides shared background layers for the runtime.
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FRONT-BOOT-01
 *
 * @notes
 * decisions: the global chrome moves from legacy CSS into runtime-applied classes and fixed layers
 */
export const documentStyles = {
  html: 'scroll-smooth bg-qart-bg',
  body: 'min-h-screen bg-qart-bg font-sans text-qart-text antialiased transition-colors duration-300',
} as const;

export const appStyles = {
  shell: 'relative min-h-screen overflow-x-clip bg-qart-bg text-qart-text',
  chrome:
    'pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--qart-accent-soft)_68%,transparent),transparent_42%),linear-gradient(180deg,color-mix(in_srgb,var(--qart-bg-warm)_68%,var(--qart-bg)),var(--qart-bg))]',
  grain:
    'pointer-events-none fixed inset-0 -z-10 opacity-[0.035] [background-image:linear-gradient(90deg,color-mix(in_srgb,var(--qart-border)_14%,transparent)_1px,transparent_1px),linear-gradient(color-mix(in_srgb,var(--qart-border)_14%,transparent)_1px,transparent_1px)] [background-size:22px_22px]',
  viewport: 'relative z-0 min-h-screen',
} as const;
