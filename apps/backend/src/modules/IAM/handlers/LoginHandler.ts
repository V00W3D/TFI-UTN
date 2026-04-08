/**
 * @file LoginHandler.ts
 * @module IAM
 * @description Archivo LoginHandler alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-02
 * rnf: RNF-02
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
import { loginService } from '../services/LoginService';
import { issueAuthCookies } from '../services/issueAuthCookies';

/**
 * @description Authentication Handler (POST /iam/login).
 * Validates credentials, issues both JWT cookies, and returns the authenticated subject.
 */
export const LoginHandler = api.handler('POST /iam/login')(async (input, { res }) => {
  const user = await loginService(input);
  issueAuthCookies(res, user);
  return user;
});
