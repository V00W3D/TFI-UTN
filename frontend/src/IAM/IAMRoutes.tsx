// frontend/routes/modules/iam.routes.tsx

import type { RouteObject } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export const IAMRoutes: RouteObject = {
  path: '/iam',
  element: <AuthLayout />,
  children: [
    { path: 'login', element: <LoginPage /> },
    { path: 'register', element: <RegisterPage /> },
  ],
};
