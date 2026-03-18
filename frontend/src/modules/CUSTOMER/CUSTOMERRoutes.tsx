import type { RouteObject } from 'react-router-dom';

import CoreLayout from './layouts/CustomerLayout';
import LandingPage from './pages/LandingPage';

export const CORERoutes: RouteObject = {
  path: '/',
  element: <CoreLayout />,
  children: [
    {
      index: true,
      element: <LandingPage />,
    },
  ],
};
