import jwt from 'jsonwebtoken';
import { SESSION_SECRET, REFRESH_SECRET, BUN_MODE } from '@env';
import { loginService, registerService, logoutService, meService } from './IAMService';
import { api } from '@tools/api';

//#region COOKIE_CONFIG
const COOKIE_BASE = {
  httpOnly: true,
  secure: BUN_MODE === 'prod',
  sameSite: 'strict',
} as const;

const ACCESS_TTL = 1000 * 60 * 60;
const REFRESH_TTL = 1000 * 60 * 60 * 24 * 7;
//#endregion

//#region HELPERS
function issueTokens(res: import('express').Response, user: object): void {
  res.cookie('CupCake', jwt.sign(user, SESSION_SECRET, { expiresIn: '1h' }), {
    ...COOKIE_BASE,
    maxAge: ACCESS_TTL,
  });
  res.cookie('Cake', jwt.sign(user, REFRESH_SECRET, { expiresIn: '7d' }), {
    ...COOKIE_BASE,
    maxAge: REFRESH_TTL,
  });
}
//#endregion

//#region HANDLERS
const LoginHandler = api.handler('POST /iam/login')(async (input, ctx) => {
  const user = await loginService(input);
  issueTokens(ctx.res, user);
  return user;
});

const RegisterHandler = api.handler('POST /iam/register')(async (input) => {
  await registerService(input);
});

const LogoutHandler = api.handler('POST /iam/logout')(async (_input, ctx) => {
  logoutService(ctx);
});

const MeHandler = api.handler('GET /iam/me')(async (input, ctx) => {
  return meService(input, ctx);
});
//#endregion

//#region ROUTER
export const IAMRouter = api.router([LoginHandler, RegisterHandler, LogoutHandler, MeHandler]);
//#endregion
