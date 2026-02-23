import type { RegisterType } from '../schemas/RegisterSchema';
import pg from '@b-config/pgsql';
import argon2 from 'argon2';

export const RegisterService = async (input: RegisterType) => {
  const { name, s_name, l_name, sex, username, password, email, phone } = input;

  const password_hash = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  try {
    await pg.query(
      `INSERT INTO users(name,s_name,l_name,sex,username,password,email,phone)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
      [name, s_name, l_name, sex, username, password_hash, email, phone],
    );
  } catch (err: any) {
    if (err.code === '23505') {
      if (err.constraint?.includes('username')) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      if (err.constraint?.includes('email')) {
        throw new Error('El correo electrónico ya está en uso');
      }

      if (err.constraint?.includes('phone')) {
        throw new Error('El número de teléfono ya está en uso');
      }

      throw new Error('Ya existe una cuenta con esos datos');
    }

    throw err;
  }
};
