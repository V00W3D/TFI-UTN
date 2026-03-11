import { z } from 'zod';
import { CORE } from '../CoreSchema';
import { createContract } from '@tools/ContractFactory';

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

export const LoginSchema = createContract(LoginInputSchema, LoginSuccessSchema);

/* ============================================================
   TYPES
============================================================ */

export type LoginInput = z.infer<typeof LoginInputSchema>;
export type LoginOutput = z.infer<typeof LoginSchema.O>;
