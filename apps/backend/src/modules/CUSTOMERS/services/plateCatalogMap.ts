/**
 * @file plateCatalogMap.ts
 * @module CUSTOMERS
 * @description Archivo plateCatalogMap alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: payloads tipados, ids autenticados, helpers compartidos y acceso a Prisma cuando aplica
 * outputs: datos de dominio listos para contrato, mutaciones persistidas o payloads auxiliares
 * rules: normalizar datos, validar reglas de dominio y preservar consistencia transaccional
 *
 * @technical
 * dependencies: @app/sdk, @app/contracts, plateImages, plateCatalogInclude
 * flow: normaliza los datos recibidos; consulta o muta dependencias de dominio e infraestructura; arma la respuesta del caso de uso; devuelve un resultado consumible por handlers u otros servicios.
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
 * decisions: la logica de negocio se concentra en funciones async reutilizables y desacopladas del transporte
 */
import { analyzePlateNutrition, analyzePlatePricing, type InferSuccess } from '@app/sdk';
import type { GetPlatesContract } from '@app/contracts';
import { resolveAssetUrl } from '../../../catalog/plateImages';
import type { PlateCatalogRecord } from './plateCatalogInclude';

type PlateDto = InferSuccess<typeof GetPlatesContract>[number];

const mapIngredientNutrition = (ingredient: {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugars: number;
  sodium: number;
  saturatedFat: number;
  transFat: number;
  monounsaturatedFat: number;
  polyunsaturatedFat: number;
}) => ({
  calories: ingredient.calories,
  proteins: ingredient.proteins,
  carbs: ingredient.carbs,
  fats: ingredient.fats,
  fiber: ingredient.fiber,
  sugars: ingredient.sugars,
  sodium: ingredient.sodium,
  saturatedFat: ingredient.saturatedFat,
  transFat: ingredient.transFat,
  monounsaturatedFat: ingredient.monounsaturatedFat,
  polyunsaturatedFat: ingredient.polyunsaturatedFat,
});

const mapVariantOverrideNutrition = (variant: {
  overrideCalories: number | null;
  overrideProteins: number | null;
  overrideCarbs: number | null;
  overrideFats: number | null;
  overrideFiber: number | null;
  overrideSugars: number | null;
  overrideSodium: number | null;
  overrideSaturatedFat: number | null;
  overrideTransFat: number | null;
  overrideMonounsaturatedFat: number | null;
  overridePolyunsaturatedFat: number | null;
}) => ({
  calories: variant.overrideCalories ?? null,
  proteins: variant.overrideProteins ?? null,
  carbs: variant.overrideCarbs ?? null,
  fats: variant.overrideFats ?? null,
  fiber: variant.overrideFiber ?? null,
  sugars: variant.overrideSugars ?? null,
  sodium: variant.overrideSodium ?? null,
  saturatedFat: variant.overrideSaturatedFat ?? null,
  transFat: variant.overrideTransFat ?? null,
  monounsaturatedFat: variant.overrideMonounsaturatedFat ?? null,
  polyunsaturatedFat: variant.overridePolyunsaturatedFat ?? null,
});

const mapIngredient = (
  ingredient: PlateCatalogRecord['recipe']['items'][number]['variant']['ingredient'],
): PlateDto['recipe']['items'][number]['variant']['ingredient'] => ({
  id: ingredient.id,
  name: ingredient.name,
  description: ingredient.description ?? null,
  category: ingredient.category,
  subCategory: ingredient.subCategory ?? null,
  primaryFlavor: ingredient.primaryFlavor ?? null,
  nutritionBasisGrams: ingredient.nutritionBasisGrams,
  nutrition: mapIngredientNutrition(ingredient),
  allergens: ingredient.allergens,
  dietaryTags: ingredient.dietaryTags,
  nutritionTags: ingredient.nutritionTags,
  notes: ingredient.notes ?? null,
  extraAttributes: ingredient.extraAttributes ?? null,
});

const mapVariant = (
  variant: PlateCatalogRecord['recipe']['items'][number]['variant'],
): PlateDto['recipe']['items'][number]['variant'] => ({
  id: variant.id,
  name: variant.name,
  description: variant.description ?? null,
  preparationMethod: variant.preparationMethod,
  preparationNotes: variant.preparationNotes ?? null,
  portionGrams: variant.portionGrams,
  yieldFactor: variant.yieldFactor,
  isDefault: variant.isDefault,
  overrideNutrition: mapVariantOverrideNutrition(variant),
  ingredient: mapIngredient(variant.ingredient),
});

