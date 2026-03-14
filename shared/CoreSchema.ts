import { username, type CoreUsername, USERNAME_RULES } from './core/zUsername';
import { password, type CorePassword, PASSWORD_RULES } from './core/zPassword';
import { cpassword, type CoreCPassword, CPASSWORD_RULES } from './core/zCPassword';
import { email, type CoreEmail, EMAIL_RULES } from './core/zEmail';
import { phone, type CorePhone, PHONE_RULES } from './core/zPhone';
import { name, type CoreName, NAME_RULES } from './core/zName';
import { sex, type CoreSex, SEX_RULES } from './core/zSex';
import { identity, type CoreIdentity, IDENTITY_RULES } from './core/zIdentity';
/* ============================================================
   CORE EXPORT
============================================================ */

export const CORE = Object.freeze({
  username,
  password,
  cpassword,
  email,
  phone,
  name,
  sex,
  identity,
});

/* ============================================================
   TYPE EXPORTS (MISMO NOMBRE QUE ANTES)
============================================================ */

export type {
  CoreUsername,
  CorePassword,
  CoreCPassword,
  CoreEmail,
  CorePhone,
  CoreName,
  CoreSex,
  CoreIdentity,
};

/* ============================================================
   HUMAN RULES CENTRALIZADAS
============================================================ */

export const CORE_RULES = Object.freeze({
  username: USERNAME_RULES,
  password: PASSWORD_RULES,
  cpassword: CPASSWORD_RULES,
  email: EMAIL_RULES,
  phone: PHONE_RULES,
  name: NAME_RULES,
  sex: SEX_RULES,
  identity: IDENTITY_RULES,
});

export { CORE_ROUTES } from './core/CoreRoutes';
