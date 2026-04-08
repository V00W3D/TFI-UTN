/**
 * @file MeHandler.ts
 * @module IAM
 * @description Archivo MeHandler alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-05
 * rnf: RNF-05
 *
 * @business
 * inputs: payload validado del contrato, contexto HTTP y req.user cuando aplica
 * outputs: respuesta tipada del endpoint o accion HTTP puntual
 * rules: mantener handlers livianos y delegar negocio al service
 *
 * @technical
 * dependencies: api, MeService
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
import { meService } from '../services/MeService';

/**
 * @description Identity Probe Handler (GET /iam/me).
 * Returns the authenticated session shape already validated by middleware and contract.
 */
export const MeHandler = api.handler('GET /iam/me')(async (_input, ctx) => {
  return meService(ctx.req);
});
