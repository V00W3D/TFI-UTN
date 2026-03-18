// frontend/routes/AppRoutes.tsx

import { useRoutes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { IAMRoutes } from '@modules/IAM/IAMRoutes';
import { CORERoutes } from '@modules/CUSTOMER/CUSTOMERRoutes';

export default function AppRoutes() {
  const routes: RouteObject[] = [
    CORERoutes,
    IAMRoutes,
    // POSRoutes,
    // AdminRoutes,
  ];

  return useRoutes(routes);
}
