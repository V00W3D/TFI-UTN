import { procedure } from '@tools/procedurer';
import { LoginSchema } from '@shared/contracts/LoginSchema';
import { LoginService } from '../services/login';

import jwt from 'jsonwebtoken';
import { SESSION_SECRET, REFRESH_SECRET, BUN_MODE } from '@env';

export default procedure('public', LoginSchema).mutation(async ({ input, ctx }) => {
  const user = await LoginService(input);

  const accessToken = jwt.sign(user, SESSION_SECRET, {
    expiresIn: '1h',
  });

  const refreshToken = jwt.sign(user, REFRESH_SECRET, {
    expiresIn: '7d',
  });

  ctx.res.cookie('CupCake', accessToken, {
    httpOnly: true,
    secure: BUN_MODE === 'prod',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60,
  });

  ctx.res.cookie('Cake', refreshToken, {
    httpOnly: true,
    secure: BUN_MODE === 'prod',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return {
    ok: true,
    message: 'Inicio de sesión exitoso',
    data: user,
  };
});
