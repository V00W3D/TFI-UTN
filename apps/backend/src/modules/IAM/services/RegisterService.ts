import * as argon2 from 'argon2';
import { type InferRequest, type InferSuccess } from '@app/sdk';
import type { RegisterContract } from '@app/contracts';
import { prisma } from '../../../tools/db';

/**
 * @description User Registration Logic.
 * Persists a normalized customer account that matches the current Prisma schema.
 */
export async function registerService(
  input: InferRequest<typeof RegisterContract>,
): Promise<InferSuccess<typeof RegisterContract>> {
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
}
