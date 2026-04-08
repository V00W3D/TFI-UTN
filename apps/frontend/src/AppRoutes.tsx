/**
 * @file AppRoutes.tsx
 * @module Frontend
 * @description Compone el arbol principal de rutas de la aplicacion segun el alcance publico habilitado.
 *
 * @tfi
 * section: IEEE 830 11 / 12.1
 * rf: RF-17
 * rnf: RNF-03
 *
 * @business
 * inputs: alcance PUBLIC_APP_SCOPE y rutas modulares
 * outputs: definicion final de rutas para React Router
 * rules: exponer customer solo cuando el scope lo habilita; conservar navegacion modular
 *
 * @technical
 * dependencies: react-router-dom, modulos de rutas
 * flow: agrega rutas compartidas; decide alcance customer; delega renderizado a useRoutes
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-ROUTES-01
 *
 * @notes
 * decisions: el default export se vuelve arrow function para cumplir context.md
 */
// frontend/routes/AppRoutes.tsx

import { useRoutes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { CustomerRoutes } from '@modules/Customer/CustomerRoutes';
import { IAMRoutes } from '@modules/IAM/IAMRoutes';
import { LandingRoutes } from '@modules/Landing/LandingRoutes';
import { SearchRoutes } from '@modules/Search/SearchRoutes';
import { PUBLIC_APP_SCOPE } from './qartEnv';

const shared: RouteObject[] = [LandingRoutes, SearchRoutes, IAMRoutes];

const AppRoutes = () => {
  const routes: RouteObject[] = PUBLIC_APP_SCOPE === 'full' ? [...shared, CustomerRoutes] : shared;

  return useRoutes(routes);
};

export default AppRoutes;
