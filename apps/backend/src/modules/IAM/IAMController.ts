import jwt from 'jsonwebtoken';
import { SESSION_SECRET, REFRESH_SECRET, BUN_MODE } from '@env';
import {
  loginService,
  staffLoginService,
  registerService,
  logoutService,
  meService,
} from './IAMService';
import { api } from '@tools/api';

//#region COOKIE_CONFIG
const COOKIE_BASE = {
  httpOnly: true,
  secure: BUN_MODE === 'prod',
  sameSite: 'strict',
} as const;

const ACCESS_TTL = 1000 * 60 * 60; // 1h
const REFRESH_TTL = 1000 * 60 * 60 * 24 * 7; // 7d
//#endregion

//#region HELPERS
/** Issues CupCake (1h access) + Cake (7d refresh) HttpOnly cookies. */
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

//#region IAM HANDLERS
/** Authenticates any user. Redirects to the correct panel based on `role` in the response. */
const LoginHandler = api.handler('POST /iam/login')(async (input, ctx) => {
  const user = await loginService(input);
  issueTokens(ctx.res, user);
  return user;
});

/** Creates a new CUSTOMER account. Returns void — client redirects to login. */
const RegisterHandler = api.handler('POST /iam/register')(async (input) => {
  await registerService(input);
});

/** Clears session cookies. */
const LogoutHandler = api.handler('POST /iam/logout')(async (_input, ctx) => {
  logoutService(ctx);
});

/** Returns the currently authenticated user with their sub-profile. */
const MeHandler = api.handler('GET /iam/me')(async (input, ctx) => {
  return meService(input, ctx);
});
//#endregion

//#region STAFF HANDLERS
/**
 * Authenticates STAFF or AUTHORITY users for the internal panel.
 * Returns FORBIDDEN (not INVALID_CREDENTIALS) when a CUSTOMER attempts access,
 * so the panel can show a helpful error without leaking user existence.
 */
const StaffLoginHandler = api.handler('POST /staff/login')(async (input, ctx) => {
  const user = await staffLoginService(input);
  issueTokens(ctx.res, user);
  return user;
});
//#endregion

//#region ROUTERS
export const IAMRouter = api.router([
  LoginHandler,
  RegisterHandler,
  LogoutHandler,
  MeHandler,
  StaffLoginHandler,
]);
//#endregion
