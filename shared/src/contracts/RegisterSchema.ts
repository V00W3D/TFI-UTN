import { z } from 'zod';
import { CORE } from '../CoreSchema';
import { createContract } from '../ContractFactory';
import type { ContractType } from '../ContractFactory';

/* ============================================================
   REGISTER CONTRACT
============================================================ */

export const RegisterSchema = createContract(
  /* ---------------------------
     INPUT
  ---------------------------- */
  z
    .object({
      name: CORE.name,
      sname: CORE.name.nullable(),
      lname: CORE.name,
      sex: CORE.sex,
      username: CORE.username,
      password: CORE.password,
      cpassword: CORE.cpassword,
      email: CORE.email,
      phone: CORE.phone,
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.cpassword) {
        ctx.addIssue({
          path: ['cpassword'], // ← importantísimo
          code: z.ZodIssueCode.custom,
          message: 'Las contraseñas no coinciden',
        });
      }
    }),

  /* ---------------------------
     OUTPUT DATA (SUCCESS PAYLOAD)
  ---------------------------- */
  z.undefined(),
);

/* ============================================================
   TYPES
============================================================ */

export type RegisterInput = ContractType<typeof RegisterSchema.I>;
export type RegisterOutput = ContractType<typeof RegisterSchema.O>;
export type RegisterError = ContractType<typeof RegisterSchema.E>;
