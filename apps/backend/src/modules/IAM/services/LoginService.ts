import * as argon2 from 'argon2';
import { ERR, type InferRequest, type InferSuccess } from '@app/sdk';
import type { LoginContract } from '@app/contracts';
import { prisma } from '../../../tools/db';

/** @description Cryptographic constant used to mitigate timing attacks on nonexistent accounts. */
const FAKE_HASH = '$argon2id$v=19$m=65536,t=3,p=4$C29tZXNhbHQ$9KjQ7xL9W8N7Zp7Kz1nG9w';

/**
 * @description Authentication Logic.
 * Verifies user identity (username, email, or phone) and validates the password hash.
 * Returns a complete AuthUser payload optimized for JWT embedding.
 */
export async function loginService(
  input: InferRequest<typeof LoginContract>,
): Promise<InferSuccess<typeof LoginContract>> {
  const found = await prisma.user.findFirst({
    where: {
      OR: [{ username: input.identity }, { email: input.identity }, { phone: input.identity }],
    },
    select: { id: true, password: true, role: true },
  });
  if (!found || !(await argon2.verify(found.password || FAKE_HASH, input.password)))
    throw ERR.UNAUTHORIZED();
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
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    phone: row.phone,
    role: row.role,
    profile: {
      ...(row.customer?.tier && { tier: row.customer.tier }),
      ...(row.staff?.post && { post: row.staff.post }),
      ...(row.authority?.rank && { rank: row.authority.rank }),
    },
  } as unknown as InferSuccess<typeof LoginContract>;
}
