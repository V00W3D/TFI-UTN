import { z } from 'zod';

/* ============================================================
   CONSTRAINTS
============================================================ */

const USERNAME_MIN = 4;
const USERNAME_MAX = 20;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

const RESERVED_USERNAMES = ['admin', 'root', 'system'];

/* ============================================================
   SCHEMA
============================================================ */

export const username = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    const errors: string[] = [];

    const lower = value.toLowerCase();

    /* LENGTH */

    if (value.length < USERNAME_MIN) errors.push(`Debe tener al menos ${USERNAME_MIN} caracteres`);

    if (value.length > USERNAME_MAX)
      errors.push(`No puede tener más de ${USERNAME_MAX} caracteres`);

    /* CHARACTERS */

    if (!USERNAME_REGEX.test(value))
      errors.push('Solo puede contener letras, números y guiones bajos');

    /* RESERVED WORDS */

    if (RESERVED_USERNAMES.some((r) => lower.includes(r)))
      errors.push('Contiene una palabra reservada');

    /* ISSUE */

    if (errors.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Usuario inválido. ${errors.join('. ')}`,
      });
    }
  });

/* ============================================================
   TYPE
============================================================ */

export type CoreUsername = z.infer<typeof username>;

/* ============================================================
   HUMAN RULES
============================================================ */

export const USERNAME_RULES = [
  `Debe tener entre ${USERNAME_MIN} y ${USERNAME_MAX} caracteres.`,
  'Puede incluir letras, números y guiones bajos (_).',
  'No se permiten espacios.',
];
