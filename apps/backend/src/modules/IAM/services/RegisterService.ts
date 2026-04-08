/**
 * @file RegisterService.ts
 * @module IAM
 * @description Registra un nuevo usuario customer persistiendo datos normalizados y password hasheado.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-01
 * rnf: RNF-02
 *
 * @business
 * inputs: datos de registro del usuario
 * outputs: creacion de cuenta customer
 * rules: hashear password; normalizar username y email; crear customer profile inicial
 *
 * @technical
 * dependencies: argon2, @app/sdk, @app/contracts, prisma
 * flow: hashea password; normaliza texto; crea user y customer asociado
 *
 * @estimation
 * complexity: Medium
 * fpa: EI
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-IAM-REGISTER-01
 *
 * @notes
 * decisions: se prioriza persistencia directa y funcional sin function keyword
 */
import * as argon2 from 'argon2';
import { type InferRequest, type InferSuccess } from '@app/sdk';
import type { RegisterContract } from '@app/contracts';
import { prisma } from '../../../tools/db';

/**
 * @description User Registration Logic.
 * Persists a normalized customer account that matches the current Prisma schema.
 */
export const registerService = async (
  input: InferRequest<typeof RegisterContract>,
): Promise<InferSuccess<typeof RegisterContract>> => {
  const password = await argon2.hash(input.password);

  await prisma.user.create({
    data: {
      name: input.name.trim(),
      sname: input.sname?.trim() ?? null,
      lname: input.lname.trim(),
      sex: input.sex,
      username: input.username.trim().toLowerCase(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone ?? null,
      password,
      role: 'CUSTOMER',
      customer: {
        create: {
          tier: 'REGULAR',
        },
      },
    },
  });
};
