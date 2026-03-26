/**
 * @file CUSTOMERContract.ts
 * @description Automatically enforced JSDoc header according to context.md guidelines.
 */
import { z } from 'zod';
import { defineEndpoint } from '@app/sdk';
import { plateNameField, descriptionField, plateTypeField, flavorProfileField } from '@app/sdk';

// ─────────────────────────────────────────────────────────────
//  SHARED NUTRITION SCHEMAS
// ─────────────────────────────────────────────────────────────

export const IngredientSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  flavor: flavorProfileField.schema,
  calories: z.number(),
  proteins: z.number(),
  carbs: z.number(),
  fats: z.number(),
});

export const PlateSchema = z.object({
  id: z.uuid(),
  name: plateNameField.schema,
  description: descriptionField.schema.nullable(),
  price: z.number(),
  type: plateTypeField.schema,
  flavor: flavorProfileField.schema,

  // Feedback Stats
  avgRating: z.number(),
  ratingsCount: z.number(),
  recommendations: z.number(),
  notRecommendations: z.number(),

  // Macros
  calories: z.number(),
  proteins: z.number(),
  carbs: z.number(),
  fats: z.number(),

  isAvailable: z.boolean(),

  ingredients: z
    .array(
      z.object({
        ingredient: IngredientSchema,
      }),
    )
    .optional(),
});

// ─────────────────────────────────────────────────────────────
//  CUSTOMER CONTRACTS
// ─────────────────────────────────────────────────────────────

export const GetPlatesContract = defineEndpoint('public', 'GET /customers/plates')
  .IO(z.object({}), z.array(PlateSchema))
  .doc(
    'Fetch Catalog',
    'Returns all QART plates with full nutritional and feedback macro structures.',
  )
  .build();

export const CUSTOMERContract = [GetPlatesContract] as const;
