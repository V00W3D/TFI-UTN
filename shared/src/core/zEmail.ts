import { z } from 'zod';

const EMAIL_MAX = 100;

export const email = z
  .string()
  .trim()
  .toLowerCase()
  .superRefine((value, ctx) => {
    const errors: string[] = [];

    if (value.length > EMAIL_MAX) errors.push(`No puede superar los ${EMAIL_MAX} caracteres`);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      errors.push('Debe contener @ y un dominio válido');

    if (errors.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Email inválido. ${errors.join('. ')}`,
      });
    }
  });

export type CoreEmail = z.infer<typeof email>;

export const EMAIL_RULES = [
  `No puede superar los ${EMAIL_MAX} caracteres.`,
  'Debe incluir un @.',
  'Debe tener un dominio válido.',
];
