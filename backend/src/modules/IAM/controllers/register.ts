import { createHandler } from '@tools/ApiFactory';
import { RegisterContract } from '@shared/contracts/RegisterContract';
import { registerService } from '../services/register';

const handle = createHandler(RegisterContract);

export const RegisterHandler = handle(async (input) => {
  await registerService(input);
  return;
});
