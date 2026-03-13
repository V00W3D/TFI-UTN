import { z } from 'zod';
import { CORE } from '../CoreSchema';
import { ContractFactory } from '../ContractFactory';

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

export const LoginContract = ContractFactory({
  method: 'POST',
  path: '/iam/login',
  access: 'public',
  summary: 'Authenticate user',
  description: 'Validates user credentials and returns session data',
  tags: ['IAM', 'Auth'],
  cache: 'no-store',
  input: LoginInputSchema,
  success: LoginSuccessSchema,
});
