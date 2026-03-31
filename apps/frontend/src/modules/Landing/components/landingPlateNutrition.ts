import { GetPlatesContract } from '@app/contracts';
import {
  NUTRITION_METRIC_DEFINITIONS,
  NUTRITION_REFERENCE_TABLE,
  analyzePlateNutrition,
  hasStructuredReferenceTarget,
  type NutritionMetricAnalysis as SharedNutritionMetricAnalysis,
  type NutritionSnapshot,
  type NutritionTone,
} from '@app/sdk';
import type { InferSuccess } from '@app/sdk';
import {
  getIngredientIconKey,
  type PlateDataIconKey,
} from '../../../components/shared/PlateDataIcons';

export type LandingPlate = InferSuccess<typeof GetPlatesContract>[number];
export type { NutritionSnapshot, NutritionTone };

type NutritionKey = keyof NutritionSnapshot;

export interface NutritionMetricCard {
  key: NutritionKey;
  label: string;
  icon: PlateDataIconKey;
  tone: NutritionTone;
  toneLabel: string;
  total: number;
  perPortion: number;
  percentDailyValue: number | null;
  totalValue: string;
  perPortionValue: string;
  dailyValueLabel: string;
  note: string;
}

export interface PlateIngredientBreakdown {
  id: string;
  name: string;
  description: string | null;
  quantityGrams: number;
  tone: NutritionTone;
  toneLabel: string;
  icon: PlateDataIconKey;
  categoryLabel: string;
  variants: string[];
  preparations: string[];
  notes: string[];
  allergens: string[];
  dietaryTags: string[];
  nutritionTags: string[];
  totalNutrition: NutritionSnapshot;
  perPortionNutrition: NutritionSnapshot;
  metrics: NutritionMetricCard[];
}

export interface NutritionReferenceRow {
  key: NutritionKey;
  label: string;
  icon: PlateDataIconKey;
  tone: NutritionTone;
  toneLabel: string;
  unit: string;
  daily: string;
  weekly: string;
  monthly: string;
  yearly: string;
  sourceLabel: string;
  note: string;
}

export interface PlateNutritionAnalysis {
  servings: number;
  components: ReturnType<typeof analyzePlateNutrition>['components'];
  ingredients: PlateIngredientBreakdown[];
  totalNutrition: NutritionSnapshot;
  totalPerPortionNutrition: NutritionSnapshot;
  totalMetrics: NutritionMetricCard[];
  referenceRows: NutritionReferenceRow[];
  qualitativeReferenceNotes: string[];
  marketingHeadline: string;
  marketingSummary: string;
}

export interface PlateRecipeIngredient {
  id: string;
  name: string;
  icon: PlateDataIconKey;
  categoryLabel: string;
  quantityGrams: number;
  variants: string[];
  preparations: string[];
  note: string | null;
  isMainComponent: boolean;
}

export interface PlateRecipeStep {
  id: string;
  title: string;
  body: string;
  note: string | null;
}

export interface PlateRecipeGuide {
  servings: number;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  summary: string;
  ingredients: PlateRecipeIngredient[];
  steps: PlateRecipeStep[];
}

const SIZE_LABELS: Record<string, string> = {
  REGULAR: 'Medium',
};

const metricIconMap: Record<NutritionKey, PlateDataIconKey> = {
  calories: 'calories',
  proteins: 'protein',
  carbs: 'carbs',
  fats: 'fat',
  fiber: 'fiber',
  sugars: 'sugar',
  sodium: 'sodium',
  saturatedFat: 'fatSaturated',
  transFat: 'fatTrans',
  monounsaturatedFat: 'fatMonounsaturated',
  polyunsaturatedFat: 'fatPolyunsaturated',
};

const formatMetricNumber = (value: number | null | undefined, digits = 0) => {
  if (value == null) return 'No informado';

  return digits > 0 ? value.toFixed(digits) : Number.isInteger(value) ? String(value) : value.toFixed(1);
};

const formatReferenceValue = (value: number | null, unit: string) => {
  if (value == null) return 'Sin DV oficial';

  const digits = unit === 'mg' || unit === 'kcal' ? 0 : value === 0 ? 0 : 1;
  return `${formatMetricNumber(value, digits)} ${unit}`;
};

