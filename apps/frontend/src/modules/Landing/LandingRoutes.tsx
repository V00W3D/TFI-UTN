import type { RouteObject } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

/**
 * @file LandingRoutes.tsx
 * @description Routes for the Landing/Home module.
 */
export const LandingRoutes: RouteObject = {
  path: '/',
  element: <LandingPage />,
};
