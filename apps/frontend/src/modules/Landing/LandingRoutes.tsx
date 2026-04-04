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
