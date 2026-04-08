/**
 * @file UpdateMeHandler.ts
 * @module IAM
 * @description Archivo UpdateMeHandler alineado a la arquitectura y trazabilidad QART.
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
import { updateMeService } from '../services/UpdateMeService';
import { ERR } from '@app/sdk';
import { issueAuthCookies } from '../services/issueAuthCookies';

export const UpdateMeHandler = api.handler('PATCH /iam/me')(async (input, { req, res }) => {
  if (!req.user) throw ERR.UNAUTHORIZED();

  const updatedUser = await updateMeService(req.user.id, input);
  issueAuthCookies(res, updatedUser);
  return updatedUser;
});
