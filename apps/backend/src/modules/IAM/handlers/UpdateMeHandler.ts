import { api } from '../../../tools/api';
import { updateMeService } from '../services/UpdateMeService';
import { ERR } from '@app/sdk';
import * as jwt from 'jsonwebtoken';
import { SESSION_SECRET, REFRESH_SECRET, BUN_MODE } from '../../../env';

const COOKIE_BASE = { httpOnly: true, secure: BUN_MODE === 'prod', sameSite: 'strict' as const };

export const UpdateMeHandler = api.handler('PATCH /iam/me')(async (input, { req, res }) => {
  if (!req.user) throw ERR.UNAUTHORIZED();

  const updatedUser = await updateMeService(req.user.id, input);

  // Remint the tokens to include the updated profile information in the payload
  const tokenPayload = {
    id: updatedUser.id,
    username: updatedUser.username,
    name: updatedUser.name,
    sname: updatedUser.sname,
    lname: updatedUser.lname,
    sex: updatedUser.sex,
    email: updatedUser.email,
    emailVerified: updatedUser.emailVerified,
    phone: updatedUser.phone,
    phoneVerified: updatedUser.phoneVerified,
    role: updatedUser.role,
    profile: { ...updatedUser.profile },
  };

  res.cookie('CupCake', jwt.sign(tokenPayload, SESSION_SECRET, { expiresIn: '1h' }), {
    ...COOKIE_BASE,
    maxAge: 3600000,
  });

  res.cookie('Cake', jwt.sign(tokenPayload, REFRESH_SECRET, { expiresIn: '7d' }), {
    ...COOKIE_BASE,
    maxAge: 604800000,
  });

  return updatedUser;
});
