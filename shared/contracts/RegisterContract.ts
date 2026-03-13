import { z } from 'zod';
import { CORE } from '../CoreSchema';
import { ContractFactory } from '../ContractFactory';

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

export const RegisterContract = ContractFactory({
  method: 'POST',
  path: '/iam/register',
  access: 'public',
  summary: 'Register new user',
  description: 'Creates a new user account in the system',
  tags: ['IAM', 'Auth'],
  cache: 'no-store',
  input: RegisterInputSchema,
  success: RegisterSuccessSchema,
});
