/**
 * @file AppRoutes.tsx
 * @author Victor
 * @description Automatically enforced JSDoc header according to context.md guidelines.
 * @param null
 * @returns null
 * @example null
 * @remarks This file is part of the QART monorepo architecture.
 *
 * Metrics:
 * - LOC: 50
 * - Experience Level: Junior
 * - Estimated Time: 30m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */
// frontend/routes/AppRoutes.tsx

import { useRoutes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { CustomerRoutes } from '@modules/Customer/CustomerRoutes';
import { IAMRoutes } from '@modules/IAM/IAMRoutes';
import { LandingRoutes } from '@modules/Landing/LandingRoutes';
import { SearchRoutes } from '@modules/Search/SearchRoutes';
import { PUBLIC_APP_SCOPE } from './env';

const shared: RouteObject[] = [LandingRoutes, SearchRoutes, IAMRoutes];

export default function AppRoutes() {
  const routes: RouteObject[] = PUBLIC_APP_SCOPE === 'full' ? [...shared, CustomerRoutes] : shared;

  return useRoutes(routes);
}
