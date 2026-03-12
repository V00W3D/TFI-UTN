import { z } from 'zod';

const PHONE_REGEX = /^\+[1-9]\d{6,14}$/;

export const phone = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    if (!PHONE_REGEX.test(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Teléfono inválido. Debe estar en formato internacional (+549...)',
      });
    }
  })
  .nullable();

export type CorePhone = z.infer<typeof phone>;

export const PHONE_RULES = [
  'Formato internacional.',
  'Debe comenzar con el código de país.',
  'Ejemplo válido: +5493811234567.',
];
