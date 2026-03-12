import { z } from 'zod';

const NAME_MIN = 2;
const NAME_MAX = 50;
const NAME_REGEX = /^[A-Za-zÀ-ÿ\s'-]+$/;

export const name = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    const errors: string[] = [];

    if (value.length < NAME_MIN) errors.push(`Debe tener al menos ${NAME_MIN} caracteres`);

    if (value.length > NAME_MAX) errors.push(`No puede tener más de ${NAME_MAX} caracteres`);

    if (!NAME_REGEX.test(value))
      errors.push('Solo se permiten letras, espacios, guiones y apóstrofes');

    if (errors.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Nombre inválido. ${errors.join('. ')}`,
      });
    }
  });

export type CoreName = z.infer<typeof name>;

export const NAME_RULES = [
  `Debe tener entre ${NAME_MIN} y ${NAME_MAX} caracteres.`,
  'Solo se permiten letras.',
  "Puede incluir espacios, guiones (-) y apóstrofes (').",
];
