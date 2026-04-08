/**
 * @file RegisterHandler.ts
 * @module IAM
 * @description Archivo RegisterHandler alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-01
 * rnf: RNF-05
 *
 * @business
 * inputs: payload validado del contrato, contexto HTTP y req.user cuando aplica
 * outputs: respuesta tipada del endpoint o accion HTTP puntual
 * rules: mantener handlers livianos y delegar negocio al service
 *
 * @technical
 * dependencies: api, RegisterService
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
import { registerService } from '../services/RegisterService';

/**
 * @description Registration Handler (POST /iam/register).
 * Delegates account creation to the IAM service layer after contract validation.
 */
export const RegisterHandler = api.handler('POST /iam/register')(async (input) => {
  await registerService(input);
});
