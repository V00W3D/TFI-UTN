import { api } from '../../../tools/api';
import { BUN_MODE } from '../../../env';

/** @description Shared cookie settings used to clear auth cookies reliably. */
const COOKIE_BASE = { httpOnly: true, secure: BUN_MODE === 'prod', sameSite: 'strict' as const };

/**
 * @description Logout Handler (POST /iam/logout).
 * Terminates the current session by clearing both auth cookies with matching options.
 */
export const LogoutHandler = api.handler('POST /iam/logout')(async (_input, { res }) => {
  res.clearCookie('CupCake', COOKIE_BASE);
  res.clearCookie('Cake', COOKIE_BASE);
});
