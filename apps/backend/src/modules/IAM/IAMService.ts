import argon2 from 'argon2';
import { prisma } from '@tools/db';
import { ERR } from '@app/sdk';
import type { InferRequest, InferSuccess, RequestContext } from '@app/sdk';
import type { UserPayload } from '@middleware/authMiddleware';
import type { LoginContract, RegisterContract, MeContract } from '@app/contracts';

//#region CONSTANTS
const TIMING_SAFE_FAKE_HASH = '$argon2id$v=19$m=65536,t=3,p=4$C29tZXNhbHQ$9KjQ7xL9W8N7Zp7Kz1nG9w';

const INTERNAL_ROLES = new Set(['STAFF', 'AUTHORITY'] as const);
//#endregion

//#region SERVICES
export async function loginService(
  input: InferRequest<typeof LoginContract>,
): Promise<InferSuccess<typeof LoginContract>> {
  const found = await prisma.user.findFirst({
    where: {
      OR: [{ username: input.identity }, { email: input.identity }, { phone: input.identity }],
    },
    select: { id: true, password: true, role: true },
  });

  const isValid = await argon2.verify(found?.password ?? TIMING_SAFE_FAKE_HASH, input.password);
  if (!found || !isValid) throw ERR.INVALID_CREDENTIALS();

  if (!INTERNAL_ROLES.has(found.role as 'STAFF' | 'AUTHORITY')) {
    throw ERR.FORBIDDEN();
  }

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

  if (!row) throw ERR.NOT_FOUND(['id']);

  return {
    id: row.id,
    username: row.username,
    email: row.email,
    phone: row.phone,
    role: row.role,
    profile: {
      ...(row.customer && { tier: row.customer.tier }),
      ...(row.staff && { post: row.staff.post }),
      ...(row.authority && { rank: row.authority.rank }),
    },
  };
}

export async function registerService(input: InferRequest<typeof RegisterContract>): Promise<void> {
  const { username, name, lname, sname, sex, email, phone, password } = input;
  const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: name,
        sname: sname,
        lname: lname,
        sex: sex as never,
        username: username,
        email: email,
        phone: phone,
        password: hashedPassword,
      },
      select: { id: true },
    });

    await tx.customerProfile.create({ data: { userId: user.id } });
  });
}

export function logoutService(ctx: RequestContext): void {
  const opts = { httpOnly: true, secure: true, sameSite: 'strict' as const };
  ctx.res.clearCookie('CupCake', opts);
  ctx.res.clearCookie('Cake', opts);
}

export async function meService(
  _input: void,
  ctx: RequestContext,
): Promise<InferSuccess<typeof MeContract>> {
  const session = ctx.req.user as UserPayload | undefined;
  if (!session?.id) throw ERR.UNAUTHORIZED();

  const row = await prisma.user.findUnique({
    where: { id: session.id },
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

  if (!row) throw ERR.NOT_FOUND(['id']);

  return {
    id: row.id,
    username: row.username,
    email: row.email,
    phone: row.phone,
    role: row.role,
    profile: {
      ...(row.customer && { tier: row.customer.tier }),
      ...(row.staff && { post: row.staff.post }),
      ...(row.authority && { rank: row.authority.rank }),
    },
  };
}
//#endregion
