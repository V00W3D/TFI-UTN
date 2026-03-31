import { randomUUID } from 'crypto';
import * as argon2 from 'argon2';
import {
  analyzePlatePricing,
  calculateIngredientSalePrice,
  DEFAULT_RESTAURANT_PRICING_CONFIG,
} from '@app/sdk';
import type {
  Allergen,
  CustomerTier,
  DietaryTag,
  FlavorProfile,
  IngredientCategory,
  NutritionTag,
  PreparationMethod,
  Sex,
} from '../prisma/generated/enums';
import { prisma } from '@tools/db';
import { PLATE_IMAGES } from './catalog/plateImages';

type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

type ReviewSeed = {
  userId: string;
  rating: number;
  comment: string;
  recommends: boolean;
  createdAt: Date;
};

type IngredientSeed = {
  key: string;
  data: {
    name: string;
    description: string | null;
    category: IngredientCategory;
    subCategory: string | null;
    primaryFlavor: FlavorProfile | null;
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
    allergens: Allergen[];
    dietaryTags: DietaryTag[];
    nutritionTags: NutritionTag[];
    notes: string | null;
    extraAttributes: JsonValue | null;
  };
};

type VariantSeed = {
  key: string;
  ingredientKey: string;
  data: {
    name: string;
    description: string | null;
    preparationMethod: PreparationMethod;
    preparationNotes: string | null;
    portionGrams: number;
    yieldFactor: number;
    overrideCalories?: number;
    overrideProteins?: number;
    overrideCarbs?: number;
    overrideFats?: number;
    overrideFiber?: number;
    overrideSugars?: number;
    overrideSodium?: number;
    overrideSaturatedFat?: number;
    overrideTransFat?: number;
    overrideMonounsaturatedFat?: number;
    overridePolyunsaturatedFat?: number;
    isDefault: boolean;
  };
};

type RecipeItemSeed = {
  variantKey: string;
  quantityGrams: number;
  prepNotes: string | null;
  isOptional?: boolean;
  isMainComponent?: boolean;
  sortOrder: number;
};

type RecipeSeedInput = {
  name: string;
  description: string;
  type: 'STARTER' | 'MAIN' | 'DESSERT' | 'SIDE' | 'SNACK' | 'DRINK';
  flavor: FlavorProfile;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'CHEF';
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  yieldServings: number;
  assemblyNotes: string | null;
  allergens: Allergen[];
  dietaryTags: DietaryTag[];
  items: RecipeItemSeed[];
};

type PlateSeedInput = {
  name: string;
  description: string;
  imageUrl: string;
  recipeId: string;
  size: 'SMALL' | 'REGULAR' | 'LARGE' | 'XL';
  servedWeightGrams: number;
  allergens: Allergen[];
  dietaryTags: DietaryTag[];
  nutritionTags: NutritionTag[];
  nutritionNotes: string;
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
  reviews: ReviewSeed[];
};

type IngredientSeedInput = {
  key: string;
  name: string;
  description: string;
  category: IngredientCategory;
  subCategory?: string | null;
  primaryFlavor?: FlavorProfile | null;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  fiber?: number;
  sugars?: number;
  sodium?: number;
  saturatedFat?: number;
  transFat?: number;
  monounsaturatedFat?: number;
  polyunsaturatedFat?: number;
  allergens?: Allergen[];
  dietaryTags?: DietaryTag[];
  nutritionTags?: NutritionTag[];
  notes?: string | null;
  extraAttributes?: JsonValue | null;
};

type VariantSeedInput = {
  key: string;
  ingredientKey: string;
  name: string;
  description: string;
  preparationMethod: PreparationMethod;
  preparationNotes?: string | null;
  portionGrams: number;
  yieldFactor?: number;
  overrides?: Partial<VariantSeed['data']>;
  isDefault?: boolean;
};

type StorageTypeKey = 'AMBIENT' | 'COLD' | 'FREEZER' | 'PRODUCE';

type IngredientOperationalProfile = {
  supplierKey: string;
  supplierName: string;
  pricingBasisGrams: number;
  unitCostNet: number;
  purchaseUnitLabel: string;
  storageType: StorageTypeKey;
  storageLabel: string;
  maxStockGrams: number;
  currentStockGrams: number;
  reorderPointGrams: number;
};

const averageRating = (reviews: ReviewSeed[]) =>
  Number((reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(2));

const recommendationCount = (reviews: ReviewSeed[], recommends: boolean) =>
  reviews.filter((review) => review.recommends === recommends).length;

const review = (
  userId: string,
  rating: number,
  comment: string,
  recommends: boolean,
  createdAt: string,
): ReviewSeed => ({
  userId,
  rating,
  comment,
  recommends,
  createdAt: new Date(createdAt),
});

const ingredientSeed = ({
  key,
  name,
  description,
  category,
  subCategory = null,
  primaryFlavor = 'UNKNOWN',
  calories,
  proteins,
  carbs,
  fats,
  fiber = 0,
  sugars = 0,
  sodium = 0,
  saturatedFat = 0,
  transFat = 0,
  monounsaturatedFat = 0,
  polyunsaturatedFat = 0,
  allergens = [],
  dietaryTags = [],
  nutritionTags = [],
  notes = null,
  extraAttributes = null,
}: IngredientSeedInput): IngredientSeed => ({
  key,
  data: {
    name,
    description,
    category,
    subCategory,
    primaryFlavor,
    nutritionBasisGrams: 100,
    calories,
    proteins,
    carbs,
    fats,
    fiber,
    sugars,
    sodium,
    saturatedFat,
    transFat,
    monounsaturatedFat,
    polyunsaturatedFat,
    allergens,
    dietaryTags,
    nutritionTags,
    notes,
    extraAttributes,
  },
});

const variantSeed = ({
  key,
  ingredientKey,
  name,
  description,
  preparationMethod,
  preparationNotes = null,
  portionGrams,
  yieldFactor = 1,
  overrides = {},
  isDefault = true,
}: VariantSeedInput): VariantSeed => ({
  key,
  ingredientKey,
  data: {
    name,
    description,
    preparationMethod,
    preparationNotes,
    portionGrams,
    yieldFactor,
    isDefault,
    ...overrides,
  },
});

const GENERAL_SUPPLIER = {
  key: 'supplier_qart_general',
  name: 'Distribuidora QART Generalista',
  description:
    'Proveedor mayorista ficticio para integrar secos, frescos, lacteos, fiambres y condimentos.',
  contactName: 'Mesa Comercial QART',
  email: 'compras@proveedor-qart.test',
  phone: '+54 381 600 1000',
  leadTimeDays: 2,
  notes: 'Queda como proveedor generalista base y el schema admite sumar mas proveedores despues.',
} as const;

const STORAGE_LOCATIONS = [
  {
    key: 'ambient_pantry',
    name: 'Despensa seca',
    description: 'Estanterias para panificados, secos, condimentos y salsas cerradas.',
    storageType: 'AMBIENT' as const,
    capacityGrams: 220000,
    notes: 'Sector ventilado y de rotacion rapida.',
  },
  {
    key: 'cold_room',
    name: 'Camara fria',
    description: 'Camara de frio para lacteos, fiambres, huevos y elaboraciones sensibles.',
    storageType: 'COLD' as const,
    capacityGrams: 260000,
    notes: 'Pensada para productos refrigerados de alta rotacion.',
  },
  {
    key: 'freezer_room',
    name: 'Freezer de produccion',
    description: 'Espacio de congelado para apoyo operativo y contingencias.',
    storageType: 'FREEZER' as const,
    capacityGrams: 180000,
    notes: 'Se usa como respaldo y para frituras/produccion preparada.',
  },
  {
    key: 'produce_rack',
    name: 'Batea de frescos',
    description: 'Area fresca y ventilada para vegetales y frutas de alta salida.',
    storageType: 'PRODUCE' as const,
    capacityGrams: 140000,
    notes: 'Reposicion constante para evitar mermas.',
  },
] as const;

const ingredientOperationalProfile = (
  input: Omit<IngredientOperationalProfile, 'supplierKey' | 'supplierName'>,
): IngredientOperationalProfile => ({
  supplierKey: GENERAL_SUPPLIER.key,
  supplierName: GENERAL_SUPPLIER.name,
  ...input,
});

const ingredientOperationalProfiles = {
  panSanguchero: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 180,
    purchaseUnitLabel: 'kg equivalente',
    storageType: 'AMBIENT',
    storageLabel: 'Despensa seca',
    maxStockGrams: 18000,
    currentStockGrams: 12000,
    reorderPointGrams: 5000,
  }),
  panChia: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 220,
    purchaseUnitLabel: 'kg equivalente',
    storageType: 'AMBIENT',
    storageLabel: 'Despensa seca',
    maxStockGrams: 14000,
    currentStockGrams: 9000,
    reorderPointGrams: 3500,
  }),
  masaPizza: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 160,
    purchaseUnitLabel: 'kg equivalente',
    storageType: 'COLD',
    storageLabel: 'Camara fria',
    maxStockGrams: 22000,
    currentStockGrams: 15000,
    reorderPointGrams: 6000,
  }),
  tapaEmpanada: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 190,
    purchaseUnitLabel: 'kg equivalente',
    storageType: 'COLD',
    storageLabel: 'Camara fria',
    maxStockGrams: 16000,
    currentStockGrams: 10500,
    reorderPointGrams: 4500,
  }),
  carneVacuna: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 1100,
    purchaseUnitLabel: 'kg',
    storageType: 'COLD',
    storageLabel: 'Camara fria',
    maxStockGrams: 32000,
    currentStockGrams: 21000,
    reorderPointGrams: 9000,
  }),
  carnePollo: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 720,
    purchaseUnitLabel: 'kg',
    storageType: 'COLD',
    storageLabel: 'Camara fria',
    maxStockGrams: 26000,
    currentStockGrams: 17000,
    reorderPointGrams: 7000,
  }),
  panceta: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 980,
    purchaseUnitLabel: 'kg',
    storageType: 'COLD',
    storageLabel: 'Camara fria',
    maxStockGrams: 9000,
    currentStockGrams: 5200,
    reorderPointGrams: 2200,
  }),
  jamonCocido: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 760,
    purchaseUnitLabel: 'kg',
    storageType: 'COLD',
    storageLabel: 'Camara fria',
    maxStockGrams: 11000,
    currentStockGrams: 7200,
    reorderPointGrams: 2800,
  }),
  mozzarella: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 650,
    purchaseUnitLabel: 'kg',
    storageType: 'COLD',
    storageLabel: 'Camara fria',
    maxStockGrams: 18000,
    currentStockGrams: 12200,
    reorderPointGrams: 5200,
  }),
  quesoCremoso: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 610,
    purchaseUnitLabel: 'kg',
    storageType: 'COLD',
    storageLabel: 'Camara fria',
    maxStockGrams: 12000,
    currentStockGrams: 7600,
    reorderPointGrams: 3200,
  }),
  cheddar: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 780,
    purchaseUnitLabel: 'kg',
    storageType: 'COLD',
    storageLabel: 'Camara fria',
    maxStockGrams: 9000,
    currentStockGrams: 5400,
    reorderPointGrams: 2400,
  }),
  tomate: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 180,
    purchaseUnitLabel: 'kg',
    storageType: 'PRODUCE',
    storageLabel: 'Batea de frescos',
    maxStockGrams: 16000,
    currentStockGrams: 9800,
    reorderPointGrams: 4200,
  }),
  lechuga: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 90,
    purchaseUnitLabel: 'kg',
    storageType: 'PRODUCE',
    storageLabel: 'Batea de frescos',
    maxStockGrams: 8000,
    currentStockGrams: 4600,
    reorderPointGrams: 1800,
  }),
  cebolla: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 70,
    purchaseUnitLabel: 'kg',
    storageType: 'PRODUCE',
    storageLabel: 'Batea de frescos',
    maxStockGrams: 18000,
    currentStockGrams: 12000,
    reorderPointGrams: 5000,
  }),
  morron: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 240,
    purchaseUnitLabel: 'kg',
    storageType: 'PRODUCE',
    storageLabel: 'Batea de frescos',
    maxStockGrams: 9000,
    currentStockGrams: 5800,
    reorderPointGrams: 2200,
  }),
  papa: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 110,
    purchaseUnitLabel: 'kg',
    storageType: 'PRODUCE',
    storageLabel: 'Batea de frescos',
    maxStockGrams: 42000,
    currentStockGrams: 30000,
    reorderPointGrams: 12000,
  }),
  panRallado: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 120,
    purchaseUnitLabel: 'kg',
    storageType: 'AMBIENT',
    storageLabel: 'Despensa seca',
    maxStockGrams: 14000,
    currentStockGrams: 8600,
    reorderPointGrams: 3200,
  }),
  huevo: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 260,
    purchaseUnitLabel: 'kg equivalente',
    storageType: 'COLD',
    storageLabel: 'Camara fria',
    maxStockGrams: 12000,
    currentStockGrams: 7800,
    reorderPointGrams: 2600,
  }),
  aceite: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 260,
    purchaseUnitLabel: 'litro equivalente',
    storageType: 'AMBIENT',
    storageLabel: 'Despensa seca',
    maxStockGrams: 26000,
    currentStockGrams: 18000,
    reorderPointGrams: 7000,
  }),
  mayonesa: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 240,
    purchaseUnitLabel: 'kg equivalente',
    storageType: 'COLD',
    storageLabel: 'Camara fria',
    maxStockGrams: 9000,
    currentStockGrams: 5800,
    reorderPointGrams: 2200,
  }),
  ketchup: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 180,
    purchaseUnitLabel: 'kg equivalente',
    storageType: 'AMBIENT',
    storageLabel: 'Despensa seca',
    maxStockGrams: 9000,
    currentStockGrams: 6200,
    reorderPointGrams: 2500,
  }),
  mostaza: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 170,
    purchaseUnitLabel: 'kg equivalente',
    storageType: 'AMBIENT',
    storageLabel: 'Despensa seca',
    maxStockGrams: 7000,
    currentStockGrams: 4600,
    reorderPointGrams: 1800,
  }),
  aji: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 320,
    purchaseUnitLabel: 'kg equivalente',
    storageType: 'AMBIENT',
    storageLabel: 'Despensa seca',
    maxStockGrams: 3500,
    currentStockGrams: 2200,
    reorderPointGrams: 900,
  }),
  salsaPizza: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 140,
    purchaseUnitLabel: 'kg equivalente',
    storageType: 'COLD',
    storageLabel: 'Camara fria',
    maxStockGrams: 18000,
    currentStockGrams: 11800,
    reorderPointGrams: 4200,
  }),
  aceitunaVerde: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 360,
    purchaseUnitLabel: 'kg',
    storageType: 'AMBIENT',
    storageLabel: 'Despensa seca',
    maxStockGrams: 6000,
    currentStockGrams: 3600,
    reorderPointGrams: 1400,
  }),
  oregano: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 520,
    purchaseUnitLabel: 'kg',
    storageType: 'AMBIENT',
    storageLabel: 'Despensa seca',
    maxStockGrams: 1800,
    currentStockGrams: 900,
    reorderPointGrams: 300,
  }),
  sal: ingredientOperationalProfile({
    pricingBasisGrams: 100,
    unitCostNet: 45,
    purchaseUnitLabel: 'kg',
    storageType: 'AMBIENT',
    storageLabel: 'Despensa seca',
    maxStockGrams: 10000,
    currentStockGrams: 6800,
    reorderPointGrams: 2600,
  }),
} satisfies Record<string, IngredientOperationalProfile>;