const getIngredientToneLabel = (tone: NutritionTone) =>
  tone === 'danger'
    ? 'Carga alta'
    : tone === 'caution'
      ? 'A vigilar'
      : tone === 'benefit'
        ? 'Aporta'
        : 'Acompana';

const getLandingToneLabel = (tone: NutritionTone) =>
  tone === 'danger'
    ? 'Carga marcada'
    : tone === 'caution'
      ? 'Para mirar'
      : tone === 'benefit'
        ? 'Suma valor'
        : 'En rango';

const joinHumanList = (items: string[]) => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} y ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
};

const getMetricTonePriority = (metric: SharedNutritionMetricAnalysis) => {
  switch (metric.tone) {
    case 'benefit':
      return 0;
    case 'danger':
      return 1;
    case 'caution':
      return 2;
    case 'balanced':
    default:
      return 3;
  }
};

const getMetricOrderIndex = (key: NutritionKey) =>
  NUTRITION_METRIC_DEFINITIONS.findIndex((definition) => definition.key === key);

const mapMetricCard = (metric: SharedNutritionMetricAnalysis): NutritionMetricCard => ({
  key: metric.key,
  label: metric.label,
  icon: metricIconMap[metric.key],
  tone: metric.tone,
  toneLabel: getLandingToneLabel(metric.tone),
  total: metric.total,
  perPortion: metric.perServing,
  percentDailyValue: metric.percentDailyValue,
  totalValue: formatLandingMetric(metric.total, metric.unit, metric.unit === 'mg' || metric.unit === 'kcal' ? 0 : 1),
  perPortionValue: formatLandingMetric(
    metric.perServing,
    metric.unit,
    metric.unit === 'mg' || metric.unit === 'kcal' ? 0 : 1,
  ),
  dailyValueLabel:
    metric.percentDailyValue == null ? metric.reference.note : `${metric.percentDailyValue}% del valor diario`,
  note: metric.note,
});

const getMarketingNarrative = (metrics: SharedNutritionMetricAnalysis[]) => {
  const benefits = metrics.filter((metric) => metric.tone === 'benefit');
  const limits = metrics.filter((metric) => metric.tone === 'danger' || metric.tone === 'caution');
  const leadBenefit = benefits[0];
  const leadLimit = limits[0];

  if (leadLimit?.tone === 'danger') {
    return {
      marketingHeadline: leadBenefit
        ? `Plato contundente con buen aporte de ${leadBenefit.label.toLowerCase()}`
        : 'Plato abundante para darte el gusto',
      marketingSummary: leadBenefit
        ? `Es una orden con mucha presencia en ${leadLimit.label.toLowerCase()}, pero tambien suma ${leadBenefit.label.toLowerCase()} de forma clara.`
        : `Es una comida potente y rendidora; la carga principal aparece en ${leadLimit.label.toLowerCase()}.`,
    };
  }

  if (leadBenefit) {
    return {
      marketingHeadline: `Plato con buen aporte de ${leadBenefit.label.toLowerCase()}`,
      marketingSummary: leadLimit
        ? `Aporta ${leadBenefit.label.toLowerCase()} y deja visible ${leadLimit.label.toLowerCase()} sin quitarle lo apetitoso al plato.`
        : `Tiene una lectura bastante amable y suma ${leadBenefit.label.toLowerCase()} de forma clara.`,
    };
  }

  return {
    marketingHeadline: 'Plato sabroso y directo',
    marketingSummary: leadLimit
      ? `La carga principal aparece en ${leadLimit.label.toLowerCase()}, dentro de una lectura simple del plato.`
      : 'La lectura general del plato se mantiene en una zona normal.',
  };
};

export const selectFeaturedMetrics = <TMetric extends { key: NutritionKey; tone: NutritionTone }>(
  metrics: TMetric[],
  limit: number,
) => {
  const picked: TMetric[] = [];
  const seen = new Set<NutritionKey>();
  const benefits = metrics.filter((metric) => metric.tone === 'benefit');
  const risks = metrics.filter((metric) => metric.tone === 'danger' || metric.tone === 'caution');
  const balanced = metrics.filter((metric) => metric.tone === 'balanced');
  const priority = [...benefits, ...risks, ...balanced];

  const pushMetric = (metric: TMetric | undefined) => {
    if (!metric || seen.has(metric.key) || picked.length >= limit) return;
    seen.add(metric.key);
    picked.push(metric);
  };

  pushMetric(benefits[0]);
  pushMetric(risks[0]);
  pushMetric(benefits[1] ?? balanced[0]);
  pushMetric(risks[1] ?? balanced[1]);

  for (const metric of priority) {
    pushMetric(metric);
  }

  return picked.slice(0, limit);
};

