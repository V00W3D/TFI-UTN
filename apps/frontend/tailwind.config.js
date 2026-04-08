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
// tailwind.config.js
export default {
  content: ['./src/**/*.{ts,tsx,js,jsx,css}'],
};
