// frontend/routes/AppRoutes.tsx

import { useRoutes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { IAMRoutes } from './IAMRoutes';

export default function AppRoutes() {
  const routes: RouteObject[] = [
    ...IAMRoutes,

    // Más adelante:
    // ...DashboardRoutes,
    // ...AdminRoutes,
    // etc.
  ];

  return useRoutes(routes);
}