const selectIngredientMetrics = (metrics: NutritionMetricCard[]) => selectFeaturedMetrics(metrics, 4);

export const getPlateIngredientAnalysis = (plate: LandingPlate): PlateNutritionAnalysis => {
  const sharedAnalysis = analyzePlateNutrition(plate);
  const orderedMetrics = [...sharedAnalysis.totalMetrics].sort((left, right) => {
    const toneDelta = getMetricTonePriority(left) - getMetricTonePriority(right);

    if (toneDelta !== 0) return toneDelta;

    return getMetricOrderIndex(left.key) - getMetricOrderIndex(right.key);
  });

  const { marketingHeadline, marketingSummary } = getMarketingNarrative(orderedMetrics);

  return {
    servings: sharedAnalysis.servings,
    components: sharedAnalysis.components,
    ingredients: sharedAnalysis.ingredients.map((ingredient) => {
      const mappedMetrics = ingredient.metrics.map(mapMetricCard);

      return {
        id: ingredient.id,
        name: ingredient.name,
        description: ingredient.description,
        quantityGrams: ingredient.quantityGrams,
        tone: ingredient.tone,
        toneLabel: getIngredientToneLabel(ingredient.tone),
        icon: getIngredientIconKey(ingredient.name, ingredient.category),
        categoryLabel: formatLandingEnum(ingredient.category),
        variants: ingredient.variants,
        preparations: ingredient.preparations.map((value) => formatLandingEnum(value)),
        notes: ingredient.notes,
        allergens: ingredient.allergens,
        dietaryTags: ingredient.dietaryTags,
        nutritionTags: ingredient.nutritionTags,
        totalNutrition: ingredient.totalNutrition,
        perPortionNutrition: ingredient.perServingNutrition,
        metrics: selectIngredientMetrics(mappedMetrics),
      };
    }),
    totalNutrition: sharedAnalysis.totalNutrition,
    totalPerPortionNutrition: sharedAnalysis.totalPerServingNutrition,
    totalMetrics: orderedMetrics.map(mapMetricCard),
    referenceRows: NUTRITION_METRIC_DEFINITIONS.filter((definition) =>
      hasStructuredReferenceTarget(definition.key),
    ).map((definition) => {
      const matchingMetric = orderedMetrics.find((metric) => metric.key === definition.key);
      const reference = NUTRITION_REFERENCE_TABLE[definition.key];
      const fallbackTone: NutritionTone = definition.key === 'transFat' ? 'benefit' : 'balanced';

      return {
        key: definition.key,
        label: definition.label,
        icon: metricIconMap[definition.key],
        tone: matchingMetric?.tone ?? fallbackTone,
        toneLabel: getLandingToneLabel(matchingMetric?.tone ?? fallbackTone),
        unit: definition.unit,
        daily: formatReferenceValue(reference.daily, definition.unit),
        weekly: formatReferenceValue(reference.weekly, definition.unit),
        monthly: formatReferenceValue(reference.monthly, definition.unit),
        yearly: formatReferenceValue(reference.yearly, definition.unit),
        sourceLabel: reference.sourceLabel,
        note: reference.note,
      };
    }),
    qualitativeReferenceNotes: [
      'Mono y poliinsaturadas no figuran en la tabla porque FDA no publica un valor diario oficial para ellas.',
      'En el plato se leen como parte del perfil graso: cuanto mas desplacen saturadas y trans, mejor se interpreta esa grasa.',
    ],
    marketingHeadline,
    marketingSummary,
  };
};

