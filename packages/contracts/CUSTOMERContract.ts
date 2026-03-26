import { z } from 'zod';
import { defineEndpoint } from '@app/sdk';
import {
  plateNameField,
  plateDescriptionField,
  plateSourceField,
  plateTypeField,
  flavorProfileField,
  ingredientNameField,
  tagNameField,
  reviewCommentField,
} from '@app/sdk';

// ─────────────────────────────────────────────────────────────
//  SHARED SCHEMAS
// ─────────────────────────────────────────────────────────────

const EmbeddedTagSchema = z.object({
  id: z.uuid(),
  name: tagNameField.schema,
});

const EmbeddedIngredientSchema = z.object({
  id: z.uuid(),
  name: ingredientNameField.schema,
  flavor: flavorProfileField.schema,
});

export const PlateSchema = z.object({
  id: z.uuid(),
  name: plateNameField.schema,
  description: plateDescriptionField.schema,
  source: plateSourceField.schema,
  type: plateTypeField.schema,
  flavor: flavorProfileField.schema,
  avgRating: z.number().min(0).max(5),
  ratingsCount: z.number().int().nonnegative(),
  isAvailable: z.boolean(),
  ingredients: z.array(EmbeddedIngredientSchema),
  tags: z.array(EmbeddedTagSchema),
  createdAt: z.iso.datetime(),
});

export const PlateListItemSchema = z.object({
  id: z.uuid(),
  name: plateNameField.schema,
  description: plateDescriptionField.schema,
  type: plateTypeField.schema,
  flavor: flavorProfileField.schema,
  avgRating: z.number().min(0).max(5),
  ratingsCount: z.number().int().nonnegative(),
  isAvailable: z.boolean(),
  tags: z.array(EmbeddedTagSchema),
});

export const ReviewSchema = z.object({
  id: z.uuid(),
  plateId: z.uuid(),
  rating: z.number().min(1).max(5),
  comment: reviewCommentField.schema,
  createdAt: z.iso.datetime(),
});

export const TagSchema = z.object({
  id: z.uuid(),
  name: tagNameField.schema,
  usageCount: z.number().int().nonnegative(),
  isApproved: z.boolean(),
  createdAt: z.iso.datetime(),
});

export const IngredientSchema = z.object({
  id: z.uuid(),
  name: ingredientNameField.schema,
  flavor: flavorProfileField.schema,
  isActive: z.boolean(),
});

// ─────────────────────────────────────────────────────────────
//  PLATE — CRUD
// ─────────────────────────────────────────────────────────────

/** GET /customer/plates — public. Listado paginado con filtros opcionales. */
export const GetPlatesContract = defineEndpoint('public', 'GET /customer/plates')
  .IO(
    z.object({
      type: plateTypeField.schema.optional(),
      flavor: flavorProfileField.schema.optional(),
      tag: z.string().optional(),
      available: z.coerce.boolean().optional(),
      page: z.coerce.number().int().positive().optional().default(1),
      limit: z.coerce.number().int().positive().max(50).optional().default(20),
    }),
    z.object({
      items: z.array(PlateListItemSchema),
      total: z.number().int().nonnegative(),
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
    }),
  )
  .doc('Plate listing', 'Returns a paginated list of plates. Public — used on the landing page.')
  .build();

/** GET /customer/plate — auth. Detalle completo de un plato. */
export const GetPlateContract = defineEndpoint('auth', 'GET /customer/plate')
  .IO(z.object({ id: z.uuid() }), PlateSchema)
  .doc('Plate detail', 'Returns the full detail of a single plate including ingredients and tags.')
  .build();

/**
 * POST /customer/plate — auth.
 * El creatorId se toma del token — no se expone en el input.
 */
export const CreatePlateContract = defineEndpoint('auth', 'POST /customer/plate')
  .IO(
    z.object({
      name: plateNameField.schema,
      description: plateDescriptionField.schema,
      source: plateSourceField.schema,
      type: plateTypeField.schema,
      flavor: flavorProfileField.schema,
      ingredients: z.array(z.uuid()).min(1), // ids de ingredientes existentes
      tags: z.array(z.uuid()).optional(), // ids de tags aprobados
    }),
    z.void(),
  )
  .doc('Plate create', 'Creates a new plate. The authenticated user is set as creator.')
  .build();

/**
 * PUT /customer/plate — auth.
 * Reemplaza todos los campos. Solo el creador puede hacerlo.
 */
export const UpdatePlateContract = defineEndpoint('auth', 'PUT /customer/plate')
  .IO(
    z.object({
      id: z.uuid(),
      name: plateNameField.schema,
      description: plateDescriptionField.schema,
      source: plateSourceField.schema,
      type: plateTypeField.schema,
      flavor: flavorProfileField.schema,
      isAvailable: z.boolean(),
      ingredients: z.array(z.uuid()).min(1),
      tags: z.array(z.uuid()).optional(),
    }),
    z.void(),
  )
  .doc('Plate full update', 'Replaces all plate fields. Requires ownership.')
  .build();

