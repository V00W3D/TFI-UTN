/**
 * @file MyFields.ts
 * @author Victor
 * @description Automatically enforced JSDoc header according to context.md guidelines.
 * @param null
 * @returns null
 * @example null
 * @remarks This file is part of the QART monorepo architecture.
 *
 * Metrics:
 * - LOC: 50
 * - Experience Level: Junior
 * - Estimated Time: 30m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */
import { z } from 'zod';
import { defineField, NAME_BASE, PASSWORD_LENGTH } from './FieldDef';

//#region PRISMA_ENUM_TYPES
// ─────────────────────────────────────────────────────────────
//  TypeScript unions mirroring every Prisma enum in schema.prisma.
//  Single source of truth shared by contracts, services, and frontend.
// ─────────────────────────────────────────────────────────────

/** @public Mirrors Prisma `Sex` enum. */
export type Sex = 'MALE' | 'FEMALE' | 'OTHER';

/** @public Mirrors Prisma `UserRole` enum. */
export type UserRole = 'CUSTOMER' | 'STAFF' | 'AUTHORITY';

/** @public Mirrors Prisma `CustomerTier` enum. */
export type CustomerTier = 'REGULAR' | 'VIP' | 'PREMIUM';

/** @public Mirrors Prisma `StaffPost` enum. */
export type StaffPost = 'COOK' | 'CASHIER' | 'WAITER' | 'BARISTA' | 'CLEANER' | 'DELIVERY';

/** @public Mirrors Prisma `AuthorityRank` enum. */
export type AuthorityRank = 'SUPERVISOR' | 'MANAGER' | 'DIRECTOR' | 'OWNER';
//#endregion

//#region STRING_FIELDS
// ─────────────────────────────────────────────────────────────
//  All produced by defineField — return type is FieldDef<ZodString>
//  or FieldDef<ZodNullable<ZodString>> depending on nullable.
//  No explicit type annotation — TypeScript infers the exact type.
// ─────────────────────────────────────────────────────────────

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

/** @public sname — VarChar(128), nullable. Form stores '' → ApiClient converts to null. */
export const snameField = defineField({ label: 'Segundo nombre', nullable: true, ...NAME_BASE });

/** @public lname — VarChar(128). */
export const lnameField = defineField({ label: 'Apellido', ...NAME_BASE });

/** @public email — VarChar(128), native Zod v4 email format. */
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

/** @public phone — VarChar(15), nullable, E.164. Form stores '' → null. */
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
//#endregion

//#region COMPOSITE_FIELDS
// ─────────────────────────────────────────────────────────────
//  identityField is constructed manually (not via defineField)
//  because it is a union validator, not a simple string field.
//
//  NO explicit type annotation — TypeScript infers:
//    { schema: ZodString; rules: readonly string[] }
//  which matches FieldDef<ZodString> structurally.
// ─────────────────────────────────────────────────────────────

/**
 * @public
 * @summary Login identity: accepts username, email, or phone.
 * Validates that the value satisfies at least one sub-schema.
 */
export const identityField = {
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
          message: 'Identidad inválida. Debe ser un usuario, email o teléfono válido.',
        });
    }),
  rules: ['Podés ingresar tu nombre de usuario, email o teléfono.'] as const,
} as const;
// No : FieldDef<...> annotation — TypeScript infers { schema: ZodString, rules: [...] }
// which is structurally compatible with FieldDef<ZodString>.
//#endregion

//#region ENUM_FIELDS
// ─────────────────────────────────────────────────────────────
//  Enum fields have NO explicit type annotation and NO "as" cast.
//  TypeScript infers the exact ZodEnum type from z.enum([...]).
//
//  In Zod v4, z.enum(['A','B','C']) returns:
//    ZodEnum<{ A: 'A'; B: 'B'; C: 'C' }>
//  which is more specific than ZodType<'A'|'B'|'C'> and shows cleanly in hover.
// ─────────────────────────────────────────────────────────────

/** @public sex — Prisma Sex enum: `'MALE' | 'FEMALE' | 'OTHER'`. */
export const sexField = {
  schema: z.enum(['MALE', 'FEMALE', 'OTHER']),
  rules: ['Elegí una de las opciones disponibles.'] as const,
} as const;

/** @public userRole — Prisma UserRole enum: `'CUSTOMER' | 'STAFF' | 'AUTHORITY'`. */
export const userRoleField = {
  schema: z.enum(['CUSTOMER', 'STAFF', 'AUTHORITY']),
  rules: ['El rol determina los permisos del usuario en el sistema.'] as const,
} as const;

