import { GetPlatesContract } from '@app/contracts';
import type { InferSuccess } from '@app/sdk';

export type Plate = InferSuccess<typeof GetPlatesContract>[number];
export type PlateLayout = 'grid' | 'carousel' | 'one-row' | 'group';
export type PlateCardEmphasis = 'regular' | 'featured' | 'compact';
export type PlateDetailSection =
  | 'guide'
  | 'nutrition'
  | 'recipe'
  | 'components'
  | 'reviews';
export type InsightTone = 'benefit' | 'balanced' | 'caution' | 'danger';

export interface PlateSectionMeta {
  id: PlateDetailSection;
  label: string;
  shortLabel: string;
  description: string;
}

export interface InsightBadge {
  label: string;
  tone: InsightTone;
}

export interface NutritionInsight {
  key: string;
  label: string;
  value: string;
  tone: InsightTone;
  headline: string;
  detail: string;
}

export interface NutritionMetricCard {
  key: string;
  label: string;
  value: string;
  tone: InsightTone;
  detail: string;
}

const DAILY_VALUES = {
  calories: 2000,
  proteins: 50,
  carbs: 275,
  fats: 78,
  fiber: 28,
  sugars: 50,
  sodium: 2300,
  saturatedFat: 20,
} as const;

const TRANS_FAT_REFERENCE_GRAMS = 2.2;

export const plateDetailSections: PlateSectionMeta[] = [
  {
    id: 'guide',
    label: 'Guía del plato',
    shortLabel: 'Guía',
    description: 'Lectura rápida para entender el plato sin entrar en demasiado detalle.',
  },
  {
    id: 'nutrition',
    label: 'Nutrición',
    shortLabel: 'Nutrición',
    description: 'Métricas clave y señales visuales para leer el impacto nutricional de la porción.',
  },
  {
    id: 'recipe',
    label: 'Receta',
    shortLabel: 'Receta',
    description: 'Tipo, sabor, dificultad y armado base del plato.',
  },
  {
    id: 'components',
    label: 'Componentes y ajustes',
    shortLabel: 'Componentes',
    description: 'Ingredientes, variantes y ajustes específicos del plato final.',
  },
  {
    id: 'reviews',
    label: 'Reseñas',
    shortLabel: 'Reseñas',
    description: 'Opiniones reales de otros comensales.',
  },
];

const toPercentage = (value: number, total: number) => (total > 0 ? value / total : 0);

const isLimitedNutrientLow = (ratio: number) => ratio <= 0.05;
const isLimitedNutrientHigh = (ratio: number) => ratio >= 0.2;

