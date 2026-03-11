import { controller } from '@tools/controller';
import { RegisterSchema } from '@shared/contracts/RegisterSchema';
import { registerService } from '../services/register';

export const registerController = controller(RegisterSchema, async (input) => {
  await registerService(input);
});
