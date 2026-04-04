export const NUTRITION_KEYS = [
  'calories',
  'proteins',
  'carbs',
  'fats',
  'fiber',
  'sugars',
  'sodium',
  'saturatedFat',
  'transFat',
  'monounsaturatedFat',
  'polyunsaturatedFat',
] as const;

export type NutritionKey = (typeof NUTRITION_KEYS)[number];
export type NutritionTone = 'benefit' | 'balanced' | 'caution' | 'danger';
export type NutritionReferenceKind = 'positive' | 'limit' | 'avoid' | 'contextual';

export interface NutritionSnapshot {
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
}

export interface OptionalNutritionSnapshot {
  calories: number | null;
  proteins: number | null;
  carbs: number | null;
  fats: number | null;
  fiber: number | null;
  sugars: number | null;
  sodium: number | null;
  saturatedFat: number | null;
  transFat: number | null;
  monounsaturatedFat: number | null;
  polyunsaturatedFat: number | null;
}

export interface PlateNutritionIngredientLike {
  id: string;
  name: string;
  description: string | null;
  category: string;
  nutritionBasisGrams: number;
  nutrition: NutritionSnapshot;
  allergens: string[];
  dietaryTags: string[];
  nutritionTags: string[];
  notes: string | null;
  extraAttributes?: unknown;
}

export interface PlateNutritionVariantLike {
  id: string;
  name: string;
  description: string | null;
  preparationMethod: string;
  preparationNotes: string | null;
  portionGrams: number;
  yieldFactor: number;
  overrideNutrition: OptionalNutritionSnapshot;
  ingredient: PlateNutritionIngredientLike;
}

export interface PlateNutritionRecipeItemLike {
  id: string;
  quantityGrams: number;
  prepNotes: string | null;
  isOptional: boolean;
  isMainComponent: boolean;
  sortOrder: number;
  variant: PlateNutritionVariantLike;
}

export interface PlateNutritionAdjustmentLike {
  id: string;
  adjustmentType: string;
  quantityGrams: number | null;
  notes: string | null;
  sortOrder: number;
  recipeItemId: string | null;
  recipeItem: PlateNutritionRecipeItemLike | null;
  variant: PlateNutritionVariantLike | null;
}

export interface PlateNutritionPlateLike {
  recipe: {
    yieldServings: number;
    items: PlateNutritionRecipeItemLike[];
  };
  adjustments: PlateNutritionAdjustmentLike[];
}

export interface NutritionReferencePeriod {
  daily: number | null;
  weekly: number | null;
  monthly: number | null;
  yearly: number | null;
  unit: string;
  kind: NutritionReferenceKind;
  sourceLabel: string;
  note: string;
}

export interface NutritionMetricDefinition {
  key: NutritionKey;
  label: string;
  unit: string;
  kind: NutritionReferenceKind;
}

export interface NutritionMetricAnalysis {
  key: NutritionKey;
  label: string;
  unit: string;
  kind: NutritionReferenceKind;
  tone: NutritionTone;
  total: number;
  perServing: number;
  percentDailyValue: number | null;
  reference: NutritionReferencePeriod;
  note: string;
}

export interface ResolvedPlateComponent {
  id: string;
  baseRecipeItemId: string | null;
  source: 'recipe' | 'addition' | 'substitution';
  sortOrder: number;
  requestedQuantityGrams: number;
  quantityGrams: number;
  isOptional: boolean;
  isMainComponent: boolean;
  variant: PlateNutritionVariantLike;
  notes: string[];
}

export interface PlateIngredientBreakdown {
  id: string;
  name: string;
  description: string | null;
  category: string;
  quantityGrams: number;
  tone: NutritionTone;
  variants: string[];
  preparations: string[];
  notes: string[];
  allergens: string[];
  dietaryTags: string[];
  nutritionTags: string[];
  totalNutrition: NutritionSnapshot;
  perServingNutrition: NutritionSnapshot;
  metrics: NutritionMetricAnalysis[];
}

