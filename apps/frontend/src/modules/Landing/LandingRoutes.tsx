/**
 * @file LandingRoutes.tsx
 * @module Landing
 * @description Archivo LandingRoutes alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: datos del modulo y dependencias compartidas
 * outputs: comportamiento o estructuras del modulo
 * rules: respetar contratos, seguridad y trazabilidad definidas en context.md
 *
 * @technical
 * dependencies: dependencias locales del archivo
 * flow: inicializa, transforma y expone la logica del modulo
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
 * decisions: bloque agregado para cumplir el formato obligatorio de context.md
 */
import type { RouteObject } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CraftPage from './pages/CraftPage';
import ConfigPage from './pages/ConfigPage';

/**
 * @file LandingRoutes.tsx
 * @description Routes for the Landing/Home module.
 */
export const LandingRoutes: RouteObject = {
  path: '/',
  children: [
    { index: true, element: <LandingPage /> },
    { path: 'craft', element: <CraftPage /> },
    { path: 'config', element: <ConfigPage /> },
  ],
};
