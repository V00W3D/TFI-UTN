import { createHandler } from '@tools/ApiFactory';
import { loginService } from '../services/login';
import jwt from 'jsonwebtoken';
import { SESSION_SECRET, REFRESH_SECRET, BUN_MODE } from '@env';
import { LoginContract } from '@shared/contracts/LoginContract';

const handle = createHandler(LoginContract);

/* =========================================================
REGISTER ENDPOINT
========================================================= */

export const LoginHandler = handle(async (input, ctx) => {
  const user = await loginService(input);

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

  return user;
});
