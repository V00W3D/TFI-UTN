import type { RouteObject } from 'react-router-dom';
import LandingView from '@/modules/Landing/LandingView';
import CraftView from '@/modules/Landing/CraftSection/CraftView';
import ConfigView from '@/modules/Landing/ConfigSection/ConfigView';
import BillingView from '@/modules/Landing/OrderPanel/BillingView';

export const LandingRoute: RouteObject = {
  path: '/',
  children: [
    { index: true, element: <LandingView /> },
    { path: 'craft', element: <CraftView /> },
    { path: 'config', element: <ConfigView /> },
    { path: 'facturacion', element: <BillingView /> },
  ],
};
