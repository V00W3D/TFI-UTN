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
import { registerService } from '../services/RegisterService';

/**
 * @description Registration Handler (POST /iam/register).
 * Delegates account creation to the IAM service layer after contract validation.
 */
export const RegisterHandler = api.handler('POST /iam/register')(async (input) => {
  await registerService(input);
});
