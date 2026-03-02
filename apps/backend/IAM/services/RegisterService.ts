import type { RegisterType } from '../schemas/RegisterSchema';
import { prisma } from '@db';
import argon2 from 'argon2';

export const RegisterService = async (input: RegisterType) => {
  const { name, sname, lname, sex, username, email, phone } = input;
  const password = await argon2.hash(input.password, {
    type: argon2.argon2id,
  });

  try {
    await prisma.user.create({
      data: {
        name,
        sname, // ojo con el camelCase del modelo
        lname,
        sex,
        username,
        password,
        email,
        phone,
      },
    });
  } catch (err: any) {
    // Prisma unique constraint error
    if (err.code === 'P2002') {
      const target = err.meta?.target;

      if (target?.includes('username')) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      if (target?.includes('email')) {
        throw new Error('El correo electrónico ya está en uso');
      }

      if (target?.includes('phone')) {
        throw new Error('El número de teléfono ya está en uso');
      }

      throw new Error('Ya existe una cuenta con esos datos');
    }

    throw err;
  }
};