export interface PlateNutritionAnalysis {
  servings: number;
  components: ResolvedPlateComponent[];
  ingredients: PlateIngredientBreakdown[];
  totalNutrition: NutritionSnapshot;
  totalPerServingNutrition: NutritionSnapshot;
  totalMetrics: NutritionMetricAnalysis[];
}

const REFERENCE_METRIC_KEYS = [
  'calories',
  'proteins',
  'carbs',
  'fats',
  'fiber',
  'sugars',
  'sodium',
  'saturatedFat',
  'transFat',
] as const satisfies NutritionKey[];

export const hasStructuredReferenceTarget = (key: NutritionKey) =>
  (REFERENCE_METRIC_KEYS as readonly NutritionKey[]).includes(key);

const roundValue = (value: number, digits = 1) => Number(value.toFixed(digits));

const scaleReference = (value: number | null, days: number) => {
  if (value == null) return null;
  return roundValue(value * days, value >= 100 ? 0 : 1);
};

const createReference = (
  daily: number | null,
  unit: string,
  kind: NutritionReferenceKind,
  sourceLabel: string,
  note: string,
): NutritionReferencePeriod => ({
  daily,
  weekly: scaleReference(daily, 7),
  monthly: scaleReference(daily, 30),
  yearly: scaleReference(daily, 365),
  unit,
  kind,
  sourceLabel,
  note,
});

export const NUTRITION_REFERENCE_TABLE: Record<NutritionKey, NutritionReferencePeriod> = {
  calories: createReference(
    2000,
    'kcal',
    'limit',
    'FDA Nutrition Facts reference',
    'Se usa la referencia general de 2,000 kcal por dia para leer una orden.',
  ),
  proteins: createReference(
    50,
    'g',
    'positive',
    'FDA Daily Value',
    'La proteina se valora como un aporte util del plato.',
  ),
  carbs: createReference(
    275,
    'g',
    'limit',
    'FDA Daily Value',
    'Los carbohidratos se leen con contexto: no son malos por si solos, pero conviene mirar la carga total.',
  ),
  fats: createReference(
    78,
    'g',
    'limit',
    'FDA Daily Value',
    'La grasa total importa menos sola que junto a saturadas, trans y perfil insaturado.',
  ),
  fiber: createReference(
    28,
    'g',
    'positive',
    'FDA Daily Value',
    'La fibra se interpreta como una señal favorable cuando el plato realmente aporta.',
  ),
  sugars: createReference(
    50,
    'g',
    'limit',
    'FDA Daily Value for added sugars',
    'El esquema actual guarda azucares totales; esta referencia se usa como proxy conservador.',
  ),
  sodium: createReference(
    2300,
    'mg',
    'limit',
    'FDA Daily Value',
    'Arriba de este rango, el sodio empieza a pesar mucho dentro del dia.',
  ),
  saturatedFat: createReference(
    20,
    'g',
    'limit',
    'FDA Daily Value',
    'La grasa saturada se limita para que no domine el perfil lipidico del plato.',
  ),
  transFat: createReference(
    0,
    'g',
    'avoid',
    'Dietary Guidelines / FDA labeling context',
    'No tiene un valor diario oficial; la referencia operativa es mantenerla lo mas cerca posible de cero.',
  ),
  monounsaturatedFat: createReference(
    null,
    'g',
    'contextual',
    'Contextual heuristic',
    'No existe un valor diario oficial fijo; se valora cuando desplaza saturadas dentro de la grasa total.',
  ),
  polyunsaturatedFat: createReference(
    null,
    'g',
    'contextual',
    'Contextual heuristic',
    'No existe un valor diario oficial fijo; se valora cuando forma parte de un perfil graso mas favorable.',
  ),
};

