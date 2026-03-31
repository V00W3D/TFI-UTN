import { ERR, analyzePlateNutrition, analyzePlatePricing, type InferSuccess } from '@app/sdk';
import type { GetPlatesContract } from '@app/contracts';
import { prisma as db } from '../../../tools/db';
import { resolveAssetUrl } from '../../../catalog/plateImages';

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

const mapIngredient = (ingredient: {
  id: string;
  name: string;
  description: string | null;
  category: InferSuccess<typeof GetPlatesContract>[number]['recipe']['items'][number]['variant']['ingredient']['category'];
  subCategory: string | null;
  primaryFlavor: InferSuccess<typeof GetPlatesContract>[number]['recipe']['items'][number]['variant']['ingredient']['primaryFlavor'];
  nutritionBasisGrams: number;
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
  allergens: InferSuccess<typeof GetPlatesContract>[number]['recipe']['items'][number]['variant']['ingredient']['allergens'];
  dietaryTags: InferSuccess<typeof GetPlatesContract>[number]['recipe']['items'][number]['variant']['ingredient']['dietaryTags'];
  nutritionTags: InferSuccess<typeof GetPlatesContract>[number]['recipe']['items'][number]['variant']['ingredient']['nutritionTags'];
  notes: string | null;
  extraAttributes: unknown;
}) => ({
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

const mapVariant = (variant: {
  id: string;
  name: string;
  description: string | null;
  preparationMethod: InferSuccess<typeof GetPlatesContract>[number]['recipe']['items'][number]['variant']['preparationMethod'];
  preparationNotes: string | null;
  portionGrams: number;
  yieldFactor: number;
  isDefault: boolean;
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
  ingredient: Parameters<typeof mapIngredient>[0];
}) => ({
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

const mapRecipeItem = (item: {
  id: string;
  quantityGrams: number;
  prepNotes: string | null;
  isOptional: boolean;
  isMainComponent: boolean;
  sortOrder: number;
  variant: Parameters<typeof mapVariant>[0];
}) => ({
  id: item.id,
  quantityGrams: item.quantityGrams,
  prepNotes: item.prepNotes ?? null,
  isOptional: item.isOptional,
  isMainComponent: item.isMainComponent,
  sortOrder: item.sortOrder,
  variant: mapVariant(item.variant),
});

const mapReview = (review: {
  id: string;
  rating: number;
  comment: string | null;
  recommends: boolean | null;
  createdAt: Date;
}) => ({
  id: review.id,
  rating: review.rating,
  comment: review.comment ?? null,
  recommends: review.recommends ?? null,
  createdAt: review.createdAt.toISOString(),
});

const mapTag = (entry: {
  tag: {
    id: string;
    name: string;
    description: string | null;
  };
}) => ({
  id: entry.tag.id,
  name: entry.tag.name,
  description: entry.tag.description ?? null,
});

const mapAdjustment = (adjustment: {
  id: string;
  adjustmentType: InferSuccess<typeof GetPlatesContract>[number]['adjustments'][number]['adjustmentType'];
  quantityGrams: number | null;
  notes: string | null;
  sortOrder: number;
  recipeItemId: string | null;
  recipeItem: Parameters<typeof mapRecipeItem>[0] | null;
  variant: Parameters<typeof mapVariant>[0] | null;
}) => ({
  id: adjustment.id,
  adjustmentType: adjustment.adjustmentType,
  quantityGrams: adjustment.quantityGrams ?? null,
  notes: adjustment.notes ?? null,
  sortOrder: adjustment.sortOrder,
  recipeItemId: adjustment.recipeItemId ?? null,
  recipeItem: adjustment.recipeItem ? mapRecipeItem(adjustment.recipeItem) : null,
  variant: adjustment.variant ? mapVariant(adjustment.variant) : null,
});

/**
 * @description Retrieves the public restaurant catalog with full customer-relevant dish detail.
 */
export const getPlatesService = async (): Promise<InferSuccess<typeof GetPlatesContract>> => {
  try {
    const plates = await db.plate.findMany({
      where: {
        isAvailable: true,
        recipe: { isActive: true },
      },
      include: {
        recipe: {
          include: {
            items: {
              where: {
                variant: {
                  isActive: true,
                  ingredient: { isActive: true },
                },
              },
              orderBy: { sortOrder: 'asc' },
              include: {
                variant: {
                  include: {
                    ingredient: true,
                  },
                },
              },
            },
          },
        },
        adjustments: {
          orderBy: { sortOrder: 'asc' },
          include: {
            recipeItem: {
              include: {
                variant: {
                  include: {
                    ingredient: true,
                  },
                },
              },
            },
            variant: {
              include: {
                ingredient: true,
              },
            },
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
        tags: {
          where: {
            tag: { isActive: true },
          },
          include: {
            tag: true,
          },
        },
      },
      orderBy: [{ likesCount: 'desc' }, { avgRating: 'desc' }, { name: 'asc' }],
    });

    return plates.map((plate) => {
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
        imageUrl: resolveAssetUrl(
          (plate as { imageUrl?: string | null }).imageUrl ?? null,
          '',
        ),
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
    });
  } catch {
    throw ERR.INTERNAL(['DATABASE_ERROR']);
  }
};
