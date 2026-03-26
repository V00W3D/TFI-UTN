import * as jwt from 'jsonwebtoken';
import { api } from '../../../tools/api';
import { loginService } from '../services/LoginService';
import { SESSION_SECRET, REFRESH_SECRET, BUN_MODE } from '../../../env';

/** @description Configuration for secure, HttpOnly authentication cookies. */
const COOKIE_BASE = { httpOnly: true, secure: BUN_MODE === 'prod', sameSite: 'strict' as const };

/**
 * @description Authentication Handler (POST /iam/login).
 * Orchestrates the identity verification process and establishes a secure session via JWT cookies.
 * 1. Delegates credential validation to the loginService.
 * 2. Issues 'CupCake' (Access) and 'Cake' (Refresh) cookies upon success.
 */
export const LoginHandler = api.handler('POST /iam/login')(async (input, { res }) => {
  const user = await loginService(input);
  const payload = {
    id: user.id,
    role: user.role,
    username: user.username,
    email: user.email,
    phone: user.phone,
    profile: user.profile,
  };
  res.cookie('CupCake', jwt.sign(payload, SESSION_SECRET, { expiresIn: '1h' }), {
    ...COOKIE_BASE,
    maxAge: 3600000,
  });
  res.cookie('Cake', jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' }), {
    ...COOKIE_BASE,
    maxAge: 604800000,
  });
  return user;
});
