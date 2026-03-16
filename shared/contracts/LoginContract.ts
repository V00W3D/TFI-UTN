import { readonly, z } from 'zod';
import { CORE } from '../CoreSchema';
import { createContract } from '../ContractFactory';

/* ============================================================
INPUT SCHEMA
============================================================ */

export const LoginInputSchema = z.object({
  identity: CORE.identity,
  password: z.string().trim().min(1, 'La contraseña es obligatoria'),
});

/* ============================================================
SUCCESS SCHEMA
============================================================ */

export const LoginSuccessSchema = z.object({
  id: z.uuid(),
  username: CORE.username,
  email: CORE.email,
  phone: CORE.phone,
  role: z.string(),
});

/* ============================================================
CONTRACT
============================================================ */

export const LoginContract = createContract('public', 'POST', '/iam/login')
  .IO(LoginInputSchema, LoginSuccessSchema)
  .doc('Session initializer', 'Lets an existing user have access to the app')
  .build();
