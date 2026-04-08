/**
 * @file requestTokenService.ts
 * @module IAM
 * @description Emite tokens cortos de verificacion para cambios sensibles del perfil.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-06
 * rnf: RNF-02
 *
 * @business
 * inputs: userId autenticado y tipo de verificacion
 * outputs: token persistido con expiracion
 * rules: un token activo por tipo; evitar email/phone duplicados; expirar en 10 minutos
 *
 * @technical
 * dependencies: @app/sdk, @app/contracts, prisma
 * flow: normaliza destino; valida unicidad; reemplaza tokens previos; guarda token nuevo y loguea emision
 *
 * @estimation
 * complexity: Medium
 * fpa: EI
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-IAM-TOKEN-01
 *
 * @notes
 * decisions: los helpers y service se expresan como arrows para respetar context.md
 */
import { ERR, type InferRequest } from '@app/sdk';
import type { RequestTokenContract } from '@app/contracts';
import { prisma } from '../../../tools/db';

const TOKEN_EXPIRATION_MINUTES = 10;

const normalizeTarget = (
  type: InferRequest<typeof RequestTokenContract>['type'],
  targetVal?: string,
) => {
  const trimmed = targetVal?.trim();
  if (!trimmed) return undefined;

  if (type === 'EMAIL_CHANGE') return trimmed.toLowerCase();
  return trimmed;
};

const buildToken = () => Math.floor(100000 + Math.random() * 900000).toString();

export const requestTokenService = async (
  userId: string,
  input: InferRequest<typeof RequestTokenContract>,
): Promise<void> => {
  const normalizedTarget = normalizeTarget(input.type, input.targetVal);

  if (input.type === 'EMAIL_CHANGE' && normalizedTarget) {
    const exists = await prisma.user.findFirst({
      where: {
        id: { not: userId },
        email: { equals: normalizedTarget, mode: 'insensitive' },
      },
      select: { id: true },
    });

    if (exists) throw ERR.ALREADY_EXISTS(['email']);
  }

  if (input.type === 'PHONE_CHANGE' && normalizedTarget) {
    const exists = await prisma.user.findFirst({
      where: {
        id: { not: userId },
        phone: normalizedTarget,
      },
      select: { id: true },
    });

    if (exists) throw ERR.ALREADY_EXISTS(['phone']);
  }

  const token = buildToken();
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MINUTES * 60 * 1000);

  await prisma.$transaction([
    prisma.verificationToken.deleteMany({
      where: {
        userId,
        type: input.type,
      },
    }),
    prisma.verificationToken.create({
      data: {
        userId,
        type: input.type,
        token,
        payload: normalizedTarget ?? null,
        expiresAt,
      },
    }),
  ]);

  const channel =
    input.type === 'EMAIL_CHANGE'
      ? normalizedTarget || 'email actual'
      : input.type === 'PHONE_CHANGE'
        ? normalizedTarget || 'teléfono actual'
        : 'canal seguro';

  console.log(
    `[IAM] Verification token for ${input.type} (${channel}) user=${userId}: ${token} expires=${expiresAt.toISOString()}`,
  );
};
