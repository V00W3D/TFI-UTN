/**
 * @file role.middleware.ts
 * @module Backend
 * @description Archivo role.middleware alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-10
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
import type { Request, Response, NextFunction } from 'express';
import { ERR } from '@app/sdk';

/**
 * @description Role-Based Access Control (RBAC) Middleware.
 * Guards routes by verifying if the authenticated subject (req.user) possesses one of the required roles.
 * Must be executed AFTER authMiddleware.
 */
export const roleMiddleware =
  (roles: string[]) => (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return next(ERR.FORBIDDEN());
    next();
  };
