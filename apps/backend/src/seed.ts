import * as argon2 from 'argon2';
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

const averageRating = (reviews: ReviewSeed[]) =>
  Number((reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(2));

const recommendationCount = (reviews: ReviewSeed[], recommends: boolean) =>
  reviews.filter((review) => review.recommends === recommends).length;

async function resetCatalog() {
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
  };

  const tags = {
    firmaCostera: await prisma.tag.create({
      data: {
        name: 'firma costera',
        description: 'Platos donde el mar y los vegetales frescos son protagonistas.',
      },
    }),
    altoOmega: await prisma.tag.create({
      data: {
        name: 'alto omega',
        description: 'Preparaciones con foco en grasas insaturadas y perfil marino.',
      },
    }),
    comfort: await prisma.tag.create({
      data: {
        name: 'comfort',
        description: 'Sabores intensos, cálidos y de apetito grande.',
      },
    }),
    favoritoNocturno: await prisma.tag.create({
      data: {
        name: 'favorito nocturno',
        description: 'Los más pedidos cuando cae la noche y sube el hambre.',
      },
    }),
    plantPower: await prisma.tag.create({
      data: {
        name: 'plant power',
        description: 'Platos vegetales completos, saciantes y con estructura real.',
      },
    }),
    almuerzoAgil: await prisma.tag.create({
      data: {
        name: 'almuerzo agil',
        description: 'Opciones pensadas para resolver mediodías sin bajar calidad.',
      },
    }),
  };

  const ingredientIds = new Map<string, string>();
  const variantIds = new Map<string, string>();

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

  const ingredientSeeds = [
    {
      key: 'brioche',
      data: {
        name: 'Pan brioche de masa madre',
        description: 'Pan suave con miga húmeda y tostado uniforme.',
        category: 'BREAD',
        subCategory: 'Brioche',
        primaryFlavor: 'SWEET',
        nutritionBasisGrams: 100,
        calories: 285,
        proteins: 8,
        carbs: 49,
        fats: 6,
        fiber: 2,
        sugars: 7,
        sodium: 430,
        saturatedFat: 1.5,
        transFat: 0,
        monounsaturatedFat: 1.8,
        polyunsaturatedFat: 1.2,
        allergens: ['GLUTEN', 'EGG', 'MILK'],
        dietaryTags: [],
        nutritionTags: ['ENERGY_DENSE'],
        notes: 'Aporta estructura y dulzor leve sin volverse invasivo.',
        extraAttributes: { fermentation: 'natural', toastProfile: 'medium' },
      },
    },
    {
      key: 'salmon',
      data: {
        name: 'Salmón atlántico',
        description: 'Lomo con grasa intramuscular marcada y textura firme.',
        category: 'PROTEIN_ANIMAL',
        subCategory: 'Pescado azul',
        primaryFlavor: 'UMAMI',
        nutritionBasisGrams: 100,
        calories: 208,
        proteins: 20,
        carbs: 0,
        fats: 13,
        fiber: 0,
        sugars: 0,
        sodium: 59,
        saturatedFat: 3.1,
        transFat: 0,
        monounsaturatedFat: 4.5,
        polyunsaturatedFat: 4.2,
        allergens: ['FISH'],
        dietaryTags: ['LOW_CARB', 'KETO_COMPATIBLE', 'PALEO_COMPATIBLE', 'PESCATARIAN'],
        nutritionTags: ['HIGH_PROTEIN', 'HIGH_HEALTHY_FATS', 'WHOLE_FOOD'],
        notes: 'Fuente central de omega-3 del plato costero.',
        extraAttributes: { omega3MgPer100g: 2200, origin: 'Patagonia' },
      },
    },
    {
      key: 'avocado',
      data: {
        name: 'Palta hass',
        description: 'Pulpa cremosa y densa, con perfil de grasa insaturada dominante.',
        category: 'FAT',
        subCategory: 'Fruta grasa',
        primaryFlavor: 'BITTERSWEET',
        nutritionBasisGrams: 100,
        calories: 160,
        proteins: 2,
        carbs: 9,
        fats: 15,
        fiber: 7,
        sugars: 0.7,
        sodium: 7,
        saturatedFat: 2.1,
        transFat: 0,
        monounsaturatedFat: 10,
        polyunsaturatedFat: 1.8,
        allergens: [],
        dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE', 'LOW_CARB', 'KETO_COMPATIBLE'],
        nutritionTags: ['HIGH_HEALTHY_FATS', 'HIGH_FIBER', 'WHOLE_FOOD', 'SATIATING'],
        notes: 'La grasa predominante es monoinsaturada; no se interpreta como un “malo”.',
        extraAttributes: { glycemicIndex: 15, potassiumMgPer100g: 485 },
      },
    },
    {
      key: 'yogurtDill',
      data: {
        name: 'Crema de yogur y eneldo',
        description: 'Salsa ácida y fresca para cortar la grasa del pescado.',
        category: 'SAUCE',
        subCategory: 'Láctea',
        primaryFlavor: 'ACID',
        nutritionBasisGrams: 100,
        calories: 118,
        proteins: 4,
        carbs: 6,
        fats: 8,
        fiber: 0,
        sugars: 4,
        sodium: 240,
        saturatedFat: 5,
        transFat: 0,
        monounsaturatedFat: 2,
        polyunsaturatedFat: 0.3,
        allergens: ['MILK'],
        dietaryTags: ['VEGETARIAN', 'GLUTEN_FREE'],
        nutritionTags: ['MINIMALLY_PROCESSED'],
        notes: 'Se usa como puente aromático entre salmón, palta y encurtidos.',
        extraAttributes: { herb: 'eneldo', texture: 'airy' },
      },
    },
    {
      key: 'pickledCucumber',
      data: {
        name: 'Pepino encurtido',
        description: 'Láminas finas con acidez alta y crocante limpio.',
        category: 'VEGETABLE',
        subCategory: 'Encurtido',
        primaryFlavor: 'ACID',
        nutritionBasisGrams: 100,
        calories: 24,
        proteins: 1,
        carbs: 5,
        fats: 0,
        fiber: 1,
        sugars: 3,
        sodium: 580,
        saturatedFat: 0,
        transFat: 0,
        monounsaturatedFat: 0,
        polyunsaturatedFat: 0,
        allergens: [],
        dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
        nutritionTags: ['LOW_SUGAR', 'MINIMALLY_PROCESSED'],
        notes: 'Da corte y refresco, no volumen.',
        extraAttributes: { pickleBase: 'vinagre de manzana' },
      },
    },
    {
      key: 'arugula',
      data: {
        name: 'Rúcula baby',
        description: 'Hoja picante, aireada y de final mineral.',
        category: 'VEGETABLE',
        subCategory: 'Hoja verde',
        primaryFlavor: 'BITTERSWEET',
        nutritionBasisGrams: 100,
        calories: 25,
        proteins: 2.6,
        carbs: 3.7,
        fats: 0.7,
        fiber: 1.6,
        sugars: 2.1,
        sodium: 27,
        saturatedFat: 0.1,
        transFat: 0,
        monounsaturatedFat: 0.1,
        polyunsaturatedFat: 0.3,
        allergens: [],
        dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
        nutritionTags: ['WHOLE_FOOD', 'MINIMALLY_PROCESSED'],
        notes: 'Sirve para aligerar perfiles grasos o densos.',
        extraAttributes: { leafCut: 'baby' },
      },
    },
    {
      key: 'lemon',
      data: {
        name: 'Limón fresco',
        description: 'Gajo servido para terminar el plato a último momento.',
        category: 'FRUIT',
        subCategory: 'Cítrico',
        primaryFlavor: 'ACID',
        nutritionBasisGrams: 100,
        calories: 29,
        proteins: 1.1,
        carbs: 9.3,
        fats: 0.3,
        fiber: 2.8,
        sugars: 2.5,
        sodium: 2,
        saturatedFat: 0,
        transFat: 0,
        monounsaturatedFat: 0,
        polyunsaturatedFat: 0.1,
        allergens: [],
        dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
        nutritionTags: ['WHOLE_FOOD', 'LOW_SUGAR'],
        notes: 'Se piensa como terminación, no como ingrediente de volumen.',
        extraAttributes: { useCase: 'finish' },
      },
    },
    {
      key: 'vealMilanesa',
      data: {
        name: 'Milanesa de ternera',
        description: 'Corte fino empanado y frito, con costra crujiente y centro jugoso.',
        category: 'PROTEIN_ANIMAL',
        subCategory: 'Carne vacuna empanada',
        primaryFlavor: 'UMAMI',
        nutritionBasisGrams: 100,
        calories: 279,
        proteins: 21,
        carbs: 12,
        fats: 16,
        fiber: 0.6,
        sugars: 0.7,
        sodium: 520,
        saturatedFat: 6,
        transFat: 0.4,
        monounsaturatedFat: 7,
        polyunsaturatedFat: 1.4,
        allergens: ['GLUTEN', 'EGG'],
        dietaryTags: [],
        nutritionTags: ['HIGH_PROTEIN', 'ENERGY_DENSE', 'SATIATING'],
        notes: 'Plato indulgente y explícito, sin maquillaje nutricional.',
        extraAttributes: { breading: 'panko fino' },
      },
    },
    {
      key: 'mozzarella',
      data: {
        name: 'Mozzarella fior di latte',
        description: 'Queso de fundido parejo y elasticidad alta.',
        category: 'DAIRY',
        subCategory: 'Queso pasta hilada',
        primaryFlavor: 'SALTY',
        nutritionBasisGrams: 100,
        calories: 280,
        proteins: 28,
        carbs: 3,
        fats: 17,
        fiber: 0,
        sugars: 1,
        sodium: 627,
        saturatedFat: 10,
        transFat: 0.3,
        monounsaturatedFat: 4.5,
        polyunsaturatedFat: 0.5,
        allergens: ['MILK'],
        dietaryTags: ['VEGETARIAN', 'GLUTEN_FREE'],
        nutritionTags: ['HIGH_PROTEIN', 'SATIATING'],
        notes: 'Genera la capa superior y el tirón clásico napolitano.',
        extraAttributes: { meltProfile: 'elastic' },
      },
    },
    {
      key: 'pomodoro',
      data: {
        name: 'Pomodoro casero',
        description: 'Salsa larga de tomate, ajo y oliva con acidez controlada.',
        category: 'SAUCE',
        subCategory: 'Tomate cocido',
        primaryFlavor: 'UMAMI',
        nutritionBasisGrams: 100,
        calories: 78,
        proteins: 1.8,
        carbs: 12,
        fats: 2.6,
        fiber: 2.5,
        sugars: 8,
        sodium: 410,
        saturatedFat: 0.4,
        transFat: 0,
        monounsaturatedFat: 1.6,
        polyunsaturatedFat: 0.3,
        allergens: [],
        dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
        nutritionTags: ['WHOLE_FOOD', 'MINIMALLY_PROCESSED'],
        notes: 'Más salsa de cocción que ketchup: tomate real, ajo y oliva.',
        extraAttributes: { cookTimeMinutes: 90 },
      },
    },
    {
      key: 'potato',
      data: {
        name: 'Papa criolla',
        description: 'Papa pequeña y cremosa, ideal para horno fuerte.',
        category: 'VEGETABLE',
        subCategory: 'Tubérculo',
        primaryFlavor: 'SWEET',
        nutritionBasisGrams: 100,
        calories: 87,
        proteins: 2,
        carbs: 20,
        fats: 0.1,
        fiber: 1.8,
        sugars: 1.2,
        sodium: 7,
        saturatedFat: 0,
        transFat: 0,
        monounsaturatedFat: 0,
        polyunsaturatedFat: 0,
        allergens: [],
        dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
        nutritionTags: ['WHOLE_FOOD', 'SATIATING'],
        notes: 'Se usa para una guarnición de corte rústico y textura cremosa.',
        extraAttributes: { texture: 'creamy' },
      },
    },
    {
      key: 'confitTomato',
      data: {
        name: 'Tomate confitado',
        description: 'Tomate cocido lento con oliva y hierbas.',
        category: 'VEGETABLE',
        subCategory: 'Confitado',
        primaryFlavor: 'SWEET',
        nutritionBasisGrams: 100,
        calories: 118,
        proteins: 2,
        carbs: 9,
        fats: 8,
        fiber: 2.5,
        sugars: 7,
        sodium: 180,
        saturatedFat: 1.2,
        transFat: 0,
        monounsaturatedFat: 5,
        polyunsaturatedFat: 0.8,
        allergens: [],
        dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
        nutritionTags: ['WHOLE_FOOD', 'HIGH_HEALTHY_FATS'],
        notes: 'Aporta dulzor profundo y textura carnosa vegetal.',
        extraAttributes: { confitMedium: 'olive oil' },
      },
    },
    {
      key: 'redOnion',
      data: {
        name: 'Cebolla morada',
        description: 'Láminas finas con final dulce y ácido corto.',
        category: 'VEGETABLE',
        subCategory: 'Bulbo',
        primaryFlavor: 'SWEET',
        nutritionBasisGrams: 100,
        calories: 40,
        proteins: 1.1,
        carbs: 9.3,
        fats: 0.1,
        fiber: 1.7,
        sugars: 4.2,
        sodium: 4,
        saturatedFat: 0,
        transFat: 0,
        monounsaturatedFat: 0,
        polyunsaturatedFat: 0,
        allergens: [],
        dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
        nutritionTags: ['WHOLE_FOOD', 'MINIMALLY_PROCESSED'],
        notes: 'Se usa para sumar filo aromático; en el plato final se remueve.',
        extraAttributes: { cut: 'thin' },
      },
    },
    {
      key: 'quinoa',
      data: {
        name: 'Quinoa tricolor cocida',
        description: 'Base tibia, suelta y con mordida leve.',
        category: 'GRAIN',
        subCategory: 'Pseudo cereal',
        primaryFlavor: 'UNKNOWN',
        nutritionBasisGrams: 100,
        calories: 120,
        proteins: 4.4,
        carbs: 21.3,
        fats: 1.9,
        fiber: 2.8,
        sugars: 0.9,
        sodium: 7,
        saturatedFat: 0.2,
        transFat: 0,
        monounsaturatedFat: 0.5,
        polyunsaturatedFat: 1,
        allergens: [],
        dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
        nutritionTags: ['HIGH_FIBER', 'WHOLE_FOOD', 'SATIATING'],
        notes: 'Da estructura al bowl sin depender solo de legumbres.',
        extraAttributes: { grainBlend: ['white', 'red', 'black'] },
      },
    },
    {
      key: 'chickpea',
      data: {
        name: 'Garbanzo cocido',
        description: 'Legumbre base con textura firme y aporte proteico vegetal.',
        category: 'LEGUME',
        subCategory: 'Legumbre',
        primaryFlavor: 'UNKNOWN',
        nutritionBasisGrams: 100,
        calories: 164,
        proteins: 8.9,
        carbs: 27.4,
        fats: 2.6,
        fiber: 7.6,
        sugars: 4.8,
        sodium: 24,
        saturatedFat: 0.3,
        transFat: 0,
        monounsaturatedFat: 0.6,
        polyunsaturatedFat: 1.1,
        allergens: [],
        dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
        nutritionTags: ['HIGH_FIBER', 'HIGH_PROTEIN', 'WHOLE_FOOD', 'SATIATING'],
        notes: 'La proteína vegetal principal del bowl.',
        extraAttributes: { legumeType: 'kabuli' },
      },
    },
    {
      key: 'portobello',
      data: {
        name: 'Portobello',
        description: 'Hongo carnoso con sabor umami concentrado.',
        category: 'VEGETABLE',
        subCategory: 'Hongo',
        primaryFlavor: 'UMAMI',
        nutritionBasisGrams: 100,
        calories: 22,
        proteins: 3.1,
        carbs: 3.3,
        fats: 0.3,
        fiber: 1,
        sugars: 2.1,
        sodium: 6,
        saturatedFat: 0.1,
        transFat: 0,
        monounsaturatedFat: 0,
        polyunsaturatedFat: 0.2,
        allergens: [],
        dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
        nutritionTags: ['WHOLE_FOOD', 'MINIMALLY_PROCESSED'],
        notes: 'Compensa la ausencia de proteína animal con textura y umami.',
        extraAttributes: { moistureLossOnRoastPct: 18 },
      },
    },
    {
      key: 'kale',
      data: {
        name: 'Kale',
        description: 'Hoja firme de sabor verde intenso.',
        category: 'VEGETABLE',
        subCategory: 'Hoja verde',
        primaryFlavor: 'BITTERSWEET',
        nutritionBasisGrams: 100,
        calories: 49,
        proteins: 4.3,
        carbs: 8.8,
        fats: 0.9,
        fiber: 3.6,
        sugars: 1.2,
        sodium: 38,
        saturatedFat: 0.1,
        transFat: 0,
        monounsaturatedFat: 0.1,
        polyunsaturatedFat: 0.2,
        allergens: [],
        dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
        nutritionTags: ['HIGH_FIBER', 'WHOLE_FOOD'],
        notes: 'En la receta base aporta verde cocido; luego se sustituye en el plato final.',
        extraAttributes: { leafType: 'curly' },
      },
    },
    {
      key: 'tahiniLemon',
      data: {
        name: 'Vinagreta de tahini y limón',
        description: 'Emulsión cremosa de sésamo tostado y jugo cítrico.',
        category: 'SAUCE',
        subCategory: 'Semillas',
        primaryFlavor: 'ACID',
        nutritionBasisGrams: 100,
        calories: 420,
        proteins: 10,
        carbs: 12,
        fats: 36,
        fiber: 5,
        sugars: 1,
        sodium: 220,
        saturatedFat: 5,
        transFat: 0,
        monounsaturatedFat: 15,
        polyunsaturatedFat: 14,
        allergens: ['SESAME'],
        dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE', 'LOW_CARB'],
        nutritionTags: ['HIGH_HEALTHY_FATS', 'MINIMALLY_PROCESSED', 'SATIATING'],
        notes: 'Sirve para ligar el bowl sin volverlo pesado.',
        extraAttributes: { acidityBalance: 'medium-high' },
      },
    },
    {
      key: 'sesame',
      data: {
        name: 'Semillas de sésamo',
        description: 'Terminación tostada con textura y aroma seco.',
        category: 'CONDIMENT',
        subCategory: 'Semillas',
        primaryFlavor: 'SALTY',
        nutritionBasisGrams: 100,
        calories: 573,
        proteins: 17,
        carbs: 23,
        fats: 50,
        fiber: 12,
        sugars: 0.3,
        sodium: 11,
        saturatedFat: 7,
        transFat: 0,
        monounsaturatedFat: 19,
        polyunsaturatedFat: 21,
        allergens: ['SESAME'],
        dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
        nutritionTags: ['HIGH_HEALTHY_FATS', 'HIGH_FIBER', 'WHOLE_FOOD'],
        notes: 'Se usa en dosis bajas como remate aromático y de textura.',
        extraAttributes: { roastLevel: 'light' },
      },
    },
  ] satisfies IngredientSeed[];

  for (const seed of ingredientSeeds) {
    const ingredient = await prisma.ingredient.create({ data: seed.data });
    ingredientIds.set(seed.key, ingredient.id);
  }

  const variantSeeds = [
    {
      key: 'briocheToasted',
      ingredientKey: 'brioche',
      data: {
        name: 'Brioche tostado en plancha',
        description: 'Exterior dorado, centro suave.',
        preparationMethod: 'GRILLED',
        preparationNotes: 'Sellado rápido para ganar estructura sin secar la miga.',
        portionGrams: 85,
        yieldFactor: 1,
        isDefault: true,
      },
    },
    {
      key: 'salmonGrilled',
      ingredientKey: 'salmon',
      data: {
        name: 'Salmón grillado',
        description: 'Pieza marcada a fuego fuerte con centro húmedo.',
        preparationMethod: 'GRILLED',
        preparationNotes: 'Plancha muy caliente y terminación corta.',
        portionGrams: 150,
        yieldFactor: 0.9,
        overrideCalories: 225,
        overrideProteins: 23,
        overrideCarbs: 0,
        overrideFats: 14,
        overrideFiber: 0,
        overrideSugars: 0,
        overrideSodium: 70,
        overrideSaturatedFat: 3.3,
        overrideTransFat: 0,
        overrideMonounsaturatedFat: 4.9,
        overridePolyunsaturatedFat: 4.6,
        isDefault: true,
      },
    },
    {
      key: 'avocadoFan',
      ingredientKey: 'avocado',
      data: {
        name: 'Palta en abanico',
        description: 'Corte fino para cubrir superficie sin aplastar la pieza.',
        preparationMethod: 'RAW',
        preparationNotes: 'Se incorpora al final para preservar textura y color.',
        portionGrams: 70,
        yieldFactor: 1,
        isDefault: true,
      },
    },
    {
      key: 'yogurtWhipped',
      ingredientKey: 'yogurtDill',
      data: {
        name: 'Crema batida',
        description: 'Salsa aireada con pico suave.',
        preparationMethod: 'RAW',
        preparationNotes: 'Se emulsiona hasta ganar aire y estabilidad.',
        portionGrams: 40,
        yieldFactor: 1,
        isDefault: true,
      },
    },
    {
      key: 'pickledCucumberFine',
      ingredientKey: 'pickledCucumber',
      data: {
        name: 'Pepino encurtido fino',
        description: 'Lámina delgada para intercalar entre capas.',
        preparationMethod: 'PICKLED',
        preparationNotes: 'Corte longitudinal para mantener crocante.',
        portionGrams: 26,
        yieldFactor: 1,
        overrideCalories: 22,
        overrideProteins: 1,
        overrideCarbs: 4.8,
        overrideFats: 0,
        overrideFiber: 1,
        overrideSugars: 2.6,
        overrideSodium: 620,
        overrideSaturatedFat: 0,
        overrideTransFat: 0,
        overrideMonounsaturatedFat: 0,
        overridePolyunsaturatedFat: 0,
        isDefault: true,
      },
    },
    {
      key: 'arugulaFresh',
      ingredientKey: 'arugula',
      data: {
        name: 'Rúcula fresca',
        description: 'Terminación fresca y picante.',
        preparationMethod: 'RAW',
        preparationNotes: 'Se suma al final para que no colapse.',
        portionGrams: 18,
        yieldFactor: 1,
        isDefault: true,
      },
    },
    {
      key: 'lemonWedge',
      ingredientKey: 'lemon',
      data: {
        name: 'Gajo de limón',
        description: 'Servido al costado para exprimir a gusto.',
        preparationMethod: 'RAW',
        preparationNotes: 'No se integra hasta el pase final.',
        portionGrams: 12,
        yieldFactor: 1,
        isDefault: true,
      },
    },
    {
      key: 'vealMilanesaFried',
      ingredientKey: 'vealMilanesa',
      data: {
        name: 'Milanesa frita',
        description: 'Empanado fino y crocante parejo.',
        preparationMethod: 'FRIED',
        preparationNotes: 'Fritura corta en aceite limpio.',
        portionGrams: 220,
        yieldFactor: 0.92,
        overrideCalories: 305,
        overrideProteins: 23,
        overrideCarbs: 13,
        overrideFats: 18,
        overrideFiber: 0.7,
        overrideSugars: 0.7,
        overrideSodium: 590,
        overrideSaturatedFat: 6.4,
        overrideTransFat: 0.4,
        overrideMonounsaturatedFat: 7.8,
        overridePolyunsaturatedFat: 1.6,
        isDefault: true,
      },
    },
    {
      key: 'mozzarellaGratinated',
      ingredientKey: 'mozzarella',
      data: {
        name: 'Mozzarella gratinada',
        description: 'Capa superior fundida y ligeramente dorada.',
        preparationMethod: 'BAKED',
        preparationNotes: 'Golpe final de horno para fijar la cobertura.',
        portionGrams: 85,
        yieldFactor: 0.98,
        isDefault: true,
      },
    },
    {
      key: 'pomodoroReduced',
      ingredientKey: 'pomodoro',
      data: {
        name: 'Pomodoro reducido',
        description: 'Salsa más concentrada y de mejor adhesión.',
        preparationMethod: 'SAUTEED',
        preparationNotes: 'Reducción hasta textura napante.',
        portionGrams: 90,
        yieldFactor: 0.95,
        isDefault: true,
      },
    },
    {
      key: 'potatoRoasted',
      ingredientKey: 'potato',
      data: {
        name: 'Papas horneadas',
        description: 'Gajo corto con exterior seco y centro cremoso.',
        preparationMethod: 'BAKED',
        preparationNotes: 'Horno fuerte con aceite de oliva y sal fina.',
        portionGrams: 180,
        yieldFactor: 0.88,
        overrideCalories: 140,
        overrideProteins: 2.6,
        overrideCarbs: 28,
        overrideFats: 2.8,
        overrideFiber: 2.6,
        overrideSugars: 1.6,
        overrideSodium: 160,
        overrideSaturatedFat: 0.4,
        overrideTransFat: 0,
        overrideMonounsaturatedFat: 1.8,
        overridePolyunsaturatedFat: 0.4,
        isDefault: true,
      },
    },
    {
      key: 'tomatoConfit',
      ingredientKey: 'confitTomato',
      data: {
        name: 'Tomate confitado',
        description: 'Terminación dulce y brillante.',
        preparationMethod: 'ROASTED',
        preparationNotes: 'Cocción lenta para caramelizar sin secar.',
        portionGrams: 36,
        yieldFactor: 0.95,
        isDefault: true,
      },
    },
    {
      key: 'onionPickled',
      ingredientKey: 'redOnion',
      data: {
        name: 'Cebolla encurtida',
        description: 'Aporta un filo ácido que en el SKU final se retira.',
        preparationMethod: 'PICKLED',
        preparationNotes: 'Encurtido corto para conservar textura.',
        portionGrams: 22,
        yieldFactor: 1,
        isDefault: true,
      },
    },
    {
      key: 'quinoaWarm',
      ingredientKey: 'quinoa',
      data: {
        name: 'Quinoa tibia',
        description: 'Base suelta y tibia al pase.',
        preparationMethod: 'BOILED',
        preparationNotes: 'Cocción justa y reposo en gastronorm tibio.',
        portionGrams: 150,
        yieldFactor: 1,
        isDefault: true,
      },
    },
    {
      key: 'chickpeaCrispy',
      ingredientKey: 'chickpea',
      data: {
        name: 'Garbanzo crocante',
        description: 'Legumbre asada con especiado seco.',
        preparationMethod: 'ROASTED',
        preparationNotes: 'Asado hasta piel firme y centro aún cremoso.',
        portionGrams: 110,
        yieldFactor: 0.96,
        overrideCalories: 185,
        overrideProteins: 10,
        overrideCarbs: 28,
        overrideFats: 3.2,
        overrideFiber: 8.1,
        overrideSugars: 4.5,
        overrideSodium: 90,
        overrideSaturatedFat: 0.3,
        overrideTransFat: 0,
        overrideMonounsaturatedFat: 0.7,
        overridePolyunsaturatedFat: 1.2,
        isDefault: true,
      },
    },
    {
      key: 'portobelloRoasted',
      ingredientKey: 'portobello',
      data: {
        name: 'Portobello asado',
        description: 'Pieza gruesa y jugosa de sabor más concentrado.',
        preparationMethod: 'ROASTED',
        preparationNotes: 'Horno fuerte para dorar bordes y retener humedad central.',
        portionGrams: 120,
        yieldFactor: 0.82,
        isDefault: true,
      },
    },
    {
      key: 'kaleSauteed',
      ingredientKey: 'kale',
      data: {
        name: 'Kale salteado',
        description: 'Hoja apenas rendida con aceite y sal.',
        preparationMethod: 'SAUTEED',
        preparationNotes: 'Salteo breve para bajar aspereza sin perder nervio.',
        portionGrams: 42,
        yieldFactor: 0.9,
        isDefault: true,
      },
    },
    {
      key: 'tahiniEmulsion',
      ingredientKey: 'tahiniLemon',
      data: {
        name: 'Vinagreta emulsionada',
        description: 'Salsa cremosa de textura fluida.',
        preparationMethod: 'RAW',
        preparationNotes: 'Emulsión fría hasta lograr caída continua.',
        portionGrams: 35,
        yieldFactor: 1,
        isDefault: true,
      },
    },
    {
      key: 'sesameToasted',
      ingredientKey: 'sesame',
      data: {
        name: 'Sésamo tostado',
        description: 'Terminación de semillas apenas doradas.',
        preparationMethod: 'ROASTED',
        preparationNotes: 'Tostado corto para liberar aroma sin amargar.',
        portionGrams: 10,
        yieldFactor: 1,
        isDefault: true,
      },
    },
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

  const briocheCostero = await prisma.recipe.create({
    data: {
      name: 'Brioche Costero',
      description:
        'Brioche tostado con salmón grillado, crema láctica herbácea y contraste fresco.',
      type: 'MAIN',
      flavor: 'UMAMI',
      difficulty: 'MEDIUM',
      prepTimeMinutes: 20,
      cookTimeMinutes: 12,
      yieldServings: 1,
      assemblyNotes:
        'El brioche se arma recién al pase. La palta no va en la receta base para poder declararla como ajuste final del SKU.',
      allergens: ['GLUTEN', 'MILK', 'FISH'],
      dietaryTags: ['PESCATARIAN'],
      isPublic: true,
      items: {
        create: [
          {
            variantId: requireVariantId('briocheToasted'),
            quantityGrams: 85,
            prepNotes: 'Base estructural del sándwich.',
            isMainComponent: false,
            sortOrder: 0,
          },
          {
            variantId: requireVariantId('salmonGrilled'),
            quantityGrams: 150,
            prepNotes: 'Pieza principal del plato.',
            isMainComponent: true,
            sortOrder: 1,
          },
          {
            variantId: requireVariantId('yogurtWhipped'),
            quantityGrams: 40,
            prepNotes: 'Se dosifica debajo y sobre el pescado.',
            isMainComponent: false,
            sortOrder: 2,
          },
          {
            variantId: requireVariantId('pickledCucumberFine'),
            quantityGrams: 26,
            prepNotes: 'Intercala acidez y crocante.',
            isMainComponent: false,
            sortOrder: 3,
          },
          {
            variantId: requireVariantId('arugulaFresh'),
            quantityGrams: 18,
            prepNotes: 'Capa aérea superior.',
            isMainComponent: false,
            sortOrder: 4,
          },
          {
            variantId: requireVariantId('lemonWedge'),
            quantityGrams: 12,
            prepNotes: 'Se sirve aparte para exprimir.',
            isOptional: true,
            isMainComponent: false,
            sortOrder: 5,
          },
        ],
      },
    },
    include: { items: true },
  });

  const napolitanaBarrio = await prisma.recipe.create({
    data: {
      name: 'Napolitana de Barrio',
      description:
        'Milanesa grande, pomodoro largo, mozzarella fundida y papas criollas al horno.',
      type: 'MAIN',
      flavor: 'UMAMI',
      difficulty: 'MEDIUM',
      prepTimeMinutes: 25,
      cookTimeMinutes: 18,
      yieldServings: 1,
      assemblyNotes:
        'La cebolla encurtida se contempla en la receta base, pero el SKU final la retira para un perfil más clásico.',
      allergens: ['GLUTEN', 'MILK', 'EGG'],
      dietaryTags: [],
      isPublic: true,
      items: {
        create: [
          {
            variantId: requireVariantId('vealMilanesaFried'),
            quantityGrams: 220,
            prepNotes: 'Pieza principal servida extendida.',
            isMainComponent: true,
            sortOrder: 0,
          },
          {
            variantId: requireVariantId('pomodoroReduced'),
            quantityGrams: 90,
            prepNotes: 'Capa base de la cobertura napolitana.',
            isMainComponent: false,
            sortOrder: 1,
          },
          {
            variantId: requireVariantId('mozzarellaGratinated'),
            quantityGrams: 85,
            prepNotes: 'Capa superior fundida.',
            isMainComponent: false,
            sortOrder: 2,
          },
          {
            variantId: requireVariantId('potatoRoasted'),
            quantityGrams: 180,
            prepNotes: 'Guarnición servida al costado.',
            isMainComponent: false,
            sortOrder: 3,
          },
          {
            variantId: requireVariantId('tomatoConfit'),
            quantityGrams: 36,
            prepNotes: 'Punto dulce para equilibrar el pomodoro.',
            isOptional: true,
            isMainComponent: false,
            sortOrder: 4,
          },
          {
            variantId: requireVariantId('onionPickled'),
            quantityGrams: 22,
            prepNotes: 'Guarnición de borde pensada para contraste ácido.',
            isMainComponent: false,
            sortOrder: 5,
          },
        ],
      },
    },
    include: { items: true },
  });

  const bowlVerde = await prisma.recipe.create({
    data: {
      name: 'Bowl Tibio Verde',
      description:
        'Base tibia de quinoa y garbanzo con hongos, hojas verdes y vinagreta de tahini.',
      type: 'MAIN',
      flavor: 'UMAMI',
      difficulty: 'EASY',
      prepTimeMinutes: 18,
      cookTimeMinutes: 14,
      yieldServings: 1,
      assemblyNotes:
        'La receta base usa kale salteado; el plato final lo sustituye por rúcula para una lectura más fresca.',
      allergens: ['SESAME'],
      dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
      isPublic: true,
      items: {
        create: [
          {
            variantId: requireVariantId('quinoaWarm'),
            quantityGrams: 150,
            prepNotes: 'Base del bowl y eje térmico.',
            isMainComponent: true,
            sortOrder: 0,
          },
          {
            variantId: requireVariantId('chickpeaCrispy'),
            quantityGrams: 110,
            prepNotes: 'Proteína vegetal principal.',
            isMainComponent: true,
            sortOrder: 1,
          },
          {
            variantId: requireVariantId('portobelloRoasted'),
            quantityGrams: 120,
            prepNotes: 'Capa umami del bowl.',
            isMainComponent: true,
            sortOrder: 2,
          },
          {
            variantId: requireVariantId('kaleSauteed'),
            quantityGrams: 42,
            prepNotes: 'Verde cocido de la receta base.',
            isMainComponent: false,
            sortOrder: 3,
          },
          {
            variantId: requireVariantId('tahiniEmulsion'),
            quantityGrams: 35,
            prepNotes: 'Salsa de unión del bowl.',
            isMainComponent: false,
            sortOrder: 4,
          },
          {
            variantId: requireVariantId('tomatoConfit'),
            quantityGrams: 40,
            prepNotes: 'Se suma para dar contrapunto dulce.',
            isOptional: true,
            isMainComponent: false,
            sortOrder: 5,
          },
          {
            variantId: requireVariantId('sesameToasted'),
            quantityGrams: 10,
            prepNotes: 'Terminación final.',
            isMainComponent: false,
            sortOrder: 6,
          },
        ],
      },
    },
    include: { items: true },
  });

  const coastalReviews: ReviewSeed[] = [
    {
      userId: reviewers.lucia.id,
      rating: 4.9,
      comment:
        'La palta está ahí para sumar textura y grasas nobles, no para tapar el salmón. Muy bien balanceado.',
      recommends: true,
      createdAt: new Date('2026-03-18T21:10:00.000Z'),
    },
    {
      userId: reviewers.bruno.id,
      rating: 4.7,
      comment:
        'Muy fresco para ser un plato intenso. El pepino encurtido hace que no se vuelva pesado.',
      recommends: true,
      createdAt: new Date('2026-03-20T12:45:00.000Z'),
    },
    {
      userId: reviewers.julieta.id,
      rating: 4.8,
      comment:
        'Se nota el perfil graso, pero es redondo y limpio. Nada que ver con una lectura simplista de “mucha grasa”.',
      recommends: true,
      createdAt: new Date('2026-03-24T20:05:00.000Z'),
    },
  ];

  const napolitanaReviews: ReviewSeed[] = [
    {
      userId: reviewers.lucia.id,
      rating: 4.6,
      comment: 'Clásico bien resuelto. Mucha cobertura, pero la milanesa sigue mandando.',
      recommends: true,
      createdAt: new Date('2026-03-16T21:20:00.000Z'),
    },
    {
      userId: reviewers.bruno.id,
      rating: 4.4,
      comment: 'Potente y reconfortante. Las papas llegan al punto justo.',
      recommends: true,
      createdAt: new Date('2026-03-19T23:00:00.000Z'),
    },
    {
      userId: reviewers.julieta.id,
      rating: 4.2,
      comment: 'Plato grande y honesto. Se agradece que la cebolla venga removida en esta versión.',
      recommends: false,
      createdAt: new Date('2026-03-26T22:10:00.000Z'),
    },
  ];

  const bowlReviews: ReviewSeed[] = [
    {
      userId: reviewers.lucia.id,
      rating: 4.8,
      comment: 'Muy completo. El tahini liga todo sin volverlo pesado.',
      recommends: true,
      createdAt: new Date('2026-03-17T13:05:00.000Z'),
    },
    {
      userId: reviewers.bruno.id,
      rating: 4.5,
      comment: 'El portobello sostiene muy bien el bowl. Se siente abundante de verdad.',
      recommends: true,
      createdAt: new Date('2026-03-21T13:20:00.000Z'),
    },
    {
      userId: reviewers.julieta.id,
      rating: 4.7,
      comment:
        'La sustitución por rúcula le da un cierre más fresco. Gran opción de almuerzo largo.',
      recommends: true,
      createdAt: new Date('2026-03-27T12:30:00.000Z'),
    },
  ];

  const coastalPlate = await prisma.plate.create({
    data: {
      name: 'Brioche Costero con Salmón y Palta',
      description:
        'Sándwich tibio de salmón grillado con palta, crema de yogur y eneldo, pepinos encurtidos y rúcula.',
      recipeId: briocheCostero.id,
      size: 'REGULAR',
      servedWeightGrams: 438,
      costPrice: '9.40',
      menuPrice: '18.50',
      avgRating: averageRating(coastalReviews),
      ratingsCount: coastalReviews.length,
      likesCount: recommendationCount(coastalReviews, true),
      dislikesCount: recommendationCount(coastalReviews, false),
      calculatedCalories: 782,
      calculatedProteins: 37,
      calculatedCarbs: 44,
      calculatedFats: 47,
      calculatedFiber: 10,
      calculatedSugars: 6,
      calculatedSodium: 980,
      calculatedSaturatedFat: 7,
      calculatedTransFat: 0,
      calculatedMonounsaturatedFat: 24,
      calculatedPolyunsaturatedFat: 10,
      allergens: ['GLUTEN', 'MILK', 'FISH'],
      dietaryTags: ['PESCATARIAN'],
      nutritionTags: [
        'HIGH_PROTEIN',
        'HIGH_HEALTHY_FATS',
        'LOW_SUGAR',
        'WHOLE_FOOD',
        'SATIATING',
      ],
      nutritionNotes:
        'La mayor parte de la grasa proviene de salmón y palta, con predominio de mono y poliinsaturadas.',
    },
  });

  const napolitanaPlate = await prisma.plate.create({
    data: {
      name: 'Milanesa Napolitana con Papas Criollas',
      description:
        'Milanesa de ternera con pomodoro casero, mozzarella gratinada, tomate confitado y papas criollas al horno.',
      recipeId: napolitanaBarrio.id,
      size: 'LARGE',
      servedWeightGrams: 510,
      costPrice: '8.70',
      menuPrice: '16.90',
      avgRating: averageRating(napolitanaReviews),
      ratingsCount: napolitanaReviews.length,
      likesCount: recommendationCount(napolitanaReviews, true),
      dislikesCount: recommendationCount(napolitanaReviews, false),
      calculatedCalories: 986,
      calculatedProteins: 58,
      calculatedCarbs: 63,
      calculatedFats: 55,
      calculatedFiber: 7,
      calculatedSugars: 10,
      calculatedSodium: 1670,
      calculatedSaturatedFat: 19,
      calculatedTransFat: 0.7,
      calculatedMonounsaturatedFat: 21,
      calculatedPolyunsaturatedFat: 5,
      allergens: ['GLUTEN', 'MILK', 'EGG'],
      dietaryTags: [],
      nutritionTags: ['HIGH_PROTEIN', 'ENERGY_DENSE', 'SATIATING'],
      nutritionNotes:
        'Es un plato indulgente y explícito; la densidad energética forma parte de su identidad y se declara sin ocultarla.',
    },
  });

  const bowlPlate = await prisma.plate.create({
    data: {
      name: 'Bowl Tibio de Garbanzos, Portobello y Tahini',
      description:
        'Bowl tibio con quinoa, garbanzo crocante, portobello asado, rúcula fresca y vinagreta de tahini y limón.',
      recipeId: bowlVerde.id,
      size: 'REGULAR',
      servedWeightGrams: 460,
      costPrice: '6.80',
      menuPrice: '14.20',
      avgRating: averageRating(bowlReviews),
      ratingsCount: bowlReviews.length,
      likesCount: recommendationCount(bowlReviews, true),
      dislikesCount: recommendationCount(bowlReviews, false),
      calculatedCalories: 648,
      calculatedProteins: 24,
      calculatedCarbs: 68,
      calculatedFats: 29,
      calculatedFiber: 17,
      calculatedSugars: 8,
      calculatedSodium: 620,
      calculatedSaturatedFat: 4.8,
      calculatedTransFat: 0,
      calculatedMonounsaturatedFat: 10.7,
      calculatedPolyunsaturatedFat: 10.2,
      allergens: ['SESAME'],
      dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
      nutritionTags: ['HIGH_FIBER', 'WHOLE_FOOD', 'MINIMALLY_PROCESSED', 'SATIATING'],
      nutritionNotes:
        'La saciedad viene del combo quinoa-garbanzo-sésamo, no de ultraprocesados ni atajos.',
    },
  });

  const napolitanaOnionItem = napolitanaBarrio.items.find((item) => item.sortOrder === 5);
  const bowlKaleItem = bowlVerde.items.find((item) => item.sortOrder === 3);

  if (!napolitanaOnionItem || !bowlKaleItem) {
    throw new Error('Seed recipes were created without the expected recipe items.');
  }

  await prisma.plateAdjustment.createMany({
    data: [
      {
        plateId: coastalPlate.id,
        adjustmentType: 'ADDITION',
        variantId: requireVariantId('avocadoFan'),
        quantityGrams: 70,
        notes: 'El SKU final suma abanico de palta como capa explícita sobre el salmón.',
        sortOrder: 0,
      },
      {
        plateId: napolitanaPlate.id,
        adjustmentType: 'REMOVAL',
        recipeItemId: napolitanaOnionItem.id,
        quantityGrams: null,
        notes: 'Se retira la cebolla encurtida para dejar una lectura más clásica y frontal.',
        sortOrder: 0,
      },
      {
        plateId: bowlPlate.id,
        adjustmentType: 'SUBSTITUTION',
        recipeItemId: bowlKaleItem.id,
        variantId: requireVariantId('arugulaFresh'),
        quantityGrams: 32,
        notes: 'La rúcula reemplaza al kale para un final más fresco y aireado.',
        sortOrder: 0,
      },
    ],
  });

  await prisma.plateTag.createMany({
    data: [
      { plateId: coastalPlate.id, tagId: tags.firmaCostera.id },
      { plateId: coastalPlate.id, tagId: tags.altoOmega.id },
      { plateId: napolitanaPlate.id, tagId: tags.comfort.id },
      { plateId: napolitanaPlate.id, tagId: tags.favoritoNocturno.id },
      { plateId: bowlPlate.id, tagId: tags.plantPower.id },
      { plateId: bowlPlate.id, tagId: tags.almuerzoAgil.id },
    ],
  });

  await prisma.review.createMany({
    data: [
      ...coastalReviews.map((review) => ({ ...review, plateId: coastalPlate.id })),
      ...napolitanaReviews.map((review) => ({ ...review, plateId: napolitanaPlate.id })),
      ...bowlReviews.map((review) => ({ ...review, plateId: bowlPlate.id })),
    ],
  });

  console.log('✅ Seeding Complete!');
  console.log(`   • ${ingredientSeeds.length} ingredientes con metadata nutricional completa`);
  console.log(`   • ${variantSeeds.length} variantes asociadas a ingredientes`);
  console.log('   • 3 recetas con todos sus recipeItems');
  console.log('   • 3 platos finales con tags, ajustes y snapshots nutricionales');
  console.log('   • 9 reviews distribuidas entre 3 usuarios seed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
