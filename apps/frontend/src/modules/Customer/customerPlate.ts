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
 * inputs: payloads customer del catalogo y helpers de presentacion del modulo
 * outputs: tipos, formateadores y mapeos reutilizados por la experiencia customer
 * rules: mantener una traduccion consistente entre contratos y UI del modulo
 *
 * @technical
 * dependencies: @app/contracts, @app/sdk
 * flow: recibe estructuras del catalogo customer; define tipos y helpers de presentacion; exporta mapeos reutilizados por listas y detalles del modulo.
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
 * decisions: los helpers del dominio customer se centralizan en un archivo utilitario del modulo
 */
import { GetPlatesContract } from '@app/contracts';
import type { InferSuccess } from '@app/sdk';
import { formatEnumLabel } from '@/shared/utils/enumLabels';

export type CustomerPlate = InferSuccess<typeof GetPlatesContract>[number];

export const formatCustomerEnum = (value: string | null | undefined) => {
  return formatEnumLabel(value);
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