/**
 * PATCH /customer/plate — auth.
 * Actualización parcial. Solo el creador puede hacerlo.
 */
export const PatchPlateContract = defineEndpoint('auth', 'PATCH /customer/plate')
  .IO(
    z.object({
      id: z.uuid(),
      name: plateNameField.schema.optional(),
      description: plateDescriptionField.schema.optional(),
      source: plateSourceField.schema.optional(),
      type: plateTypeField.schema.optional(),
      flavor: flavorProfileField.schema.optional(),
      isAvailable: z.boolean().optional(),
      ingredients: z.array(z.uuid()).min(1).optional(),
      tags: z.array(z.uuid()).optional(),
    }),
    z.void(),
  )
  .doc('Plate partial update', 'Updates only the provided fields. Requires ownership.')
  .build();

/**
 * DELETE /customer/plate — auth.
 * Solo el creador o un AUTHORITY puede eliminarlo.
 * La verificación de rango AUTHORITY se hace en el service.
 */
export const DeletePlateContract = defineEndpoint('auth', 'DELETE /customer/plate')
  .IO(z.object({ id: z.uuid() }), z.void())
  .doc('Plate delete', 'Deletes a plate. Requires ownership or AUTHORITY rank.')
  .build();

// ─────────────────────────────────────────────────────────────
//  REVIEW — CRUD
// ─────────────────────────────────────────────────────────────

/** GET /customer/reviews — auth. Reviews del usuario autenticado. */
export const GetMyReviewsContract = defineEndpoint('auth', 'GET /customer/reviews')
  .IO(
    z.object({
      page: z.coerce.number().int().positive().optional().default(1),
      limit: z.coerce.number().int().positive().max(50).optional().default(10),
    }),
    z.object({
      items: z.array(ReviewSchema),
      total: z.number().int().nonnegative(),
    }),
  )
  .doc('My reviews', 'Returns all reviews written by the authenticated user.')
  .build();

/** GET /customer/review — auth. Una review específica del usuario por plateId. */
export const GetReviewContract = defineEndpoint('auth', 'GET /customer/review')
  .IO(z.object({ plateId: z.uuid() }), ReviewSchema)
  .doc('Review detail', 'Returns the authenticated user review for a specific plate.')
  .build();

/**
 * POST /customer/review — auth.
 * Crea una review. El userId viene del token.
 * Falla si ya existe una (usar PATCH para editar).
 */
export const CreateReviewContract = defineEndpoint('auth', 'POST /customer/review')
  .IO(
    z.object({
      plateId: z.uuid(),
      rating: z.number().min(1).max(5),
      comment: reviewCommentField.schema,
    }),
    z.void(),
  )
  .doc('Review create', 'Creates a review for a plate. One review per user per plate.')
  .build();

/**
 * PATCH /customer/review — auth.
 * Edita rating y/o comment. Solo el autor puede hacerlo.
 */
export const PatchReviewContract = defineEndpoint('auth', 'PATCH /customer/review')
  .IO(
    z.object({
      plateId: z.uuid(),
      rating: z.number().min(1).max(5).optional(),
      comment: reviewCommentField.schema.optional(),
    }),
    z.void(),
  )
  .doc('Review partial update', 'Updates rating and/or comment. Requires authorship.')
  .build();

/**
 * DELETE /customer/review — auth.
 * Solo el autor puede eliminar su propia review.
 */
export const DeleteReviewContract = defineEndpoint('auth', 'DELETE /customer/review')
  .IO(z.object({ plateId: z.uuid() }), z.void())
  .doc('Review delete', 'Deletes the authenticated user review for a given plate.')
  .build();

// ─────────────────────────────────────────────────────────────
//  INGREDIENT — CRUD
// ─────────────────────────────────────────────────────────────

/** GET /customer/ingredients — public. Lista ingredientes activos. */
export const GetIngredientsContract = defineEndpoint('public', 'GET /customer/ingredients')
  .IO(
    z.object({
      flavor: flavorProfileField.schema.optional(),
      page: z.coerce.number().int().positive().optional().default(1),
      limit: z.coerce.number().int().positive().max(100).optional().default(50),
    }),
    z.object({
      items: z.array(IngredientSchema),
      total: z.number().int().nonnegative(),
    }),
  )
  .doc('Ingredient listing', 'Returns active ingredients. Used when composing plates.')
  .build();

/** GET /customer/ingredient — auth. Detalle de un ingrediente por id. */
export const GetIngredientContract = defineEndpoint('auth', 'GET /customer/ingredient')
  .IO(z.object({ id: z.uuid() }), IngredientSchema)
  .doc('Ingredient detail', 'Returns the detail of a single ingredient.')
  .build();

