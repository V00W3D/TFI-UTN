/**
 * @file customerPlate.ts
 * @module Customer
 * @description Archivo customerPlate alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: datos del modulo y dependencias compartidas
 * outputs: comportamiento o estructuras del modulo
 * rules: respetar contratos, seguridad y trazabilidad definidas en context.md
 *
 * @technical
 * dependencies: dependencias locales del archivo
 * flow: inicializa, transforma y expone la logica del modulo
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
 * decisions: bloque agregado para cumplir el formato obligatorio de context.md
 */
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
