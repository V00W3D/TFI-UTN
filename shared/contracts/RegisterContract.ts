import { z } from 'zod';
import { CORE } from '../CoreSchema';
import { Contract } from '../ContractFactory';

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

export const RegisterContract = Contract.follow('public', 'POST', 'IAM', 'register')
  .IO(RegisterInputSchema, RegisterSuccessSchema)
  .doc('Register new user', 'Creates a new user account in the system')
  .build();
