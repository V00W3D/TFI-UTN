/**
 * @file LoginService.ts
 * @module IAM
 * @description Autentica al usuario por identidad flexible y devuelve el perfil auth compacto.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-02
 * rnf: RNF-02
 *
 * @business
 * inputs: identity y password
 * outputs: payload auth para cookies/JWT y frontend
 * rules: resistir timing attacks; aceptar username, email o phone; rechazar credenciales invalidas
 *
 * @technical
 * dependencies: argon2, @app/sdk, @app/contracts, prisma, buildAuthUser
 * flow: normaliza identity; busca usuario; verifica hash; carga perfil; construye auth user
 *
 * @estimation
 * complexity: Medium
 * fpa: EI
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-IAM-LOGIN-01
 *
 * @notes
 * decisions: se conserva FAKE_HASH para mitigar filtraciones temporales sin usar classes
 */
import * as argon2 from 'argon2';
import { ERR, type InferRequest, type InferSuccess } from '@app/sdk';
import type { LoginContract } from '@app/contracts';
import { prisma } from '../../../tools/db';
import { buildAuthUser } from './buildAuthUser';

/** @description Cryptographic constant used to mitigate timing attacks on nonexistent accounts. */
const FAKE_HASH = '$argon2id$v=19$m=65536,t=3,p=4$C29tZXNhbHQ$9KjQ7xL9W8N7Zp7Kz1nG9w';

/**
 * @description Authentication Logic.
 * Verifies user identity (username, email, or phone) and validates the password hash.
 * Returns a compact auth payload optimized for JWT embedding and /me hydration.
 */
export const loginService = async (
  input: InferRequest<typeof LoginContract>,
): Promise<InferSuccess<typeof LoginContract>> => {
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
      name: true,
      sname: true,
      lname: true,
      sex: true,
      email: true,
      emailVerified: true,
      phone: true,
      phoneVerified: true,
      role: true,
      customer: { select: { tier: true } },
      staff: { select: { post: true } },
      authority: { select: { rank: true } },
    },
  });

  if (!row) throw ERR.NOT_FOUND();
  return buildAuthUser(row);
};