export const formatEnum = (value: string | null | undefined) => {
  if (!value) return 'No especificado';
  return value
    .toLowerCase()
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

export const formatMetric = (value: number | null | undefined, unit = '', digits = 0) => {
  if (value == null) return 'No informado';
  const rendered =
    digits > 0 ? value.toFixed(digits) : Number.isInteger(value) ? String(value) : value.toFixed(1);
  return unit ? `${rendered} ${unit}` : rendered;
};

export const getInsightToneClass = (tone: InsightTone) => `insight-tone-${tone}`;

export const getPreviewIngredients = (plate: Plate, limit = 3) => {
  const preview = plate.recipe.items
    .slice(0, limit)
    .map((item) => item.variant.ingredient.name)
    .join(', ');

  if (!preview) return 'Sin componentes declarados en la receta base.';

  return `Incluye ${preview}${plate.recipe.items.length > limit ? ' y más.' : '.'}`;
};

const getUnsaturatedFat = (plate: Plate) =>
  plate.nutrition.monounsaturatedFat + plate.nutrition.polyunsaturatedFat;

const getUnsaturatedShare = (plate: Plate) =>
  plate.nutrition.fats > 0 ? getUnsaturatedFat(plate) / plate.nutrition.fats : 0;

const getPortionTone = (plate: Plate): InsightTone => {
  const weight = plate.servedWeightGrams ?? 0;
  const calories = plate.nutrition.calories;

  if (weight >= 520 || calories >= 900) return 'caution';
  if (weight >= 360 || calories >= 550) return 'balanced';
  return 'benefit';
};

export const getPortionGuideLabel = (plate: Plate) => {
  const weight = plate.servedWeightGrams ?? 0;
  const calories = plate.nutrition.calories;

  if (weight >= 520 || calories >= 900) return 'Porción abundante';
  if (weight >= 360 || calories >= 550) return 'Porción equilibrada';
  return 'Porción ligera';
};

const getProteinTone = (proteins: number): InsightTone => {
  const ratio = toPercentage(proteins, DAILY_VALUES.proteins);

  if (ratio >= 0.4) return 'benefit';
  if (ratio >= 0.2) return 'balanced';
  if (ratio >= 0.1) return 'caution';
  return 'danger';
};

const getFiberTone = (fiber: number): InsightTone => {
  const ratio = toPercentage(fiber, DAILY_VALUES.fiber);

  if (ratio >= 0.2) return 'benefit';
  if (ratio >= 0.1) return 'balanced';
  if (ratio >= 0.05) return 'caution';
  return 'danger';
};

const getSodiumTone = (sodium: number): InsightTone => {
  const ratio = toPercentage(sodium, DAILY_VALUES.sodium);

  if (ratio <= 0.05) return 'benefit';
  if (ratio <= 0.2) return 'balanced';
  if (ratio <= 0.35) return 'caution';
  return 'danger';
};

const getSaturatedFatTone = (saturatedFat: number): InsightTone => {
  const ratio = toPercentage(saturatedFat, DAILY_VALUES.saturatedFat);

  if (ratio <= 0.05) return 'benefit';
  if (ratio <= 0.2) return 'balanced';
  if (ratio <= 0.35) return 'caution';
  return 'danger';
};

const getTransFatTone = (transFat: number): InsightTone => {
  if (transFat <= 0.1) return 'benefit';
  if (transFat <= 0.5) return 'balanced';
  if (transFat <= 1) return 'caution';
  return 'danger';
};

const getCaloriesTone = (calories: number): InsightTone => {
  const ratio = toPercentage(calories, DAILY_VALUES.calories);

  if (ratio <= 0.16) return 'benefit';
  if (ratio <= 0.35) return 'balanced';
  if (ratio <= 0.45) return 'caution';
  return 'danger';
};

const getCarbsTone = (carbs: number): InsightTone => {
  const ratio = toPercentage(carbs, DAILY_VALUES.carbs);

  if (ratio <= 0.08) return 'benefit';
  if (ratio <= 0.2) return 'balanced';
  if (ratio <= 0.3) return 'caution';
  return 'danger';
};

const getSugarsTone = (sugars: number): InsightTone => {
  if (sugars <= 8) return 'benefit';
  if (sugars <= 18) return 'balanced';
  if (sugars <= 28) return 'caution';
  return 'danger';
};

const getFatProfileTone = (plate: Plate): InsightTone => {
  const unsaturatedShare = getUnsaturatedShare(plate);
  const saturatedShare =
    plate.nutrition.fats > 0 ? plate.nutrition.saturatedFat / plate.nutrition.fats : 0;

  if (
    unsaturatedShare >= 0.58 &&
    plate.nutrition.transFat <= 0.1 &&
    saturatedShare <= 0.3
  ) {
    return 'benefit';
  }

  if (
    unsaturatedShare >= 0.4 &&
    plate.nutrition.transFat <= 0.5 &&
    saturatedShare <= 0.45
  ) {
    return 'balanced';
  }

  if (plate.nutrition.transFat <= 1 && saturatedShare <= 0.55) {
    return 'caution';
  }

  return 'danger';
};

const buildProteinInsight = (plate: Plate): NutritionInsight => {
  const tone = getProteinTone(plate.nutrition.proteins);

  return {
    key: 'proteins',
    label: 'Proteínas',
    value: formatMetric(plate.nutrition.proteins, 'g', 1),
    tone,
    headline:
      tone === 'benefit'
        ? 'Proteína protagonista'
        : tone === 'balanced'
          ? 'Buen soporte proteico'
          : tone === 'caution'
            ? 'Proteína moderada'
            : 'Proteína baja para un plato principal',
    detail:
      tone === 'benefit'
        ? 'Aporta una carga proteica muy sólida para la porción servida.'
        : tone === 'balanced'
          ? 'Tiene una base proteica interesante sin dominar por completo el plato.'
          : tone === 'caution'
            ? 'Puede necesitar un acompañamiento proteico si se busca más saciedad.'
            : 'Funciona más por sabor o ligereza que por aporte proteico.',
  };
};

const buildFiberInsight = (plate: Plate): NutritionInsight => {
  const tone = getFiberTone(plate.nutrition.fiber);

  return {
    key: 'fiber',
    label: 'Fibra',
    value: formatMetric(plate.nutrition.fiber, 'g', 1),
    tone,
    headline:
      tone === 'benefit'
        ? 'Buena fibra por plato'
        : tone === 'balanced'
          ? 'Fibra presente'
          : tone === 'caution'
            ? 'Fibra discreta'
            : 'Fibra baja',
    detail:
      tone === 'benefit'
        ? 'La fibra tiene un rol real en saciedad y estructura nutricional.'
        : tone === 'balanced'
          ? 'Acompaña bien el plato, aunque no es el rasgo dominante.'
          : tone === 'caution'
            ? 'La fibra existe, pero no alcanza a ser uno de los puntos fuertes.'
            : 'La fibra no es protagonista en esta composición.',
  };
};

const buildSodiumInsight = (plate: Plate): NutritionInsight => {
  const tone = getSodiumTone(plate.nutrition.sodium);
  const ratio = Math.round(toPercentage(plate.nutrition.sodium, DAILY_VALUES.sodium) * 100);

  return {
    key: 'sodium',
    label: 'Sodio',
    value: formatMetric(plate.nutrition.sodium, 'mg', 0),
    tone,
    headline:
      tone === 'benefit'
        ? 'Sodio contenido'
        : tone === 'balanced'
          ? 'Sodio moderado'
          : tone === 'caution'
            ? 'Sodio elevado'
            : 'Sodio muy alto',
    detail:
      tone === 'benefit'
        ? 'La porción se mueve en un rango bajo de sodio.'
        : tone === 'balanced'
          ? `Aporta ${ratio}% del valor diario de referencia; es razonable para una porción.`
          : tone === 'caution'
            ? `Aporta ${ratio}% del valor diario de referencia y merece atención.`
            : `Concentra ${ratio}% del valor diario de referencia y se vuelve un dato decisivo.`,
  };
};

const buildSaturatedFatInsight = (plate: Plate): NutritionInsight => {
  const tone = getSaturatedFatTone(plate.nutrition.saturatedFat);

  return {
    key: 'saturated-fat',
    label: 'Grasas saturadas',
    value: formatMetric(plate.nutrition.saturatedFat, 'g', 1),
    tone,
    headline:
      tone === 'benefit'
        ? 'Saturadas bien controladas'
        : tone === 'balanced'
          ? 'Saturadas moderadas'
          : tone === 'caution'
            ? 'Saturadas altas'
            : 'Saturadas muy altas',
    detail:
      tone === 'benefit'
        ? 'No son el rasgo dominante del perfil graso.'
        : tone === 'balanced'
          ? 'Están presentes, pero no desequilibran el plato por sí solas.'
          : tone === 'caution'
            ? 'Empiezan a pesar en la lectura global del plato.'
            : 'Tienen un peso fuerte en la porción y merecen una señal visual clara.',
  };
};

const buildTransFatInsight = (plate: Plate): NutritionInsight => {
  const tone = getTransFatTone(plate.nutrition.transFat);
  const ratio = Math.round(
    toPercentage(plate.nutrition.transFat, TRANS_FAT_REFERENCE_GRAMS) * 100,
  );

  return {
    key: 'trans-fat',
    label: 'Grasas trans',
    value: formatMetric(plate.nutrition.transFat, 'g', 1),
    tone,
    headline:
      tone === 'benefit'
        ? 'Trans prácticamente ausentes'
        : tone === 'balanced'
          ? 'Trans muy bajas'
          : tone === 'caution'
            ? 'Trans relevantes'
            : 'Trans demasiado altas',
    detail:
      tone === 'benefit'
        ? 'No condicionan negativamente el perfil del plato.'
        : tone === 'balanced'
          ? 'Siguen bajas, pero ya vale la pena mostrarlas con atención.'
          : tone === 'caution'
            ? `La porción sola se acerca a ${ratio}% del umbral diario de referencia.`
            : `La porción sola supera una fracción muy grande del umbral diario de referencia.`,
  };
};

const buildFatProfileInsight = (plate: Plate): NutritionInsight => {
  const tone = getFatProfileTone(plate);
  const unsaturatedShare = Math.round(getUnsaturatedShare(plate) * 100);

  return {
    key: 'fat-profile',
    label: 'Perfil graso',
    value: `${unsaturatedShare}% insaturadas`,
    tone,
    headline:
      tone === 'benefit'
        ? 'Predominio de grasas insaturadas'
        : tone === 'balanced'
          ? 'Perfil graso equilibrado'
          : tone === 'caution'
            ? 'Perfil graso a vigilar'
            : 'Perfil graso pesado',
    detail:
      tone === 'benefit'
        ? 'Las mono y poliinsaturadas lideran la composición; esto evita castigar platos como uno con palta.'
        : tone === 'balanced'
          ? 'Las grasas útiles tienen buen peso, aunque no dominan por completo.'
          : tone === 'caution'
            ? 'Hay grasas insaturadas, pero saturadas/trans ganan demasiado terreno.'
            : 'Saturadas y trans toman demasiado protagonismo en la porción.',
  };
};

export const getNutritionInsights = (plate: Plate): NutritionInsight[] => [
  buildFatProfileInsight(plate),
  buildTransFatInsight(plate),
  buildSaturatedFatInsight(plate),
  buildSodiumInsight(plate),
  buildProteinInsight(plate),
  buildFiberInsight(plate),
];

export const getGuideBadges = (plate: Plate): InsightBadge[] => {
  const badges: InsightBadge[] = [
    { label: getPortionGuideLabel(plate), tone: getPortionTone(plate) },
    { label: formatEnum(plate.recipe.flavor), tone: 'balanced' },
    { label: formatEnum(plate.recipe.type), tone: 'balanced' },
  ];

  const insights = getNutritionInsights(plate);
  const leadBenefit = insights.find((insight) => insight.tone === 'benefit');
  const leadCaution = insights.find(
    (insight) => insight.tone === 'danger' || insight.tone === 'caution',
  );

  if (leadBenefit) {
    badges.push({ label: leadBenefit.headline, tone: leadBenefit.tone });
  }

  if (leadCaution && leadCaution.key !== leadBenefit?.key) {
    badges.push({ label: leadCaution.headline, tone: leadCaution.tone });
  }

  if (plate.dietaryTags[0]) {
    badges.push({ label: formatEnum(plate.dietaryTags[0]), tone: 'benefit' });
  } else if (plate.tags[0]?.name) {
    badges.push({ label: plate.tags[0].name, tone: 'balanced' });
  }

  return badges.slice(0, 4);
};

export const getCardNarrative = (plate: Plate) => {
  const lead = getNutritionInsights(plate)[0];
  const weightText = plate.servedWeightGrams
    ? `porción de ${formatMetric(plate.servedWeightGrams, 'g', 0)}`
    : 'porción definida de cocina';

  return `${formatEnum(plate.recipe.flavor)} y ${weightText}. ${lead.headline}.`;
};

export const getNutritionMetricCards = (plate: Plate): NutritionMetricCard[] => {
  const unsaturatedShare = getUnsaturatedShare(plate);

  return [
    {
      key: 'calories',
      label: 'Calorías',
      value: formatMetric(plate.nutrition.calories, 'kcal', 0),
      tone: getCaloriesTone(plate.nutrition.calories),
      detail:
        getCaloriesTone(plate.nutrition.calories) === 'benefit'
          ? 'Carga energética liviana para la porción.'
          : getCaloriesTone(plate.nutrition.calories) === 'balanced'
            ? 'Carga energética razonable para un plato principal.'
            : getCaloriesTone(plate.nutrition.calories) === 'caution'
              ? 'Es una porción contundente desde energía.'
              : 'La energía total es muy alta para una sola porción.',
    },
    {
      key: 'proteins',
      label: 'Proteínas',
      value: formatMetric(plate.nutrition.proteins, 'g', 1),
      tone: getProteinTone(plate.nutrition.proteins),
      detail: 'Lectura basada en el valor diario de referencia de proteína.',
    },
    {
      key: 'carbs',
      label: 'Carbohidratos',
      value: formatMetric(plate.nutrition.carbs, 'g', 1),
      tone: getCarbsTone(plate.nutrition.carbs),
      detail: 'Indica el peso de la carga glucídica dentro de la porción.',
    },
    {
      key: 'fats',
      label: 'Grasas totales',
      value: formatMetric(plate.nutrition.fats, 'g', 1),
      tone: getFatProfileTone(plate),
      detail:
        unsaturatedShare >= 0.5
          ? 'La grasa total viene acompañada por un perfil mayormente insaturado.'
          : 'La lectura depende mucho de cómo se reparte entre saturadas, trans y grasas nobles.',
    },
    {
      key: 'fiber',
      label: 'Fibra',
      value: formatMetric(plate.nutrition.fiber, 'g', 1),
      tone: getFiberTone(plate.nutrition.fiber),
      detail: 'La fibra empuja saciedad y equilibrio del plato.',
    },
    {
      key: 'sugars',
      label: 'Azúcares',
      value: formatMetric(plate.nutrition.sugars, 'g', 1),
      tone: getSugarsTone(plate.nutrition.sugars),
      detail: 'Se lee como azúcares totales del plato; puede incluir azúcares naturales.',
    },
    {
      key: 'sodium',
      label: 'Sodio',
      value: formatMetric(plate.nutrition.sodium, 'mg', 0),
      tone: getSodiumTone(plate.nutrition.sodium),
      detail: 'Comparado contra 2.300 mg diarios de referencia.',
    },
    {
      key: 'saturated-fat',
      label: 'Saturadas',
      value: formatMetric(plate.nutrition.saturatedFat, 'g', 1),
      tone: getSaturatedFatTone(plate.nutrition.saturatedFat),
      detail: 'Comparado contra 20 g diarios de referencia.',
    },
    {
      key: 'trans-fat',
      label: 'Trans',
      value: formatMetric(plate.nutrition.transFat, 'g', 1),
      tone: getTransFatTone(plate.nutrition.transFat),
      detail: 'La referencia visual busca mantenerlas lo más cerca posible de cero.',
    },
    {
      key: 'monounsaturated-fat',
      label: 'Monoinsaturadas',
      value: formatMetric(plate.nutrition.monounsaturatedFat, 'g', 1),
      tone:
        plate.nutrition.fats > 0 && plate.nutrition.monounsaturatedFat / plate.nutrition.fats >= 0.25
          ? 'benefit'
          : 'balanced',
      detail: 'Ayudan a entender si la grasa total tiene una composición más amigable.',
    },
    {
      key: 'polyunsaturated-fat',
      label: 'Poliinsaturadas',
      value: formatMetric(plate.nutrition.polyunsaturatedFat, 'g', 1),
      tone:
        plate.nutrition.fats > 0 && plate.nutrition.polyunsaturatedFat / plate.nutrition.fats >= 0.15
          ? 'benefit'
          : 'balanced',
      detail: 'Se evalúan junto con las monoinsaturadas para no castigar grasas nobles.',
    },
  ];
};

export const getReviewHeadline = (plate: Plate) => {
  if (plate.ratingsCount === 0) return 'Todavía no tiene reseñas públicas';
  if (plate.avgRating >= 4.5) return 'Recepción excelente';
  if (plate.avgRating >= 4) return 'Muy buena recepción';
  if (plate.avgRating >= 3.5) return 'Recepción sólida';
  return 'Todavía en evaluación del público';
};

export const hasOverrideNutrition = (
  nutrition: Plate['recipe']['items'][number]['variant']['overrideNutrition'],
) => Object.values(nutrition).some((value) => value !== null);

export const isLowDv = (value: number, dailyValue: number) =>
  isLimitedNutrientLow(toPercentage(value, dailyValue));

export const isHighDv = (value: number, dailyValue: number) =>
  isLimitedNutrientHigh(toPercentage(value, dailyValue));
