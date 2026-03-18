import { z } from 'zod';
import { defineField, PATTERNS, type FieldDef } from './FieldDef';

//#region USER IDENTITY FIELDS
/**
 * @public
 * @summary Username field.
 * @remarks DB: User.username — VarChar(32), unique.
 * Between 4–32 characters. Letters, digits, and underscores only. No reserved words.
 */
export const usernameField = defineField({
  label: 'Usuario',
  min: { value: 4 },
  max: { value: 32 },
  pattern: {
    pattern: PATTERNS.USERNAME,
    message: 'Solo puede contener letras, números y guiones bajos',
  },
  reserved: { words: ['admin', 'root', 'system'] },
  rules: [
    'Debe tener entre 4 y 32 caracteres.',
    'Puede incluir letras, números y guiones bajos (_).',
    'No se permiten espacios.',
  ],
});

/**
 * @public
 * @summary Email field.
 * @remarks DB: User.email — VarChar(128), unique. Lowercased before validation.
 */
export const emailField = defineField({
  label: 'Email',
  lowercase: true,
  max: { value: 128 },
  pattern: {
    pattern: PATTERNS.EMAIL,
    message: 'Debe contener @ y un dominio válido',
  },
  rules: [
    'No puede superar los 128 caracteres.',
    'Debe incluir un @.',
    'Debe tener un dominio válido (ej: usuario@dominio.com).',
  ],
});

/**
 * @public
 * @summary Phone field.
 * @remarks DB: User.phone — VarChar(15), unique, nullable.
 * Accepts E.164 format as produced by react-phone-number-input (e.g. `+5493811234567`).
 * Max 15 characters to fit the DB column ('+' + 14 digits).
 * Empty or whitespace-only input is coerced to null.
 */
export const phoneField = defineField({
  label: 'Teléfono',
  nullable: true,
  max: { value: 15 },
  pattern: {
    pattern: PATTERNS.PHONE_E164,
    message: 'Debe estar en formato internacional (ej: +5493811234567)',
  },
  rules: [
    'Formato internacional (E.164).',
    'Debe comenzar con el código de país (ej: +54 para Argentina).',
    'Ejemplo válido: +5493811234567.',
  ],
});

/**
 * @public
 * @summary Password field.
 * @remarks DB: User.password — VarChar(128) (stores the bcrypt hash).
 * Input validated between 8–72 characters (bcrypt truncates beyond 72).
 * Requires uppercase, lowercase, digit, and special character.
 */
export const passwordField = defineField({
  label: 'Contraseña',
  min: { value: 8 },
  max: { value: 72 },
  pattern: {
    pattern: PATTERNS.PASSWORD_STRONG,
    message: 'Debe contener mayúscula, minúscula, número y carácter especial',
  },
  rules: [
    'Debe tener entre 8 y 72 caracteres.',
    'Incluir al menos una letra mayúscula.',
    'Incluir al menos una letra minúscula.',
    'Incluir al menos un número.',
    'Incluir al menos un símbolo (ej: !, @, #, $).',
  ],
});

/**
 * @public
 * @summary Confirm-password field.
 * @remarks Same length rules as {@link passwordField}. Pattern equality is validated at the form level.
 */
export const cpasswordField = defineField({
  label: 'Confirmación de contraseña',
  min: { value: 8 },
  max: { value: 72 },
  rules: [
    'Debe tener entre 8 y 72 caracteres.',
    'Debe coincidir exactamente con la contraseña ingresada.',
  ],
});

/**
 * @public
 * @summary Identity field (composite: username | email | phone).
 * @remarks
 * Accepts any value that satisfies at least one of the three identity sub-schemas.
 * Used as the login identifier field.
 */
export const identityField: FieldDef<z.ZodString> = {
  schema: z
    .string()
    .trim()
    .toLowerCase()
    .superRefine((value, ctx) => {
      const isValid = [usernameField.schema, emailField.schema, phoneField.schema].some(
        (sub) => sub.safeParse(value).success,
      );
      if (!isValid)
        ctx.addIssue({
          code: 'custom',
          message: 'Identidad inválida: debe ser un usuario, email o teléfono válido.',
        });
    }),
  rules: ['Podés ingresar tu nombre de usuario, email o teléfono.'],
};
//#endregion

//#region USER PROFILE FIELDS
/**
 * @public
 * @summary First name field.
 * @remarks DB: User.name — VarChar(128), required.
 */
export const nameField = defineField({
  label: 'Nombre',
  min: { value: 2 },
  max: { value: 128 },
  pattern: {
    pattern: PATTERNS.NAME,
    message: "Solo se permiten letras, espacios, guiones (-) y apóstrofes (')",
  },
  rules: [
    'Debe tener entre 2 y 128 caracteres.',
    'Solo se permiten letras (con acentos).',
    "Puede incluir espacios, guiones (-) y apóstrofes (').",
  ],
});

/**
 * @public
 * @summary Second name field (optional).
 * @remarks DB: User.sname — VarChar(128), nullable.
 * Empty or whitespace-only input is coerced to null.
 */
