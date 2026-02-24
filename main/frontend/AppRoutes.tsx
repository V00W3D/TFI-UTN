// frontend/routes/AppRoutes.tsx

import { useRoutes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { IAMRoutes } from '@IAM/frontend/IAMRoutes';
// después:
// import { POSRoutes } from './modules/pos.routes'
// import { AdminRoutes } from './modules/admin.routes'
// import { CoreRoutes } from './modules/core.routes'

export default function AppRoutes() {
  const routes: RouteObject[] = [
    IAMRoutes,
    // POSRoutes,
    // AdminRoutes,
    // CoreRoutes,
  ];

  return useRoutes(routes);
}
