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
 * inputs: handlers del modulo y la factory api.router
 * outputs: router tipado listo para montarse en el backend
 * rules: registrar solo endpoints del dominio y preservar su ensamblado declarativo
 *
 * @technical
 * dependencies: api, LoginHandler, RegisterHandler, LogoutHandler, MeHandler, UpdateMeHandler, RequestTokenHandler, VerifyUpdateHandler
 * flow: importa los handlers del modulo; los agrupa en api.router; exporta el router que monta el backend principal.
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
 * decisions: cada modulo expone un router compuesto para aislar su superficie HTTP
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
