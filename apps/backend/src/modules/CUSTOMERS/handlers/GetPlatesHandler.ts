/**
 * @file GetPlatesHandler.ts
 * @module CUSTOMERS
 * @description Archivo GetPlatesHandler alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: payload validado del contrato, contexto HTTP y req.user cuando aplica
 * outputs: respuesta tipada del endpoint o accion HTTP puntual
 * rules: mantener handlers livianos y delegar negocio al service
 *
 * @technical
 * dependencies: api, GetPlatesService
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
import { getPlatesService } from '../services/GetPlatesService';

/**
 * @description Catalog Handler (GET /customers/plates).
 * Returns the full customer-facing restaurant catalog already shaped for the public contract.
 */
export const GetPlatesHandler = api.handler('GET /customers/plates')(async () => {
  return getPlatesService();
});
