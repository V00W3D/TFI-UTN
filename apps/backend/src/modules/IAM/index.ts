import { api } from '../../tools/api';
import { LoginHandler } from './handlers/LoginHandler';
import { RegisterHandler } from './handlers/RegisterHandler';
import { LogoutHandler } from './handlers/LogoutHandler';
import { MeHandler } from './handlers/MeHandler';
import { UpdateMeHandler } from './handlers/UpdateMeHandler';

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
]);
