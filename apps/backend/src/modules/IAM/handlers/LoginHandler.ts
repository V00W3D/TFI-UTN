import * as jwt from 'jsonwebtoken';
import { api } from '../../../tools/api';
import { loginService } from '../services/LoginService';
import { SESSION_SECRET, REFRESH_SECRET, BUN_MODE } from '../../../env';

/** @description Configuration for secure, HttpOnly authentication cookies. */
const COOKIE_BASE = { httpOnly: true, secure: BUN_MODE === 'prod', sameSite: 'strict' as const };

/**
 * @description Authentication Handler (POST /iam/login).
 * Validates credentials, issues both JWT cookies, and returns the authenticated subject.
 */
export const LoginHandler = api.handler('POST /iam/login')(async (input, { res }) => {
  const user = await loginService(input);

  const tokenPayload = {
    id: user.id,
    username: user.username,
    name: user.name,
    sname: user.sname ?? null,
    lname: user.lname,
    sex: user.sex,
    email: user.email,
    emailVerified: user.emailVerified,
    phone: user.phone ?? null,
    phoneVerified: user.phoneVerified,
    role: user.role,
    profile: { ...user.profile },
  };

  res.cookie('CupCake', jwt.sign(tokenPayload, SESSION_SECRET, { expiresIn: '1h' }), {
    ...COOKIE_BASE,
    maxAge: 3600000,
  });

  res.cookie('Cake', jwt.sign(tokenPayload, REFRESH_SECRET, { expiresIn: '7d' }), {
    ...COOKIE_BASE,
    maxAge: 604800000,
  });

  return user;
});
