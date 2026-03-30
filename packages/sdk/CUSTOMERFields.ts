/**
 * @file CUSTOMERFields.ts
 * @author Victor
 * @description Shared catalog and customer-facing field definitions aligned with the current Prisma schema.
 * @remarks Covers plate, recipe, ingredient, tag, and nutrition metadata fields.
 *
 * Metrics:
 * - LOC: 240
 * - Experience Level: Mid
 * - Estimated Time: 45m
 * - FPA: 3
 * - PERT: 45m
 * - Planning Poker: 3
 */
import { z } from 'zod';
import { defineField } from './FieldDef';

// ═══════════════════════════════════════════════════════════════
// REUSABLE STRING CONFIGS
// ═══════════════════════════════════════════════════════════════

const DISPLAY_NAME_PATTERN = /^[A-Za-zÀ-ÿ0-9\s'&.,()+\-/%]+$/;

const DISPLAY_NAME_RULES = [
  'Solo letras, números, espacios y signos básicos de puntuación.',
] as const;

// ═══════════════════════════════════════════════════════════════
// STRING FIELDS
// ═══════════════════════════════════════════════════════════════

/** @public Nombre del plato — VarChar(128). */
export const plateNameField = defineField({
  label: 'Nombre del plato',
  min: { value: 2 },
  max: { value: 128 },
  pattern: {
    pattern: DISPLAY_NAME_PATTERN,
    message: 'Solo se permiten letras, números, espacios y puntuación básica',
  },
  rules: ['Debe tener entre 2 y 128 caracteres.', ...DISPLAY_NAME_RULES],
});

/** @public Nombre de receta — VarChar(128). */
export const recipeNameField = defineField({
  label: 'Nombre de la receta',
  min: { value: 2 },
  max: { value: 128 },
  pattern: {
    pattern: DISPLAY_NAME_PATTERN,
    message: 'Solo se permiten letras, números, espacios y puntuación básica',
  },
  rules: ['Debe tener entre 2 y 128 caracteres.', ...DISPLAY_NAME_RULES],
});

/** @public Descripción general para entidades con columna `Text`, nullable. */
export const descriptionField = defineField({
  label: 'Descripción',
  nullable: true,
  min: { value: 0 },
  max: { value: 5000, message: 'La descripción no puede superar los 5000 caracteres' },
  rules: ['Opcional.', 'No puede superar los 5000 caracteres.'],
});

/** @public Descripción larga del plato o receta — texto libre, nullable. */
export const longDescriptionField = defineField({
  label: 'Descripción detallada',
  nullable: true,
  min: { value: 0 },
  max: { value: 5000, message: 'La descripción detallada no puede superar los 5000 caracteres' },
  rules: ['Opcional.', 'No puede superar los 5000 caracteres.'],
});

/** @public Nombre del ingrediente — VarChar(64), único. */
export const ingredientNameField = defineField({
  label: 'Nombre del ingrediente',
  min: { value: 2 },
  max: { value: 64 },
  pattern: {
    pattern: DISPLAY_NAME_PATTERN,
    message: 'Solo se permiten letras, números, espacios y puntuación básica',
  },
  rules: ['Debe tener entre 2 y 64 caracteres.', ...DISPLAY_NAME_RULES],
});

/** @public Nombre de variante — VarChar(64). */
export const ingredientVariantNameField = defineField({
  label: 'Nombre de la variante',
  min: { value: 2 },
  max: { value: 64 },
  pattern: {
    pattern: DISPLAY_NAME_PATTERN,
    message: 'Solo se permiten letras, números, espacios y puntuación básica',
  },
  rules: ['Debe tener entre 2 y 64 caracteres.', ...DISPLAY_NAME_RULES],
});

/** @public Subcategoría o clasificación puntual — VarChar(64), nullable. */
export const ingredientSubCategoryField = defineField({
  label: 'Subcategoría',
  nullable: true,
  min: { value: 0 },
  max: { value: 64, message: 'La subcategoría no puede superar los 64 caracteres' },
  pattern: {
    pattern: DISPLAY_NAME_PATTERN,
    message: 'Solo se permiten letras, números, espacios y puntuación básica',
  },
  rules: ['Opcional.', 'No puede superar los 64 caracteres.'],
});

/** @public Comentario de review — VarChar(500), nullable. */
export const reviewCommentField = defineField({
  label: 'Comentario',
  nullable: true,
  min: { value: 0 },
  max: { value: 500, message: 'El comentario no puede superar los 500 caracteres' },
  rules: ['Opcional.', 'No puede superar los 500 caracteres.'],
});

/** @public Nota breve operativa o nutricional — VarChar(255), nullable. */
export const shortNoteField = defineField({
  label: 'Nota',
  nullable: true,
  min: { value: 0 },
  max: { value: 255, message: 'La nota no puede superar los 255 caracteres' },
  rules: ['Opcional.', 'No puede superar los 255 caracteres.'],
});

/** @public Nombre de tag — VarChar(32). */
export const tagNameField = defineField({
  label: 'Tag',
  min: { value: 2 },
  max: { value: 32 },
  pattern: {
    pattern: /^[A-Za-zÀ-ÿ0-9\s\-_/]+$/,
    message: 'Solo se permiten letras, números, espacios, guiones, barras y guion bajo',
  },
  rules: [
    'Debe tener entre 2 y 32 caracteres.',
    'Solo letras, números, espacios, guiones, barras y guion bajo.',
  ],
});

// ═══════════════════════════════════════════════════════════════
// PRISMA ENUM VALUES
// ═══════════════════════════════════════════════════════════════

export const PLATE_TYPE_VALUES = ['STARTER', 'MAIN', 'DESSERT', 'SIDE', 'SNACK', 'DRINK'] as const;
export const FLAVOR_PROFILE_VALUES = [
  'SWEET',
  'SALTY',
  'ACID',
  'BITTERSWEET',
  'UMAMI',
  'SPICY',
  'UNKNOWN',
] as const;
export const DIFFICULTY_VALUES = ['EASY', 'MEDIUM', 'HARD', 'CHEF'] as const;
export const PLATE_SIZE_VALUES = ['SMALL', 'REGULAR', 'LARGE', 'XL'] as const;
export const INGREDIENT_CATEGORY_VALUES = [
  'PROTEIN_ANIMAL',
  'PROTEIN_PLANT',
  'VEGETABLE',
  'FRUIT',
  'LEGUME',
  'GRAIN',
  'BREAD',
  'DAIRY',
  'FAT',
  'SAUCE',
  'CONDIMENT',
  'SWEETENER',
  'BEVERAGE',
  'OTHER',
] as const;
export const PREPARATION_METHOD_VALUES = [
  'RAW',
  'GRILLED',
  'FRIED',
  'BAKED',
  'ROASTED',
  'SAUTEED',
  'BOILED',
  'STEAMED',
  'SMOKED',
  'PICKLED',
  'FERMENTED',
] as const;
export const ADJUSTMENT_TYPE_VALUES = ['ADDITION', 'REMOVAL', 'SUBSTITUTION'] as const;
export const ALLERGEN_VALUES = [
  'GLUTEN',
  'MILK',
  'EGG',
  'PEANUT',
  'TREE_NUT',
  'SOY',
  'SESAME',
  'FISH',
  'SHELLFISH',
  'MUSTARD',
  'CELERY',
  'SULFITES',
] as const;
export const DIETARY_TAG_VALUES = [
  'VEGETARIAN',
  'VEGAN',
  'GLUTEN_FREE',
  'DAIRY_FREE',
  'NUT_FREE',
  'LOW_CARB',
  'KETO_COMPATIBLE',
  'PALEO_COMPATIBLE',
  'PESCATARIAN',
] as const;
export const NUTRITION_TAG_VALUES = [
  'HIGH_PROTEIN',
  'HIGH_FIBER',
  'HIGH_HEALTHY_FATS',
  'LOW_SUGAR',
  'LOW_SODIUM',
  'WHOLE_FOOD',
  'MINIMALLY_PROCESSED',
  'ENERGY_DENSE',
  'SATIATING',
] as const;

/** @public Mirrors Prisma `PlateType` enum. */
export type PlateType = (typeof PLATE_TYPE_VALUES)[number];

/** @public Mirrors Prisma `FlavorProfile` enum. */
export type FlavorProfile = (typeof FLAVOR_PROFILE_VALUES)[number];

/** @public Mirrors Prisma `Difficulty` enum. */
export type Difficulty = (typeof DIFFICULTY_VALUES)[number];

/** @public Mirrors Prisma `PlateSize` enum. */
export type PlateSize = (typeof PLATE_SIZE_VALUES)[number];

/** @public Mirrors Prisma `IngredientCategory` enum. */
export type IngredientCategory = (typeof INGREDIENT_CATEGORY_VALUES)[number];

/** @public Mirrors Prisma `PreparationMethod` enum. */
export type PreparationMethod = (typeof PREPARATION_METHOD_VALUES)[number];

/** @public Mirrors Prisma `AdjustmentType` enum. */
export type AdjustmentType = (typeof ADJUSTMENT_TYPE_VALUES)[number];

/** @public Mirrors Prisma `Allergen` enum. */
export type Allergen = (typeof ALLERGEN_VALUES)[number];

/** @public Mirrors Prisma `DietaryTag` enum. */
export type DietaryTag = (typeof DIETARY_TAG_VALUES)[number];

/** @public Mirrors Prisma `NutritionTag` enum. */
export type NutritionTag = (typeof NUTRITION_TAG_VALUES)[number];

// ═══════════════════════════════════════════════════════════════
// ENUM FIELDS
// ═══════════════════════════════════════════════════════════════

/** @public plateType — tipo gastronómico del plato o receta. */
export const plateTypeField = {
  schema: z.enum(PLATE_TYPE_VALUES),
  rules: ['Elegí el tipo que mejor describe el plato o la receta.'] as const,
} as const;

/** @public flavorProfile — perfil de sabor dominante. */
export const flavorProfileField = {
  schema: z.enum(FLAVOR_PROFILE_VALUES),
  rules: ['Elegí el perfil de sabor dominante del plato, receta o ingrediente.'] as const,
} as const;

/** @public difficulty — nivel técnico de preparación. */
export const difficultyField = {
  schema: z.enum(DIFFICULTY_VALUES),
  rules: ['Refleja la complejidad real de preparación de la receta.'] as const,
} as const;

/** @public plateSize — tamaño comercial del plato. */
export const plateSizeField = {
  schema: z.enum(PLATE_SIZE_VALUES),
  rules: ['Representa el tamaño de porción ofrecido en el menú.'] as const,
} as const;

/** @public ingredientCategory — clasificación principal del ingrediente. */
export const ingredientCategoryField = {
  schema: z.enum(INGREDIENT_CATEGORY_VALUES),
  rules: ['Elegí la categoría que mejor describe la materia prima base.'] as const,
} as const;

/** @public preparationMethod — técnica aplicada a la variante. */
export const preparationMethodField = {
  schema: z.enum(PREPARATION_METHOD_VALUES),
  rules: ['Indicá el método de preparación dominante de la variante.'] as const,
} as const;

/** @public adjustmentType — cómo se altera un plato respecto de su receta base. */
export const adjustmentTypeField = {
  schema: z.enum(ADJUSTMENT_TYPE_VALUES),
  rules: ['Define si el ajuste agrega, remueve o sustituye un componente.'] as const,
} as const;

/** @public allergen — alérgenos declarables en ingredientes, recetas y platos. */
export const allergenField = {
  schema: z.enum(ALLERGEN_VALUES),
  rules: ['Declarar alérgenos mejora seguridad y transparencia del menú.'] as const,
} as const;

/** @public dietaryTag — compatibilidad dietaria declarativa, no moralizante. */
export const dietaryTagField = {
  schema: z.enum(DIETARY_TAG_VALUES),
  rules: ['Indicá compatibilidades dietarias reales del producto final.'] as const,
} as const;

/** @public nutritionTag — highlights nutricionales descriptivos. */
export const nutritionTagField = {
  schema: z.enum(NUTRITION_TAG_VALUES),
  rules: ['Usalos para comunicar rasgos nutricionales relevantes sin simplificar de más.'] as const,
} as const;
