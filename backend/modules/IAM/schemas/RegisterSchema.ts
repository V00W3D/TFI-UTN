import { z } from 'zod';

/* ============================================================
   GLOBAL CONFIG (EDITABLE ZONE)
   ============================================================ */

// ---- Limits ----
const LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  USERNAME_MIN: 4,
  USERNAME_MAX: 20,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 72,
  EMAIL_MAX: 100,
};

// ---- Regex ----
const REGEX = {
  NAME: /^[A-Za-zÀ-ÿ\s'-]+$/,
  USERNAME: /^[a-zA-Z0-9_]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
  PHONE_E164: /^\+[1-9]\d{6,14}$/,
};

// ---- Messages ----
const MSG = {
  NAME_INVALID: 'Solo se permiten letras, espacios, guiones y apóstrofes',
  USERNAME_INVALID: 'El nombre de usuario solo puede contener letras, números y guiones bajos',
  PASSWORD_WEAK:
    'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
  EMAIL_INVALID: 'Formato de correo electrónico inválido',
  PHONE_INVALID:
    'Número de teléfono inválido (debe estar en formato internacional, por ejemplo +549...)',
  SEX_INVALID: 'Sexo inválido',
};

/* ============================================================
   SCHEMA
   ============================================================ */

export const RegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(LIMITS.NAME_MIN)
    .max(LIMITS.NAME_MAX)
    .regex(REGEX.NAME, MSG.NAME_INVALID),

  s_name: z
    .string()
    .trim()
    .min(LIMITS.NAME_MIN)
    .max(LIMITS.NAME_MAX)
    .regex(REGEX.NAME, MSG.NAME_INVALID),

  l_name: z
    .string()
    .trim()
    .min(LIMITS.NAME_MIN)
    .max(LIMITS.NAME_MAX)
    .regex(REGEX.NAME, MSG.NAME_INVALID),

  sex: z.enum(['male', 'female', 'other'], {
    message: MSG.SEX_INVALID,
  }),

  username: z
    .string()
    .trim()
    .min(LIMITS.USERNAME_MIN)
    .max(LIMITS.USERNAME_MAX)
    .regex(REGEX.USERNAME, MSG.USERNAME_INVALID),

  password: z
    .string()
    .min(LIMITS.PASSWORD_MIN)
    .max(LIMITS.PASSWORD_MAX)
    .regex(REGEX.PASSWORD, MSG.PASSWORD_WEAK),

  email: z.string().email(MSG.EMAIL_INVALID).max(LIMITS.EMAIL_MAX),

  phone: z.string().trim().regex(REGEX.PHONE_E164, MSG.PHONE_INVALID),
});

export type RegisterType = z.infer<typeof RegisterSchema>;
