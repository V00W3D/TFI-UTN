/**
 * @file UpdateAddressHandler.ts
 * @module CUSTOMERS
 * @description Archivo UpdateAddressHandler alineado a la arquitectura y trazabilidad QART.
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
 * dependencies: @app/sdk, api, addressService
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
import { updateAddressService } from '../services/addressService';

export const UpdateAddressHandler = api.handler('PUT /customers/addresses')(async (
  input,
  { req },
) => {
  if (!req.user) throw ERR.UNAUTHORIZED();
  return updateAddressService(req.user.id, input);
});
