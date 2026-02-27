import { z } from 'zod';
import { zUsername, zPassword, zEmail, zPhone, zName, zSex } from './shared';

/* ============================================================
   GENERIC HELPER → devuelve true o string
============================================================ */

const validate =
  <T>(schema: z.ZodType<T>) =>
  (value: unknown): true | string[] => {
    const result = schema.safeParse(value);

    if (result.success) return true;

    return result.error.issues.map((i) => i.message);
  };

export const UsernameValidator = validate(zUsername);
export const EmailValidator = validate(zEmail);
export const PasswordValidator = validate(zPassword);
export const NameValidator = validate(zName);
export const PhoneValidator = validate(zPhone);
export const SexValidator = validate(zSex);

export const ConfirmPasswordValidator = (
  password: string,
  confirmPassword: string,
): true | string[] => {
  if (!confirmPassword) {
    return ['Debes confirmar la contraseña'];
  }

  if (!password) {
    return ['Primero debes ingresar una contraseña'];
  }

  if (password !== confirmPassword) {
    return ['Las contraseñas no coinciden'];
  }

  return true;
};
