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
 * inputs: request, response, next y configuracion de seguridad
 * outputs: contexto HTTP enriquecido o corte temprano de la request
 * rules: validar autenticacion o autorizacion antes del handler
 *
 * @technical
 * dependencies: express, @app/sdk
 * flow: inspecciona el request y sus credenciales o roles; valida la condicion de seguridad correspondiente; modifica el contexto o rechaza la request; delega al siguiente eslabon cuando pasa la validacion.
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
 * decisions: la seguridad se implementa como middlewares composables reutilizables
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