const TAX_RULE_SEEDS = DEFAULT_RESTAURANT_PRICING_CONFIG.taxRules.map((rule, index) => ({
  ...rule,
  sortOrder: index,
}));

const getIngredientOperationalProfile = (key: string) =>
  key in ingredientOperationalProfiles
    ? ingredientOperationalProfiles[key as keyof typeof ingredientOperationalProfiles]
    : undefined;

const getStorageLocationKeyForType = (storageType: StorageTypeKey) =>
  storageType === 'AMBIENT'
    ? 'ambient_pantry'
    : storageType === 'COLD'
      ? 'cold_room'
      : storageType === 'FREEZER'
        ? 'freezer_room'
        : 'produce_rack';

const recipeItem = (
  variantKey: string,
  quantityGrams: number,
  sortOrder: number,
  prepNotes: string,
  options: Pick<RecipeItemSeed, 'isOptional' | 'isMainComponent'> = {},
): RecipeItemSeed => {
  const item: RecipeItemSeed = {
    variantKey,
    quantityGrams,
    prepNotes,
    sortOrder,
  };

  if (options.isOptional !== undefined) item.isOptional = options.isOptional;
  if (options.isMainComponent !== undefined) item.isMainComponent = options.isMainComponent;

  return item;
};

async function resetCatalog() {
  await prisma.$executeRawUnsafe('DELETE FROM "SaleItem"');
  await prisma.$executeRawUnsafe('DELETE FROM "Sale"');
  await prisma.$executeRawUnsafe('DELETE FROM "PurchaseItem"');
  await prisma.$executeRawUnsafe('DELETE FROM "Purchase"');
  await prisma.$executeRawUnsafe('DELETE FROM "InventoryLevel"');
  await prisma.$executeRawUnsafe('DELETE FROM "SupplierIngredient"');
  await prisma.$executeRawUnsafe('DELETE FROM "TaxRule"');
  await prisma.$executeRawUnsafe('DELETE FROM "StorageLocation"');
  await prisma.$executeRawUnsafe('DELETE FROM "Supplier"');
  await prisma.review.deleteMany();
  await prisma.plateTag.deleteMany();
  await prisma.plateAdjustment.deleteMany();
  await prisma.plate.deleteMany();
  await prisma.recipeItem.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.ingredientVariant.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.tag.deleteMany();
}

const mapIngredientForPricing = (ingredient: {
  id: string;
  name: string;
  description: string | null;
  category: IngredientCategory;
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
  allergens: Allergen[];
  dietaryTags: DietaryTag[];
  nutritionTags: NutritionTag[];
  notes: string | null;
  extraAttributes: unknown;
}) => ({
  id: ingredient.id,
  name: ingredient.name,
  description: ingredient.description ?? null,
  category: ingredient.category,
  nutritionBasisGrams: ingredient.nutritionBasisGrams,
  nutrition: {
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
  },
  allergens: ingredient.allergens,
  dietaryTags: ingredient.dietaryTags,
  nutritionTags: ingredient.nutritionTags,
  notes: ingredient.notes ?? null,
  extraAttributes: ingredient.extraAttributes ?? null,
});

const mapVariantForPricing = (variant: {
  id: string;
  name: string;
  description: string | null;
  preparationMethod: PreparationMethod;
  preparationNotes: string | null;
  portionGrams: number;
  yieldFactor: number;
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
  ingredient: Parameters<typeof mapIngredientForPricing>[0];
}) => ({
  id: variant.id,
  name: variant.name,
  description: variant.description ?? null,
  preparationMethod: variant.preparationMethod,
  preparationNotes: variant.preparationNotes ?? null,
  portionGrams: variant.portionGrams,
  yieldFactor: variant.yieldFactor,
  overrideNutrition: {
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
  },
  ingredient: mapIngredientForPricing(variant.ingredient),
});

const mapRecipeItemForPricing = (item: {
  id: string;
  quantityGrams: number;
  prepNotes: string | null;
  isOptional: boolean;
  isMainComponent: boolean;
  sortOrder: number;
  variant: Parameters<typeof mapVariantForPricing>[0];
}) => ({
  id: item.id,
  quantityGrams: item.quantityGrams,
  prepNotes: item.prepNotes ?? null,
  isOptional: item.isOptional,
  isMainComponent: item.isMainComponent,
  sortOrder: item.sortOrder,
  variant: mapVariantForPricing(item.variant),
});

const mapAdjustmentForPricing = (adjustment: {
  id: string;
  adjustmentType: 'ADDITION' | 'REMOVAL' | 'SUBSTITUTION';
  quantityGrams: number | null;
  notes: string | null;
  sortOrder: number;
  recipeItemId: string | null;
  recipeItem: Parameters<typeof mapRecipeItemForPricing>[0] | null;
  variant: Parameters<typeof mapVariantForPricing>[0] | null;
}) => ({
  id: adjustment.id,
  adjustmentType: adjustment.adjustmentType,
  quantityGrams: adjustment.quantityGrams ?? null,
  notes: adjustment.notes ?? null,
  sortOrder: adjustment.sortOrder,
  recipeItemId: adjustment.recipeItemId ?? null,
  recipeItem: adjustment.recipeItem ? mapRecipeItemForPricing(adjustment.recipeItem) : null,
  variant: adjustment.variant ? mapVariantForPricing(adjustment.variant) : null,
});

