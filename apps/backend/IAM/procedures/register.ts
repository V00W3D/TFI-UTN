import { procedure } from '@utils/procedurer';
import { RegisterSchema } from '@contracts/RegisterSchema';
import { RegisterService } from '../services/register';

export default procedure('public', RegisterSchema).mutation(async ({ input }) => {
  await RegisterService(input);
  return {
    ok: true,
    message: 'Usuario registrado correctamente',
    data: undefined,
  };
});
