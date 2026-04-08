/**
 * @file LoginHandler.ts
 * @module IAM
 * @description Archivo LoginHandler alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-02
 * rnf: RNF-02
 *
 * @business
 * inputs: payload validado del contrato, contexto HTTP y req.user cuando aplica
 * outputs: respuesta tipada del endpoint o accion HTTP puntual
 * rules: mantener handlers livianos y delegar negocio al service
 *
 * @technical
 * dependencies: api, LoginService, issueAuthCookies
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
import { loginService } from '../services/LoginService';
import { issueAuthCookies } from '../services/issueAuthCookies';

/**
 * @description Authentication Handler (POST /iam/login).
 * Validates credentials, issues both JWT cookies, and returns the authenticated subject.
 */
export const LoginHandler = api.handler('POST /iam/login')(async (input, { res }) => {
  const user = await loginService(input);
  issueAuthCookies(res, user);
  return user;
});
