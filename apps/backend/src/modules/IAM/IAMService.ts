import argon2 from 'argon2';
import { IAMRepository } from './IAMRepository';
import type { AuthenticatedUserWithProfile } from './IAMRepository';
import { ERR } from '@app/sdk';
import type { InferRequest, InferSuccess, RequestContext } from '@app/sdk';
import type { UserPayload } from '@middleware/authMiddleware';
import type {
  LoginContract,
  RegisterContract,
  MeContract,
  StaffLoginContract,
} from '@app/contracts';

//#region CONSTANTS
/** Fake hash — ensures argon2 always runs even when the user doesn't exist. Prevents timing attacks. */
const TIMING_SAFE_FAKE_HASH = '$argon2id$v=19$m=65536,t=3,p=4$C29tZXNhbHQ$9KjQ7xL9W8N7Zp7Kz1nG9w';

/** Roles allowed to authenticate through the internal panel. */
const INTERNAL_ROLES = new Set(['STAFF', 'AUTHORITY'] as const);
//#endregion

//#region AUTH_HELPERS
/**
 * @internal Core credential verification — shared by loginService and staffLoginService.
 * Always runs argon2 regardless of whether the user exists (prevents timing enumeration).
 * @throws {@link ERR.INVALID_CREDENTIALS} on wrong identity or password.
 */
async function verifyCredentials(
  identity: string,
  password: string,
): Promise<AuthenticatedUserWithProfile> {
  const user = await IAMRepository.findUserByIdentity(identity);

  const hash = user?.password ?? TIMING_SAFE_FAKE_HASH;
  const isValid = await argon2.verify(hash, password);

  if (!user || !isValid) throw ERR.INVALID_CREDENTIALS();

  const withProfile = await IAMRepository.findUserWithProfile(user.id);
  if (!withProfile) throw ERR.NOT_FOUND(['id']);

  return withProfile;
}
//#endregion

//#region LOGIN_SERVICE
/**
 * Authenticates any user (customer, staff, or authority) — public app entry point.
 * @throws {@link ERR.INVALID_CREDENTIALS} on wrong identity or password.
 */
export async function loginService(
  input: InferRequest<typeof LoginContract>,
): Promise<InferSuccess<typeof LoginContract>> {
  return verifyCredentials(input.identity, input.password);
}
//#endregion

//#region STAFF_LOGIN_SERVICE
/**
 * Authenticates a STAFF or AUTHORITY user — internal panel entry point.
 * Reuses {@link verifyCredentials} and adds a role gate.
 * @throws {@link ERR.INVALID_CREDENTIALS} on wrong identity or password.
 * @throws {@link ERR.FORBIDDEN} when the user exists but is a CUSTOMER.
 */
export async function staffLoginService(
  input: InferRequest<typeof StaffLoginContract>,
): Promise<InferSuccess<typeof StaffLoginContract>> {
  const user = await verifyCredentials(input.identity, input.password);
  if (!INTERNAL_ROLES.has(user.role as 'STAFF' | 'AUTHORITY')) throw ERR.FORBIDDEN();
  return user;
}
//#endregion

//#region REGISTER_SERVICE
/**
 * Creates a new CUSTOMER account.
 * - Strips `cpassword` (already validated by RegisterInputSchema.superRefine).
 * - Hashes `password` with argon2id before persisting.
 * - Creates User + CustomerProfile (tier: REGULAR) in a transaction.
 * @throws Prisma P2002 → ErrorTools maps to {@link ERR.ALREADY_EXISTS}.
 */
export async function registerService(input: InferRequest<typeof RegisterContract>): Promise<void> {
  const { cpassword: _stripped, password, ...rest } = input;
  const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });
  await IAMRepository.createCustomer({ ...rest, password: hashedPassword });
}
//#endregion

//#region LOGOUT_SERVICE
/** Clears the CupCake (access) and Cake (refresh) HttpOnly cookies. No DB interaction. */
export function logoutService(ctx: RequestContext): void {
  const opts = { httpOnly: true, secure: true, sameSite: 'strict' as const };
  ctx.res.clearCookie('CupCake', opts);
  ctx.res.clearCookie('Cake', opts);
}
//#endregion

//#region ME_SERVICE
/**
 * Returns the currently authenticated user with their sub-profile.
 * Reads `req.user` (set by authMiddleware) for the session id, then fetches
 * fresh data from the DB to avoid returning stale JWT payload data.
 * @throws {@link ERR.UNAUTHORIZED} when authMiddleware didn't attach a user (safety net).
 * @throws {@link ERR.NOT_FOUND} when the user no longer exists in the DB.
 */
export async function meService(
  _input: void,
  ctx: RequestContext,
): Promise<InferSuccess<typeof MeContract>> {
  // Read from req.user — set by authMiddleware, consistent with the Express standard.
  const session = ctx.req.user as UserPayload | undefined;
  if (!session?.id) throw ERR.UNAUTHORIZED();

  const user = await IAMRepository.findUserWithProfile(session.id);
  if (!user) throw ERR.NOT_FOUND(['id']);

  return user;
}
//#endregion