export const NUTRITION_METRIC_DEFINITIONS: NutritionMetricDefinition[] = [
  { key: 'calories', label: 'Calorias', unit: 'kcal', kind: 'limit' },
  { key: 'proteins', label: 'Proteinas', unit: 'g', kind: 'positive' },
  { key: 'carbs', label: 'Carbohidratos', unit: 'g', kind: 'limit' },
  { key: 'fats', label: 'Grasas', unit: 'g', kind: 'limit' },
  { key: 'fiber', label: 'Fibra', unit: 'g', kind: 'positive' },
  { key: 'sugars', label: 'Azucares', unit: 'g', kind: 'limit' },
  { key: 'sodium', label: 'Sodio', unit: 'mg', kind: 'limit' },
  { key: 'saturatedFat', label: 'Grasa saturada', unit: 'g', kind: 'limit' },
  { key: 'transFat', label: 'Grasa trans', unit: 'g', kind: 'avoid' },
  {
    key: 'monounsaturatedFat',
    label: 'Grasa monoinsaturada',
    unit: 'g',
    kind: 'contextual',
  },
  {
    key: 'polyunsaturatedFat',
    label: 'Grasa poliinsaturada',
    unit: 'g',
    kind: 'contextual',
  },
] as const;

export const createEmptyNutrition = (): NutritionSnapshot => ({
  calories: 0,
  proteins: 0,
  carbs: 0,
  fats: 0,
  fiber: 0,
  sugars: 0,
  sodium: 0,
  saturatedFat: 0,
  transFat: 0,
  monounsaturatedFat: 0,
  polyunsaturatedFat: 0,
});

export const dedupeStrings = (values: Array<string | null | undefined>) =>
  Array.from(
    new Set(
      values.map((value) => value?.trim()).filter((value): value is string => Boolean(value)),
    ),
  );

export const addNutrition = (
  left: NutritionSnapshot,
  right: NutritionSnapshot,
): NutritionSnapshot => {
  const next = createEmptyNutrition();

  for (const key of NUTRITION_KEYS) {
    next[key] = left[key] + right[key];
  }

  return next;
};

export const divideNutrition = (value: NutritionSnapshot, divisor: number): NutritionSnapshot => {
  const next = createEmptyNutrition();
  const safeDivisor = divisor > 0 ? divisor : 1;

  for (const key of NUTRITION_KEYS) {
    next[key] = value[key] / safeDivisor;
  }

  return next;
};

const ratio = (value: number, reference: number) => (reference > 0 ? value / reference : 0);

const classifyPositiveRatio = (
  value: number,
  reference: number,
  benefitMin: number,
  balancedMin: number,
): NutritionTone => {
  const currentRatio = ratio(value, reference);

  if (currentRatio >= benefitMin) return 'benefit';
  if (currentRatio >= balancedMin) return 'balanced';
  return 'caution';
};

const classifyLimitRatio = (
  value: number,
  reference: number,
  balancedMax: number,
  cautionMax: number,
): NutritionTone => {
  const currentRatio = ratio(value, reference);

  if (currentRatio <= balancedMax) return 'balanced';
  if (currentRatio <= cautionMax) return 'caution';
  return 'danger';
};

const classifyAvoidAbsolute = (
  value: number,
  benefitMax: number,
  cautionMax: number,
): NutritionTone => {
  if (value <= benefitMax) return 'benefit';
  if (value <= cautionMax) return 'caution';
  return 'danger';
};

const classifyUnsaturatedMetric = (
  value: number,
  totalFat: number,
  benefitMin: number,
  benefitShare: number,
  balancedMin: number,
  balancedShare: number,
): NutritionTone => {
  if (value <= 0.25 || totalFat <= 1) return 'balanced';

  const share = value / totalFat;

  if (value >= benefitMin && share >= benefitShare) return 'benefit';
  if (value >= balancedMin && share >= balancedShare) return 'balanced';
  return 'balanced';
};

