import { z } from 'zod';
import type { RegisterContract } from '@shared/contracts/RegisterContract';
import { prisma } from '@tools/ApiFactory';
import argon2 from 'argon2';

export const registerService = async (input: z.infer<typeof RegisterContract.__requestSchema>) => {
  const { name, sname, lname, sex, username, email, phone } = input;

  const password = await argon2.hash(input.password, {
    type: argon2.argon2id,
  });

  await prisma.user.create({
    data: {
      name,
      sname,
      lname,
      sex,
      username,
      password,
      email,
      phone,
    },
  });
};
