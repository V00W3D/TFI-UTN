import { z } from 'zod';
import { defineField } from 'SDKFactory/FieldDef';
import {
  identityField,
  usernameField,
  emailField,
  phoneField,
  userRoleField,
} from 'SDKFactory/MyFields';
import { defineEndpoint } from 'SDKFactory/Contracts';

/* ============================================================
   LOCAL FIELD — login password
   A relaxed variant: non-empty check only.
   Strength rules are enforced at registration; here we just
   verify the field isn't blank before sending to the server.
============================================================ */

const loginPasswordField = defineField({
  label: 'Contraseña',
  min: { value: 1 },
  rules: ['La contraseña es obligatoria.'],
});

/* ============================================================
   INPUT SCHEMA
============================================================ */

export const LoginInputSchema = z.object({
  identity: identityField.schema,
  password: loginPasswordField.schema,
});

/* ============================================================
   SUCCESS SCHEMA
============================================================ */

export const LoginSuccessSchema = z.object({
  id: z.uuid(),
  username: usernameField.schema,
  email: emailField.schema,
  phone: phoneField.schema,
  role: userRoleField.schema,
});

/* ============================================================
   CONTRACT
============================================================ */

export const LoginContract = defineEndpoint('public', 'POST', '/iam/login')
  .IO(LoginInputSchema, LoginSuccessSchema)
  .doc('Session initializer', 'Lets an existing user have access to the app')
  .build();