const describeMetricTone = (
  key: NutritionKey,
  tone: NutritionTone,
  nutrition: NutritionSnapshot,
): string => {
  switch (key) {
    case 'calories':
      return tone === 'danger'
        ? 'Carga energetica alta para una sola orden.'
        : tone === 'caution'
          ? 'Conviene mirar el tamano de la porcion.'
          : 'Carga energetica razonable para el plato.';
    case 'proteins':
      return tone === 'benefit'
        ? 'Buen aporte proteico.'
        : tone === 'balanced'
          ? 'Aporta proteina de forma decente.'
          : 'Podria aportar mas proteina para su tamano.';
    case 'carbs':
      return tone === 'danger'
        ? 'La carga de carbohidratos es alta para una sola orden.'
        : tone === 'caution'
          ? 'Hay bastante carga de carbohidratos en el plato.'
          : 'La carga de carbohidratos entra en un rango esperable.';
    case 'fats':
      return tone === 'danger'
        ? 'La grasa total ya pesa fuerte dentro del dia.'
        : tone === 'caution'
          ? 'Conviene mirar el perfil de grasas del plato.'
          : 'La grasa total queda en una zona normal.';
    case 'fiber':
      return tone === 'benefit'
        ? 'Buen aporte de fibra.'
        : tone === 'balanced'
          ? 'Tiene algo de fibra para la porcion.'
          : 'La fibra puede mejorar.';
    case 'sugars':
      return tone === 'danger'
        ? 'La carga de azucares ya es alta para una sola orden.'
        : tone === 'caution'
          ? 'Hay azucares para vigilar.'
          : 'Azucares en una zona razonable para el plato.';
    case 'sodium':
      return tone === 'danger'
        ? 'El sodio queda alto para una sola orden.'
        : tone === 'caution'
          ? 'Hay sodio para vigilar.'
          : 'El sodio queda en una lectura normal.';
    case 'saturatedFat':
      return tone === 'danger'
        ? 'La grasa saturada domina demasiado la orden.'
        : tone === 'caution'
          ? 'Hay saturadas para revisar.'
          : 'Las saturadas quedan controladas.';
    case 'transFat':
      return tone === 'danger'
        ? 'La grasa trans ya es un exceso claro.'
        : tone === 'caution'
          ? 'Hay presencia de grasa trans.'
          : 'Practicamente no aporta grasas trans.';
    case 'monounsaturatedFat':
      return tone === 'benefit'
        ? 'Predominan grasas monoinsaturadas dentro del perfil graso.'
        : tone === 'balanced'
          ? 'Hay una presencia decente de grasa monoinsaturada.'
          : nutrition.fats > 0
            ? 'La grasa monoinsaturada no llega a destacarse.'
            : 'No aplica sin grasa total.';
    case 'polyunsaturatedFat':
      return tone === 'benefit'
        ? 'Aporta grasas poliinsaturadas en un rango favorable.'
        : tone === 'balanced'
          ? 'Hay una presencia decente de grasa poliinsaturada.'
          : nutrition.fats > 0
            ? 'La grasa poliinsaturada no llega a destacarse.'
            : 'No aplica sin grasa total.';
    default:
      return 'Sin lectura adicional.';
  }
};

export const classifyNutritionMetric = (
  key: NutritionKey,
  value: number,
  nutrition: NutritionSnapshot,
): NutritionTone => {
  switch (key) {
    case 'calories':
      return classifyLimitRatio(value, 2000, 0.35, 0.5);
    case 'proteins':
      return classifyPositiveRatio(value, 50, 0.25, 0.12);
    case 'carbs':
      return classifyLimitRatio(value, 275, 0.4, 0.6);
    case 'fats':
      return classifyLimitRatio(value, 78, 0.4, 0.55);
    case 'fiber':
      return classifyPositiveRatio(value, 28, 0.2, 0.1);
    case 'sugars':
      return classifyLimitRatio(value, 50, 0.4, 0.7);
    case 'sodium':
      return classifyLimitRatio(value, 2300, 0.3, 0.45);
    case 'saturatedFat':
      return classifyLimitRatio(value, 20, 0.35, 0.55);
    case 'transFat':
      return classifyAvoidAbsolute(value, 0.05, 0.5);
    case 'monounsaturatedFat':
      return classifyUnsaturatedMetric(value, nutrition.fats, 6, 0.35, 2.5, 0.2);
    case 'polyunsaturatedFat':
      return classifyUnsaturatedMetric(value, nutrition.fats, 3, 0.14, 1, 0.08);
    default:
      return 'balanced';
  }
};

