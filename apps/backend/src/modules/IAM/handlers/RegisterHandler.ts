import { api } from '../../../tools/api';
import { registerService } from '../services/RegisterService';

/**
 * @description Registration Handler (POST /iam/register).
 * Delegates account creation to the IAM service layer after contract validation.
 */
export const RegisterHandler = api.handler('POST /iam/register')(async (input) => {
  await registerService(input);
});
