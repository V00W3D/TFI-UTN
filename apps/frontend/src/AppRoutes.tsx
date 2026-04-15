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

import { CustomerRoute } from '@/modules/Customer/CustomerRoute';
import { IAMRoute } from '@/modules/IAM/IAMRoute';
import { LandingRoute } from '@/modules/Landing/LandingRoute';
import { SearchRoute } from '@/modules/Search/SearchRoute';
import * as qartEnv from '@/shared/utils/qartEnv';

const sharedRoutes: RouteObject[] = [LandingRoute, SearchRoute, IAMRoute];

const AppRoutes = () => {
  const routes: RouteObject[] =
    qartEnv.PUBLIC_APP_SCOPE === 'full'
      ? [...sharedRoutes, CustomerRoute]
      : sharedRoutes;

  return useRoutes(routes);
};

export default AppRoutes;
