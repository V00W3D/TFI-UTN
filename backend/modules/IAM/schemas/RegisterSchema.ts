import { z } from 'zod';
import { zUsername, zPassword, zEmail, zPhone, zName, zSex } from './_shared';

export const RegisterSchema = z.object({
  name: zName,
  s_name: zName,
  l_name: zName,
  sex: zSex,
  username: zUsername,
  password: zPassword,
  email: zEmail,
  phone: zPhone,
});

export type RegisterType = z.infer<typeof RegisterSchema>;