const mapRecipeItem = (
  item: PlateCatalogRecord['recipe']['items'][number],
): PlateDto['recipe']['items'][number] => ({
  id: item.id,
  quantityGrams: item.quantityGrams,
  prepNotes: item.prepNotes ?? null,
  isOptional: item.isOptional,
  isMainComponent: item.isMainComponent,
  sortOrder: item.sortOrder,
  variant: mapVariant(item.variant),
});

export type ReviewUserSelect = PlateCatalogRecord['reviews'][number]['user'];

export const reviewerFromUser = (u: ReviewUserSelect): PlateDto['reviews'][number]['reviewer'] => ({
  id: u.id,
  displayName:
    [u.name, u.sname, u.lname]
      .filter((p): p is string => Boolean(p?.trim()))
      .join(' ')
      .trim() || u.username,
  avatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(u.username)}`,
});

export const mapReviewWithUser = (review: {
  id: string;
  rating: number;
  comment: string | null;
  recommends: boolean | null;
  createdAt: Date;
  user: ReviewUserSelect;
}): PlateDto['reviews'][number] => ({
  id: review.id,
  rating: review.rating,
  comment: review.comment ?? null,
  recommends: review.recommends ?? null,
  createdAt: review.createdAt.toISOString(),
  reviewer: reviewerFromUser(review.user),
});

const mapReview = (review: PlateCatalogRecord['reviews'][number]): PlateDto['reviews'][number] =>
  mapReviewWithUser(review);

const mapTag = (entry: PlateCatalogRecord['tags'][number]): PlateDto['tags'][number] => ({
  id: entry.tag.id,
  name: entry.tag.name,
  description: entry.tag.description ?? null,
});

const mapAdjustment = (
  adjustment: PlateCatalogRecord['adjustments'][number],
): PlateDto['adjustments'][number] => ({
  id: adjustment.id,
  adjustmentType: adjustment.adjustmentType,
  quantityGrams: adjustment.quantityGrams ?? null,
  notes: adjustment.notes ?? null,
  sortOrder: adjustment.sortOrder,
  recipeItemId: adjustment.recipeItemId ?? null,
  recipeItem: adjustment.recipeItem ? mapRecipeItem(adjustment.recipeItem) : null,
  variant: adjustment.variant ? mapVariant(adjustment.variant) : null,
});

export const mapPlateRecordToDto = (plate: PlateCatalogRecord): PlateDto => {
  const recipe = {
    id: plate.recipe.id,
    name: plate.recipe.name,
    description: plate.recipe.description ?? null,
    type: plate.recipe.type,
    flavor: plate.recipe.flavor,
    difficulty: plate.recipe.difficulty,
    prepTimeMinutes: plate.recipe.prepTimeMinutes ?? null,
    cookTimeMinutes: plate.recipe.cookTimeMinutes ?? null,
    yieldServings: plate.recipe.yieldServings,
    assemblyNotes: plate.recipe.assemblyNotes ?? null,
    allergens: plate.recipe.allergens,
    dietaryTags: plate.recipe.dietaryTags,
    items: plate.recipe.items.map(mapRecipeItem),
  };
  const adjustments = plate.adjustments.map(mapAdjustment);
  const nutrition = analyzePlateNutrition({ recipe, adjustments }).totalNutrition;
  const pricing = analyzePlatePricing({ recipe, adjustments });
  const menuPrice = pricing.costPrice > 0 ? pricing.menuPrice : plate.menuPrice.toNumber();

  return {
    id: plate.id,
    name: plate.name,
    description: plate.description ?? null,
    imageUrl: resolveAssetUrl(plate.imageUrl ?? null, ''),
    size: plate.size,
    servedWeightGrams: plate.servedWeightGrams ?? null,
    menuPrice,
    avgRating: plate.avgRating,
    ratingsCount: plate.ratingsCount,
    likesCount: plate.likesCount,
    dislikesCount: plate.dislikesCount,
    isAvailable: plate.isAvailable,
    allergens: plate.allergens,
    dietaryTags: plate.dietaryTags,
    nutritionTags: plate.nutritionTags,
    nutritionNotes: plate.nutritionNotes ?? null,
    nutrition,
    tags: plate.tags.map(mapTag),
    recipe,
    adjustments,
    reviews: plate.reviews.map(mapReview),
  };
};
