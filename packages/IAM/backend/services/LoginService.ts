import type { LoginType } from '../schemas/LoginSchema';
import pg from '@backend/pgsql';
import argon2 from 'argon2';

export const LoginService = async (input: LoginType) => {
  const { identity, password } = input;

  const result = await pg.query(
    `
    SELECT id, username, email, phone, password, role
    FROM users
    WHERE username = $1
       OR email = $1
       OR phone = $1
    LIMIT 1
    `,
    [identity],
  );

  const user = result.rows[0];

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
