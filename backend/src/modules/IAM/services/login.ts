import { prisma } from '@tools/db';
import type { LoginInput } from '@shared/contracts/LoginSchema';
import { ERR } from '@tools/ErrorTools';
import argon2 from 'argon2';

export const loginService = async (input: LoginInput) => {
  const { identity, password } = input;

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

  const FAKE_HASH = '$argon2id$v=19$m=65536,t=3,p=4$C29tZXNhbHQ$9KjQ7xL9W8N7Zp7Kz1nG9w';

  if (!user) {
    await argon2.verify(FAKE_HASH, password);
    throw ERR.INVALID_CREDENTIALS();
  }

  const validPassword = await argon2.verify(user.password, password);

  if (!validPassword) {
    throw ERR.INVALID_CREDENTIALS();
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
};
