/**
 * @file verifyUpdateService.ts
 * @module IAM
 * @description Valida tokens de verificacion y aplica cambios sensibles al perfil autenticado.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-06
 * rnf: RNF-02
 *
 * @business
 * inputs: userId autenticado, tipo de cambio y token
 * outputs: usuario autenticado actualizado
 * rules: token vigente; aplicar password/email/phone segun tipo; invalidar tokens usados
 *
 * @technical
 * dependencies: argon2, @app/sdk, @app/contracts, prisma, buildAuthUser
 * flow: busca token; valida expiracion; actualiza user en transaccion; borra tokens; reconstruye auth user
 *
 * @estimation
 * complexity: Medium
 * fpa: EI
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-IAM-VERIFY-01
 *
 * @notes
 * decisions: se centraliza toda la mutacion en una transaccion funcional y sin classes
 */
import * as argon2 from 'argon2';
import { ERR, type InferRequest, type InferSuccess } from '@app/sdk';
import type { VerifyUpdateContract } from '@app/contracts';
import { prisma } from '../../../tools/db';
import { buildAuthUser } from './buildAuthUser';

export const verifyUpdateService = async (
  userId: string,
  input: InferRequest<typeof VerifyUpdateContract>,
): Promise<InferSuccess<typeof VerifyUpdateContract>> => {
  const verification = await prisma.verificationToken.findFirst({
    where: {
      userId,
      type: input.type,
      token: input.token.trim(),
    },
  });

  if (!verification || verification.expiresAt.getTime() < Date.now()) {
    throw ERR.UNAUTHORIZED(['token']);
  }

  const updatedUser = await prisma.$transaction(async (tx) => {
    if (input.type === 'PASSWORD_CHANGE') {
      if (!input.newPassword) throw ERR.VALIDATION(['newPassword']);

      await tx.user.update({
        where: { id: userId },
        data: {
          password: await argon2.hash(input.newPassword),
        },
      });
    }

    if (input.type === 'EMAIL_CHANGE') {
      const nextEmail = verification.payload?.trim().toLowerCase();
      if (!nextEmail) {
        await tx.user.update({
          where: { id: userId },
          data: { emailVerified: true },
        });
      } else {
        await tx.user.update({
          where: { id: userId },
          data: {
            email: nextEmail,
            emailVerified: true,
          },
        });
      }
    }

    if (input.type === 'PHONE_CHANGE') {
      const nextPhone = verification.payload?.trim();
      if (!nextPhone) {
        await tx.user.update({
          where: { id: userId },
          data: { phoneVerified: true },
        });
      } else {
        await tx.user.update({
          where: { id: userId },
          data: {
            phone: nextPhone,
            phoneVerified: true,
          },
        });
      }
    }

    await tx.verificationToken.deleteMany({
      where: {
        userId,
        type: input.type,
      },
    });

    const user = await tx.user.findUnique({
      where: { id: userId },
      include: {
        customer: { select: { tier: true } },
        staff: { select: { post: true } },
        authority: { select: { rank: true } },
      },
    });

    if (!user) throw ERR.NOT_FOUND();
    return user;
  });

  return buildAuthUser(updatedUser);
};
