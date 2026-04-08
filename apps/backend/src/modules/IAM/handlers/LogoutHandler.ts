/**
 * @file LogoutHandler.ts
 * @module IAM
 * @description Archivo LogoutHandler alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-03
 * rnf: RNF-05
 *
 * @business
 * inputs: payload validado del contrato, contexto HTTP y req.user cuando aplica
 * outputs: respuesta tipada del endpoint o accion HTTP puntual
 * rules: mantener handlers livianos y delegar negocio al service
 *
 * @technical
 * dependencies: api, env
 * flow: recibe el payload validado por api.handler; verifica sesion si req.user es obligatorio; delega la operacion al service importado; devuelve la respuesta serializable del contrato.
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
 * decisions: se separa transporte HTTP de logica de negocio para mantener handlers finos
 */
import { api } from '../../../tools/api';
import { BUN_MODE } from '../../../env';

/** @description Shared cookie settings used to clear auth cookies reliably. */
const COOKIE_BASE = { httpOnly: true, secure: BUN_MODE === 'prod', sameSite: 'strict' as const };

/**
 * @description Logout Handler (POST /iam/logout).
 * Terminates the current session by clearing both auth cookies with matching options.
 */
export const LogoutHandler = api.handler('POST /iam/logout')(async (_input, { res }) => {
  res.clearCookie('CupCake', COOKIE_BASE);
  res.clearCookie('Cake', COOKIE_BASE);
});
