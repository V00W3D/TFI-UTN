/**
 * @file VerifyUpdateHandler.ts
 * @module IAM
 * @description Archivo VerifyUpdateHandler alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-06
 * rnf: RNF-02
 *
 * @business
 * inputs: payload validado del contrato, contexto HTTP y req.user cuando aplica
 * outputs: respuesta tipada del endpoint o accion HTTP puntual
 * rules: mantener handlers livianos y delegar negocio al service
 *
 * @technical
 * dependencies: @app/sdk, api, issueAuthCookies, verifyUpdateService
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
import { ERR } from '@app/sdk';
import { api } from '../../../tools/api';
import { issueAuthCookies } from '../services/issueAuthCookies';
import { verifyUpdateService } from '../services/verifyUpdateService';

export const VerifyUpdateHandler = api.handler('POST /iam/verify-update')(async (
  input,
  { req, res },
) => {
  if (!req.user) throw ERR.UNAUTHORIZED();

  const updatedUser = await verifyUpdateService(req.user.id, input);
  issueAuthCookies(res, updatedUser);

  return updatedUser;
});
