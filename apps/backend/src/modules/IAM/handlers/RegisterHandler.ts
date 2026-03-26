import { api } from '../../../tools/api';
import { registerService } from '../services/RegisterService';

/**
 * @description Registration Handler (POST /iam/register).
 * Entry point for new user creation. Validates input against the RegisterContract via SDK automatically.
 */
export const RegisterHandler = api.handler('POST /iam/register')(async (input) =>
  registerService(input),
);
