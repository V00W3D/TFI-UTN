/**
 * @file IAMRoutes.tsx
 * @module IAM
 * @description Archivo IAMRoutes alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-18
 * rnf: RNF-03
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
 * @file IAMRoutes.tsx
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
