import { NavLink, Outlet } from 'react-router-dom';
import './auth-layout.css';

const AuthLayout = () => {
  return (
    <div className="auth-container">
      <nav className="auth-navbar bg">
        <NavLink
          to="/iam/login"
          className={({ isActive }) => (isActive ? 'auth-link auth-link-active' : 'auth-link')}
        >
          Iniciar Sesión
        </NavLink>

        <NavLink
          to="/iam/register"
          className={({ isActive }) => (isActive ? 'auth-link auth-link-active' : 'auth-link')}
        >
          Crear Cuenta
        </NavLink>
      </nav>

      <div className="auth-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
