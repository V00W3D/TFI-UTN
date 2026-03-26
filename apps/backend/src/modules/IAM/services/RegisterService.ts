import * as argon2 from 'argon2';
import { type InferRequest, type InferSuccess } from '@app/sdk';
import type { RegisterContract } from '@app/contracts';
import { prisma } from '../../../tools/db';

/**
 * @description User Registration Logic.
 * 1. Hashes the raw password using Argon2 for secure storage.
 * 2. Persists the new user record in the database.
 * @throws AppError if constraints are violated (handled by ErrorTools).
 */
export async function registerService(
  input: InferRequest<typeof RegisterContract>,
): Promise<InferSuccess<typeof RegisterContract>> {
  const password = await argon2.hash(input.password);
  await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      phone: input.phone,
      password,
      role: 'CUSTOMER',
      name: input.name,
      sname: input.sname,
      lname: input.lname,
      customer: { create: { tier: 'REGULAR' } },
    },
  });
}
