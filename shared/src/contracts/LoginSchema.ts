import { z } from 'zod';
import { CORE } from '../CoreSchema';
import { createContract } from '../ContractFactory';

/* ============================================================
   LOGIN CONTRACT
============================================================ */

export const LoginSchema = createContract(
  /* ---------------------------
     INPUT
  ---------------------------- */
  z.object({
    identity: CORE.identity,
    password: z.string().trim().min(1, 'La contraseña es obligatoria'),
  }),

  /* ---------------------------
     OUTPUT DATA
  ---------------------------- */
  z
    .object({
      id: z.uuid(),

      username: CORE.username,
      email: CORE.email,

      // Prisma devuelve string | null
      phone: CORE.phone,

      role: z.string(),
    })
    .readonly(),
);
export type LoginInput = z.infer<typeof LoginSchema.I>;
export type LoginOutput = z.infer<typeof LoginSchema.O>;
export type LoginError = z.infer<typeof LoginSchema.E>;
