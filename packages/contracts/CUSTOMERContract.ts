/**
 * @file CUSTOMERContract.ts
 * @module Contracts
 * @description Archivo CUSTOMERContract alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: schemas, contratos, adapters y utilidades tipadas compartidas
 * outputs: infraestructura tipada reutilizable del workspace
 * rules: preservar una unica fuente de verdad y API funcional tipada
 *
 * @technical
 * dependencies: zod, @app/sdk
 * flow: define artefactos compartidos del workspace; compone tipos, contratos o runtime reutilizable; exporta piezas consumidas por frontend y backend.
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: las piezas compartidas viven en packages para evitar duplicacion
 */
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
import * as z from 'zod';
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

export const ReviewerSchema = z.object({
  id: z.uuid(),
  displayName: z.string(),
  /** Avatar generado (sin foto de perfil persistida en el usuario). */
  avatarUrl: z.string().nullable(),
});

export const ReviewSchema = z.object({
  id: z.uuid(),
  rating: z.number(),
  comment: reviewCommentField.schema,
  recommends: z.boolean().nullable(),
  createdAt: z.string(),
  reviewer: ReviewerSchema,
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
  imageUrl: z.string().max(255).nullable(),
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

const qCsv = (val: unknown): string[] | undefined => {
  if (val == null || val === '') return undefined;
  if (Array.isArray(val)) {
    return val
      .flatMap((v) => String(v).split(','))
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (typeof val === 'string') {
    return val
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return undefined;
};

const asOptNum = z.preprocess(
  (v) => (v === '' || v == null ? undefined : v),
  z.coerce.number().optional(),
);

const asOptInt = z.preprocess(
  (v) => (v === '' || v == null ? undefined : v),
  z.coerce.number().int().optional(),
);

export const SearchPlatesQuerySchema = z.object({
  q: z.string().optional(),
  sort: z
    .enum([
      'price_asc',
      'price_desc',
      'rating_desc',
      'rating_asc',
      'name_asc',
      'name_desc',
      'popular_desc',
    ])
    .default('name_asc'),
  page: z.coerce.number().int().min(1).catch(1),
  pageSize: z.coerce.number().int().min(1).max(60).catch(24),
  minPrice: asOptNum,
  maxPrice: asOptNum,
  minCalories: asOptNum,
  maxCalories: asOptNum,
  minProtein: asOptNum,
  maxProtein: asOptNum,
  minFat: asOptNum,
  maxFat: asOptNum,
  minRating: asOptNum,
  minRatingsCount: asOptInt,
  minLikes: asOptInt,
  maxPrepMinutes: asOptInt,
  maxCookMinutes: asOptInt,
  minYieldServings: asOptInt,
  maxYieldServings: asOptInt,
  minServedWeightGrams: asOptNum,
  maxServedWeightGrams: asOptNum,
  recipeTypes: z.preprocess(qCsv, z.array(plateTypeField.schema).optional()),
  flavors: z.preprocess(qCsv, z.array(flavorProfileField.schema).optional()),
  difficulties: z.preprocess(qCsv, z.array(difficultyField.schema).optional()),
  sizes: z.preprocess(qCsv, z.array(plateSizeField.schema).optional()),
  /** Alérgenos: excluir platos que contengan alguno de estos. */
  excludeAllergens: z.preprocess(qCsv, z.array(allergenField.schema).optional()),
  /** Etiquetas dietarias que el plato debe incluir (todas). */
  dietaryTags: z.preprocess(qCsv, z.array(dietaryTagField.schema).optional()),
  /** Etiquetas nutricionales que el plato debe incluir (todas). */
  nutritionTags: z.preprocess(qCsv, z.array(nutritionTagField.schema).optional()),
  /** Mismas etiquetas a nivel receta (todas). */
  recipeDietaryTags: z.preprocess(qCsv, z.array(dietaryTagField.schema).optional()),
  /** Nombres de tags de cartelería (coincidencia sin distinguir mayúsculas). */
  tagNames: z.preprocess(qCsv, z.array(z.string().min(1)).optional()),
});

export const SearchPlatesResponseSchema = z.object({
  items: z.array(PlateSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
});

/** Tipo de entrada ya validada (query parseada en el servidor). */
export type SearchPlatesQuery = z.output<typeof SearchPlatesQuerySchema>;

export const SearchPlatesContract = defineEndpoint('public', 'GET /customers/search')
  .IO(SearchPlatesQuerySchema, SearchPlatesResponseSchema)
  .doc(
    'Search menu',
    'Filtered, sortable catalog with URL-friendly query params; totals for pagination.',
  )
  .build();

export const FeaturedPlateSchema = PlateSchema.extend({
  unitsSold: z.number().int(),
});

export const GetFeaturedPlatesContract = defineEndpoint('public', 'GET /customers/featured')
  .IO(
    z.object({
      limit: z.coerce.number().int().min(1).max(10).catch(3),
    }),
    z.array(FeaturedPlateSchema),
  )
  .doc('Featured plates', 'Top sellers weighted with review quality; default limit 3.')
  .build();

export const UpsertReviewBodySchema = z.object({
  plateId: z.uuid(),
  rating: z.number().int().min(1).max(5),
  comment: reviewCommentField.schema.optional(),
  recommends: z.boolean().optional(),
});

/** Alta o edición de la reseña del usuario autenticado para un plato (rol CUSTOMER). */
export const UpsertReviewContract = defineEndpoint('role', 'POST /customers/reviews')
  .IO(UpsertReviewBodySchema, ReviewSchema)
  .doc(
    'Publicar reseña',
    'Crea o actualiza la reseña del cliente para un plato; recalcula promedio del plato.',
  )
  .build();

export const CreateCustomerOrderLineSchema = z.object({
  plateId: z.uuid(),
  quantity: z.number().int().min(1).max(99),
});

export const CreateCustomerOrderBodySchema = z.object({
  lines: z.array(CreateCustomerOrderLineSchema).min(1).max(40),
  fulfillment: z.enum(['dine_in', 'pickup', 'delivery']),
});

export const CreateCustomerOrderResponseSchema = z.object({
  saleId: z.uuid(),
  totalAmount: z.number(),
  status: z.enum(['OPEN', 'CONFIRMED', 'CANCELLED', 'REFUNDED']),
  channel: z.enum(['COUNTER', 'TAKEAWAY', 'DELIVERY', 'ONLINE']),
  fulfillment: z.enum(['dine_in', 'pickup', 'delivery']),
  lifecycleStatus: z.enum(['PENDIENTE', 'COMPLETADO']),
});

export const OrderHistoryLineSchema = z.object({
  plateId: z.uuid(),
  name: z.string(),
  quantity: z.number().int().min(1),
  unitPrice: z.number(),
});

export const OrderHistoryEntrySchema = z.object({
  id: z.string(),
  saleId: z.string().optional(),
  completedAt: z.string(),
  lines: z.array(OrderHistoryLineSchema),
  total: z.number(),
  fulfillment: z.enum(['dine_in', 'pickup', 'delivery']).optional(),
  lifecycleStatus: z.enum(['PENDIENTE', 'COMPLETADO']).optional(),
});

export const GetCustomerOrderHistoryContract = defineEndpoint('public', 'GET /customers/history')
  .IO(z.object({}), z.array(OrderHistoryEntrySchema))
  .doc('Historial de pedidos', 'Retorna los pedidos del cliente según sesión/cookie y cache local.')
  .build();

/** Pedido web con precios de menú desde DB; sesión opcional para asociar la venta al usuario. */
export const CreateCustomerOrderContract = defineEndpoint('public', 'POST /customers/orders')
  .IO(CreateCustomerOrderBodySchema, CreateCustomerOrderResponseSchema)
  .doc(
    'Registrar pedido',
    'Crea una Sale con ítems; consume en local, retiro o delivery. Estado acorde a la modalidad.',
  )
  .build();

export const AddressSchema = z.object({
  id: z.string().uuid(),
  street: z.string().min(1).max(128),
  number: z.string().min(1).max(16),
  floorApt: z.string().max(32).nullable(),
  notes: z.string().max(255).nullable(),
  isDefault: z.boolean(),
});

export const CreateAddressSchema = z.object({
  street: z.string().min(1).max(128),
  number: z.string().min(1).max(16),
  floorApt: z.string().max(32).optional(),
  notes: z.string().max(255).optional(),
  isDefault: z.boolean().optional(),
});

export const UpdateAddressSchema = CreateAddressSchema.extend({
  id: z.string().uuid(),
});

export const GetAddressesContract = defineEndpoint('auth', 'GET /customers/addresses')
  .IO(z.object({}), z.array(AddressSchema))
  .doc('Get Addresses', 'Returns all addresses for the authenticated customer.')
  .build();

export const CreateAddressContract = defineEndpoint('auth', 'POST /customers/addresses')
  .IO(CreateAddressSchema, AddressSchema)
  .doc('Create Address', 'Creates a new address for the authenticated customer.')
  .build();

export const UpdateAddressContract = defineEndpoint('auth', 'PUT /customers/addresses')
  .IO(UpdateAddressSchema, AddressSchema)
  .doc('Update Address', 'Updates an existing address.')
  .build();

export const CUSTOMERContract = [
  GetPlatesContract,
  GetFeaturedPlatesContract,
  SearchPlatesContract,
  UpsertReviewContract,
  CreateCustomerOrderContract,
  GetCustomerOrderHistoryContract,
  GetAddressesContract,
  CreateAddressContract,
  UpdateAddressContract,
] as const;
