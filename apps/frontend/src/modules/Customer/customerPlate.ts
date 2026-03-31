import { GetPlatesContract } from '@app/contracts';
import type { InferSuccess } from '@app/sdk';

export type CustomerPlate = InferSuccess<typeof GetPlatesContract>[number];

export const formatCustomerEnum = (value: string | null | undefined) => {
  if (!value) return 'No especificado';

  if (value === 'REGULAR') return 'Medium';

  return value
    .toLowerCase()
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

export const formatCustomerPrice = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);

export const formatCustomerMetric = (value: number | null | undefined, unit = '', digits = 0) => {
  if (value == null) return 'No informado';

  const rendered =
    digits > 0 ? value.toFixed(digits) : Number.isInteger(value) ? String(value) : value.toFixed(1);

  return unit ? `${rendered} ${unit}` : rendered;
};

export const getCustomerPlateSearchText = (plate: CustomerPlate) =>
  [
    plate.name,
    plate.description,
    plate.recipe.name,
    plate.recipe.description,
    plate.recipe.items.map((item) => item.variant.ingredient.name).join(' '),
    plate.tags.map((tag) => tag.name).join(' '),
    plate.dietaryTags.join(' '),
    plate.nutritionTags.join(' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
