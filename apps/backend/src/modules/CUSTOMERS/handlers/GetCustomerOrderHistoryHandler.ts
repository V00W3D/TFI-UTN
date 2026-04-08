/**
 * @file GetCustomerOrderHistoryHandler.ts
 * @module CUSTOMERS
 * @description Archivo GetCustomerOrderHistoryHandler alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-20
 * rnf: RNF-03
 *
 * @business
 * inputs: datos del modulo y dependencias compartidas
 * outputs: comportamiento o estructuras del modulo
 * rules: respetar contratos, seguridad y trazabilidad definidas en context.md
 *
 * @technical
 * dependencies: dependencias locales del archivo
 * flow: inicializa, transforma y expone la logica del modulo
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
 * decisions: bloque agregado para cumplir el formato obligatorio de context.md
 */
import { api } from '../../../tools/api';
import { readOptionalUserId } from '../../../tools/optionalUser';
import { getCustomerOrderHistoryService } from '../services/getCustomerOrderHistoryService';

/**
 * @description GET /customers/history — público; si hay sesión, retorna pedidos asociados.
 */
export const GetCustomerOrderHistoryHandler = api.handler('GET /customers/history')(async (
  _input,
  { req },
) => {
  const customerUserId = readOptionalUserId(req);
  return getCustomerOrderHistoryService({ customerUserId });
});
