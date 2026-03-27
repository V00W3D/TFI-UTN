/**
 * @file AuthLayout.tsx
 * @author Victor
 * @description Automatically enforced JSDoc header according to context.md guidelines.
 * @param null
 * @returns null
 * @example null
 * @remarks This file is part of the QART monorepo architecture.
 *
 * Metrics:
 * - LOC: 50
 * - Experience Level: Junior
 * - Estimated Time: 30m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */
import { NavLink, Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-container">
      <nav className="auth-navbar">
        <NavLink
          to="/iam/login"
          replace
          className={({ isActive }) => (isActive ? 'auth-link auth-link-active' : 'auth-link')}
        >
          Iniciar Sesión
        </NavLink>

        <NavLink
          to="/iam/register"
          replace
          className={({ isActive }) => (isActive ? 'auth-link auth-link-active' : 'auth-link')}
        >
          Crear cuenta
        </NavLink>
      </nav>

      <div className="auth-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