/** POST /customer/ingredient — auth. Crea un nuevo ingrediente. */
export const CreateIngredientContract = defineEndpoint('auth', 'POST /customer/ingredient')
  .IO(
    z.object({
      name: ingredientNameField.schema,
      flavor: flavorProfileField.schema,
    }),
    z.void(),
  )
  .doc('Ingredient create', 'Creates a new ingredient.')
  .build();

/** PUT /customer/ingredient — auth. Reemplaza nombre y flavor de un ingrediente. */
export const UpdateIngredientContract = defineEndpoint('auth', 'PUT /customer/ingredient')
  .IO(
    z.object({
      id: z.uuid(),
      name: ingredientNameField.schema,
      flavor: flavorProfileField.schema,
    }),
    z.void(),
  )
  .doc('Ingredient full update', 'Replaces name and flavor of an ingredient.')
  .build();

/** PATCH /customer/ingredient — auth. Actualización parcial de un ingrediente. */
export const PatchIngredientContract = defineEndpoint('auth', 'PATCH /customer/ingredient')
  .IO(
    z.object({
      id: z.uuid(),
      name: ingredientNameField.schema.optional(),
      flavor: flavorProfileField.schema.optional(),
      isActive: z.boolean().optional(),
    }),
    z.void(),
  )
  .doc('Ingredient partial update', 'Updates name, flavor and/or active state.')
  .build();

/** DELETE /customer/ingredient — auth. Elimina un ingrediente. */
export const DeleteIngredientContract = defineEndpoint('auth', 'DELETE /customer/ingredient')
  .IO(z.object({ id: z.uuid() }), z.void())
  .doc('Ingredient delete', 'Deletes an ingredient. Fails if used in any plate.')
  .build();

// ─────────────────────────────────────────────────────────────
//  TAG — CRUD
// ─────────────────────────────────────────────────────────────

/** GET /customer/tags — public. Lista tags aprobados y activos. */
export const GetTagsContract = defineEndpoint('public', 'GET /customer/tags')
  .IO(
    z.object({
      page: z.coerce.number().int().positive().optional().default(1),
      limit: z.coerce.number().int().positive().max(100).optional().default(50),
    }),
    z.object({
      items: z.array(TagSchema),
      total: z.number().int().nonnegative(),
    }),
  )
  .doc('Tag listing', 'Returns approved and active tags. Used to filter plates on the landing.')
  .build();

/** GET /customer/tag — auth. Detalle de un tag por id. */
export const GetTagContract = defineEndpoint('auth', 'GET /customer/tag')
  .IO(z.object({ id: z.uuid() }), TagSchema)
  .doc('Tag detail', 'Returns the detail of a single tag.')
  .build();

/**
 * POST /customer/tag — auth.
 * Propone un nuevo tag. Queda con isApproved: false hasta revisión.
 */
export const ProposeTagContract = defineEndpoint('auth', 'POST /customer/tag')
  .IO(z.object({ name: tagNameField.schema }), z.void())
  .doc('Tag proposal', 'Proposes a new tag. Stays pending until an AUTHORITY approves it.')
  .build();

/**
 * PATCH /customer/tag — auth.
 * Solo el creador puede renombrar su tag si aún no fue aprobado.
 */
export const PatchTagContract = defineEndpoint('auth', 'PATCH /customer/tag')
  .IO(
    z.object({
      id: z.uuid(),
      name: tagNameField.schema.optional(),
    }),
    z.void(),
  )
  .doc('Tag partial update', 'Renames a pending tag. Only the creator can do this.')
  .build();

/**
 * DELETE /customer/tag — auth.
 * Solo el creador (si el tag no fue aprobado) o AUTHORITY puede eliminarlo.
 */
export const DeleteTagContract = defineEndpoint('auth', 'DELETE /customer/tag')
  .IO(z.object({ id: z.uuid() }), z.void())
  .doc('Tag delete', 'Deletes a tag. Requires ownership (pending only) or AUTHORITY rank.')
  .build();

// ─────────────────────────────────────────────────────────────
//  EXPORT
// ─────────────────────────────────────────────────────────────

export const CUSTOMERContract = [
  // Plates
  GetPlatesContract,
  GetPlateContract,
  CreatePlateContract,
  UpdatePlateContract,
  PatchPlateContract,
  DeletePlateContract,
  // Reviews
  GetMyReviewsContract,
  GetReviewContract,
  CreateReviewContract,
  PatchReviewContract,
  DeleteReviewContract,
  // Ingredients
  GetIngredientsContract,
  GetIngredientContract,
  CreateIngredientContract,
  UpdateIngredientContract,
  PatchIngredientContract,
  DeleteIngredientContract,
  // Tags
  GetTagsContract,
  GetTagContract,
  ProposeTagContract,
  PatchTagContract,
  DeleteTagContract,
] as const;
