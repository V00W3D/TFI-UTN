/**
 * @file index.ts
 * @module IAM
 * @description Archivo index alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
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
import { api } from '../../tools/api';
import { LoginHandler } from './handlers/LoginHandler';
import { RegisterHandler } from './handlers/RegisterHandler';
import { LogoutHandler } from './handlers/LogoutHandler';
import { MeHandler } from './handlers/MeHandler';
import { UpdateMeHandler } from './handlers/UpdateMeHandler';
import { RequestTokenHandler } from './handlers/RequestTokenHandler';
import { VerifyUpdateHandler } from './handlers/VerifyUpdateHandler';

/**
 * @description IAM (Identity and Access Management) Module Router.
 * Aggregates all security-related handlers into a single router instance for easy mounting.
 */
export const IAMRouter = api.router([
  LoginHandler,
  RegisterHandler,
  LogoutHandler,
  MeHandler,
  UpdateMeHandler,
  RequestTokenHandler,
  VerifyUpdateHandler,
]);
