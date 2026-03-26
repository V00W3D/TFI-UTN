import { api } from '../../../tools/api';

/**
 * @description Logout Handler (POST /iam/logout).
 * Terminates the user session by clearing all authentication cookies.
 */
export const LogoutHandler = api.handler('POST /iam/logout')(async (_input, { res }) => {
  res.clearCookie('CupCake');
  res.clearCookie('Cake');
});
