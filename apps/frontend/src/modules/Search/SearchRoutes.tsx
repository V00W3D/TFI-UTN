/**
 * @file SearchRoutes.tsx
 * @module Search
 * @description Archivo SearchRoutes alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-19
 * rnf: RNF-03
 *
 * @business
 * inputs: paginas, layouts y flags de alcance del frontend
 * outputs: configuracion declarativa de rutas
 * rules: mantener arbol de navegacion modular
 *
 * @technical
 * dependencies: react-router-dom, SearchPage
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
import SearchPage from './pages/SearchPage';

export const SearchRoutes: RouteObject = {
  path: '/search',
  element: <SearchPage />,
};
