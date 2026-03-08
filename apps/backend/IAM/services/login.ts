import type { LoginInput } from '@contracts/LoginSchema';
import { prisma } from '@db';
import argon2 from 'argon2';

export const LoginService = async (input: LoginInput) => {
  const { identity, password } = input;

  // Prisma permite OR directamente
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: identity }, { email: identity }, { phone: identity }],
    },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      password: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const validPassword = await argon2.verify(user.password, password);

  if (!validPassword) {
    throw new Error('Credenciales inválidas');
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
};
