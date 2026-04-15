/**
 * @file tailwind.config.js
 * @module Frontend
 * @description Archivo tailwind.config alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: tokens visuales, paths de contenido y extensiones de Tailwind
 * outputs: configuracion del sistema de estilos utilitarios del frontend
 * rules: mantener consistencia visual y alcance correcto de clases
 *
 * @technical
 * dependencies: sin imports directos; consumido por el modulo correspondiente
 * flow: declara el contenido que Tailwind debe escanear; extiende tema y tokens del proyecto; exporta la configuracion consumida por el pipeline CSS.
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: Tailwind se configura en un unico punto para sostener coherencia visual del frontend
 */
const qartColor = (token) => `var(${token})`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        'qart-bg': qartColor('--qart-bg'),
        'qart-bg-warm': qartColor('--qart-bg-warm'),
        'qart-surface': qartColor('--qart-surface'),
        'qart-surface-raised': qartColor('--qart-surface-raised'),
        'qart-surface-sunken': qartColor('--qart-surface-sunken'),
        'qart-surface-inverse': qartColor('--qart-surface-inverse'),
        'qart-text': qartColor('--qart-text'),
        'qart-text-muted': qartColor('--qart-text-muted'),
        'qart-text-subtle': qartColor('--qart-text-subtle'),
        'qart-text-disabled': qartColor('--qart-text-disabled'),
        'qart-text-on-primary': qartColor('--qart-text-on-primary'),
        'qart-text-on-accent': qartColor('--qart-text-on-accent'),
        'qart-text-on-inverse': qartColor('--qart-text-on-inverse'),
        'qart-primary': qartColor('--qart-primary'),
        'qart-border': qartColor('--qart-border'),
        'qart-border-soft': qartColor('--qart-border-soft'),
        'qart-border-subtle': qartColor('--qart-border-subtle'),
        'qart-border-ghost': qartColor('--qart-border-ghost'),
        'qart-accent': qartColor('--qart-accent'),
        'qart-accent-hover': qartColor('--qart-accent-hover'),
        'qart-accent-soft': qartColor('--qart-accent-soft'),
        'qart-accent-muted': qartColor('--qart-accent-muted'),
        'qart-accent-2': qartColor('--qart-accent-2'),
        'qart-accent-warm': qartColor('--qart-accent-warm'),
        'qart-accent-light': qartColor('--qart-accent-light'),
        'qart-success': qartColor('--qart-success'),
        'qart-success-bg': qartColor('--qart-success-bg'),
        'qart-success-border': qartColor('--qart-success-border'),
        'qart-error': qartColor('--qart-error'),
        'qart-error-bg': qartColor('--qart-error-bg'),
        'qart-error-border': qartColor('--qart-error-border'),
        'qart-warning': qartColor('--qart-warning'),
        'qart-warning-bg': qartColor('--qart-warning-bg'),
        'qart-warning-border': qartColor('--qart-warning-border'),
        'qart-info': qartColor('--qart-info'),
        'qart-info-bg': qartColor('--qart-info-bg'),
        'qart-insight-benefit': qartColor('--qart-insight-benefit'),
        'qart-insight-benefit-bg': qartColor('--qart-insight-benefit-bg'),
        'qart-insight-benefit-border': qartColor('--qart-insight-benefit-border'),
        'qart-insight-balanced': qartColor('--qart-insight-balanced'),
        'qart-insight-balanced-bg': qartColor('--qart-insight-balanced-bg'),
        'qart-insight-balanced-border': qartColor('--qart-insight-balanced-border'),
        'qart-insight-caution': qartColor('--qart-insight-caution'),
        'qart-insight-caution-bg': qartColor('--qart-insight-caution-bg'),
        'qart-insight-caution-border': qartColor('--qart-insight-caution-border'),
        'qart-insight-danger': qartColor('--qart-insight-danger'),
        'qart-insight-danger-bg': qartColor('--qart-insight-danger-bg'),
        'qart-insight-danger-border': qartColor('--qart-insight-danger-border'),
      },
      boxShadow: {
        sharp: 'var(--qart-shadow-sharp)',
        hover: 'var(--qart-shadow-hover)',
        accent: 'var(--qart-shadow-accent)',
        'accent-hover': 'var(--qart-shadow-accent-hover)',
        warm: 'var(--qart-shadow-warm)',
        soft: 'var(--qart-shadow-soft)',
        elevated: 'var(--qart-shadow-elevated)',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
    },
  },
};
