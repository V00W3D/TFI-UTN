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
import { getPlatesService } from '../services/GetPlatesService';

/**
 * @description Catalog Handler (GET /customers/plates).
 * Returns the full customer-facing restaurant catalog already shaped for the public contract.
 */
export const GetPlatesHandler = api.handler('GET /customers/plates')(async () => {
  return getPlatesService();
});