export const shouldShowNutritionMetric = (key: NutritionKey, value: number) => {
  if (key === 'transFat') return value >= 0.1;
  if (key === 'monounsaturatedFat' || key === 'polyunsaturatedFat') return value >= 1;
  if (key === 'calories' || key === 'sodium') return value > 0;
  return value > 0.05;
};

const metricDigits = (key: NutritionKey) => (key === 'calories' || key === 'sodium' ? 0 : 1);

const getPercentDailyValue = (key: NutritionKey, value: number) => {
  const daily = NUTRITION_REFERENCE_TABLE[key].daily;

  if (daily == null || daily <= 0) return null;

  return roundValue((value / daily) * 100, 1);
};

export const getNutritionMetricAnalyses = (
  nutrition: NutritionSnapshot,
  servings: number,
): NutritionMetricAnalysis[] =>
  NUTRITION_METRIC_DEFINITIONS.map((definition) => {
    const total = roundValue(nutrition[definition.key], metricDigits(definition.key));
    const perServing = roundValue(
      total / (servings > 0 ? servings : 1),
      metricDigits(definition.key),
    );
    const tone = classifyNutritionMetric(definition.key, total, nutrition);

    return {
      key: definition.key,
      label: definition.label,
      unit: definition.unit,
      kind: definition.kind,
      tone,
      total,
      perServing,
      percentDailyValue: getPercentDailyValue(definition.key, total),
      reference: NUTRITION_REFERENCE_TABLE[definition.key],
      note: describeMetricTone(definition.key, tone, nutrition),
    };
  });

const getVariantNutritionValue = (variant: PlateNutritionVariantLike, key: NutritionKey) =>
  variant.overrideNutrition[key] ?? variant.ingredient.nutrition[key];

const getEffectiveQuantityGrams = (
  variant: PlateNutritionVariantLike,
  requestedQuantityGrams: number,
) => {
  const safeYield = variant.yieldFactor > 0 ? variant.yieldFactor : 1;
  return requestedQuantityGrams * safeYield;
};

const getComponentNutrition = (
  variant: PlateNutritionVariantLike,
  quantityGrams: number,
): NutritionSnapshot => {
  const basis =
    variant.ingredient.nutritionBasisGrams > 0 ? variant.ingredient.nutritionBasisGrams : 100;
  const scaled = createEmptyNutrition();

  for (const key of NUTRITION_KEYS) {
    scaled[key] = (getVariantNutritionValue(variant, key) * quantityGrams) / basis;
  }

  return scaled;
};

const refreshComponentQuantity = (component: ResolvedPlateComponent) => {
  component.quantityGrams = getEffectiveQuantityGrams(
    component.variant,
    component.requestedQuantityGrams,
  );
};

const createComponentFromRecipeItem = (
  item: PlateNutritionRecipeItemLike,
): ResolvedPlateComponent => {
  const component: ResolvedPlateComponent = {
    id: item.id,
    baseRecipeItemId: item.id,
    source: 'recipe',
    sortOrder: item.sortOrder,
    requestedQuantityGrams: item.quantityGrams,
    quantityGrams: 0,
    isOptional: item.isOptional,
    isMainComponent: item.isMainComponent,
    variant: item.variant,
    notes: dedupeStrings([
      item.prepNotes,
      item.variant.preparationNotes,
      item.variant.description,
      item.variant.ingredient.notes,
    ]),
  };

  refreshComponentQuantity(component);
  return component;
};

