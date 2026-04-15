import type { RouteObject } from 'react-router-dom';
import CustomerView from '@/modules/Customer/CustomerView';

export const CustomerRoute: RouteObject = {
  path: '/customer',
  element: <CustomerView />,
};
