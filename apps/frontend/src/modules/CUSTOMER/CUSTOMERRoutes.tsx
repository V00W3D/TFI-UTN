import type { RouteObject } from 'react-router-dom';

import CustomerLayout from './layouts/CustomerLayout';
import LandingPage from './pages/LandingPage';

export const CORERoutes: RouteObject = {
  path: '/',
  element: <CustomerLayout />,
  children: [
    {
      index: true,
      element: <LandingPage />,
    },
  ],
};
