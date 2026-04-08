/**
 * @file CreateCustomerOrderHandler.ts
 * @module CUSTOMERS
 * @description Archivo CreateCustomerOrderHandler alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-18
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
import { createCustomerOrderService } from '../services/createCustomerOrderService';

/**
 * @description POST /customers/orders — público; asocia usuario si hay cookies de sesión.
 */
export const CreateCustomerOrderHandler = api.handler('POST /customers/orders')(async (
  input,
  { req },
) => {
  const customerUserId = readOptionalUserId(req);
  return createCustomerOrderService(input, { customerUserId });
});
