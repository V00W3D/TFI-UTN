/**
 * @file IAMFields.ts
 * @author Victor
 * @description Shared IAM field definitions aligned with the current Prisma schema.
 * @remarks Centralizes auth/account enums and reusable form field validators.
 *
 * Metrics:
 * - LOC: 170
 * - Experience Level: Mid
 * - Estimated Time: 35m
 * - FPA: 2
 * - PERT: 35m
 * - Planning Poker: 2
 */
import { z } from 'zod';
import { defineField, NAME_BASE, PASSWORD_LENGTH } from './FieldDef';

// ═══════════════════════════════════════════════════════════════
// PRISMA ENUM VALUES
// ═══════════════════════════════════════════════════════════════

export const SEX_VALUES = ['MALE', 'FEMALE', 'OTHER'] as const;
export const USER_ROLE_VALUES = ['CUSTOMER', 'STAFF', 'AUTHORITY'] as const;
export const CUSTOMER_TIER_VALUES = ['REGULAR', 'VIP', 'PREMIUM'] as const;
export const STAFF_POST_VALUES = [
  'COOK',
  'CASHIER',
  'WAITER',
  'BARISTA',
  'CLEANER',
  'DELIVERY',
] as const;
export const AUTHORITY_RANK_VALUES = ['SUPERVISOR', 'MANAGER', 'DIRECTOR', 'OWNER'] as const;

/** @public Mirrors Prisma `Sex` enum. */
export type Sex = (typeof SEX_VALUES)[number];

/** @public Mirrors Prisma `UserRole` enum. */
export type UserRole = (typeof USER_ROLE_VALUES)[number];

/** @public Mirrors Prisma `CustomerTier` enum. */
export type CustomerTier = (typeof CUSTOMER_TIER_VALUES)[number];

/** @public Mirrors Prisma `StaffPost` enum. */
export type StaffPost = (typeof STAFF_POST_VALUES)[number];

/** @public Mirrors Prisma `AuthorityRank` enum. */
export type AuthorityRank = (typeof AUTHORITY_RANK_VALUES)[number];

// ═══════════════════════════════════════════════════════════════
// STRING FIELDS
// ═══════════════════════════════════════════════════════════════

/** @public username — VarChar(32), alphanumeric + underscore, no reserved words. */
export const usernameField = defineField({
  label: 'Usuario',
  min: { value: 4 },
  max: { value: 32 },
  pattern: {
    pattern: /^[a-zA-Z0-9_]+$/,
    message: 'Solo puede contener letras, números y guiones bajos',
  },
  reserved: { words: ['admin', 'root', 'system'], message: 'Contiene una palabra reservada' },
  rules: [
    'Debe tener entre 4 y 32 caracteres.',
    'Puede incluir letras, números y guiones bajos (_).',
    'No se permiten espacios.',
  ],
});

/** @public password — VarChar(128), full strength rules enforced. */
export const passwordField = defineField({
  label: 'Contraseña',
  ...PASSWORD_LENGTH,
  pattern: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
    message: 'Debe contener mayúscula, minúscula, número y carácter especial',
  },
  rules: [
    'Debe tener entre 8 y 128 caracteres.',
    'Incluir al menos una letra mayúscula.',
    'Incluir al menos una letra minúscula.',
    'Incluir al menos un número.',
    'Incluir al menos un símbolo.',
  ],
});

/** @public cpassword — same length as password; equality validated at schema level. */
export const cpasswordField = defineField({
  label: 'Confirmación de contraseña',
  ...PASSWORD_LENGTH,
  rules: [
    'Debe tener entre 8 y 128 caracteres.',
    'Debe coincidir exactamente con la contraseña ingresada.',
  ],
});

/** @public name — VarChar(128). */
export const nameField = defineField({ label: 'Nombre', ...NAME_BASE });

/** @public sname — VarChar(128), nullable. */
export const snameField = defineField({ label: 'Segundo nombre', nullable: true, ...NAME_BASE });

/** @public lname — VarChar(128). */
export const lnameField = defineField({ label: 'Apellido', ...NAME_BASE });

/** @public email — VarChar(128), normalized to lowercase. */
export const emailField = defineField({
  label: 'Email',
  lowercase: true,
  format: 'email',
  max: { value: 128 },
  rules: [
    'No puede superar los 128 caracteres.',
    'Debe incluir un @.',
    'Debe tener un dominio válido.',
  ],
});

/** @public phone — VarChar(15), nullable, E.164. */
export const phoneField = defineField({
  label: 'Teléfono',
  nullable: true,
  format: 'phone',
  max: { value: 15 },
  pattern: {
    pattern: /^\+[1-9]\d{6,14}$/,
    message: 'Debe estar en formato internacional (+549...)',
  },
  rules: [
    'Formato internacional E.164.',
    'Debe comenzar con el código de país (+).',
    'Ejemplo válido: +5493811234567.',
  ],
});

// ═══════════════════════════════════════════════════════════════
// COMPOSITE FIELD
// ═══════════════════════════════════════════════════════════════

/**
 * @public
 * @summary Login identity: accepts username, email, or phone.
 */
export const identityField = {
  schema: z
    .string()
    .trim()
    .toLowerCase()
    .superRefine((value, ctx) => {
      const isValid = [usernameField.schema, emailField.schema, phoneField.schema].some(
        (subSchema) => subSchema.safeParse(value).success,
      );

      if (!isValid)
        ctx.addIssue({
          code: 'custom',
          message: 'Identidad inválida. Debe ser un usuario, email o teléfono válido.',
        });
    }),
  rules: ['Podés ingresar tu nombre de usuario, email o teléfono.'] as const,
} as const;

// ═══════════════════════════════════════════════════════════════
// ENUM FIELDS
// ═══════════════════════════════════════════════════════════════

/** @public sex — Prisma Sex enum. */
export const sexField = {
  schema: z.enum(SEX_VALUES),
  rules: ['Elegí una de las opciones disponibles.'] as const,
} as const;

/** @public userRole — Prisma UserRole enum. */
export const userRoleField = {
  schema: z.enum(USER_ROLE_VALUES),
  rules: ['El rol determina los permisos del usuario en el sistema.'] as const,
} as const;

/** @public customerTier — Prisma CustomerTier enum. */
export const customerTierField = {
  schema: z.enum(CUSTOMER_TIER_VALUES),
  rules: ['El nivel determina los beneficios del cliente.'] as const,
} as const;

/** @public staffPost — Prisma StaffPost enum. */
export const staffPostField = {
  schema: z.enum(STAFF_POST_VALUES),
  rules: ['El puesto define las responsabilidades del trabajador.'] as const,
} as const;

/** @public authorityRank — Prisma AuthorityRank enum. */
export const authorityRankField = {
  schema: z.enum(AUTHORITY_RANK_VALUES),
  rules: ['El rango define la jerarquía de autoridad.'] as const,
} as const;
