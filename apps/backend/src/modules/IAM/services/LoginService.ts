import * as argon2 from 'argon2';
import { ERR, type InferRequest, type InferSuccess } from '@app/sdk';
import type { LoginContract } from '@app/contracts';
import { prisma } from '../../../tools/db';

/** @description Cryptographic constant used to mitigate timing attacks on nonexistent accounts. */
const FAKE_HASH = '$argon2id$v=19$m=65536,t=3,p=4$C29tZXNhbHQ$9KjQ7xL9W8N7Zp7Kz1nG9w';

type AuthRow = {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  role: InferSuccess<typeof LoginContract>['role'];
  customer: { tier: InferSuccess<typeof LoginContract>['profile']['tier'] } | null;
  staff: { post: InferSuccess<typeof LoginContract>['profile']['post'] } | null;
  authority: { rank: InferSuccess<typeof LoginContract>['profile']['rank'] } | null;
};

const buildAuthUser = (row: AuthRow): InferSuccess<typeof LoginContract> => ({
  id: row.id,
  username: row.username,
  email: row.email,
  phone: row.phone ?? null,
  role: row.role,
  profile: {
    ...(row.customer?.tier ? { tier: row.customer.tier } : {}),
    ...(row.staff?.post ? { post: row.staff.post } : {}),
    ...(row.authority?.rank ? { rank: row.authority.rank } : {}),
  },
});

/**
 * @description Authentication Logic.
 * Verifies user identity (username, email, or phone) and validates the password hash.
 * Returns a compact auth payload optimized for JWT embedding and /me hydration.
 */
export async function loginService(
  input: InferRequest<typeof LoginContract>,
): Promise<InferSuccess<typeof LoginContract>> {
  const identity = input.identity.trim();

  const found = await prisma.user.findFirst({
    where: {
      OR: [
        { username: { equals: identity, mode: 'insensitive' } },
        { email: { equals: identity, mode: 'insensitive' } },
        { phone: identity },
      ],
    },
    select: {
      id: true,
      password: true,
    },
  });

  const hashToVerify = found?.password ?? FAKE_HASH;
  const passwordMatches = await argon2.verify(hashToVerify, input.password);
  if (!found || !passwordMatches) throw ERR.UNAUTHORIZED();

  const row = await prisma.user.findUnique({
    where: { id: found.id },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      role: true,
      customer: { select: { tier: true } },
      staff: { select: { post: true } },
      authority: { select: { rank: true } },
    },
  });

  if (!row) throw ERR.NOT_FOUND();
  return buildAuthUser(row);
}
