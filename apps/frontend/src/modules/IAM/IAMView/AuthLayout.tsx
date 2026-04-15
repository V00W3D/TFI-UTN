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
 * inputs: contenido hijo, props de layout y contexto visual de autenticacion
 * outputs: estructura visual compartida para login y registro
 * rules: separar layout auth de la logica de negocio de cada pagina
 *
 * @technical
 * dependencies: react-router-dom, iam style module
 * flow: recibe contenido y props de composicion; arma la estructura visual comun de IAM; distribuye paneles y slots; renderiza el layout reutilizable de autenticacion.
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
 * decisions: el layout auth se separa para reutilizar estructura y mantener paginas mas enfocadas
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
import { authNavLinkStyles, iamStyles } from '@/styles/modules/iam';

const AuthLayout = () => {
  return (
    <div className={iamStyles.layout}>
      <nav className={iamStyles.navBar}>
        <NavLink
          to="/iam/login"
          replace
          className={({ isActive }) => authNavLinkStyles({ active: isActive })}
        >
          Iniciar sesión
        </NavLink>

        <NavLink
          to="/iam/register"
          replace
          className={({ isActive }) => authNavLinkStyles({ active: isActive })}
        >
          Crear cuenta
        </NavLink>
      </nav>

      <div className={iamStyles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