const createComponentFromAdjustment = (
  adjustment: PlateNutritionAdjustmentLike,
  source: ResolvedPlateComponent['source'],
): ResolvedPlateComponent | null => {
  if (!adjustment.variant) return null;

  const component: ResolvedPlateComponent = {
    id: `adjustment-${adjustment.id}`,
    baseRecipeItemId: adjustment.recipeItemId,
    source,
    sortOrder: adjustment.sortOrder + 1000,
    requestedQuantityGrams: adjustment.quantityGrams ?? adjustment.variant.portionGrams,
    quantityGrams: 0,
    isOptional: false,
    isMainComponent: false,
    variant: adjustment.variant,
    notes: dedupeStrings([
      adjustment.notes,
      adjustment.variant.preparationNotes,
      adjustment.variant.description,
      adjustment.variant.ingredient.notes,
    ]),
  };

  refreshComponentQuantity(component);
  return component;
};

export const resolvePlateComponents = (
  plate: PlateNutritionPlateLike,
): ResolvedPlateComponent[] => {
  const components = plate.recipe.items.map(createComponentFromRecipeItem);
  const componentMap = new Map(
    components.map((component) => [component.baseRecipeItemId ?? component.id, component]),
  );

  for (const adjustment of plate.adjustments) {
    if (adjustment.adjustmentType === 'ADDITION') {
      const addition = createComponentFromAdjustment(adjustment, 'addition');

      if (addition) {
        components.push(addition);
      }

      continue;
    }

    if (!adjustment.recipeItemId) {
      if (adjustment.adjustmentType === 'SUBSTITUTION') {
        const substitution = createComponentFromAdjustment(adjustment, 'substitution');

        if (substitution) {
          components.push(substitution);
        }
      }

      continue;
    }

    const target = componentMap.get(adjustment.recipeItemId);

    if (!target) {
      if (adjustment.adjustmentType === 'SUBSTITUTION') {
        const substitution = createComponentFromAdjustment(adjustment, 'substitution');

        if (substitution) {
          components.push(substitution);
        }
      }

      continue;
    }

    if (adjustment.adjustmentType === 'REMOVAL') {
      const quantityToRemove = adjustment.quantityGrams ?? target.requestedQuantityGrams;

      target.requestedQuantityGrams = Math.max(0, target.requestedQuantityGrams - quantityToRemove);
      target.notes = dedupeStrings([
        ...target.notes,
        adjustment.notes,
        'Se ajusto la cantidad final.',
      ]);
      refreshComponentQuantity(target);
      continue;
    }

    if (adjustment.adjustmentType === 'SUBSTITUTION' && adjustment.variant) {
      target.variant = adjustment.variant;
      target.source = 'substitution';
      target.requestedQuantityGrams = adjustment.quantityGrams ?? target.requestedQuantityGrams;
      target.notes = dedupeStrings([
        ...target.notes,
        adjustment.notes,
        adjustment.variant.preparationNotes,
        adjustment.variant.description,
        `Sustituido por ${adjustment.variant.name}.`,
      ]);
      refreshComponentQuantity(target);
    }
  }

  return components
    .filter((component) => component.quantityGrams > 0.05)
    .sort((left, right) => left.sortOrder - right.sortOrder);
};

export const getNutritionToneLabel = (tone: NutritionTone) =>
  tone === 'danger'
    ? 'Exceso'
    : tone === 'caution'
      ? 'A mejorar'
      : tone === 'benefit'
        ? 'Algo bueno'
        : 'Normal';

