/**
 * @file CUSTOMERContract.ts
 * @author Victor
 * @description Customer-facing contracts for the restaurant catalog.
 * @remarks Exposes a rich plate payload aligned with the current Prisma restaurant schema.
 *
 * Metrics:
 * - LOC: 170
 * - Experience Level: Mid
 * - Estimated Time: 45m
 * - FPA: 3
 * - PERT: 45m
 * - Planning Poker: 3
 */
import { z } from 'zod';
import { defineEndpoint } from '@app/sdk';
import {
  adjustmentTypeField,
  allergenField,
  descriptionField,
  dietaryTagField,
  difficultyField,
  flavorProfileField,
  ingredientCategoryField,
  ingredientNameField,
  ingredientSubCategoryField,
  ingredientVariantNameField,
  longDescriptionField,
  nutritionTagField,
  plateNameField,
  plateSizeField,
  plateTypeField,
  preparationMethodField,
  recipeNameField,
  reviewCommentField,
  shortNoteField,
  tagNameField,
} from '@app/sdk';

const NutritionSnapshotSchema = z.object({
  calories: z.number(),
  proteins: z.number(),
  carbs: z.number(),
  fats: z.number(),
  fiber: z.number(),
  sugars: z.number(),
  sodium: z.number(),
  saturatedFat: z.number(),
  transFat: z.number(),
  monounsaturatedFat: z.number(),
  polyunsaturatedFat: z.number(),
});

const OptionalNutritionSnapshotSchema = z.object({
  calories: z.number().nullable(),
  proteins: z.number().nullable(),
  carbs: z.number().nullable(),
  fats: z.number().nullable(),
  fiber: z.number().nullable(),
  sugars: z.number().nullable(),
  sodium: z.number().nullable(),
  saturatedFat: z.number().nullable(),
  transFat: z.number().nullable(),
  monounsaturatedFat: z.number().nullable(),
  polyunsaturatedFat: z.number().nullable(),
});

export const IngredientSchema = z.object({
  id: z.uuid(),
  name: ingredientNameField.schema,
  description: shortNoteField.schema,
  category: ingredientCategoryField.schema,
  subCategory: ingredientSubCategoryField.schema,
  primaryFlavor: flavorProfileField.schema.nullable(),
  nutritionBasisGrams: z.number(),
  nutrition: NutritionSnapshotSchema,
  allergens: z.array(allergenField.schema),
  dietaryTags: z.array(dietaryTagField.schema),
  nutritionTags: z.array(nutritionTagField.schema),
  notes: shortNoteField.schema,
  extraAttributes: z.unknown().nullable(),
});

export const IngredientVariantSchema = z.object({
  id: z.uuid(),
  name: ingredientVariantNameField.schema,
  description: shortNoteField.schema,
  preparationMethod: preparationMethodField.schema,
  preparationNotes: shortNoteField.schema,
  portionGrams: z.number(),
  yieldFactor: z.number(),
  isDefault: z.boolean(),
  overrideNutrition: OptionalNutritionSnapshotSchema,
  ingredient: IngredientSchema,
});

export const RecipeItemSchema = z.object({
  id: z.uuid(),
  quantityGrams: z.number(),
  prepNotes: shortNoteField.schema,
  isOptional: z.boolean(),
  isMainComponent: z.boolean(),
  sortOrder: z.number().int(),
  variant: IngredientVariantSchema,
});

export const RecipeSchema = z.object({
  id: z.uuid(),
  name: recipeNameField.schema,
  description: descriptionField.schema,
  type: plateTypeField.schema,
  flavor: flavorProfileField.schema,
  difficulty: difficultyField.schema,
  prepTimeMinutes: z.number().int().nullable(),
  cookTimeMinutes: z.number().int().nullable(),
  yieldServings: z.number().int(),
  assemblyNotes: longDescriptionField.schema,
  allergens: z.array(allergenField.schema),
  dietaryTags: z.array(dietaryTagField.schema),
  items: z.array(RecipeItemSchema),
});

export const TagSchema = z.object({
  id: z.uuid(),
  name: tagNameField.schema,
  description: shortNoteField.schema,
});

export const ReviewSchema = z.object({
  id: z.uuid(),
  rating: z.number(),
  comment: reviewCommentField.schema,
  recommends: z.boolean().nullable(),
  createdAt: z.string(),
});

export const PlateAdjustmentSchema = z.object({
  id: z.uuid(),
  adjustmentType: adjustmentTypeField.schema,
  quantityGrams: z.number().nullable(),
  notes: shortNoteField.schema,
  sortOrder: z.number().int(),
  recipeItemId: z.uuid().nullable(),
  recipeItem: RecipeItemSchema.nullable(),
  variant: IngredientVariantSchema.nullable(),
});

export const PlateSchema = z.object({
  id: z.uuid(),
  name: plateNameField.schema,
  description: descriptionField.schema,
  size: plateSizeField.schema,
  servedWeightGrams: z.number().nullable(),
  menuPrice: z.number(),
  avgRating: z.number(),
  ratingsCount: z.number().int(),
  likesCount: z.number().int(),
  dislikesCount: z.number().int(),
  isAvailable: z.boolean(),
  allergens: z.array(allergenField.schema),
  dietaryTags: z.array(dietaryTagField.schema),
  nutritionTags: z.array(nutritionTagField.schema),
  nutritionNotes: shortNoteField.schema,
  nutrition: NutritionSnapshotSchema,
  tags: z.array(TagSchema),
  recipe: RecipeSchema,
  adjustments: z.array(PlateAdjustmentSchema),
  reviews: z.array(ReviewSchema),
});

export const GetPlatesContract = defineEndpoint('public', 'GET /customers/plates')
  .IO(z.object({}), z.array(PlateSchema))
  .doc(
    'Fetch Catalog',
    'Returns the public restaurant catalog with nutritional, recipe, ingredient, adjustment, tag, and review metadata.',
  )
  .build();

export const CUSTOMERContract = [GetPlatesContract] as const;
