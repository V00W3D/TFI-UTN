import { z } from 'zod';
import { username } from './zUsername';
import { email } from './zEmail';
import { phone } from './zPhone';

const identitySchemas = [username, email, phone] as const;

export const identity = z
  .string()
  .trim()
  .toLowerCase()
  .superRefine((value, ctx) => {
    const matches = identitySchemas.some((schema) => schema.safeParse(value).success);

    if (!matches) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Identidad inválida. Debe ser un usuario, email o teléfono válido.',
      });
    }
  });

export type CoreIdentity = z.infer<typeof identity>;

export const IDENTITY_RULES = ['Podés ingresar tu nombre de usuario, email o teléfono.'];