const loadPlatesForPricing = async () => {
  const plates = await prisma.plate.findMany({
    include: {
      recipe: {
        include: {
          items: {
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
    },
  });

  return plates.map((plate) => ({
    id: plate.id,
    name: plate.name,
    recipe: {
      yieldServings: plate.recipe.yieldServings,
      items: plate.recipe.items.map(mapRecipeItemForPricing),
    },
    adjustments: plate.adjustments.map(mapAdjustmentForPricing),
  }));
};

async function upsertCustomer(input: {
  name: string;
  sname?: string | null;
  lname: string;
  sex: Sex;
  username: string;
  email: string;
  phone: string;
  tier: CustomerTier;
  password: string;
}) {
  return prisma.user.upsert({
    where: { username: input.username },
    update: {
      name: input.name,
      sname: input.sname ?? null,
      lname: input.lname,
      sex: input.sex,
      email: input.email,
      phone: input.phone,
      password: input.password,
      role: 'CUSTOMER',
      customer: {
        upsert: {
          create: { tier: input.tier },
          update: { tier: input.tier },
        },
      },
    },
    create: {
      name: input.name,
      sname: input.sname ?? null,
      lname: input.lname,
      sex: input.sex,
      username: input.username,
      email: input.email,
      phone: input.phone,
      password: input.password,
      role: 'CUSTOMER',
      customer: {
        create: { tier: input.tier },
      },
    },
  });
}

async function main() {
  console.log('🌱 Starting Database Seeding...');

  await resetCatalog();

  const passwordHash = await argon2.hash('QartSeed123!');

  const reviewers = {
    lucia: await upsertCustomer({
      name: 'Lucia',
      lname: 'Mercado',
      sex: 'FEMALE',
      username: 'seed_lucia',
      email: 'seed.lucia@qart.dev',
      phone: '+5493815000001',
      tier: 'VIP',
      password: passwordHash,
    }),
    bruno: await upsertCustomer({
      name: 'Bruno',
      lname: 'Salvatierra',
      sex: 'MALE',
      username: 'seed_bruno',
      email: 'seed.bruno@qart.dev',
      phone: '+5493815000002',
      tier: 'REGULAR',
      password: passwordHash,
    }),
    julieta: await upsertCustomer({
      name: 'Julieta',
      lname: 'Leiva',
      sex: 'FEMALE',
      username: 'seed_julieta',
      email: 'seed.julieta@qart.dev',
      phone: '+5493815000003',
      tier: 'PREMIUM',
      password: passwordHash,
    }),
    mateo: await upsertCustomer({
      name: 'Mateo',
      lname: 'Albornoz',
      sex: 'MALE',
      username: 'seed_mateo',
      email: 'seed.mateo@qart.dev',
      phone: '+5493815000004',
      tier: 'REGULAR',
      password: passwordHash,
    }),
  };

  const tags = {
    clasicoArgentino: await prisma.tag.create({
      data: {
        name: 'clasico argentino',
        description: 'Platos conocidos, rendidores y directos, sin vueltas raras.',
      },
    }),
    bienTucumano: await prisma.tag.create({
      data: {
        name: 'bien tucumano',
        description: 'Sabores de sanguchería, picante opcional y hambre de facultad.',
      },
    }),
    conPapas: await prisma.tag.create({
      data: {
        name: 'con papas',
        description: 'Platos que se bancan una guarnición de papas fritas de verdad.',
      },
    }),
    paraCompartir: await prisma.tag.create({
      data: {
        name: 'para compartir',
        description: 'Opciones que funcionan muy bien en mesa larga o entre varios.',
      },
    }),
    hornoYMuzza: await prisma.tag.create({
      data: {
        name: 'horno y muzza',
        description: 'La línea de pizzas y empanadas con mucho queso y buen piso.',
      },
    }),
    mostrador: await prisma.tag.create({
      data: {
        name: 'de mostrador',
        description: 'Comida que uno espera encontrar en un local de siempre.',
      },
    }),
    favoritoEstudiantil: await prisma.tag.create({
      data: {
        name: 'favorito estudiantil',
        description: 'Ideal para resolver hambre grande entre cursadas.',
      },
    }),
    hambreReal: await prisma.tag.create({
      data: {
        name: 'hambre real',
        description: 'Porciones abundantes para cuando no alcanza algo livianito.',
      },
    }),
  };

  const ingredientIds = new Map<string, string>();
  const variantIds = new Map<string, string>();
  const storageLocationIds = new Map<string, string>();

  const requireIngredientId = (key: string) => {
    const id = ingredientIds.get(key);
    if (!id) throw new Error(`Missing ingredient id for seed key "${key}".`);
    return id;
  };

  const requireVariantId = (key: string) => {
    const id = variantIds.get(key);
    if (!id) throw new Error(`Missing variant id for seed key "${key}".`);
    return id;
  };

  const requireRecipeItem = <T extends { id: string; sortOrder: number }>(
    items: T[],
    sortOrder: number,
    label: string,
  ) => {
    const item = items.find((entry) => entry.sortOrder === sortOrder);
    if (!item) throw new Error(`Missing recipe item ${sortOrder} for ${label}.`);
    return item;
  };

  const createRecipe = async (input: RecipeSeedInput) =>
    prisma.recipe.create({
      data: {
        name: input.name,
        description: input.description,
        type: input.type,
        flavor: input.flavor,
        difficulty: input.difficulty,
        prepTimeMinutes: input.prepTimeMinutes,
        cookTimeMinutes: input.cookTimeMinutes,
        yieldServings: input.yieldServings,
        assemblyNotes: input.assemblyNotes,
        allergens: input.allergens,
        dietaryTags: input.dietaryTags,
        isPublic: true,
        items: {
          create: input.items.map((item) => ({
            variantId: requireVariantId(item.variantKey),
            quantityGrams: item.quantityGrams,
            prepNotes: item.prepNotes,
            isOptional: item.isOptional ?? false,
            isMainComponent: item.isMainComponent ?? false,
            sortOrder: item.sortOrder,
          })),
        },
      },
      include: { items: true },
    });

  // Estos snapshots siguen existiendo por compatibilidad de esquema, pero el runtime
  // customer ya debe leer la nutricion calculada desde ingredientes y ajustes.
  const createPlate = async (input: PlateSeedInput) =>
    prisma.plate.create({
      data: {
        name: input.name,
        description: input.description,
        imageUrl: input.imageUrl,
        recipeId: input.recipeId,
        size: input.size,
        servedWeightGrams: input.servedWeightGrams,
        costPrice: '0',
        menuPrice: '0',
        avgRating: averageRating(input.reviews),
        ratingsCount: input.reviews.length,
        likesCount: recommendationCount(input.reviews, true),
        dislikesCount: recommendationCount(input.reviews, false),
        calculatedCalories: input.calories,
        calculatedProteins: input.proteins,
        calculatedCarbs: input.carbs,
        calculatedFats: input.fats,
        calculatedFiber: input.fiber,
        calculatedSugars: input.sugars,
        calculatedSodium: input.sodium,
        calculatedSaturatedFat: input.saturatedFat,
        calculatedTransFat: input.transFat,
        calculatedMonounsaturatedFat: input.monounsaturatedFat,
        calculatedPolyunsaturatedFat: input.polyunsaturatedFat,
        allergens: input.allergens,
        dietaryTags: input.dietaryTags,
        nutritionTags: input.nutritionTags,
        nutritionNotes: input.nutritionNotes,
      } as Parameters<typeof prisma.plate.create>[0]['data'],
    });

  const ingredientSeeds = [
    ingredientSeed({
      key: 'panSanguchero',
      name: 'Pan sanguchero',
      description: 'Pan largo y liviano, pensado para bancarse una milanesa completa.',
      category: 'BREAD',
      subCategory: 'Pan blanco',
      primaryFlavor: 'SALTY',
      calories: 274,
      proteins: 8.6,
      carbs: 52,
      fats: 3.1,
      fiber: 2.3,
      sugars: 4,
      sodium: 460,
      saturatedFat: 0.6,
      monounsaturatedFat: 0.7,
      polyunsaturatedFat: 1.1,
      allergens: ['GLUTEN'],
      dietaryTags: ['VEGETARIAN', 'DAIRY_FREE'],
      nutritionTags: ['ENERGY_DENSE', 'SATIATING'],
      notes: 'Tiene que ser liviano de miga para no tapar la milanesa.',
      extraAttributes: { cut: 'larga', localStyle: 'sangucheria' },
    }),
    ingredientSeed({
      key: 'panChia',
      name: 'Pan con chia',
      description: 'Pan de hamburguesa con semillas de chía en cubierta y miga tierna.',
      category: 'BREAD',
      subCategory: 'Pan de hamburguesa',
      primaryFlavor: 'SALTY',
      calories: 286,
      proteins: 9.4,
      carbs: 48,
      fats: 6.5,
      fiber: 3.9,
      sugars: 5,
      sodium: 420,
      saturatedFat: 1,
      monounsaturatedFat: 1.6,
      polyunsaturatedFat: 2.1,
      allergens: ['GLUTEN'],
      dietaryTags: ['VEGETARIAN', 'DAIRY_FREE'],
      nutritionTags: ['ENERGY_DENSE', 'SATIATING'],
      notes: 'Se usa para la hamburguesa porque suma identidad sin salirse de lo clasico.',
      extraAttributes: { seeds: ['chia'] },
    }),
    ingredientSeed({
      key: 'masaPizza',
      name: 'Masa de pizza',
      description: 'Base de pizza con buen piso, borde aireado y horno fuerte.',
      category: 'BREAD',
      subCategory: 'Pizza',
      primaryFlavor: 'SALTY',
      calories: 268,
      proteins: 8,
      carbs: 50,
      fats: 3.5,
      fiber: 2.4,
      sugars: 2.2,
      sodium: 530,
      saturatedFat: 0.6,
      monounsaturatedFat: 0.5,
      polyunsaturatedFat: 0.9,
      allergens: ['GLUTEN'],
      dietaryTags: ['VEGAN', 'DAIRY_FREE'],
      nutritionTags: ['ENERGY_DENSE', 'SATIATING'],
      notes: 'La idea es una pizza de barrio, no un estilo napolitano gourmet.',
      extraAttributes: { hydration: 'media', style: 'argentina' },
    }),
    ingredientSeed({
      key: 'tapaEmpanada',
      name: 'Tapa para empanada',
      description: 'Disco de masa fino para horno, pensado para rellenos abundantes.',
      category: 'BREAD',
      subCategory: 'Empanada',
      primaryFlavor: 'SALTY',
      calories: 311,
      proteins: 7,
      carbs: 45,
      fats: 11,
      fiber: 1.7,
      sugars: 1.5,
      sodium: 430,
      saturatedFat: 2.4,
      monounsaturatedFat: 4.7,
      polyunsaturatedFat: 2.8,
      allergens: ['GLUTEN'],
      dietaryTags: ['VEGETARIAN', 'DAIRY_FREE'],
      nutritionTags: ['ENERGY_DENSE'],
      notes: 'La usamos horneada para mantener el perfil clasico de mostrador.',
      extraAttributes: { unitsPer100gApprox: 2.5 },
    }),
    ingredientSeed({
      key: 'carneVacuna',
      name: 'Carne de vaca',
      description: 'Base vacuna para milanesas, hamburguesas y relleno de empanadas.',
      category: 'PROTEIN_ANIMAL',
      subCategory: 'Vacuno',
      primaryFlavor: 'UMAMI',
      calories: 250,
      proteins: 26,
      carbs: 0,
      fats: 15,
      sodium: 72,
      saturatedFat: 6.1,
      monounsaturatedFat: 7.2,
      polyunsaturatedFat: 0.5,
      nutritionTags: ['HIGH_PROTEIN', 'SATIATING', 'WHOLE_FOOD'],
      notes: 'Se piensa como materia prima noble y rendidora para local clasico.',
      extraAttributes: { cuts: ['nalga', 'picada', 'blend hamburguesa'] },
    }),
    ingredientSeed({
      key: 'carnePollo',
      name: 'Carne de pollo',
      description: 'Pechuga y medallon de pollo para milanesa y version crispy.',
      category: 'PROTEIN_ANIMAL',
      subCategory: 'Ave',
      primaryFlavor: 'UMAMI',
      calories: 165,
      proteins: 31,
      carbs: 0,
      fats: 3.6,
      sodium: 74,
      saturatedFat: 1,
      monounsaturatedFat: 1.2,
      polyunsaturatedFat: 0.8,
      nutritionTags: ['HIGH_PROTEIN', 'WHOLE_FOOD', 'SATIATING'],
      notes: 'Sirve para dar una alternativa clasica a la carne vacuna.',
      extraAttributes: { cut: 'pechuga' },
    }),
    ingredientSeed({
      key: 'panceta',
      name: 'Bacon',
      description: 'Panceta ahumada para el toque salado y crocante de la hamburguesa.',
      category: 'PROTEIN_ANIMAL',
      subCategory: 'Cerdo curado',
      primaryFlavor: 'SALTY',
      calories: 541,
      proteins: 37,
      carbs: 1.4,
      fats: 42,
      sugars: 0.3,
      sodium: 1717,
      saturatedFat: 14,
      transFat: 0.2,
      monounsaturatedFat: 19,
      polyunsaturatedFat: 4.7,
      nutritionTags: ['ENERGY_DENSE'],
      notes: 'Se usa en poca cantidad, bien crocante.',
      extraAttributes: { smoked: true },
    }),
    ingredientSeed({
      key: 'jamonCocido',
      name: 'Jamon cocido',
      description: 'Feta de jamon clasica para pizza especial, napolitana y empanadas.',
      category: 'PROTEIN_ANIMAL',
      subCategory: 'Fiambre',
      primaryFlavor: 'SALTY',
      calories: 145,
      proteins: 21,
      carbs: 1.5,
      fats: 5.5,
      sugars: 1,
      sodium: 1200,
      saturatedFat: 1.8,
      monounsaturatedFat: 2.1,
      polyunsaturatedFat: 0.7,
      allergens: [],
      nutritionTags: ['HIGH_PROTEIN'],
      notes: 'Va para perfiles bien conocidos por el publico.',
      extraAttributes: { cut: 'fetas' },
    }),
    ingredientSeed({
      key: 'mozzarella',
      name: 'Mozzarella',
      description: 'Queso de fundido parejo para pizza y napolitana.',
      category: 'DAIRY',
      subCategory: 'Queso pasta hilada',
      primaryFlavor: 'SALTY',
      calories: 280,
      proteins: 28,
      carbs: 3,
      fats: 17,
      sugars: 1,
      sodium: 627,
      saturatedFat: 10,
      transFat: 0.2,
      monounsaturatedFat: 4.5,
      polyunsaturatedFat: 0.5,
      allergens: ['MILK'],
      dietaryTags: ['VEGETARIAN', 'GLUTEN_FREE'],
      nutritionTags: ['HIGH_PROTEIN', 'SATIATING'],
      notes: 'La muzza tiene que verse y sentirse abundante.',
      extraAttributes: { meltProfile: 'alta' },
    }),
    ingredientSeed({
      key: 'quesoCremoso',
      name: 'Queso cremoso',
      description: 'Queso blando ideal para una empanada de jyq bien cargada.',
      category: 'DAIRY',
      subCategory: 'Queso blando',
      primaryFlavor: 'SALTY',
      calories: 310,
      proteins: 19,
      carbs: 2.8,
      fats: 25,
      sugars: 1,
      sodium: 520,
      saturatedFat: 15,
      transFat: 0.3,
      monounsaturatedFat: 7,
      polyunsaturatedFat: 0.8,
      allergens: ['MILK'],
      dietaryTags: ['VEGETARIAN', 'GLUTEN_FREE'],
      nutritionTags: ['SATIATING', 'ENERGY_DENSE'],
      notes: 'Hace que la jyq tenga ese centro bien cremoso al abrirla.',
      extraAttributes: { texture: 'soft' },
    }),
    ingredientSeed({
      key: 'cheddar',
      name: 'Cheddar',
      description: 'Queso fundente para hamburguesas.',
      category: 'DAIRY',
      subCategory: 'Queso procesado',
      primaryFlavor: 'SALTY',
      calories: 403,
      proteins: 25,
      carbs: 1.3,
      fats: 33,
      sugars: 0.5,
      sodium: 621,
      saturatedFat: 19,
      transFat: 1,
      monounsaturatedFat: 9,
      polyunsaturatedFat: 1.1,
      allergens: ['MILK'],
      dietaryTags: ['VEGETARIAN', 'GLUTEN_FREE'],
      nutritionTags: ['ENERGY_DENSE', 'SATIATING'],
      notes: 'Se usa por presencia visual y por lectura popular inmediata.',
      extraAttributes: { slices: true },
    }),
    ingredientSeed({
      key: 'tomate',
      name: 'Tomate',
      description: 'Tomate fresco para sandwiches y hamburguesas.',
      category: 'VEGETABLE',
      subCategory: 'Fruto fresco',
      primaryFlavor: 'ACID',
      calories: 18,
      proteins: 0.9,
      carbs: 3.9,
      fats: 0.2,
      fiber: 1.2,
      sugars: 2.6,
      sodium: 5,
      saturatedFat: 0,
      polyunsaturatedFat: 0.1,
      dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
      nutritionTags: ['WHOLE_FOOD', 'LOW_SUGAR', 'MINIMALLY_PROCESSED'],
      notes: 'Refresca y corta grasa en platos pesados.',
      extraAttributes: { cut: 'rodajas' },
    }),
    ingredientSeed({
      key: 'lechuga',
      name: 'Lechuga',
      description: 'Hoja crocante para dar frescura a sanguches y hamburguesas.',
      category: 'VEGETABLE',
      subCategory: 'Hoja verde',
      primaryFlavor: 'UNKNOWN',
      calories: 15,
      proteins: 1.4,
      carbs: 2.9,
      fats: 0.2,
      fiber: 1.3,
      sugars: 0.8,
      sodium: 28,
      dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
      nutritionTags: ['WHOLE_FOOD', 'MINIMALLY_PROCESSED'],
      notes: 'La idea es que llegue fresca y no decorativa.',
      extraAttributes: { style: 'cortada' },
    }),
    ingredientSeed({
      key: 'cebolla',
      name: 'Cebolla',
      description: 'Cebolla blanca para rodajas finas, salteados y rellenos.',
      category: 'VEGETABLE',
      subCategory: 'Bulbo',
      primaryFlavor: 'SWEET',
      calories: 40,
      proteins: 1.1,
      carbs: 9.3,
      fats: 0.1,
      fiber: 1.7,
      sugars: 4.2,
      sodium: 4,
      dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
      nutritionTags: ['WHOLE_FOOD', 'MINIMALLY_PROCESSED'],
      notes: 'Funciona tanto cruda como bien cocida para rellenos.',
      extraAttributes: { localUse: ['rodajas', 'relleno'] },
    }),
    ingredientSeed({
      key: 'morron',
      name: 'Morron',
      description: 'Morrón rojo para pizza especial y relleno de empanadas.',
      category: 'VEGETABLE',
      subCategory: 'Pimiento',
      primaryFlavor: 'SWEET',
      calories: 31,
      proteins: 1,
      carbs: 6,
      fats: 0.3,
      fiber: 2.1,
      sugars: 4.2,
      sodium: 4,
      dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
      nutritionTags: ['WHOLE_FOOD', 'MINIMALLY_PROCESSED'],
      notes: 'Suma la lectura de pizza especial de barrio al instante.',
      extraAttributes: { color: 'rojo' },
    }),
    ingredientSeed({
      key: 'papa',
      name: 'Papa',
      description: 'Papa para frita clasica, cortada gruesa y bien dorada.',
      category: 'VEGETABLE',
      subCategory: 'Tuberculo',
      primaryFlavor: 'SWEET',
      calories: 77,
      proteins: 2,
      carbs: 17,
      fats: 0.1,
      fiber: 2.2,
      sugars: 0.8,
      sodium: 6,
      dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
      nutritionTags: ['WHOLE_FOOD', 'SATIATING'],
      notes: 'Las papas fritas son parte central del menu, no una guarnicion de relleno.',
      extraAttributes: { cut: 'baston' },
    }),
    ingredientSeed({
      key: 'panRallado',
      name: 'Pan rallado',
      description: 'Cobertura para milanesas y crispy de pollo.',
      category: 'BREAD',
      subCategory: 'Empanado',
      primaryFlavor: 'SALTY',
      calories: 351,
      proteins: 13,
      carbs: 71,
      fats: 5,
      fiber: 4,
      sugars: 6,
      sodium: 560,
      saturatedFat: 0.9,
      monounsaturatedFat: 0.8,
      polyunsaturatedFat: 2.2,
      allergens: ['GLUTEN'],
      dietaryTags: ['VEGETARIAN', 'DAIRY_FREE'],
      nutritionTags: ['ENERGY_DENSE'],
      notes: 'Es clave para que la milanesa tenga textura real de bodegon.',
      extraAttributes: { grind: 'medio' },
    }),
    ingredientSeed({
      key: 'huevo',
      name: 'Huevo',
      description: 'Se usa para ligar el empanado y tambien duro en empanadas.',
      category: 'PROTEIN_ANIMAL',
      subCategory: 'Ave',
      primaryFlavor: 'SALTY',
      calories: 143,
      proteins: 13,
      carbs: 1.1,
      fats: 10,
      sugars: 1.1,
      sodium: 140,
      saturatedFat: 3.1,
      monounsaturatedFat: 3.8,
      polyunsaturatedFat: 1.4,
      allergens: ['EGG'],
      dietaryTags: ['VEGETARIAN', 'GLUTEN_FREE'],
      nutritionTags: ['HIGH_PROTEIN', 'WHOLE_FOOD'],
      notes: 'Cumple doble rol en el menu: milanesa y empanada de carne.',
      extraAttributes: { uses: ['batido', 'duro'] },
    }),
    ingredientSeed({
      key: 'aceite',
      name: 'Aceite',
      description: 'Aceite neutro para frituras y terminaciones de cocina.',
      category: 'FAT',
      subCategory: 'Vegetal',
      primaryFlavor: 'UNKNOWN',
      calories: 884,
      proteins: 0,
      carbs: 0,
      fats: 100,
      sodium: 0,
      saturatedFat: 14,
      monounsaturatedFat: 73,
      polyunsaturatedFat: 11,
      dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
      nutritionTags: ['ENERGY_DENSE'],
      notes: 'Se declara porque en fritos pesa en costo y lectura nutricional.',
      extraAttributes: { use: 'fritura' },
    }),
    ingredientSeed({
      key: 'mayonesa',
      name: 'Mayonesa',
      description: 'Untable clasico para sanguche y papas.',
      category: 'SAUCE',
      subCategory: 'Emulsion',
      primaryFlavor: 'SALTY',
      calories: 680,
      proteins: 1,
      carbs: 1,
      fats: 75,
      sugars: 1,
      sodium: 635,
      saturatedFat: 12,
      monounsaturatedFat: 47,
      polyunsaturatedFat: 14,
      allergens: ['EGG'],
      dietaryTags: ['VEGETARIAN', 'GLUTEN_FREE'],
      nutritionTags: ['ENERGY_DENSE'],
      notes: 'En la hamburguesa de pollo suma jugosidad; en papas, costumbre.',
      extraAttributes: { service: 'untada' },
    }),
    ingredientSeed({
      key: 'ketchup',
      name: 'Ketchup',
      description: 'Salsa de tomate dulce para hamburguesas y papas.',
      category: 'SAUCE',
      subCategory: 'Tomate',
      primaryFlavor: 'SWEET',
      calories: 112,
      proteins: 1.2,
      carbs: 27,
      fats: 0.2,
      fiber: 0.3,
      sugars: 22,
      sodium: 907,
      dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
      nutritionTags: ['MINIMALLY_PROCESSED'],
      notes: 'Le da a la hamburguesa la lectura mas clasica posible.',
      extraAttributes: { squeeze: true },
    }),
    ingredientSeed({
      key: 'mostaza',
      name: 'Mostaza',
      description: 'Mostaza amarilla para hamburguesa y sanguche.',
      category: 'SAUCE',
      subCategory: 'Condimento',
      primaryFlavor: 'ACID',
      calories: 66,
      proteins: 4.4,
      carbs: 5.8,
      fats: 4.4,
      fiber: 3.3,
      sugars: 0,
      sodium: 1130,
      saturatedFat: 0.2,
      monounsaturatedFat: 2.6,
      polyunsaturatedFat: 1.2,
      allergens: ['MUSTARD'],
      dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
      nutritionTags: ['MINIMALLY_PROCESSED'],
      notes: 'Le da nervio a preparaciones grasas sin irse de tema.',
      extraAttributes: { style: 'clasica' },
    }),
    ingredientSeed({
      key: 'aji',
      name: 'Aji',
      description: 'Salsa picante para el completo con aji del sanguche de milanesa.',
      category: 'CONDIMENT',
      subCategory: 'Picante',
      primaryFlavor: 'SPICY',
      calories: 55,
      proteins: 1.8,
      carbs: 10,
      fats: 1.1,
      fiber: 2.2,
      sugars: 5,
      sodium: 880,
      saturatedFat: 0.1,
      polyunsaturatedFat: 0.4,
      dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
      nutritionTags: ['MINIMALLY_PROCESSED'],
      notes: 'Se deja bien claro como opcion del completo tucumano.',
      extraAttributes: { heatLevel: 'medio', service: 'opcional' },
    }),
    ingredientSeed({
      key: 'salsaPizza',
      name: 'Salsa de pizza',
      description: 'Salsa corta de tomate, ajo y oregano para pizzas y napolitanas.',
      category: 'SAUCE',
      subCategory: 'Tomate cocido',
      primaryFlavor: 'UMAMI',
      calories: 62,
      proteins: 1.7,
      carbs: 10,
      fats: 1.8,
      fiber: 2.1,
      sugars: 7,
      sodium: 360,
      saturatedFat: 0.3,
      monounsaturatedFat: 1.1,
      polyunsaturatedFat: 0.2,
      dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
      nutritionTags: ['WHOLE_FOOD', 'MINIMALLY_PROCESSED'],
      notes: 'No es ketchup ni una salsa gourmet: es salsa de pizza de local.',
      extraAttributes: { texture: 'corta' },
    }),
    ingredientSeed({
      key: 'aceitunaVerde',
      name: 'Aceituna verde',
      description: 'Aceituna fileteada para pizza y empanadas de carne.',
      category: 'FRUIT',
      subCategory: 'Oliva',
      primaryFlavor: 'SALTY',
      calories: 145,
      proteins: 1,
      carbs: 3.8,
      fats: 15.3,
      fiber: 3.3,
      sugars: 0,
      sodium: 1556,
      saturatedFat: 2,
      monounsaturatedFat: 11.3,
      polyunsaturatedFat: 1.3,
      dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
      nutritionTags: ['HIGH_HEALTHY_FATS', 'MINIMALLY_PROCESSED'],
      notes: 'Aparece en cantidad justa, sin invadir el plato.',
      extraAttributes: { presentation: 'rodajas' },
    }),
    ingredientSeed({
      key: 'oregano',
      name: 'Oregano',
      description: 'Oregano seco para terminar pizzas, napolitanas y jyq.',
      category: 'CONDIMENT',
      subCategory: 'Hierba seca',
      primaryFlavor: 'UNKNOWN',
      calories: 265,
      proteins: 9,
      carbs: 69,
      fats: 4.3,
      fiber: 42,
      sugars: 4,
      sodium: 25,
      dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
      nutritionTags: ['WHOLE_FOOD'],
      notes: 'Se usa poquito, pero sin oregano no se termina de leer como clasico.',
      extraAttributes: { use: 'terminacion' },
    }),
    ingredientSeed({
      key: 'sal',
      name: 'Sal',
      description: 'Sal fina para sazon final.',
      category: 'CONDIMENT',
      subCategory: 'Mineral',
      primaryFlavor: 'SALTY',
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
      sodium: 38758,
      dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
      nutritionTags: [],
      notes: 'Se declara porque ajusta lectura de sabor y sodio en platos clasicos.',
      extraAttributes: { grind: 'fina' },
    }),
  ] satisfies IngredientSeed[];

  for (const seed of ingredientSeeds) {
    const operationalProfile = getIngredientOperationalProfile(seed.key);
    const { extraAttributes, ...ingredientData } = seed.data;
    const mergedExtraAttributes =
      operationalProfile == null
        ? extraAttributes
        : {
            ...((extraAttributes &&
              typeof extraAttributes === 'object' &&
              !Array.isArray(extraAttributes)
              ? extraAttributes
              : {}) as Record<string, JsonValue>),
            procurement: {
              supplierKey: operationalProfile.supplierKey,
              supplierName: operationalProfile.supplierName,
              pricingBasisGrams: operationalProfile.pricingBasisGrams,
              unitCostNet: operationalProfile.unitCostNet,
              purchaseUnitLabel: operationalProfile.purchaseUnitLabel,
            },
            inventory: {
              storageType: operationalProfile.storageType,
              storageLabel: operationalProfile.storageLabel,
              maxStockGrams: operationalProfile.maxStockGrams,
              currentStockGrams: operationalProfile.currentStockGrams,
              reorderPointGrams: operationalProfile.reorderPointGrams,
            },
          };
    const createData =
      mergedExtraAttributes == null
        ? ingredientData
        : {
            ...ingredientData,
            extraAttributes: mergedExtraAttributes,
          };

    const ingredient = await prisma.ingredient.create({
      data: createData as Parameters<typeof prisma.ingredient.create>[0]['data'],
    });

    if (operationalProfile) {
      const ingredientSalePricing = calculateIngredientSalePrice({
        pricingBasisGrams: operationalProfile.pricingBasisGrams,
        unitCostNet: operationalProfile.unitCostNet,
        purchaseUnitLabel: operationalProfile.purchaseUnitLabel,
        supplierKey: operationalProfile.supplierKey,
        supplierName: operationalProfile.supplierName,
      });

      await prisma.$executeRawUnsafe(
        'UPDATE "Ingredient" SET "pricingBasisGrams" = $1, "costPrice" = $2, "salePrice" = $3, "defaultStorageType" = $4::"StorageType", "maxStockGrams" = $5, "reorderPointGrams" = $6 WHERE "id" = $7',
        operationalProfile.pricingBasisGrams,
        ingredientSalePricing.costPrice,
        ingredientSalePricing.salePrice,
        operationalProfile.storageType,
        operationalProfile.maxStockGrams,
        operationalProfile.reorderPointGrams,
        ingredient.id,
      );
    }

    ingredientIds.set(seed.key, ingredient.id);
  }

  const supplierCreatedAt = new Date();
  const generalSupplierId = randomUUID();

  await prisma.$executeRawUnsafe(
    'INSERT INTO "Supplier" ("id", "name", "description", "contactName", "email", "phone", "leadTimeDays", "notes", "isActive", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
    generalSupplierId,
    GENERAL_SUPPLIER.name,
    GENERAL_SUPPLIER.description,
    GENERAL_SUPPLIER.contactName,
    GENERAL_SUPPLIER.email,
    GENERAL_SUPPLIER.phone,
    GENERAL_SUPPLIER.leadTimeDays,
    GENERAL_SUPPLIER.notes,
    true,
    supplierCreatedAt,
    supplierCreatedAt,
  );

  for (const location of STORAGE_LOCATIONS) {
    const storageId = randomUUID();
    storageLocationIds.set(location.key, storageId);

    await prisma.$executeRawUnsafe(
      'INSERT INTO "StorageLocation" ("id", "name", "description", "storageType", "capacityGrams", "notes", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4::"StorageType", $5, $6, $7, $8)',
      storageId,
      location.name,
      location.description,
      location.storageType,
      location.capacityGrams,
      location.notes,
      supplierCreatedAt,
      supplierCreatedAt,
    );
  }

  for (const rule of TAX_RULE_SEEDS) {
    await prisma.$executeRawUnsafe(
      'INSERT INTO "TaxRule" ("id", "key", "name", "description", "rate", "includedInMenuPrice", "isActive", "sortOrder", "sourceLabel", "note", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
      randomUUID(),
      rule.key,
      rule.label,
      rule.note,
      rule.rate,
      rule.includedInMenuPrice,
      rule.isActive,
      rule.sortOrder,
      rule.sourceLabel,
      rule.note,
      supplierCreatedAt,
      supplierCreatedAt,
    );
  }

  for (const [ingredientKey, profile] of Object.entries(ingredientOperationalProfiles)) {
    const ingredientId = requireIngredientId(ingredientKey);
    const storageLocationId = storageLocationIds.get(getStorageLocationKeyForType(profile.storageType));

    if (!storageLocationId) {
      throw new Error(`Missing storage location for ${profile.storageType}.`);
    }

    await prisma.$executeRawUnsafe(
      'UPDATE "Ingredient" SET "preferredSupplierId" = $1 WHERE "id" = $2',
      generalSupplierId,
      ingredientId,
    );

    await prisma.$executeRawUnsafe(
      'INSERT INTO "SupplierIngredient" ("id", "supplierId", "ingredientId", "purchaseUnitLabel", "pricingBasisGrams", "unitCostNet", "minimumOrderGrams", "leadTimeDays", "isPreferred", "lastQuotedAt", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
      randomUUID(),
      generalSupplierId,
      ingredientId,
      profile.purchaseUnitLabel,
      profile.pricingBasisGrams,
      profile.unitCostNet,
      profile.reorderPointGrams,
      GENERAL_SUPPLIER.leadTimeDays,
      true,
      supplierCreatedAt,
      supplierCreatedAt,
      supplierCreatedAt,
    );

    await prisma.$executeRawUnsafe(
      'INSERT INTO "InventoryLevel" ("id", "ingredientId", "storageLocationId", "currentQuantityGrams", "reservedQuantityGrams", "maxQuantityGrams", "reorderPointGrams", "averageUnitCost", "lastPurchaseUnitCost", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      randomUUID(),
      ingredientId,
      storageLocationId,
      profile.currentStockGrams,
      0,
      profile.maxStockGrams,
      profile.reorderPointGrams,
      profile.unitCostNet,
      profile.unitCostNet,
      supplierCreatedAt,
      supplierCreatedAt,
    );
  }

  const variantSeeds = [
    variantSeed({
      key: 'panSangucheroTostado',
      ingredientKey: 'panSanguchero',
      name: 'Pan sanguchero tostado',
      description: 'Pan apenas marcado para que no se humedezca con la milanesa.',
      preparationMethod: 'GRILLED',
      preparationNotes: 'Se tuesta rapido sobre plancha.',
      portionGrams: 140,
    }),
    variantSeed({
      key: 'panChiaTostado',
      ingredientKey: 'panChia',
      name: 'Pan con chia tostado',
      description: 'Pan de hamburguesa tibio y con borde levemente crocante.',
      preparationMethod: 'GRILLED',
      preparationNotes: 'Se marca corte contra plancha para fijar estructura.',
      portionGrams: 95,
    }),
    variantSeed({
      key: 'masaPizzaHorneada',
      ingredientKey: 'masaPizza',
      name: 'Base horneada',
      description: 'Piso dorado y borde suave, pensado para pizza al molde delgada.',
      preparationMethod: 'BAKED',
      preparationNotes: 'Se prehornea y se termina con cobertura.',
      portionGrams: 240,
      yieldFactor: 0.94,
    }),
    variantSeed({
      key: 'tapaEmpanadaHorneada',
      ingredientKey: 'tapaEmpanada',
      name: 'Tapa horneada',
      description: 'Empanada cerrada al repulgue con dorado de horno.',
      preparationMethod: 'BAKED',
      preparationNotes: 'Se hornea hasta quedar firme y levemente dorada.',
      portionGrams: 120,
      yieldFactor: 0.95,
    }),
    variantSeed({
      key: 'carneVacunaMilanesaFrita',
      ingredientKey: 'carneVacuna',
      name: 'Milanesa de carne frita',
      description: 'Bife fino empanado y frito, con borde crocante y centro jugoso.',
      preparationMethod: 'FRIED',
      preparationNotes: 'Nalga fina empanada y frita en aceite limpio.',
      portionGrams: 190,
      yieldFactor: 0.9,
      overrides: {
        overrideCalories: 308,
        overrideProteins: 24,
        overrideCarbs: 13,
        overrideFats: 18,
        overrideFiber: 0.8,
        overrideSugars: 0.5,
        overrideSodium: 560,
        overrideSaturatedFat: 6.2,
        overrideTransFat: 0.3,
        overrideMonounsaturatedFat: 8.2,
        overridePolyunsaturatedFat: 1.7,
      },
    }),
    variantSeed({
      key: 'carneVacunaMedallonPlancha',
      ingredientKey: 'carneVacuna',
      name: 'Medallon de carne a la plancha',
      description: 'Hamburguesa vacuna sellada a plancha.',
      preparationMethod: 'GRILLED',
      preparationNotes: 'Blend clasico de carne vacuna, marcado de ambos lados.',
      portionGrams: 170,
      yieldFactor: 0.9,
      overrides: {
        overrideCalories: 290,
        overrideProteins: 26,
        overrideCarbs: 0,
        overrideFats: 21,
        overrideFiber: 0,
        overrideSugars: 0,
        overrideSodium: 340,
        overrideSaturatedFat: 8,
        overrideTransFat: 0.4,
        overrideMonounsaturatedFat: 9,
        overridePolyunsaturatedFat: 0.7,
      },
    }),
    variantSeed({
      key: 'carneVacunaRellenoSalteado',
      ingredientKey: 'carneVacuna',
      name: 'Relleno de carne salteado',
      description: 'Carne vacuna cocinada para empanada de carne.',
      preparationMethod: 'SAUTEED',
      preparationNotes: 'Coccion corta para que siga jugosa dentro de la empanada.',
      portionGrams: 150,
      yieldFactor: 0.92,
      overrides: {
        overrideCalories: 265,
        overrideProteins: 23,
        overrideCarbs: 1,
        overrideFats: 18,
        overrideFiber: 0,
        overrideSugars: 0.2,
        overrideSodium: 210,
        overrideSaturatedFat: 6.8,
        overrideTransFat: 0.3,
        overrideMonounsaturatedFat: 8.4,
        overridePolyunsaturatedFat: 0.6,
      },
    }),
    variantSeed({
      key: 'carnePolloMilanesaFrita',
      ingredientKey: 'carnePollo',
      name: 'Milanesa de pollo frita',
      description: 'Pechuga empanada y frita, version clasica para sanguche.',
      preparationMethod: 'FRIED',
      preparationNotes: 'Empanado parejo y fritura corta.',
      portionGrams: 180,
      yieldFactor: 0.9,
      overrides: {
        overrideCalories: 276,
        overrideProteins: 26,
        overrideCarbs: 12,
        overrideFats: 13,
        overrideFiber: 0.7,
        overrideSugars: 0.4,
        overrideSodium: 520,
        overrideSaturatedFat: 3.1,
        overrideTransFat: 0.2,
        overrideMonounsaturatedFat: 4.8,
        overridePolyunsaturatedFat: 2.1,
      },
    }),
    variantSeed({
      key: 'carnePolloCrispy',
      ingredientKey: 'carnePollo',
      name: 'Pollo crispy',
      description: 'Filet de pollo rebozado y frito para hamburguesa.',
      preparationMethod: 'FRIED',
      preparationNotes: 'Empanado mas grueso para textura crunchy.',
      portionGrams: 180,
      yieldFactor: 0.88,
      overrides: {
        overrideCalories: 301,
        overrideProteins: 24,
        overrideCarbs: 15,
        overrideFats: 16,
        overrideFiber: 0.8,
        overrideSugars: 0.5,
        overrideSodium: 590,
        overrideSaturatedFat: 3.3,
        overrideTransFat: 0.2,
        overrideMonounsaturatedFat: 5.3,
        overridePolyunsaturatedFat: 3.1,
      },
    }),
    variantSeed({
      key: 'pancetaCrocante',
      ingredientKey: 'panceta',
      name: 'Bacon crocante',
      description: 'Tiras cocidas hasta quedar bien crujientes.',
      preparationMethod: 'FRIED',
      preparationNotes: 'Se cocina hasta perder exceso de grasa.',
      portionGrams: 30,
      yieldFactor: 0.45,
      overrides: {
        overrideCalories: 505,
        overrideProteins: 40,
        overrideCarbs: 1,
        overrideFats: 37,
        overrideFiber: 0,
        overrideSugars: 0.2,
        overrideSodium: 1820,
        overrideSaturatedFat: 12,
        overrideTransFat: 0.2,
        overrideMonounsaturatedFat: 17,
        overridePolyunsaturatedFat: 4.2,
      },
    }),
    variantSeed({
      key: 'jamonTibio',
      ingredientKey: 'jamonCocido',
      name: 'Jamon tibio',
      description: 'Jamon apenas calentado por horno o plancha.',
      preparationMethod: 'GRILLED',
      preparationNotes: 'Solo se lleva a temperatura, no se dora.',
      portionGrams: 60,
    }),
    variantSeed({
      key: 'mozzarellaFundida',
      ingredientKey: 'mozzarella',
      name: 'Mozzarella fundida',
      description: 'Queso bien derretido para pizza y napolitana.',
      preparationMethod: 'BAKED',
      preparationNotes: 'Se termina en horno hasta fundir sin secar.',
      portionGrams: 170,
      yieldFactor: 0.98,
    }),
    variantSeed({
      key: 'quesoCremosoFundido',
      ingredientKey: 'quesoCremoso',
      name: 'Queso cremoso fundido',
      description: 'Queso blando apenas derretido dentro de la empanada.',
      preparationMethod: 'BAKED',
      preparationNotes: 'Se funde con el calor del horno en la empanada.',
      portionGrams: 110,
      yieldFactor: 0.98,
    }),
    variantSeed({
      key: 'cheddarFundido',
      ingredientKey: 'cheddar',
      name: 'Cheddar fundido',
      description: 'Cheddar derretido sobre medallon o pollo crispy.',
      preparationMethod: 'BAKED',
      preparationNotes: 'Se derrite al final para que abrace la proteina.',
      portionGrams: 40,
      yieldFactor: 1,
    }),
    variantSeed({
      key: 'tomateRodajas',
      ingredientKey: 'tomate',
      name: 'Tomate en rodajas',
      description: 'Rodajas finas para sanguches y hamburguesas.',
      preparationMethod: 'RAW',
      preparationNotes: 'Corte al momento para que no largue agua de mas.',
      portionGrams: 40,
    }),
    variantSeed({
      key: 'lechugaCortada',
      ingredientKey: 'lechuga',
      name: 'Lechuga cortada',
      description: 'Lechuga fresca lista para sumar crocante.',
      preparationMethod: 'RAW',
      preparationNotes: 'Lavada y secada antes del servicio.',
      portionGrams: 24,
    }),
    variantSeed({
      key: 'cebollaPluma',
      ingredientKey: 'cebolla',
      name: 'Cebolla en pluma',
      description: 'Corte fino para sandwiches y hamburguesas.',
      preparationMethod: 'RAW',
      preparationNotes: 'Corte fino para no dominar el conjunto.',
      portionGrams: 28,
    }),
    variantSeed({
      key: 'cebollaSalteada',
      ingredientKey: 'cebolla',
      name: 'Cebolla salteada',
      description: 'Cebolla cocida para relleno de empanada.',
      preparationMethod: 'SAUTEED',
      preparationNotes: 'Se cocina hasta quedar dulce y tierna.',
      portionGrams: 55,
      yieldFactor: 0.86,
    }),
    variantSeed({
      key: 'morronAsado',
      ingredientKey: 'morron',
      name: 'Morron asado',
      description: 'Tiras de morron asado para pizza especial o relleno.',
      preparationMethod: 'ROASTED',
      preparationNotes: 'Horno fuerte para concentrar dulzor.',
      portionGrams: 40,
      yieldFactor: 0.82,
    }),
    variantSeed({
      key: 'papaFrita',
      ingredientKey: 'papa',
      name: 'Papas fritas',
      description: 'Baston clasico, dorado parejo por fuera y centro suave.',
      preparationMethod: 'FRIED',
      preparationNotes: 'Doble coccion corta para sostener crocante.',
      portionGrams: 180,
      yieldFactor: 0.72,
      overrides: {
        overrideCalories: 312,
        overrideProteins: 3.8,
        overrideCarbs: 41,
        overrideFats: 14,
        overrideFiber: 3.7,
        overrideSugars: 0.6,
        overrideSodium: 210,
        overrideSaturatedFat: 2.2,
        overrideTransFat: 0,
        overrideMonounsaturatedFat: 8.1,
        overridePolyunsaturatedFat: 3.1,
      },
    }),
    variantSeed({
      key: 'panRalladoEmpanado',
      ingredientKey: 'panRallado',
      name: 'Pan rallado para empanar',
      description: 'Cobertura aplicada en milanesas y crispy.',
      preparationMethod: 'RAW',
      preparationNotes: 'Se usa previo a la fritura.',
      portionGrams: 18,
    }),
    variantSeed({
      key: 'huevoBatido',
      ingredientKey: 'huevo',
      name: 'Huevo batido',
      description: 'Ligante clasico del empanado.',
      preparationMethod: 'RAW',
      preparationNotes: 'Se bate con sal para adherir pan rallado.',
      portionGrams: 20,
    }),
    variantSeed({
      key: 'huevoDuro',
      ingredientKey: 'huevo',
      name: 'Huevo duro picado',
      description: 'Huevo cocido para empanadas de carne.',
      preparationMethod: 'BOILED',
      preparationNotes: 'Se cocina duro y se pica grueso.',
      portionGrams: 35,
      yieldFactor: 0.98,
    }),
    variantSeed({
      key: 'aceiteFritura',
      ingredientKey: 'aceite',
      name: 'Aceite de fritura',
      description: 'Fraccion de aceite absorbida por la preparacion.',
      preparationMethod: 'RAW',
      preparationNotes: 'Se declara la parte efectiva que queda en el producto.',
      portionGrams: 12,
    }),
    variantSeed({
      key: 'mayonesaUntada',
      ingredientKey: 'mayonesa',
      name: 'Mayonesa untada',
      description: 'Capa corta de mayonesa.',
      preparationMethod: 'RAW',
      preparationNotes: 'Se unta sin excederse para no tapar el resto.',
      portionGrams: 18,
    }),
    variantSeed({
      key: 'ketchupUntado',
      ingredientKey: 'ketchup',
      name: 'Ketchup',
      description: 'Dosis clasica para hamburguesa o papas.',
      preparationMethod: 'RAW',
      preparationNotes: 'Se aplica en zigzag corto.',
      portionGrams: 16,
    }),
    variantSeed({
      key: 'mostazaUntada',
      ingredientKey: 'mostaza',
      name: 'Mostaza',
      description: 'Mostaza clasica en capa fina.',
      preparationMethod: 'RAW',
      preparationNotes: 'Se usa para levantar sabor y grasa.',
      portionGrams: 10,
    }),
    variantSeed({
      key: 'ajiTucumano',
      ingredientKey: 'aji',
      name: 'Aji tucumano',
      description: 'Picante para el completo con aji.',
      preparationMethod: 'RAW',
      preparationNotes: 'Se sirve como parte del armado base del completo.',
      portionGrams: 10,
    }),
    variantSeed({
      key: 'salsaPizzaCocinada',
      ingredientKey: 'salsaPizza',
      name: 'Salsa cocinada',
      description: 'Salsa lista para pizza o cobertura napolitana.',
      preparationMethod: 'SAUTEED',
      preparationNotes: 'Se cocina corta para fijar sabor de tomate.',
      portionGrams: 120,
      yieldFactor: 0.96,
    }),
    variantSeed({
      key: 'aceitunaRodajas',
      ingredientKey: 'aceitunaVerde',
      name: 'Aceituna en rodajas',
      description: 'Aceituna fileteada para terminar pizza o empanada.',
      preparationMethod: 'RAW',
      preparationNotes: 'Se agrega en poca cantidad.',
      portionGrams: 18,
    }),
    variantSeed({
      key: 'oreganoFinal',
      ingredientKey: 'oregano',
      name: 'Oregano final',
      description: 'Espolvoreado final de oregano.',
      preparationMethod: 'RAW',
      preparationNotes: 'Se agrega fuera del horno o justo al salir.',
      portionGrams: 2,
    }),
    variantSeed({
      key: 'salFinal',
      ingredientKey: 'sal',
      name: 'Sal final',
      description: 'Ajuste de sal al final del armado.',
      preparationMethod: 'RAW',
      preparationNotes: 'Se usa en baja cantidad.',
      portionGrams: 3,
    }),
  ] satisfies VariantSeed[];

  for (const seed of variantSeeds) {
    const variant = await prisma.ingredientVariant.create({
      data: {
        ingredientId: requireIngredientId(seed.ingredientKey),
        ...seed.data,
      },
    });
    variantIds.set(seed.key, variant.id);
  }

  const pizzaMuzzarella = await createRecipe({
    name: 'Pizza Muzzarella',
    description: 'Pizza clasica de muzza con salsa, aceitunas y oregano.',
    type: 'MAIN',
    flavor: 'UMAMI',
    difficulty: 'EASY',
    prepTimeMinutes: 20,
    cookTimeMinutes: 14,
    yieldServings: 1,
    assemblyNotes: 'Sale entera, con piso firme y muzza generosa.',
    allergens: ['GLUTEN', 'MILK'],
    dietaryTags: ['VEGETARIAN'],
    items: [
      recipeItem('masaPizzaHorneada', 240, 0, 'Base de la pizza.', { isMainComponent: true }),
      recipeItem('salsaPizzaCocinada', 120, 1, 'Salsa de base repartida pareja.'),
      recipeItem('mozzarellaFundida', 170, 2, 'Cobertura principal.', { isMainComponent: true }),
      recipeItem('aceitunaRodajas', 18, 3, 'Terminacion clasica.'),
      recipeItem('oreganoFinal', 2, 4, 'Se agrega al final.'),
    ],
  });

  const sandwichMilanesa = await createRecipe({
    name: 'Sanguche de Milanesa Completo',
    description: 'Pan sanguchero con milanesa de carne, verduras, condimentos y papas fritas.',
    type: 'MAIN',
    flavor: 'UMAMI',
    difficulty: 'MEDIUM',
    prepTimeMinutes: 18,
    cookTimeMinutes: 16,
    yieldServings: 1,
    assemblyNotes: 'El completo sale con aji; despues se derivan variantes sin aji o con pollo.',
    allergens: ['GLUTEN', 'EGG', 'MUSTARD'],
    dietaryTags: [],
    items: [
      recipeItem('panSangucheroTostado', 140, 0, 'Pan base del sanguche.'),
      recipeItem('carneVacunaMilanesaFrita', 190, 1, 'Proteina principal.', {
        isMainComponent: true,
      }),
      recipeItem('panRalladoEmpanado', 18, 2, 'Parte del empanado declarado para la receta.'),
      recipeItem('huevoBatido', 20, 3, 'Ligante del empanado.'),
      recipeItem('aceiteFritura', 12, 4, 'Absorcion estimada por fritura.'),
      recipeItem('lechugaCortada', 24, 5, 'Capa fresca del completo.'),
      recipeItem('tomateRodajas', 40, 6, 'Rodajas finas para corte de grasa.'),
      recipeItem('cebollaPluma', 28, 7, 'Cebolla fresca.'),
      recipeItem('mayonesaUntada', 18, 8, 'Untado clasico.'),
      recipeItem('mostazaUntada', 10, 9, 'Mostaza para levantar sabor.'),
      recipeItem('ajiTucumano', 10, 10, 'Picante del completo tucumano.'),
      recipeItem('papaFrita', 180, 11, 'Guarnicion obligada.', { isMainComponent: true }),
      recipeItem('salFinal', 3, 12, 'Ajuste final para papas y vegetales.'),
    ],
  });

  const milanesaNapolitana = await createRecipe({
    name: 'Milanesa a la Napolitana',
    description: 'Milanesa de carne con salsa, jamon, muzza y papas fritas.',
    type: 'MAIN',
    flavor: 'UMAMI',
    difficulty: 'MEDIUM',
    prepTimeMinutes: 22,
    cookTimeMinutes: 18,
    yieldServings: 1,
    assemblyNotes: 'La cobertura se termina al horno para que salga bien fundida.',
    allergens: ['GLUTEN', 'EGG', 'MILK'],
    dietaryTags: [],
    items: [
      recipeItem('carneVacunaMilanesaFrita', 220, 0, 'Milanesa base.', { isMainComponent: true }),
      recipeItem('panRalladoEmpanado', 20, 1, 'Empanado declarado.'),
      recipeItem('huevoBatido', 20, 2, 'Ligante del empanado.'),
      recipeItem('aceiteFritura', 12, 3, 'Absorcion estimada por fritura.'),
      recipeItem('salsaPizzaCocinada', 90, 4, 'Salsa sobre la milanesa.'),
      recipeItem('jamonTibio', 55, 5, 'Capa intermedia de la cobertura.'),
      recipeItem('mozzarellaFundida', 100, 6, 'Muzza final bien derretida.', {
        isMainComponent: true,
      }),
      recipeItem('oreganoFinal', 2, 7, 'Terminacion clasica.'),
      recipeItem('papaFrita', 190, 8, 'Papas fritas al lado.', { isMainComponent: true }),
      recipeItem('salFinal', 3, 9, 'Ajuste final.'),
    ],
  });

  const hamburguesaClasica = await createRecipe({
    name: 'Hamburguesa Clasica',
    description: 'Hamburguesa de carne con cheddar, bacon, verduras y papas fritas.',
    type: 'MAIN',
    flavor: 'UMAMI',
    difficulty: 'MEDIUM',
    prepTimeMinutes: 16,
    cookTimeMinutes: 14,
    yieldServings: 1,
    assemblyNotes:
      'La receta base representa la version con carne, cheddar y bacon; desde ahi se deriva la de pollo.',
    allergens: ['GLUTEN', 'MILK', 'MUSTARD'],
    dietaryTags: [],
    items: [
      recipeItem('panChiaTostado', 95, 0, 'Pan de hamburguesa.', { isMainComponent: true }),
      recipeItem('carneVacunaMedallonPlancha', 170, 1, 'Medallon base.', {
        isMainComponent: true,
      }),
      recipeItem('cheddarFundido', 40, 2, 'Queso sobre la carne.'),
      recipeItem('pancetaCrocante', 30, 3, 'Bacon crocante.'),
      recipeItem('lechugaCortada', 18, 4, 'Frescura y volumen.'),
      recipeItem('tomateRodajas', 30, 5, 'Tomate fresco.'),
      recipeItem('cebollaPluma', 20, 6, 'Cebolla cruda fina.'),
      recipeItem('ketchupUntado', 16, 7, 'Ketchup del armado.'),
      recipeItem('mostazaUntada', 10, 8, 'Mostaza del armado.'),
      recipeItem('papaFrita', 170, 9, 'Papas fritas de acompanamiento.', {
        isMainComponent: true,
      }),
      recipeItem('salFinal', 3, 10, 'Ajuste de sal.'),
    ],
  });

  const empanadasCarne = await createRecipe({
    name: 'Empanadas de Carne',
    description: 'Empanadas horneadas de carne con cebolla, morron, huevo y aceituna.',
    type: 'SNACK',
    flavor: 'UMAMI',
    difficulty: 'MEDIUM',
    prepTimeMinutes: 25,
    cookTimeMinutes: 16,
    yieldServings: 3,
    assemblyNotes: 'Se sirven tres unidades como porcion completa.',
    allergens: ['GLUTEN', 'EGG'],
    dietaryTags: [],
    items: [
      recipeItem('tapaEmpanadaHorneada', 120, 0, 'Tres tapas ya horneadas.', {
        isMainComponent: true,
      }),
      recipeItem('carneVacunaRellenoSalteado', 150, 1, 'Relleno principal.', {
        isMainComponent: true,
      }),
      recipeItem('cebollaSalteada', 55, 2, 'Base del relleno.'),
      recipeItem('morronAsado', 30, 3, 'Apoyo dulce del relleno.'),
      recipeItem('huevoDuro', 35, 4, 'Picado grueso dentro del relleno.'),
      recipeItem('aceitunaRodajas', 18, 5, 'Aceituna fileteada.'),
      recipeItem('ajiTucumano', 8, 6, 'Picante opcional del relleno.', { isOptional: true }),
      recipeItem('salFinal', 2, 7, 'Ajuste final.'),
    ],
  });

  const empanadasJyQ = await createRecipe({
    name: 'Empanadas de Jamon y Queso',
    description: 'Empanadas horneadas de jamon cocido y queso cremoso.',
    type: 'SNACK',
    flavor: 'UMAMI',
    difficulty: 'EASY',
    prepTimeMinutes: 18,
    cookTimeMinutes: 15,
    yieldServings: 3,
    assemblyNotes: 'Se sirven tres unidades, bien cargadas y de horno.',
    allergens: ['GLUTEN', 'MILK'],
    dietaryTags: [],
    items: [
      recipeItem('tapaEmpanadaHorneada', 120, 0, 'Tres tapas ya horneadas.', {
        isMainComponent: true,
      }),
      recipeItem('jamonTibio', 90, 1, 'Jamon del relleno.', { isMainComponent: true }),
      recipeItem('quesoCremosoFundido', 110, 2, 'Queso central del relleno.', {
        isMainComponent: true,
      }),
      recipeItem('oreganoFinal', 2, 3, 'Toque final.'),
    ],
  });

  const papasFritas = await createRecipe({
    name: 'Papas Fritas Clasicas',
    description: 'Papas fritas servidas con ketchup y mayonesa al costado.',
    type: 'SIDE',
    flavor: 'SALTY',
    difficulty: 'EASY',
    prepTimeMinutes: 8,
    cookTimeMinutes: 12,
    yieldServings: 1,
    assemblyNotes: 'Salen en canasto o fuente corta, bien doradas.',
    allergens: ['EGG'],
    dietaryTags: ['VEGETARIAN', 'GLUTEN_FREE'],
    items: [
      recipeItem('papaFrita', 220, 0, 'Papas base.', { isMainComponent: true }),
      recipeItem('ketchupUntado', 18, 1, 'Ketchup al costado.', { isOptional: true }),
      recipeItem('mayonesaUntada', 18, 2, 'Mayonesa al costado.', { isOptional: true }),
      recipeItem('salFinal', 2, 3, 'Sal final.'),
    ],
  });

  const pizzaMuzzarellaReviews = [
    review(
      reviewers.lucia.id,
      4.8,
      'La muzza viene bien cargada y el piso aguanta, que es lo importante.',
      true,
      '2026-03-12T21:15:00.000Z',
    ),
    review(
      reviewers.bruno.id,
      4.6,
      'Muy clasica, aceituna justa y nada de inventos raros.',
      true,
      '2026-03-15T22:05:00.000Z',
    ),
    review(
      reviewers.julieta.id,
      4.7,
      'Tiene pinta de pizza de barrio de verdad, ideal para compartir.',
      true,
      '2026-03-19T20:35:00.000Z',
    ),
  ];

  const pizzaEspecialReviews = [
    review(
      reviewers.lucia.id,
      4.9,
      'Con jamon y morron ya entra directo en la categoria de clasicos que siempre funcionan.',
      true,
      '2026-03-13T22:10:00.000Z',
    ),
    review(
      reviewers.bruno.id,
      4.7,
      'La pediria despues de cursar sin pensarlo dos veces.',
      true,
      '2026-03-18T21:45:00.000Z',
    ),
    review(
      reviewers.mateo.id,
      4.8,
      'Muy buena para mesa de varios y no se siente pijoteada con el jamon.',
      true,
      '2026-03-22T20:50:00.000Z',
    ),
  ];

  const sandwichCompletoReviews = [
    review(
      reviewers.lucia.id,
      4.9,
      'Esto si se siente como un completo de verdad. El aji levanta todo.',
      true,
      '2026-03-14T13:20:00.000Z',
    ),
    review(
      reviewers.bruno.id,
      4.8,
      'Pan bien elegido, milanesa grande y papas que acompañan como corresponde.',
      true,
      '2026-03-17T12:50:00.000Z',
    ),
    review(
      reviewers.julieta.id,
      4.6,
      'Es abundante, picantito y bien de sangucheria.',
      true,
      '2026-03-25T13:05:00.000Z',
    ),
  ];

  const sandwichSinAjiReviews = [
    review(
      reviewers.lucia.id,
      4.5,
      'Para quien no quiere picante, sigue siendo un sanguchazo.',
      true,
      '2026-03-16T12:10:00.000Z',
    ),
    review(
      reviewers.bruno.id,
      4.4,
      'Mas tranquilo que el completo con aji, pero igual muy rendidor.',
      true,
      '2026-03-20T13:35:00.000Z',
    ),
    review(
      reviewers.mateo.id,
      4.6,
      'Buen equilibrio entre verduras, mayonesa y milanesa.',
      true,
      '2026-03-27T12:45:00.000Z',
    ),
  ];

  const sandwichPolloReviews = [
    review(
      reviewers.lucia.id,
      4.7,
      'La de pollo sigue la misma idea del completo y funciona muy bien.',
      true,
      '2026-03-18T12:25:00.000Z',
    ),
    review(
      reviewers.julieta.id,
      4.6,
      'Crujiente, grande y con buena lectura de local clasico.',
      true,
      '2026-03-23T13:15:00.000Z',
    ),
    review(
      reviewers.mateo.id,
      4.5,
      'Me gusto que no la hagan gourmet: es un sanguche de pollo y punto.',
      true,
      '2026-03-28T12:20:00.000Z',
    ),
  ];

  const napolitanaReviews = [
    review(
      reviewers.lucia.id,
      4.8,
      'Milanesa grande, buena muzza y papas fritas. No se necesita mas.',
      true,
      '2026-03-11T21:25:00.000Z',
    ),
    review(
      reviewers.bruno.id,
      4.7,
      'La napolitana esta hecha como la esperas: frontal, abundante y rica.',
      true,
      '2026-03-19T22:15:00.000Z',
    ),
    review(
      reviewers.julieta.id,
      4.5,
      'Pesada, si, pero en el mejor sentido. Plato de hambre real.',
      true,
      '2026-03-24T22:05:00.000Z',
    ),
  ];

  const burgerReviews = [
    review(
      reviewers.lucia.id,
      4.7,
      'La clasica con cheddar y bacon entra perfecto en este menu.',
      true,
      '2026-03-12T22:35:00.000Z',
    ),
    review(
      reviewers.bruno.id,
      4.6,
      'Muy bien resuelta, sin volverse una torre imposible de comer.',
      true,
      '2026-03-18T23:00:00.000Z',
    ),
    review(
      reviewers.mateo.id,
      4.8,
      'Buen medallon, papas ricas y pan con chia que suma sin molestar.',
      true,
      '2026-03-29T21:40:00.000Z',
    ),
  ];

  const burgerPolloReviews = [
    review(
      reviewers.lucia.id,
      4.6,
      'La version de pollo crispy esta muy bien pensada y sigue siendo bien clasica.',
      true,
      '2026-03-15T22:45:00.000Z',
    ),
    review(
      reviewers.julieta.id,
      4.5,
      'La mayonesa le va mejor que el bacon en esta variante.',
      true,
      '2026-03-21T22:20:00.000Z',
    ),
    review(
      reviewers.mateo.id,
      4.7,
      'Cruje bien y no se siente seca.',
      true,
      '2026-03-28T21:10:00.000Z',
    ),
  ];

  const empanadasCarneReviews = [
    review(
      reviewers.lucia.id,
      4.8,
      'Las de carne tienen huevo, aceituna y ese punto picantito que esperas.',
      true,
      '2026-03-10T20:10:00.000Z',
    ),
    review(
      reviewers.bruno.id,
      4.7,
      'Muy de mostrador. Con una porcion de tres quedas bien.',
      true,
      '2026-03-16T20:50:00.000Z',
    ),
    review(
      reviewers.julieta.id,
      4.6,
      'Buen relleno, no puro aire.',
      true,
      '2026-03-22T19:55:00.000Z',
    ),
  ];

  const empanadasJyQReviews = [
    review(
      reviewers.lucia.id,
      4.5,
      'Clasicas, simples y efectivas.',
      true,
      '2026-03-11T19:30:00.000Z',
    ),
    review(
      reviewers.bruno.id,
      4.4,
      'Buen queso y jamon parejo en las tres.',
      true,
      '2026-03-17T20:15:00.000Z',
    ),
    review(
      reviewers.mateo.id,
      4.6,
      'Son de esas que siempre queres tener en la carta.',
      true,
      '2026-03-26T19:45:00.000Z',
    ),
  ];

  const friesReviews = [
    review(
      reviewers.bruno.id,
      4.5,
      'Bien doradas y con las salsas al costado. Cumplen.',
      true,
      '2026-03-14T19:10:00.000Z',
    ),
    review(
      reviewers.julieta.id,
      4.4,
      'No son un detalle mas; estan buenas de verdad.',
      true,
      '2026-03-20T18:55:00.000Z',
    ),
    review(
      reviewers.mateo.id,
      4.6,
      'Van solas o para compartir con cualquier plato.',
      true,
      '2026-03-29T19:20:00.000Z',
    ),
  ];

  const reviewPayloads: Array<ReviewSeed & { plateId: string }> = [];
  const tagPayloads: Array<{ plateId: string; tagId: string }> = [];
  const adjustmentPayloads: Array<{
    plateId: string;
    adjustmentType: 'ADDITION' | 'REMOVAL' | 'SUBSTITUTION';
    recipeItemId?: string | null;
    variantId?: string | null;
    quantityGrams?: number | null;
    notes?: string | null;
    sortOrder: number;
  }> = [];

  const pizzaBasePlate = await createPlate({
    name: 'Pizza Muzzarella Clasica',
    description: 'Pizza de muzzarella con salsa, aceitunas y oregano.',
    imageUrl: PLATE_IMAGES.pizzaMuzzarellaClasica,
    recipeId: pizzaMuzzarella.id,
    size: 'LARGE',
    servedWeightGrams: 550,
    allergens: ['GLUTEN', 'MILK'],
    dietaryTags: ['VEGETARIAN'],
    nutritionTags: ['HIGH_PROTEIN', 'ENERGY_DENSE', 'SATIATING'],
    nutritionNotes: 'Es una pizza de barrio: abundante, simple y con buena carga de muzza.',
    calories: 1180,
    proteins: 45,
    carbs: 102,
    fats: 64,
    fiber: 6,
    sugars: 10,
    sodium: 2280,
    saturatedFat: 24,
    transFat: 0.5,
    monounsaturatedFat: 23,
    polyunsaturatedFat: 8,
    reviews: pizzaMuzzarellaReviews,
  });

  const pizzaEspecialPlate = await createPlate({
    name: 'Pizza Especial de Jamon y Morron',
    description: 'Pizza de muzza con jamon cocido, morron asado, aceitunas y oregano.',
    imageUrl: PLATE_IMAGES.pizzaEspecialJamonMorron,
    recipeId: pizzaMuzzarella.id,
    size: 'LARGE',
    servedWeightGrams: 645,
    allergens: ['GLUTEN', 'MILK'],
    dietaryTags: [],
    nutritionTags: ['HIGH_PROTEIN', 'ENERGY_DENSE', 'SATIATING'],
    nutritionNotes:
      'Parte de la misma base de muzza, pero le suma jamon y morron para esa lectura clasica de pizza especial.',
    calories: 1325,
    proteins: 59,
    carbs: 108,
    fats: 74,
    fiber: 7,
    sugars: 13,
    sodium: 2960,
    saturatedFat: 28,
    transFat: 0.6,
    monounsaturatedFat: 28,
    polyunsaturatedFat: 10,
    reviews: pizzaEspecialReviews,
  });

  const sandwichCompletoPlate = await createPlate({
    name: 'Sanguche de Milanesa Completo con Aji',
    description:
      'Pan sanguchero con milanesa de carne, lechuga, tomate, cebolla, mayonesa, mostaza, aji y papas fritas.',
    imageUrl: PLATE_IMAGES.sangucheMilanesaCompletoAji,
    recipeId: sandwichMilanesa.id,
    size: 'LARGE',
    servedWeightGrams: 675,
    allergens: ['GLUTEN', 'EGG', 'MUSTARD'],
    dietaryTags: [],
    nutritionTags: ['HIGH_PROTEIN', 'ENERGY_DENSE', 'SATIATING'],
    nutritionNotes: 'Es la version mas clasica del completo, con picante incluido desde la base.',
    calories: 1320,
    proteins: 44,
    carbs: 113,
    fats: 74,
    fiber: 8,
    sugars: 11,
    sodium: 2540,
    saturatedFat: 14,
    transFat: 0.6,
    monounsaturatedFat: 34,
    polyunsaturatedFat: 15,
    reviews: sandwichCompletoReviews,
  });

  const sandwichSinAjiPlate = await createPlate({
    name: 'Sanguche de Milanesa Completo sin Aji',
    description:
      'La misma base clasica del completo, pero sin aji para quien lo prefiere mas suave.',
    imageUrl: PLATE_IMAGES.sangucheMilanesaCompletoSinAji,
    recipeId: sandwichMilanesa.id,
    size: 'LARGE',
    servedWeightGrams: 665,
    allergens: ['GLUTEN', 'EGG', 'MUSTARD'],
    dietaryTags: [],
    nutritionTags: ['HIGH_PROTEIN', 'ENERGY_DENSE', 'SATIATING'],
    nutritionNotes:
      'Mantiene la estructura del completo, solo retira el picante para una lectura mas suave.',
    calories: 1302,
    proteins: 44,
    carbs: 111,
    fats: 73,
    fiber: 7.8,
    sugars: 10,
    sodium: 2450,
    saturatedFat: 14,
    transFat: 0.6,
    monounsaturatedFat: 34,
    polyunsaturatedFat: 14,
    reviews: sandwichSinAjiReviews,
  });

  const sandwichPolloPlate = await createPlate({
    name: 'Sanguche de Milanesa de Pollo',
    description:
      'Version con milanesa de pollo, verduras, condimentos clasicos, aji y papas fritas.',
    imageUrl: PLATE_IMAGES.sangucheMilanesaPollo,
    recipeId: sandwichMilanesa.id,
    size: 'LARGE',
    servedWeightGrams: 665,
    allergens: ['GLUTEN', 'EGG', 'MUSTARD'],
    dietaryTags: [],
    nutritionTags: ['HIGH_PROTEIN', 'ENERGY_DENSE', 'SATIATING'],
    nutritionNotes:
      'Respeta la logica del completo, pero cambia la proteina principal por pollo empanado.',
    calories: 1240,
    proteins: 46,
    carbs: 112,
    fats: 61,
    fiber: 8,
    sugars: 11,
    sodium: 2470,
    saturatedFat: 10,
    transFat: 0.4,
    monounsaturatedFat: 28,
    polyunsaturatedFat: 14,
    reviews: sandwichPolloReviews,
  });

  const napolitanaPlate = await createPlate({
    name: 'Milanesa a la Napolitana con Papas Fritas',
    description:
      'Milanesa de carne con salsa de pizza, jamon, mozzarella fundida, oregano y papas fritas.',
    imageUrl: PLATE_IMAGES.milanesaNapolitanaPapas,
    recipeId: milanesaNapolitana.id,
    size: 'LARGE',
    servedWeightGrams: 692,
    allergens: ['GLUTEN', 'EGG', 'MILK'],
    dietaryTags: [],
    nutritionTags: ['HIGH_PROTEIN', 'ENERGY_DENSE', 'SATIATING'],
    nutritionNotes:
      'Plato grande, frontal y bien de bodegon. La identidad esta en la abundancia y la cobertura.',
    calories: 1460,
    proteins: 67,
    carbs: 88,
    fats: 86,
    fiber: 7,
    sugars: 10,
    sodium: 2840,
    saturatedFat: 28,
    transFat: 0.8,
    monounsaturatedFat: 37,
    polyunsaturatedFat: 12,
    reviews: napolitanaReviews,
  });

  const burgerPlate = await createPlate({
    name: 'Hamburguesa Clasica con Cheddar y Bacon',
    description:
      'Hamburguesa de carne con cheddar fundido, bacon crocante, lechuga, tomate, cebolla, ketchup, mostaza y papas fritas.',
    imageUrl: PLATE_IMAGES.hamburguesaClasicaCheddarBacon,
    recipeId: hamburguesaClasica.id,
    size: 'REGULAR',
    servedWeightGrams: 582,
    allergens: ['GLUTEN', 'MILK', 'MUSTARD'],
    dietaryTags: [],
    nutritionTags: ['HIGH_PROTEIN', 'ENERGY_DENSE', 'SATIATING'],
    nutritionNotes: 'Es una hamburguesa bien popular, con cheddar y bacon como protagonistas.',
    calories: 1290,
    proteins: 49,
    carbs: 81,
    fats: 83,
    fiber: 6,
    sugars: 12,
    sodium: 2650,
    saturatedFat: 29,
    transFat: 1.4,
    monounsaturatedFat: 35,
    polyunsaturatedFat: 11,
    reviews: burgerReviews,
  });

  const burgerPolloPlate = await createPlate({
    name: 'Hamburguesa de Pollo Crispy',
    description:
      'Hamburguesa de pollo crispy con cheddar, lechuga, tomate, cebolla, mayonesa y papas fritas.',
    imageUrl: PLATE_IMAGES.hamburguesaPolloCrispy,
    recipeId: hamburguesaClasica.id,
    size: 'REGULAR',
    servedWeightGrams: 585,
    allergens: ['GLUTEN', 'MILK', 'EGG'],
    dietaryTags: [],
    nutritionTags: ['HIGH_PROTEIN', 'ENERGY_DENSE', 'SATIATING'],
    nutritionNotes:
      'Parte de la estructura de hamburguesa clasica, pero va hacia un perfil mas crispy y con mayonesa.',
    calories: 1220,
    proteins: 46,
    carbs: 86,
    fats: 69,
    fiber: 6,
    sugars: 11,
    sodium: 2410,
    saturatedFat: 20,
    transFat: 0.7,
    monounsaturatedFat: 28,
    polyunsaturatedFat: 13,
    reviews: burgerPolloReviews,
  });

  const empanadasCarnePlate = await createPlate({
    name: 'Empanadas de Carne x3',
    description:
      'Tres empanadas al horno de carne con cebolla, morron, huevo, aceituna y un toque opcional de aji.',
    imageUrl: PLATE_IMAGES.empanadasCarneX3,
    recipeId: empanadasCarne.id,
    size: 'SMALL',
    servedWeightGrams: 418,
    allergens: ['GLUTEN', 'EGG'],
    dietaryTags: [],
    nutritionTags: ['HIGH_PROTEIN', 'ENERGY_DENSE', 'SATIATING'],
    nutritionNotes: 'Es una porcion simple, bien conocida y con relleno abundante.',
    calories: 940,
    proteins: 39,
    carbs: 74,
    fats: 53,
    fiber: 6,
    sugars: 7,
    sodium: 1620,
    saturatedFat: 15,
    transFat: 0.5,
    monounsaturatedFat: 24,
    polyunsaturatedFat: 8,
    reviews: empanadasCarneReviews,
  });

  const empanadasJyQPlate = await createPlate({
    name: 'Empanadas de Jamon y Queso x3',
    description: 'Tres empanadas al horno de jamon cocido y queso cremoso.',
    imageUrl: PLATE_IMAGES.empanadasJamonQuesoX3,
    recipeId: empanadasJyQ.id,
    size: 'SMALL',
    servedWeightGrams: 322,
    allergens: ['GLUTEN', 'MILK'],
    dietaryTags: [],
    nutritionTags: ['HIGH_PROTEIN', 'ENERGY_DENSE', 'SATIATING'],
    nutritionNotes:
      'El foco esta en el relleno bien cremoso y en una porcion rapida de mostrador.',
    calories: 980,
    proteins: 41,
    carbs: 68,
    fats: 61,
    fiber: 3,
    sugars: 6,
    sodium: 1810,
    saturatedFat: 29,
    transFat: 0.8,
    monounsaturatedFat: 19,
    polyunsaturatedFat: 5,
    reviews: empanadasJyQReviews,
  });

  const friesPlate = await createPlate({
    name: 'Papas Fritas Clasicas',
    description: 'Porcion de papas fritas con ketchup y mayonesa al costado.',
    imageUrl: PLATE_IMAGES.papasFritasClasicas,
    recipeId: papasFritas.id,
    size: 'REGULAR',
    servedWeightGrams: 258,
    allergens: ['EGG'],
    dietaryTags: ['VEGETARIAN', 'GLUTEN_FREE'],
    nutritionTags: ['ENERGY_DENSE', 'SATIATING'],
    nutritionNotes:
      'No hacen de extra decorativo: son una porcion real, pensada para compartir o sumar.',
    calories: 610,
    proteins: 5,
    carbs: 54,
    fats: 42,
    fiber: 4,
    sugars: 6,
    sodium: 980,
    saturatedFat: 6,
    transFat: 0,
    monounsaturatedFat: 24,
    polyunsaturatedFat: 9,
    reviews: friesReviews,
  });

  reviewPayloads.push(
    ...pizzaMuzzarellaReviews.map((entry) => ({ ...entry, plateId: pizzaBasePlate.id })),
    ...pizzaEspecialReviews.map((entry) => ({ ...entry, plateId: pizzaEspecialPlate.id })),
    ...sandwichCompletoReviews.map((entry) => ({ ...entry, plateId: sandwichCompletoPlate.id })),
    ...sandwichSinAjiReviews.map((entry) => ({ ...entry, plateId: sandwichSinAjiPlate.id })),
    ...sandwichPolloReviews.map((entry) => ({ ...entry, plateId: sandwichPolloPlate.id })),
    ...napolitanaReviews.map((entry) => ({ ...entry, plateId: napolitanaPlate.id })),
    ...burgerReviews.map((entry) => ({ ...entry, plateId: burgerPlate.id })),
    ...burgerPolloReviews.map((entry) => ({ ...entry, plateId: burgerPolloPlate.id })),
    ...empanadasCarneReviews.map((entry) => ({ ...entry, plateId: empanadasCarnePlate.id })),
    ...empanadasJyQReviews.map((entry) => ({ ...entry, plateId: empanadasJyQPlate.id })),
    ...friesReviews.map((entry) => ({ ...entry, plateId: friesPlate.id })),
  );

  tagPayloads.push(
    { plateId: pizzaBasePlate.id, tagId: tags.clasicoArgentino.id },
    { plateId: pizzaBasePlate.id, tagId: tags.hornoYMuzza.id },
    { plateId: pizzaBasePlate.id, tagId: tags.paraCompartir.id },
    { plateId: pizzaEspecialPlate.id, tagId: tags.clasicoArgentino.id },
    { plateId: pizzaEspecialPlate.id, tagId: tags.hornoYMuzza.id },
    { plateId: pizzaEspecialPlate.id, tagId: tags.paraCompartir.id },
    { plateId: sandwichCompletoPlate.id, tagId: tags.bienTucumano.id },
    { plateId: sandwichCompletoPlate.id, tagId: tags.conPapas.id },
    { plateId: sandwichCompletoPlate.id, tagId: tags.favoritoEstudiantil.id },
    { plateId: sandwichSinAjiPlate.id, tagId: tags.bienTucumano.id },
    { plateId: sandwichSinAjiPlate.id, tagId: tags.conPapas.id },
    { plateId: sandwichSinAjiPlate.id, tagId: tags.mostrador.id },
    { plateId: sandwichPolloPlate.id, tagId: tags.bienTucumano.id },
    { plateId: sandwichPolloPlate.id, tagId: tags.conPapas.id },
    { plateId: sandwichPolloPlate.id, tagId: tags.hambreReal.id },
    { plateId: napolitanaPlate.id, tagId: tags.clasicoArgentino.id },
    { plateId: napolitanaPlate.id, tagId: tags.conPapas.id },
    { plateId: napolitanaPlate.id, tagId: tags.hambreReal.id },
    { plateId: burgerPlate.id, tagId: tags.clasicoArgentino.id },
    { plateId: burgerPlate.id, tagId: tags.conPapas.id },
    { plateId: burgerPlate.id, tagId: tags.favoritoEstudiantil.id },
    { plateId: burgerPolloPlate.id, tagId: tags.conPapas.id },
    { plateId: burgerPolloPlate.id, tagId: tags.mostrador.id },
    { plateId: burgerPolloPlate.id, tagId: tags.favoritoEstudiantil.id },
    { plateId: empanadasCarnePlate.id, tagId: tags.clasicoArgentino.id },
    { plateId: empanadasCarnePlate.id, tagId: tags.mostrador.id },
    { plateId: empanadasCarnePlate.id, tagId: tags.hornoYMuzza.id },
    { plateId: empanadasJyQPlate.id, tagId: tags.clasicoArgentino.id },
    { plateId: empanadasJyQPlate.id, tagId: tags.hornoYMuzza.id },
    { plateId: empanadasJyQPlate.id, tagId: tags.mostrador.id },
    { plateId: friesPlate.id, tagId: tags.conPapas.id },
    { plateId: friesPlate.id, tagId: tags.paraCompartir.id },
    { plateId: friesPlate.id, tagId: tags.favoritoEstudiantil.id },
  );

  const sandwichBeefItem = requireRecipeItem(sandwichMilanesa.items, 1, 'sanguche de milanesa');
  const sandwichAjiItem = requireRecipeItem(sandwichMilanesa.items, 10, 'sanguche de milanesa');
  const burgerMeatItem = requireRecipeItem(hamburguesaClasica.items, 1, 'hamburguesa clasica');
  const burgerBaconItem = requireRecipeItem(hamburguesaClasica.items, 3, 'hamburguesa clasica');

  adjustmentPayloads.push(
    {
      plateId: pizzaEspecialPlate.id,
      adjustmentType: 'ADDITION',
      variantId: requireVariantId('jamonTibio'),
      quantityGrams: 80,
      notes: 'La especial suma jamon sobre la base de muzza.',
      sortOrder: 0,
    },
    {
      plateId: pizzaEspecialPlate.id,
      adjustmentType: 'ADDITION',
      variantId: requireVariantId('morronAsado'),
      quantityGrams: 40,
      notes: 'El morron asado completa la lectura clasica de pizza especial.',
      sortOrder: 1,
    },
    {
      plateId: pizzaEspecialPlate.id,
      adjustmentType: 'ADDITION',
      variantId: requireVariantId('mozzarellaFundida'),
      quantityGrams: 35,
      notes: 'Se agrega un poco mas de muzza para sostener el perfil cargado.',
      sortOrder: 2,
    },
    {
      plateId: sandwichSinAjiPlate.id,
      adjustmentType: 'REMOVAL',
      recipeItemId: sandwichAjiItem.id,
      quantityGrams: null,
      notes: 'Version sin picante.',
      sortOrder: 0,
    },
    {
      plateId: sandwichPolloPlate.id,
      adjustmentType: 'SUBSTITUTION',
      recipeItemId: sandwichBeefItem.id,
      variantId: requireVariantId('carnePolloMilanesaFrita'),
      quantityGrams: 180,
      notes: 'La milanesa de carne se reemplaza por pollo.',
      sortOrder: 0,
    },
    {
      plateId: burgerPolloPlate.id,
      adjustmentType: 'SUBSTITUTION',
      recipeItemId: burgerMeatItem.id,
      variantId: requireVariantId('carnePolloCrispy'),
      quantityGrams: 180,
      notes: 'El medallon vacuno se reemplaza por pollo crispy.',
      sortOrder: 0,
    },
    {
      plateId: burgerPolloPlate.id,
      adjustmentType: 'REMOVAL',
      recipeItemId: burgerBaconItem.id,
      quantityGrams: null,
      notes: 'La variante de pollo sale sin bacon.',
      sortOrder: 1,
    },
    {
      plateId: burgerPolloPlate.id,
      adjustmentType: 'ADDITION',
      variantId: requireVariantId('mayonesaUntada'),
      quantityGrams: 18,
      notes: 'La variante de pollo suma mayonesa en lugar de bacon.',
      sortOrder: 2,
    },
  );

  await prisma.plateAdjustment.createMany({ data: adjustmentPayloads });
  await prisma.plateTag.createMany({ data: tagPayloads });
  await prisma.review.createMany({ data: reviewPayloads });

  const publicPlates = await loadPlatesForPricing();
  const platePricingById = new Map<string, ReturnType<typeof analyzePlatePricing>>();

  for (const plate of publicPlates) {
    const pricing = analyzePlatePricing(plate, DEFAULT_RESTAURANT_PRICING_CONFIG);
    platePricingById.set(plate.id, pricing);

    if (pricing.missingIngredientIds.length > 0) {
      console.warn(
        `Pricing metadata missing for plate ${plate.name}: ${pricing.missingIngredientIds.join(', ')}`,
      );
    }

    await prisma.plate.update({
      where: { id: plate.id },
      data: {
        costPrice: pricing.costPrice.toFixed(2),
        menuPrice: pricing.menuPrice.toFixed(2),
      },
    });

    await prisma.$executeRawUnsafe(
      'UPDATE "Plate" SET "netPrice" = $1, "taxAmount" = $2, "profitAmount" = $3, "profitMarginRate" = $4 WHERE "id" = $5',
      pricing.netPrice,
      pricing.taxAmount,
      pricing.profitAmount,
      DEFAULT_RESTAURANT_PRICING_CONFIG.markupRate,
      plate.id,
    );
  }

  const vatRate = TAX_RULE_SEEDS.find((rule) => rule.key === 'vat' && rule.isActive)?.rate ?? 0;
  const purchaseCreatedAt = new Date('2026-03-22T10:15:00.000Z');
  const purchaseItemPayloads = Object.entries(ingredientOperationalProfiles).map(([ingredientKey, profile]) => {
    const quantityGrams = profile.currentStockGrams;
    const lineNetAmount = Number(
      ((profile.unitCostNet * quantityGrams) / profile.pricingBasisGrams).toFixed(2),
    );
    const lineTaxAmount = Number((lineNetAmount * vatRate).toFixed(2));
    const lineTotalAmount = Number((lineNetAmount + lineTaxAmount).toFixed(2));

    return {
      id: randomUUID(),
      ingredientId: requireIngredientId(ingredientKey),
      storageLocationId: storageLocationIds.get(getStorageLocationKeyForType(profile.storageType)),
      quantityGrams,
      pricingBasisGrams: profile.pricingBasisGrams,
      unitCostNet: profile.unitCostNet,
      taxRate: vatRate,
      lineNetAmount,
      lineTaxAmount,
      lineTotalAmount,
    };
  });
  const purchaseSubtotalNet = Number(
    purchaseItemPayloads.reduce((total, item) => total + item.lineNetAmount, 0).toFixed(2),
  );
  const purchaseTaxAmount = Number(
    purchaseItemPayloads.reduce((total, item) => total + item.lineTaxAmount, 0).toFixed(2),
  );
  const purchaseTotalAmount = Number((purchaseSubtotalNet + purchaseTaxAmount).toFixed(2));
  const purchaseId = randomUUID();

  await prisma.$executeRawUnsafe(
    'INSERT INTO "Purchase" ("id", "supplierId", "documentNumber", "purchasedAt", "receivedAt", "status", "currencyCode", "subtotalNet", "taxAmount", "totalAmount", "notes", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6::"PurchaseStatus", $7, $8, $9, $10, $11, $12, $13)',
    purchaseId,
    generalSupplierId,
    'FAC-A-0001-00000001',
    purchaseCreatedAt,
    purchaseCreatedAt,
    'RECEIVED',
    'ARS',
    purchaseSubtotalNet,
    purchaseTaxAmount,
    purchaseTotalAmount,
    'Compra inicial de abastecimiento para dejar stock, costos e inventario consistentes.',
    purchaseCreatedAt,
    purchaseCreatedAt,
  );

  for (const item of purchaseItemPayloads) {
    await prisma.$executeRawUnsafe(
      'INSERT INTO "PurchaseItem" ("id", "purchaseId", "ingredientId", "storageLocationId", "quantityGrams", "pricingBasisGrams", "unitCostNet", "taxRate", "lineNetAmount", "lineTaxAmount", "lineTotalAmount", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
      item.id,
      purchaseId,
      item.ingredientId,
      item.storageLocationId ?? null,
      item.quantityGrams,
      item.pricingBasisGrams,
      item.unitCostNet,
      item.taxRate,
      item.lineNetAmount,
      item.lineTaxAmount,
      item.lineTotalAmount,
      purchaseCreatedAt,
    );
  }

  const saleSeeds = [
    {
      soldAt: new Date('2026-03-26T13:05:00.000Z'),
      channel: 'COUNTER',
      notes: 'Venta mostrador mediodia.',
      items: [
        { plateId: pizzaEspecialPlate.id, quantity: 1 },
        { plateId: friesPlate.id, quantity: 1 },
      ],
    },
    {
      soldAt: new Date('2026-03-27T21:18:00.000Z'),
      channel: 'DELIVERY',
      notes: 'Pedido nocturno con sanguches.',
      items: [
        { plateId: sandwichCompletoPlate.id, quantity: 1 },
        { plateId: sandwichPolloPlate.id, quantity: 1 },
      ],
    },
    {
      soldAt: new Date('2026-03-29T20:42:00.000Z'),
      channel: 'ONLINE',
      notes: 'Orden online de hamburguesa y empanadas.',
      items: [
        { plateId: burgerPlate.id, quantity: 1 },
        { plateId: empanadasJyQPlate.id, quantity: 1 },
      ],
    },
  ] as const;

  for (const saleSeed of saleSeeds) {
    const saleId = randomUUID();
    const saleItemPayloads = saleSeed.items.map((item) => {
      const pricing = platePricingById.get(item.plateId);

      if (!pricing) {
        throw new Error(`Missing computed pricing for plate ${item.plateId}.`);
      }

      return {
        id: randomUUID(),
        plateId: item.plateId,
        quantity: item.quantity,
        unitCostAmount: pricing.costPrice,
        unitNetAmount: pricing.netPrice,
        unitTaxAmount: pricing.taxAmount,
        unitTotalAmount: pricing.menuPrice,
        lineCostAmount: Number((pricing.costPrice * item.quantity).toFixed(2)),
        lineNetAmount: Number((pricing.netPrice * item.quantity).toFixed(2)),
        lineTaxAmount: Number((pricing.taxAmount * item.quantity).toFixed(2)),
        lineTotalAmount: Number((pricing.menuPrice * item.quantity).toFixed(2)),
      };
    });
    const saleSubtotalNet = Number(
      saleItemPayloads.reduce((total, item) => total + item.lineNetAmount, 0).toFixed(2),
    );
    const saleTaxAmount = Number(
      saleItemPayloads.reduce((total, item) => total + item.lineTaxAmount, 0).toFixed(2),
    );
    const saleTotalAmount = Number((saleSubtotalNet + saleTaxAmount).toFixed(2));

    await prisma.$executeRawUnsafe(
      'INSERT INTO "Sale" ("id", "soldAt", "status", "channel", "currencyCode", "subtotalNet", "taxAmount", "totalAmount", "notes", "createdAt", "updatedAt") VALUES ($1, $2, $3::"SaleStatus", $4::"SaleChannel", $5, $6, $7, $8, $9, $10, $11)',
      saleId,
      saleSeed.soldAt,
      'CONFIRMED',
      saleSeed.channel,
      'ARS',
      saleSubtotalNet,
      saleTaxAmount,
      saleTotalAmount,
      saleSeed.notes,
      saleSeed.soldAt,
      saleSeed.soldAt,
    );

    for (const item of saleItemPayloads) {
      await prisma.$executeRawUnsafe(
        'INSERT INTO "SaleItem" ("id", "saleId", "plateId", "quantity", "unitCostAmount", "unitNetAmount", "unitTaxAmount", "unitTotalAmount", "lineCostAmount", "lineNetAmount", "lineTaxAmount", "lineTotalAmount", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
        item.id,
        saleId,
        item.plateId,
        item.quantity,
        item.unitCostAmount,
        item.unitNetAmount,
        item.unitTaxAmount,
        item.unitTotalAmount,
        item.lineCostAmount,
        item.lineNetAmount,
        item.lineTaxAmount,
        item.lineTotalAmount,
        saleSeed.soldAt,
      );
    }
  }

  console.log('✅ Seeding Complete!');
  console.log(`   • ${ingredientSeeds.length} ingredientes de cocina clasica argentina`);
  console.log(`   • ${variantSeeds.length} variantes listas para recetas y ajustes`);
  console.log('   • 7 recetas base para pizza, sanguches, milanesas, hamburguesas, empanadas y papas');
  console.log('   • 11 platos finales con tags, reviews y variantes utiles');
  console.log(
    `   • 1 proveedor generalista, ${STORAGE_LOCATIONS.length} ubicaciones de stock y ${TAX_RULE_SEEDS.length} reglas fiscales`,
  );
  console.log(`   • 1 compra inicial y ${saleSeeds.length} ventas demo para operaciones`);
  console.log(`   • ${reviewPayloads.length} reviews repartidas entre clientes seed`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
