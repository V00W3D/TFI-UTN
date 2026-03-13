import { conductor } from '@tools/conductor';
import { loginService } from '../services/login';
import jwt from 'jsonwebtoken';
import { SESSION_SECRET, REFRESH_SECRET, BUN_MODE } from '@env';
import { LoginContract } from '@shared/contracts/LoginContract';

/* =========================================================
REGISTER ENDPOINT
========================================================= */

export default conductor(LoginContract, async (input, req) => {
  const user = await loginService(input);

  const accessToken = jwt.sign(user, SESSION_SECRET, {
    expiresIn: '1h',
  });

  const refreshToken = jwt.sign(user, REFRESH_SECRET, {
    expiresIn: '7d',
  });

  const res = req.res!;

  res.cookie('CupCake', accessToken, {
    httpOnly: true,
    secure: BUN_MODE === 'prod',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60,
  });

  res.cookie('Cake', refreshToken, {
    httpOnly: true,
    secure: BUN_MODE === 'prod',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return user;
});
