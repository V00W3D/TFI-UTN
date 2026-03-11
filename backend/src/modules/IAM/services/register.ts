import type { RegisterInput } from '@shared/contracts/RegisterSchema';
import { prisma } from '@tools/db';
import argon2 from 'argon2';

export const registerService = async (input: RegisterInput) => {
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
