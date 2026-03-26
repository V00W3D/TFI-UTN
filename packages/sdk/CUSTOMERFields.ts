/**
 * @file CUSTOMERFields.ts
 * @description Automatically enforced JSDoc header according to context.md guidelines.
 */
import { z } from 'zod';
import { defineField } from './FieldDef';

//#region PLATE_STRING_FIELDS

/** @public Nombre del plato — VarChar(128). */
export const plateNameField = defineField({
  label: 'Nombre del plato',
  min: { value: 2 },
  max: { value: 128 },
  pattern: {
    pattern: /^[A-Za-zÀ-ÿ0-9\s'-]+$/,
    message: 'Solo se permiten letras, números, espacios, guiones y apóstrofes',
  },
  rules: [
    'Debe tener entre 2 y 128 caracteres.',
    'Solo letras, números, espacios, guiones y apóstrofes.',
  ],
});

/** @public Descripción del plato o dieta — texto libre, nullable. */
export const descriptionField = defineField({
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

/** @public Comentario de review — VarChar(500), nullable. */
export const reviewCommentField = defineField({
  label: 'Comentario',
  nullable: true,
  min: { value: 0 },
  max: { value: 500, message: 'El comentario no puede superar los 500 caracteres' },
  rules: ['Opcional.', 'No puede superar los 500 caracteres.'],
});

//#endregion

//#region ENUM_FIELDS

/** @public Mirrors Prisma `PlateType` enum. */
export type PlateType = 'STARTER' | 'MAIN' | 'DESSERT' | 'SIDE' | 'SNACK' | 'DRINK';

/** @public Mirrors Prisma `FlavorProfile` enum. */
export type FlavorProfile = 'SWEET' | 'SALTY' | 'ACID' | 'BITTERSWEET' | 'UMAMI' | 'UNKNOWN';

/** @public Mirrors Prisma `MealType` enum. */
export type MealType = 'BREAKFAST' | 'LUNCH' | 'SNACK' | 'DINNER';

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

/** @public mealType — momento nutricional del día. */
export const mealTypeField = {
  schema: z.enum(['BREAKFAST', 'LUNCH', 'SNACK', 'DINNER']),
  rules: ['Elegí el momento del día para este ítem.'] as const,
} as const;

//#endregion
