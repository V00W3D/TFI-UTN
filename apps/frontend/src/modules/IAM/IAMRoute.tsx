import type { RouteObject } from 'react-router-dom';
import IAMView from '@/modules/IAM/IAMView';

export const IAMRoute: RouteObject = {
  path: '/iam',
  children: [
    { path: 'login', element: <IAMView /> },
    { path: 'register', element: <IAMView /> },
    { index: true, element: <IAMView /> },
  ],
};
