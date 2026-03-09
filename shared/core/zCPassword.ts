import { z } from 'zod';

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 72;

export const cpassword = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    const errors: string[] = [];

    if (value.length < PASSWORD_MIN) errors.push(`Debe tener al menos ${PASSWORD_MIN} caracteres`);

    if (value.length > PASSWORD_MAX)
      errors.push(`No puede tener más de ${PASSWORD_MAX} caracteres`);

    if (errors.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Confirmación de contraseña inválida. ${errors.join('. ')}`,
      });
    }
  });

export type CoreCPassword = z.infer<typeof cpassword>;

export const CPASSWORD_RULES = [
  `Debe tener entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres.`,
  'Debe coincidir exactamente con la contraseña ingresada.',
];
