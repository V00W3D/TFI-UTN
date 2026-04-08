/**
 * @file MeHandler.ts
 * @module IAM
 * @description Archivo MeHandler alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-05
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
import { meService } from '../services/MeService';

/**
 * @description Identity Probe Handler (GET /iam/me).
 * Returns the authenticated session shape already validated by middleware and contract.
 */
export const MeHandler = api.handler('GET /iam/me')(async (_input, ctx) => {
  return meService(ctx.req);
});
