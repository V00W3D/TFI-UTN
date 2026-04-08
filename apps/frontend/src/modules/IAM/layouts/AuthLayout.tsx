/**
 * @file AuthLayout.tsx
 * @module IAM
 * @description Archivo AuthLayout alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-02
 *
 * @business
 * inputs: datos del modulo y dependencias compartidas
 * outputs: comportamiento o estructuras del modulo
 * rules: respetar contratos, seguridad y trazabilidad definidas en context.md
 *
 * @technical
 * dependencies: dependencias locales del archivo
 * flow: inicializa, transforma y expone la logica del modulo
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: bloque agregado para cumplir el formato obligatorio de context.md
 */
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
import '../pages/AuthPages.css';

const AuthLayout = () => {
  return (
    <div className="auth-container">
      <nav className="auth-navbar">
        <NavLink
          to="/iam/login"
          replace
          className={({ isActive }) => (isActive ? 'auth-link auth-link-active' : 'auth-link')}
        >
          Iniciar sesión
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