export const snameField = defineField({
  label: 'Segundo nombre',
  nullable: true,
  min: { value: 2 },
  max: { value: 128 },
  pattern: {
    pattern: PATTERNS.NAME,
    message: "Solo se permiten letras, espacios, guiones (-) y apóstrofes (')",
  },
  rules: [
    'Campo opcional.',
    'Si se ingresa, debe tener entre 2 y 128 caracteres.',
    "Puede incluir letras (con acentos), espacios, guiones (-) y apóstrofes (').",
  ],
});

/**
 * @public
 * @summary Last name field.
 * @remarks DB: User.lname — VarChar(128), required.
 */
export const lnameField = defineField({
  label: 'Apellido',
  min: { value: 2 },
  max: { value: 128 },
  pattern: {
    pattern: PATTERNS.NAME,
    message: "Solo se permiten letras, espacios, guiones (-) y apóstrofes (')",
  },
  rules: [
    'Debe tener entre 2 y 128 caracteres.',
    'Solo se permiten letras (con acentos).',
    "Puede incluir espacios, guiones (-) y apóstrofes (').",
  ],
});
//#endregion

//#region ENUM FIELDS
/**
 * @public
 * @summary Sex/gender enum values — mirrors the Prisma `Sex` enum.
 * @remarks Tuple form used directly by `z.enum()` in Zod v4.
 * Use `SEX_VALUES[number]` to get the union type `'MALE' | 'FEMALE' | 'OTHER'`.
 */
export const SEX_VALUES = ['MALE', 'FEMALE', 'OTHER'] as const;
export type SexValue = (typeof SEX_VALUES)[number];

// Internal schema — typeof used for the annotation so we never reference Zod internal types.
const _sexSchema = z.enum(SEX_VALUES);

/**
 * @public
 * @summary Sex/gender field.
 * @remarks DB: User.sex — Sex enum, default OTHER.
 */
export const sexField: FieldDef<typeof _sexSchema> = {
  schema: _sexSchema,
  rules: ['Elegí una de las opciones disponibles: Masculino, Femenino u Otro.'],
};

/**
 * @public
 * @summary High-level user role values — mirrors the Prisma `UserRole` enum.
 * @remarks Determines which profile table (Customer / Staff / Authority) is populated.
 */
export const USER_ROLE_VALUES = ['CUSTOMER', 'STAFF', 'AUTHORITY'] as const;
export type UserRoleValue = (typeof USER_ROLE_VALUES)[number];

const _userRoleSchema = z.enum(USER_ROLE_VALUES);

/**
 * @public
 * @summary User role field.
 * @remarks DB: User.role — UserRole enum, default CUSTOMER.
 */
export const userRoleField: FieldDef<typeof _userRoleSchema> = {
  schema: _userRoleSchema,
  rules: ['Elegí el rol del usuario: Cliente, Personal o Autoridad.'],
};

/**
 * @public
 * @summary Customer tier values — mirrors the Prisma `CustomerTier` enum.
 * @remarks DB: CustomerProfile.tier — loyalty / membership level.
 */
export const CUSTOMER_TIER_VALUES = ['REGULAR', 'VIP', 'PREMIUM'] as const;
export type CustomerTierValue = (typeof CUSTOMER_TIER_VALUES)[number];

const _customerTierSchema = z.enum(CUSTOMER_TIER_VALUES);

/**
 * @public
 * @summary Customer tier field.
 * @remarks DB: CustomerProfile.tier, default REGULAR.
 */
export const customerTierField: FieldDef<typeof _customerTierSchema> = {
  schema: _customerTierSchema,
  rules: ['Elegí el nivel del cliente: Regular, VIP o Premium.'],
};

/**
 * @public
 * @summary Staff post values — mirrors the Prisma `StaffPost` enum.
 * @remarks DB: StaffProfile.post — the specific workstation/role within the restaurant.
 */
export const STAFF_POST_VALUES = [
  'COOK',
  'CASHIER',
  'WAITER',
  'BARISTA',
  'CLEANER',
  'DELIVERY',
] as const;
export type StaffPostValue = (typeof STAFF_POST_VALUES)[number];

const _staffPostSchema = z.enum(STAFF_POST_VALUES);

/**
 * @public
 * @summary Staff post field.
 * @remarks DB: StaffProfile.post — required for all STAFF users.
 */
export const staffPostField: FieldDef<typeof _staffPostSchema> = {
  schema: _staffPostSchema,
  rules: ['Elegí el puesto del personal: Cocinero, Cajero, Mozo, Barista, Limpieza o Delivery.'],
};

/**
 * @public
 * @summary Authority rank values — mirrors the Prisma `AuthorityRank` enum.
 * @remarks DB: AuthorityProfile.rank — hierarchical level within management.
 */
export const AUTHORITY_RANK_VALUES = ['SUPERVISOR', 'MANAGER', 'DIRECTOR', 'OWNER'] as const;
export type AuthorityRankValue = (typeof AUTHORITY_RANK_VALUES)[number];

const _authorityRankSchema = z.enum(AUTHORITY_RANK_VALUES);

/**
 * @public
 * @summary Authority rank field.
 * @remarks DB: AuthorityProfile.rank — required for all AUTHORITY users.
 */
export const authorityRankField: FieldDef<typeof _authorityRankSchema> = {
  schema: _authorityRankSchema,
  rules: ['Elegí el rango: Supervisor, Gerente, Director o Dueño.'],
};
//#endregion
