import { z } from 'zod';

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 72;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

export const password = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    const errors: string[] = [];

    if (value.length < PASSWORD_MIN) errors.push(`Debe tener al menos ${PASSWORD_MIN} caracteres`);

    if (value.length > PASSWORD_MAX)
      errors.push(`No puede tener más de ${PASSWORD_MAX} caracteres`);

    if (!PASSWORD_REGEX.test(value))
      errors.push('Debe contener mayúscula, minúscula, número y carácter especial');

    if (errors.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Contraseña inválida. ${errors.join('. ')}`,
      });
    }
  });

export type CorePassword = z.infer<typeof password>;

export const PASSWORD_RULES = [
  `Debe tener entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres.`,
  'Incluir al menos una letra mayúscula.',
  'Incluir al menos una letra minúscula.',
  'Incluir al menos un número.',
  'Incluir al menos un símbolo.',
];
