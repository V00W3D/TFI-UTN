/**
 * @file UpdateMeService.ts
 * @module IAM
 * @description Actualiza el perfil del usuario autenticado filtrando campos indefinidos.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-05
 * rnf: RNF-05
 *
 * @business
 * inputs: userId autenticado y payload parcial del perfil
 * outputs: usuario autenticado reconstruido para el frontend
 * rules: ignorar undefined; actualizar solo al usuario autenticado; preservar shape de auth
 *
 * @technical
 * dependencies: @app/sdk, @app/contracts, prisma, buildAuthUser
 * flow: limpia input; actualiza usuario; incluye perfiles; reconstruye respuesta auth
 *
 * @estimation
 * complexity: Medium
 * fpa: EI
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-IAM-UPDATE-01
 *
 * @notes
 * decisions: el service se expresa con arrow function para cumplir context.md
 */
import type { InferRequest, InferSuccess } from '@app/sdk';
import type { UpdateMeContract } from '@app/contracts';
import { prisma } from '../../../tools/db';
import { buildAuthUser } from './buildAuthUser';

export const updateMeService = async (
  userId: string,
  input: InferRequest<typeof UpdateMeContract>,
): Promise<InferSuccess<typeof UpdateMeContract>> => {
  const cleanInput = Object.fromEntries(Object.entries(input).filter(([_, v]) => v !== undefined));

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: cleanInput,
    include: {
      customer: { select: { tier: true } },
      staff: { select: { post: true } },
      authority: { select: { rank: true } },
    },
  });

  return buildAuthUser(updatedUser);
};