/** @public customerTier — Prisma CustomerTier enum: `'REGULAR' | 'VIP' | 'PREMIUM'`. */
export const customerTierField = {
  schema: z.enum(['REGULAR', 'VIP', 'PREMIUM']),
  rules: ['El nivel determina los beneficios del cliente.'] as const,
} as const;

/** @public staffPost — Prisma StaffPost enum. */
export const staffPostField = {
  schema: z.enum(['COOK', 'CASHIER', 'WAITER', 'BARISTA', 'CLEANER', 'DELIVERY']),
  rules: ['El puesto define las responsabilidades del trabajador.'] as const,
} as const;

/** @public authorityRank — Prisma AuthorityRank enum. */
export const authorityRankField = {
  schema: z.enum(['SUPERVISOR', 'MANAGER', 'DIRECTOR', 'OWNER']),
  rules: ['El rango define la jerarquía de autoridad.'] as const,
} as const;
//#endregion

//#region PLATE_STRING_FIELDS

/** @public Nombre del plato — VarChar(128). */
export const plateNameField = defineField({
  label: 'Nombre del plato',
  ...NAME_BASE,
});

/** @public Descripción del plato — texto libre, nullable. */
export const plateDescriptionField = defineField({
  label: 'Descripción',
  nullable: true,
  min: { value: 0 },
  max: { value: 500, message: 'La descripción no puede superar los 500 caracteres' },
  rules: ['Opcional.', 'No puede superar los 500 caracteres.'],
});

/** @public Nombre del ingrediente — VarChar(64), único. */
export const ingredientNameField = defineField({
  label: 'Nombre del ingrediente',
  min: { value: 2 },
  max: { value: 64 },
  pattern: {
    pattern: /^[A-Za-zÀ-ÿ0-9\s'-]+$/,
    message: 'Solo se permiten letras, números, espacios, guiones y apóstrofes',
  },
  rules: [
    'Debe tener entre 2 y 64 caracteres.',
    'Solo letras, números, espacios, guiones y apóstrofes.',
  ],
});

/** @public Nombre del tag — VarChar(32). */
export const tagNameField = defineField({
  label: 'Tag',
  min: { value: 2 },
  max: { value: 32 },
  pattern: {
    pattern: /^[a-z0-9-]+$/,
    message: 'Solo minúsculas, números y guiones',
  },
  rules: [
    'Debe tener entre 2 y 32 caracteres.',
    'Solo minúsculas, números y guiones (-).',
    'Ejemplo: "sin-gluten", "vegano".',
  ],
});

/** @public Comentario de review — VarChar(500), nullable. */
export const reviewCommentField = defineField({
  label: 'Comentario',
  nullable: true,
  min: { value: 0 },
  max: { value: 500, message: 'El comentario no puede superar los 500 caracteres' },
  rules: ['Opcional.', 'No puede superar los 500 caracteres.'],
});

//#endregion

//#region PLATE_ENUM_FIELDS

/** @public Mirrors Prisma `PlateSource` enum. */
export type PlateSource = 'Q' | 'C';

/** @public Mirrors Prisma `PlateType` enum. */
export type PlateType = 'STARTER' | 'MAIN' | 'DESSERT' | 'SIDE' | 'SNACK' | 'DRINK';

/** @public Mirrors Prisma `FlavorProfile` enum. */
export type FlavorProfile = 'SWEET' | 'SALTY' | 'ACID' | 'BITTERSWEET' | 'UMAMI' | 'UNKNOWN';

/** @public plateSource — Q (cocina) o C (carta externa). */
export const plateSourceField = {
  schema: z.enum(['Q', 'C']),
  rules: ['Q = producido en cocina, C = externo/carta.'] as const,
} as const;

/** @public plateType — tipo de plato según momento de la comida. */
export const plateTypeField = {
  schema: z.enum(['STARTER', 'MAIN', 'DESSERT', 'SIDE', 'SNACK', 'DRINK']),
  rules: ['Elegí el tipo que mejor describe el plato.'] as const,
} as const;

/** @public flavorProfile — perfil de sabor dominante. */
export const flavorProfileField = {
  schema: z.enum(['SWEET', 'SALTY', 'ACID', 'BITTERSWEET', 'UMAMI', 'UNKNOWN']),
  rules: ['Elegí el perfil de sabor dominante del plato o ingrediente.'] as const,
} as const;

//#endregion
