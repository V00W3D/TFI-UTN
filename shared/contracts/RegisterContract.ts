import { z } from 'zod';
import { defineEndpoint } from 'SDKFactory/Contracts';
import {
  cpasswordField,
  emailField,
  lnameField,
  nameField,
  passwordField,
  phoneField,
  sexField,
  snameField,
  usernameField,
} from 'SDKFactory';

/* ============================================================
INPUT SCHEMA
============================================================ */

export const RegisterInputSchema = z
  .object({
    name: nameField.schema,
    sname: snameField.schema,
    lname: lnameField.schema,
    sex: sexField.schema,
    username: usernameField.schema,
    password: passwordField.schema,
    cpassword: cpasswordField.schema,
    email: emailField.schema,
    phone: phoneField.schema,
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

export const RegisterContract = defineEndpoint('public', 'POST', '/iam/register')
  .IO(RegisterInputSchema, RegisterSuccessSchema)
  .doc('Register new user', 'Creates a new user account in the system')
  .build();