export const getPlateRecipeGuide = (plate: LandingPlate): PlateRecipeGuide => {
  const sharedAnalysis = analyzePlateNutrition(plate);
  const mainIngredientIds = new Set(
    sharedAnalysis.components
      .filter((component) => component.isMainComponent)
      .map((component) => component.variant.ingredient.id),
  );
  const ingredientLines = sharedAnalysis.ingredients
    .map((ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
      icon: getIngredientIconKey(ingredient.name, ingredient.category),
      categoryLabel: formatLandingEnum(ingredient.category),
      quantityGrams: ingredient.quantityGrams,
      variants: ingredient.variants,
      preparations: ingredient.preparations.map((value) => formatLandingEnum(value)),
      note: ingredient.notes[0] ?? ingredient.description ?? null,
      isMainComponent: mainIngredientIds.has(ingredient.id),
    }))
    .sort((left, right) => Number(right.isMainComponent) - Number(left.isMainComponent));

  const mainComponents = sharedAnalysis.components.filter((component) => component.isMainComponent);
  const supportComponents = sharedAnalysis.components.filter((component) => !component.isMainComponent);
  const steps: PlateRecipeStep[] = [];
  const ingredientSummary = joinHumanList(
    ingredientLines.slice(0, 5).map((ingredient) => ingredient.name.toLowerCase()),
  );

  steps.push({
    id: 'mise-en-place',
    title: 'Mise en place',
    body: ingredientSummary
      ? `Pesá y dejá listos ${ingredientSummary} para ${sharedAnalysis.servings} porcion${sharedAnalysis.servings === 1 ? '' : 'es'}.`
      : 'Dejá listos los ingredientes finales antes de arrancar.',
    note:
      plate.recipe.prepTimeMinutes != null
        ? `Tiempo de prep estimado: ${plate.recipe.prepTimeMinutes} min.`
        : null,
  });

  for (const component of mainComponents) {
    steps.push({
      id: `main-${component.id}`,
      title: `Trabajar ${component.variant.ingredient.name}`,
      body: `${component.notes[0] ?? `Prepará ${component.variant.name.toLowerCase()}`}. Usá ${formatLandingMetric(component.quantityGrams, 'g', 0)} de ${component.variant.name.toLowerCase()}.`,
      note: component.notes.slice(1, 3).join(' · ') || null,
    });
  }

  if (supportComponents.length > 0) {
    steps.push({
      id: 'assembly',
      title: 'Armar y completar',
      body: `Sumá ${joinHumanList(
        supportComponents.map(
          (component) =>
            `${formatLandingMetric(component.quantityGrams, 'g', 0)} de ${component.variant.name.toLowerCase()}`,
        ),
      )}.`,
      note:
        joinHumanList(
          supportComponents
            .map((component) => component.notes[0])
            .filter((value): value is string => Boolean(value))
            .slice(0, 3),
        ) || null,
    });
  }

  steps.push({
    id: 'serve',
    title: 'Terminar y servir',
    body:
      plate.recipe.assemblyNotes ||
      'Terminá el plato apenas sale y servilo manteniendo su forma y temperatura.',
    note:
      plate.recipe.cookTimeMinutes != null
        ? `Tiempo de coccion estimado: ${plate.recipe.cookTimeMinutes} min.`
        : null,
  });

  return {
    servings: sharedAnalysis.servings,
    prepTimeMinutes: plate.recipe.prepTimeMinutes,
    cookTimeMinutes: plate.recipe.cookTimeMinutes,
    summary:
      plate.recipe.description ||
      plate.description ||
      'Version de cocina abierta para que veas como se arma este plato.',
    ingredients: ingredientLines,
    steps,
  };
};

export const formatLandingEnum = (value: string | null | undefined) => {
  if (!value) return 'No especificado';

  if (SIZE_LABELS[value]) return SIZE_LABELS[value];

  return value
    .toLowerCase()
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

export const formatLandingPrice = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);

export const formatLandingMetric = (value: number | null | undefined, unit = '', digits = 0) => {
  if (value == null) return 'No informado';

  const rendered = formatMetricNumber(value, digits);
  return unit ? `${rendered} ${unit}` : rendered;
};

export const getPreviewIngredients = (plate: LandingPlate, limit = 4) => {
  const analysis = analyzePlateNutrition(plate);
  const preview = analysis.ingredients
    .slice(0, limit)
    .map((ingredient) => ingredient.name)
    .join(', ');

  if (!preview) {
    const recipePreview = plate.recipe.items
      .slice(0, limit)
      .map((item) => item.variant.ingredient.name)
      .join(', ');

    if (!recipePreview) return 'Sin componentes declarados en la receta base.';

    return `Incluye ${recipePreview}${plate.recipe.items.length > limit ? ' y mas.' : '.'}`;
  }

  return `Incluye ${preview}${analysis.ingredients.length > limit ? ' y mas.' : '.'}`;
};