const getToneScore = (metric: NutritionMetricAnalysis) => {
  if (metric.tone === 'benefit') {
    return metric.kind === 'positive' ? 2 : 1;
  }

  if (metric.tone === 'balanced') {
    return metric.kind === 'positive' ? 1 : 0;
  }

  if (metric.tone === 'caution') {
    return metric.kind === 'avoid' || metric.key === 'sodium' || metric.key === 'saturatedFat'
      ? -2
      : -1;
  }

  return metric.kind === 'avoid' || metric.key === 'sodium' || metric.key === 'saturatedFat'
    ? -4
    : -3;
};

export const summarizeNutritionTone = (metrics: NutritionMetricAnalysis[]): NutritionTone => {
  const visibleMetrics = metrics.filter((metric) =>
    shouldShowNutritionMetric(metric.key, metric.total),
  );
  const score = visibleMetrics.reduce((total, metric) => total + getToneScore(metric), 0);
  const dangerCount = visibleMetrics.filter((metric) => metric.tone === 'danger').length;
  const benefitCount = visibleMetrics.filter((metric) => metric.tone === 'benefit').length;

  if (dangerCount >= 2 && score <= -8) return 'danger';
  if (score <= -2) return 'caution';
  if (benefitCount >= 1 && score >= 2) return 'benefit';
  return 'balanced';
};

export const analyzePlateNutrition = (plate: PlateNutritionPlateLike): PlateNutritionAnalysis => {
  const servings = Math.max(1, plate.recipe.yieldServings || 1);
  const components = resolvePlateComponents(plate);
  const groupedIngredients = new Map<string, PlateIngredientBreakdown>();
  let totalNutrition = createEmptyNutrition();

  for (const component of components) {
    const ingredient = component.variant.ingredient;
    const componentNutrition = getComponentNutrition(component.variant, component.quantityGrams);

    totalNutrition = addNutrition(totalNutrition, componentNutrition);

    const existing = groupedIngredients.get(ingredient.id);

    if (!existing) {
      groupedIngredients.set(ingredient.id, {
        id: ingredient.id,
        name: ingredient.name,
        description: ingredient.description ?? null,
        category: ingredient.category,
        quantityGrams: component.quantityGrams,
        tone: 'balanced',
        variants: dedupeStrings([component.variant.name]),
        preparations: dedupeStrings([component.variant.preparationMethod]),
        notes: component.notes,
        allergens: ingredient.allergens,
        dietaryTags: ingredient.dietaryTags,
        nutritionTags: ingredient.nutritionTags,
        totalNutrition: componentNutrition,
        perServingNutrition: divideNutrition(componentNutrition, servings),
        metrics: [],
      });

      continue;
    }

    existing.quantityGrams += component.quantityGrams;
    existing.variants = dedupeStrings([...existing.variants, component.variant.name]);
    existing.preparations = dedupeStrings([
      ...existing.preparations,
      component.variant.preparationMethod,
    ]);
    existing.notes = dedupeStrings([...existing.notes, ...component.notes]);
    existing.totalNutrition = addNutrition(existing.totalNutrition, componentNutrition);
    existing.perServingNutrition = divideNutrition(existing.totalNutrition, servings);
  }

  const ingredients = Array.from(groupedIngredients.values())
    .map((ingredient) => {
      const metrics = getNutritionMetricAnalyses(ingredient.totalNutrition, servings).filter(
        (metric) => shouldShowNutritionMetric(metric.key, metric.total),
      );

      return {
        ...ingredient,
        quantityGrams: roundValue(ingredient.quantityGrams, 1),
        tone: summarizeNutritionTone(metrics),
        metrics,
      };
    })
    .sort((left, right) => right.quantityGrams - left.quantityGrams);

  const totalPerServingNutrition = divideNutrition(totalNutrition, servings);
  const totalMetrics = getNutritionMetricAnalyses(totalNutrition, servings).filter((metric) =>
    shouldShowNutritionMetric(metric.key, metric.total),
  );

  return {
    servings,
    components,
    ingredients,
    totalNutrition,
    totalPerServingNutrition,
    totalMetrics,
  };
};
