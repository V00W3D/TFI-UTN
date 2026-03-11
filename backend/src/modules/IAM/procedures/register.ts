import { controller } from '@tools/controller';
import { RegisterSchema } from '@shared/contracts/RegisterSchema';
import { RegisterService } from '../services/register';

export const registerController = controller(RegisterSchema, async (input) => {
  await RegisterService(input);

  return undefined;
});
