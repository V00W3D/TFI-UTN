/**
 * @file SearchPlatesHandler.ts
 * @module CUSTOMERS
 * @description Archivo SearchPlatesHandler alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-19
 * rnf: RNF-03
 *
 * @business
 * inputs: payload validado del contrato, contexto HTTP y req.user cuando aplica
 * outputs: respuesta tipada del endpoint o accion HTTP puntual
 * rules: mantener handlers livianos y delegar negocio al service
 *
 * @technical
 * dependencies: @app/contracts, api, searchPlatesService
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
import type { SearchPlatesQuery } from '@app/contracts';
import { api } from '../../../tools/api';
import { searchPlatesService } from '../services/searchPlatesService';

export const SearchPlatesHandler = api.handler('GET /customers/search')(async (input) => {
  return searchPlatesService(input as SearchPlatesQuery);
});
