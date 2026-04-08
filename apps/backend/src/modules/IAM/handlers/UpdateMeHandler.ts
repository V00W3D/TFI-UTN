/**
 * @file UpdateMeHandler.ts
 * @module IAM
 * @description Archivo UpdateMeHandler alineado a la arquitectura y trazabilidad QART.
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
 * dependencies: api, UpdateMeService, @app/sdk, issueAuthCookies
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
import { updateMeService } from '../services/UpdateMeService';
import { ERR } from '@app/sdk';
import { issueAuthCookies } from '../services/issueAuthCookies';

export const UpdateMeHandler = api.handler('PATCH /iam/me')(async (input, { req, res }) => {
  if (!req.user) throw ERR.UNAUTHORIZED();

  const updatedUser = await updateMeService(req.user.id, input);
  issueAuthCookies(res, updatedUser);
  return updatedUser;
});
