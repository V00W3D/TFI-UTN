import type { RouteObject } from 'react-router-dom';
import CustomerPage from './pages/CustomerPage';

export const CustomerRoutes: RouteObject = {
  path: '/customer',
  element: <CustomerPage />,
};
