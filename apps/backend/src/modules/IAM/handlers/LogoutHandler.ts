/**
 * @file LogoutHandler.ts
 * @module IAM
 * @description Archivo LogoutHandler alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-03
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
import { BUN_MODE } from '../../../env';

/** @description Shared cookie settings used to clear auth cookies reliably. */
const COOKIE_BASE = { httpOnly: true, secure: BUN_MODE === 'prod', sameSite: 'strict' as const };

/**
 * @description Logout Handler (POST /iam/logout).
 * Terminates the current session by clearing both auth cookies with matching options.
 */
export const LogoutHandler = api.handler('POST /iam/logout')(async (_input, { res }) => {
  res.clearCookie('CupCake', COOKIE_BASE);
  res.clearCookie('Cake', COOKIE_BASE);
});
