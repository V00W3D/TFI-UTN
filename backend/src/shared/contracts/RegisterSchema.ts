import { z } from 'zod';
import { CORE } from '../CoreSchema';
import { createContract } from '@tools/ContractFactory';

/* ============================================================
   INPUT SCHEMA
============================================================ */

export const RegisterInputSchema = z
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
        path: ['cpassword'],
        code: 'custom',
        message: 'Las contraseñas no coinciden',
      });
    }
  });

/* ============================================================
   SUCCESS SCHEMA
============================================================ */

export const RegisterSuccessSchema = z.void();

/* ============================================================
   CONTRACT
============================================================ */

export const RegisterSchema = createContract(RegisterInputSchema, RegisterSuccessSchema);

/* ============================================================
   TYPES
============================================================ */

export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type RegisterOutput = z.infer<typeof RegisterSchema.O>;
