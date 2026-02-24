import { z } from 'zod';
import { zUsername, zEmail, zPhone, MSG } from './_shared';

export const LoginSchema = z.object({
  identity: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => {
      const isEmail = zEmail.safeParse(value).success;
      const isPhone = zPhone.safeParse(value).success;
      const isUsername = zUsername.safeParse(value).success;

      return isEmail || isPhone || isUsername;
    }, MSG.IDENTITY_INVALID),

  password: z.string().min(1, MSG.PASSWORD_REQUIRED),
});

export type LoginType = z.infer<typeof LoginSchema>;
