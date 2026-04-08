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
 * inputs: paginas, layouts y flags de alcance del frontend
 * outputs: configuracion declarativa de rutas
 * rules: mantener arbol de navegacion modular
 *
 * @technical
 * dependencies: react-router-dom, LandingPage, CraftPage, ConfigPage
 * flow: declara rutas del modulo o de la app; enlaza paginas y layouts correspondientes; exporta la configuracion consumida por React Router.
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
 * decisions: las rutas se definen por modulo para aislar navegacion
 */
import type { RouteObject } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CraftPage from './pages/CraftPage';
import ConfigPage from './pages/ConfigPage';
import BillingPage from './pages/BillingPage';

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
    { path: 'facturacion', element: <BillingPage /> },
    { path: 'facturación', element: <BillingPage /> },
  ],
};
