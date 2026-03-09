import type { RegisterInput } from '@contracts/RegisterSchema';
import { prisma } from '@config/pg';
import argon2 from 'argon2';

export const RegisterService = async (input: RegisterInput) => {
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
