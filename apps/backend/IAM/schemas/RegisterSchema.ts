import { z } from 'zod';
import { zUsername, zPassword, zEmail, zPhone, zName, zSex } from './IAMSchema';

export const RegisterSchema = z.object({
  name: zName,
  sname: zName,
  lname: zName,
  sex: zSex,
  username: zUsername,
  password: zPassword,
  email: zEmail,
  phone: zPhone,
});

export type RegisterType = z.infer<typeof RegisterSchema>;
