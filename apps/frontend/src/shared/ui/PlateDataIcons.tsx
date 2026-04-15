/**
 * @file PlateDataIcons.tsx
 * @module Frontend
 * @description Archivo PlateDataIcons alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: props de presentacion, estado derivado y callbacks
 * outputs: bloques de UI interactivos reutilizables
 * rules: mantener componentes composables y sin logica persistente
 *
 * @technical
 * dependencies: react
 * flow: recibe props o estado derivado; calcula etiquetas, listas o variantes visuales; renderiza la seccion interactiva; delega eventos a callbacks, stores o modales del nivel superior.
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
 * decisions: se prioriza composicion de interfaz y reutilizacion de piezas visuales
 */
/* eslint-disable react-refresh/only-export-components */

import { useId, type SVGProps } from 'react';
import { cn } from '@/styles/utils/cn';
import { plateDataStyles } from '@/styles/modules/plateData';

type IconProps = SVGProps<SVGSVGElement>;

const strokeDefaults = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.1,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const STAR_PATH =
  'M12 2.7 14.8 8.4 21.1 9.3 16.6 13.7 17.7 20 12 17 6.3 20 7.4 13.7 2.9 9.3 9.2 8.4 12 2.7Z';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const FireIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M13.4 4.5c.7 1.9-.8 3.2-1.9 4.5-1.2 1.5-1.9 2.9-1.9 4.6A4.6 4.6 0 0 0 14.2 18c2.4 0 4.3-1.8 4.3-4.2 0-2.6-1.5-4.3-5.1-9.3Z" />
    <path d="M10.7 14.2c.3 1.4 1.2 2.4 2.8 2.9" />
  </svg>
);

const BranchIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M5 18c4.6-1 8.3-5 10-11" />
    <path d="M8 17c-.8-2.2-.6-4.2.7-6.1" />
    <path d="M12.2 14.8c-.1-1.6.4-3.2 1.5-4.6" />
    <path d="M15.7 11.7c.8.6 1.4 1.4 1.7 2.4" />
  </svg>
);

const MuscleIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M8.5 10.5c0-1.4.8-2.8 2-3.6l1.1 1.4c1-.7 1.4-1.8 1.4-3.3 2.8 1.4 4.4 4 4.4 7.2a5.3 5.3 0 0 1-5.3 5.3H8.8A2.8 2.8 0 0 1 6 14.7c0-2.3 1.8-4.2 4.1-4.2Z" />
    <path d="M9 13.5h4.5" />
  </svg>
);

const DropWithLabelIcon = ({
  label,
  textFill = 'currentColor',
  ...props
}: IconProps & { label: string; textFill?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M12 4.2c3.2 3.8 4.7 6.3 4.7 8.7a4.7 4.7 0 1 1-9.4 0c0-2.4 1.5-4.9 4.7-8.7Z" />
    <text
      x="12"
      y={label.length > 1 ? '14.7' : '15.1'}
      fill={textFill}
      stroke="none"
      fontSize={label.length > 1 ? '5.8' : '7.8'}
      fontWeight="900"
      textAnchor="middle"
      fontFamily="inherit"
    >
      {label}
    </text>
  </svg>
);

const BadgeWithLabelIcon = ({
  label,
  textFill = 'currentColor',
  ...props
}: IconProps & { label: string; textFill?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <rect x="4.5" y="4.5" width="15" height="15" rx="3.2" />
    <path d="M9 4.5V3" />
    <path d="M15 4.5V3" />
    <text
      x="12"
      y={label.length > 1 ? '14.9' : '15.3'}
      fill={textFill}
      stroke="none"
      fontSize={label.length > 1 ? '6' : '8'}
      fontWeight="900"
      textAnchor="middle"
      fontFamily="inherit"
    >
      {label}
    </text>
  </svg>
);

const PriceTagIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M4 7.5V5h6.5L20 14.5 14.5 20 5 10.5V7.5Z" />
    <circle cx="8" cy="8" r="1" />
  </svg>
);

const AvailabilityIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.5 12 2.3 2.3 4.7-4.8" />
  </svg>
);

const CarbsIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M12 5.5v13" />
    <path d="M8.5 8c1.4.3 2.3 1.2 3 2.4" />
    <path d="M15.5 8c-1.4.3-2.3 1.2-3 2.4" />
    <path d="M8.5 12c1.4.3 2.3 1.2 3 2.4" />
    <path d="M15.5 12c-1.4.3-2.3 1.2-3 2.4" />
    <path d="M8.5 16c1.4.3 2.3 1.2 3 2.4" />
    <path d="M15.5 16c-1.4.3-2.3 1.2-3 2.4" />
  </svg>
);

const SugarCubeIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="m12 4.5 6 3.5v8L12 19.5 6 16V8l6-3.5Z" />
    <path d="M12 4.5V12" />
    <path d="m18 8-6 4-6-4" />
  </svg>
);

const SodiumIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M9 5.5h6" />
    <path d="M10.5 5.5v3l-2.5 3v6h8v-6l-2.5-3v-3" />
    <path d="M10 13.5h4" />
    <path d="M12 13.5v4" />
  </svg>
);

const DietaryTagIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M12 19.5V11" />
    <path d="M12 11c0-3.2 2.3-5.8 5.5-6-.2 3.9-2.2 6.2-5.5 6Z" />
    <path d="M12 13c0-2.8-2-5.1-5-5.5.1 3.5 1.9 5.4 5 5.5Z" />
  </svg>
);

const NutritionTagIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M6 5.5h12v13H6Z" />
    <path d="M9 9.5h6" />
    <path d="M9 13h6" />
    <path d="M9 16.5h4" />
  </svg>
);

const AllergenIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="m12 4.5 8 14H4l8-14Z" />
    <path d="M12 9v4.5" />
    <path d="M12 16.5h.01" />
  </svg>
);

const RecipeIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <rect x="6" y="4.5" width="12" height="15" rx="1.5" />
    <path d="M9 8.5h6" />
    <path d="M9 12h6" />
    <path d="M9 15.5h4" />
  </svg>
);

const InfoCircleIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 10.3v5.1" />
    <path d="M12 7.7h.01" />
  </svg>
);

const IngredientIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M5.5 9.5 12 5l6.5 4.5L12 14 5.5 9.5Z" />
    <path d="M5.5 14.5 12 19l6.5-4.5" />
    <path d="M12 14v5" />
  </svg>
);

const ReviewIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M5 6.5h14v9H9l-4 3v-12Z" />
    <path d="M9 10h6" />
    <path d="M9 13h4" />
  </svg>
);

const PreparationIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M5 12.5h11a3.5 3.5 0 0 1 0 7H9" />
    <path d="M16 9.5h3.5" />
    <path d="M6.5 12.5V9a3 3 0 1 1 6 0v3.5" />
  </svg>
);

const WeightIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M6 18.5h12l-1.2-8H7.2L6 18.5Z" />
    <path d="M9.2 10.5a2.8 2.8 0 1 1 5.6 0" />
    <path d="M12 10.5 13.8 8.7" />
  </svg>
);

const TimeIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 7.5v4.8l3 1.7" />
  </svg>
);

const AnimalProteinIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M7 15.5c-2.4-2.3-1.7-6.5 1.4-8a5.6 5.6 0 0 1 7.7 2c1.6 2.8.4 6-2 7.2-2.1 1.2-5 .7-7.1-1.2Z" />
    <path d="M14.5 8.5c1.2-.4 2.5-.2 3.5.5" />
  </svg>
);

const PlantProteinIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M9 7.5c-2 1.3-2.6 4-1.4 6.1 1.4 2.3 4.8 3 7.4 1.6 2.2-1.2 3.4-4 2.5-6.6-1.9-.1-3.2.4-4.4 1.5" />
    <path d="M11.5 8.5c1.7 2.2 2 5 .8 8.3" />
  </svg>
);

const GrainIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M12 5v14" />
    <path d="M8.5 7.5c1 .3 2 1.2 2.5 2.5" />
    <path d="M15.5 7.5c-1 .3-2 1.2-2.5 2.5" />
    <path d="M8.5 12c1 .3 2 1.2 2.5 2.5" />
    <path d="M15.5 12c-1 .3-2 1.2-2.5 2.5" />
  </svg>
);

const BreadIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M6 18.5V11a4.5 4.5 0 0 1 4.5-4.5H13A5 5 0 0 1 18 11v7.5Z" />
    <path d="M9 10.5h.01" />
    <path d="M12 9.5h.01" />
    <path d="M15 10.5h.01" />
  </svg>
);

const DairyIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M10 5.5h4v3l2 3v7H8v-7l2-3v-3Z" />
    <path d="M9 12.5h6" />
  </svg>
);

const VegetableIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M12 19c0-5.2 2.4-9.1 6.5-12-1 5.8-3.5 9.7-6.5 12Z" />
    <path d="M12 19C12 13.8 9.6 9.9 5.5 7c1 5.8 3.5 9.7 6.5 12Z" />
    <path d="M12 11v8" />
  </svg>
);

const FruitIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M12 8.5c-3.9 0-6.5 2.5-6.5 5.9A5.8 5.8 0 0 0 11.3 20H12a6 6 0 0 0 6.5-5.6c0-3.4-2.6-5.9-6.5-5.9Z" />
    <path d="M12 8.5c0-1.8.7-3 2-4" />
    <path d="M10 6.5c1.2.2 2 .7 2.5 1.5" />
  </svg>
);

const CondimentIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M9 5.5h6" />
    <path d="M10 5.5v3l-2 2.5v7.5h8V11l-2-2.5v-3" />
    <path d="M10 13.5h4" />
  </svg>
);

const BeverageIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M7 6.5h10l-1 12H8L7 6.5Z" />
    <path d="M9 4.5h6" />
    <path d="M15 6.5V4.5" />
  </svg>
);

const OtherIngredientIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <rect x="5.5" y="6.5" width="13" height="11" rx="2" />
    <path d="M9.5 10.5h5" />
    <path d="M9.5 13.5h5" />
  </svg>
);

const CowIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="m7 8.5-2-2.5 3 .7" />
    <path d="m17 8.5 2-2.5-3 .7" />
    <path d="M7 9.5a5 5 0 0 1 10 0v4.5c0 2-1.6 3.5-3.5 3.5h-3C8.6 17.5 7 16 7 14V9.5Z" />
    <path d="M9.5 11.5h.01" />
    <path d="M14.5 11.5h.01" />
    <path d="M10 14.5c1 .7 3 .7 4 0" />
  </svg>
);

const ChickenIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M8.5 14.5a4.8 4.8 0 1 1 7.5-4" />
    <path d="M16 10.5c1.8 0 3.2 1.4 3.2 3.2S17.8 17 16 17" />
    <path d="M8 10 6.5 8.5l.5 2" />
    <path d="M8.5 9 7.8 6.5 9.5 8" />
    <path d="M13.5 10.5h.01" />
    <path d="M19.2 12.7 21 12l-1.8-.7" />
  </svg>
);

const PigIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="m8 8-1.5-2L9 6.8" />
    <path d="m16 8 1.5-2-2.5.8" />
    <path d="M7 10a5 5 0 0 1 10 0v4a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-4Z" />
    <path d="M10 13h4v2.5a2 2 0 0 1-4 0V13Z" />
    <path d="M9.5 11.5h.01" />
    <path d="M14.5 11.5h.01" />
    <path d="M11 14.2h.01" />
    <path d="M13 14.2h.01" />
  </svg>
);

const FishIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M5 12c2.2-2.5 4.7-4 8-4 1.8 0 3.6.5 5 1.5l2-1v7l-2-1C16.6 15.5 14.8 16 13 16c-3.3 0-5.8-1.5-8-4Z" />
    <path d="M13.5 10.5h.01" />
  </svg>
);

const EggIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M12 4.5c3.3 0 5.5 5.5 5.5 9a5.5 5.5 0 0 1-11 0c0-3.5 2.2-9 5.5-9Z" />
  </svg>
);

const CheeseIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M6 17.5V10l9.5-3.5 2.5 2.5v8.5H6Z" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="15.5" cy="15" r="1" />
    <circle cx="10" cy="15.5" r="1" />
  </svg>
);

const TomatoIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <circle cx="12" cy="13" r="6" />
    <path d="M12 7V5" />
    <path d="m12 7 2-1.8" />
    <path d="M12 7 10 5.2" />
    <path d="m12 7 3 .5" />
    <path d="M12 7 9 7.5" />
  </svg>
);

const LettuceIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M12 19.5c-3.7-2.3-5.6-5.6-5.6-9 0-2.2 1.5-4 3.5-4 1 0 1.8.4 2.1 1 .3-.6 1.1-1 2.1-1 2 0 3.5 1.8 3.5 4 0 3.4-1.9 6.7-5.6 9Z" />
    <path d="M12 9.5v8" />
  </svg>
);

const OnionIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M12 5.5c-.2 1.2-.8 2.3-1.8 3.2-1.8 1.5-2.7 3.3-2.7 5.3a4.5 4.5 0 1 0 9 0c0-2-.9-3.8-2.7-5.3-1-.9-1.6-2-1.8-3.2Z" />
    <path d="M12 8.5v9" />
  </svg>
);

const PepperIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M14.5 6.5c-1.8 0-3.5 1.2-4 3L9 16a3 3 0 0 0 5.8 1.3l1.3-6c.5-2.3-.3-4.8-1.6-4.8Z" />
    <path d="M12.5 6.5c0-1 .5-1.8 1.5-2" />
  </svg>
);

const PotatoIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M7.5 8.5c2.5-2.7 7.6-2.8 9.7.2 2.2 3.2 1 8-2.4 9.8-3.6 1.8-8.2.1-9.4-3.7-.7-2.3 0-4.6 2.1-6.3Z" />
    <path d="M10 12h.01" />
    <path d="M14.5 10.5h.01" />
    <path d="M13 15.5h.01" />
  </svg>
);

const OilIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M10 5.5h4v3l1.5 2.5v7H8.5v-7L10 8.5v-3Z" />
    <path d="M12 13c1.5 1.8 2.3 3 2.3 4.2a2.3 2.3 0 0 1-4.6 0c0-1.2.8-2.4 2.3-4.2Z" />
  </svg>
);

const SauceIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M6 13.5h12a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4Z" />
    <path d="M8 11.5c1-1.3 2.3-2 4-2s3 .7 4 2" />
    <path d="M17 9 19.5 6.5" />
  </svg>
);

const SaltIngredientIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M9.5 5.5h5" />
    <path d="M10.5 5.5v3l-2.5 3v6h8v-6l-2.5-3v-3" />
    <path d="M10 13.5h4" />
    <path d="M12 13.5v4" />
    <path d="M12 8.5h.01" />
  </svg>
);

const OliveIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M11.5 8.5c3 0 5.5 2 5.5 4.5s-2.5 4.5-5.5 4.5S6 15.5 6 13s2.5-4.5 5.5-4.5Z" />
    <circle cx="12" cy="13" r="1.5" />
    <path d="M15.5 8c1.3-.3 2.3-1 3-2" />
  </svg>
);

const HerbIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M8 18c4-1 7-4.7 8.5-10" />
    <path d="M8 18c-.8-2.3-.4-4.5 1-6.5" />
    <path d="M12.5 15.5c-.1-1.8.5-3.5 1.8-5" />
    <path d="M15.5 11.5c.8.7 1.3 1.6 1.5 2.5" />
  </svg>
);

const AntIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <ellipse cx="7.1" cy="12.4" rx="2.1" ry="1.9" />
    <ellipse cx="12.4" cy="11.8" rx="3.1" ry="2.8" />
    <ellipse cx="18.1" cy="12.5" rx="2.5" ry="2.2" />
    <path d="M5.4 10.5 3.2 8.6" />
    <path d="M5.6 14.3 3.1 15.9" />
    <path d="M10 8.9 8.5 6.6" />
    <path d="M10.8 14.8 9.2 17.1" />
    <path d="M14.5 8.8 16 6.5" />
    <path d="M15.2 15 16.9 17.4" />
    <path d="M19.5 10.4 21.6 8.9" />
    <path d="M19.8 14.4 22 15.9" />
    <path d="M17.4 10 18.6 7.4" />
  </svg>
);

const RoosterIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M7.5 16.5c0-4.3 2.4-7.5 6.3-8.2 2.4-.5 4.7 1.2 4.7 3.8 0 2.8-2.2 5.4-5.7 5.9l-2.8.4" />
    <path d="M9 10c.2-1.8-.5-3.1-2-4l-.7 2-1.8.3 1.3 1.3-.8 1.7L7 11" />
    <path d="M12.8 10.6h.01" />
    <path d="M18.5 10.5 21 9.5l-1.3 2.2" />
    <path d="M10 16.8 8.8 20" />
    <path d="M14.2 16.5 15 20" />
    <path d="M8 18.5h7.5" />
  </svg>
);

const ElephantIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M6.5 17v-6.1c0-3.4 2.7-5.9 6.1-5.9h.6a5.2 5.2 0 0 1 5.2 5.2v4.1c0 2.5-1.8 4.7-4.4 4.7H12" />
    <path d="M17.9 12.8c1.9 0 3.1 1.5 3.1 3.2 0 2-1.6 3.5-3.7 3.5h-1.7" />
    <path d="M8 9.6C6.9 7.7 4.8 7 3 7.8c.8 2 2.4 3.1 4.9 3.3" />
    <path d="M10.4 9.6h.01" />
    <path d="M8.8 17v2.6" />
    <path d="M13.8 17v2.6" />
  </svg>
);

const MainCourseIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <circle cx="12" cy="6.4" r="1.1" />
    <path d="M6 16.5a6 6 0 0 1 12 0" />
    <path d="M4.5 16.5h15" />
    <path d="M3.5 18.8h17" />
  </svg>
);

const SideDishIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M7 11.5h10" />
    <path d="M7 11.5c0 3.8 2.2 6 5 6s5-2.2 5-6" />
    <path d="m16.6 7.4 2.7-2.7" />
    <path d="m15.6 8.4 2.6 2.6" />
  </svg>
);

const SnackIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M8 10.5h8l-1 7H9l-1-7Z" />
    <path d="M9 5.5v5" />
    <path d="M12 4.5v6" />
    <path d="M15 5.5v5" />
    <path d="M9 13.5h6" />
  </svg>
);

const StarterIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M7 5.5v6" />
    <path d="M9 5.5v6" />
    <path d="M8 11.5v7" />
    <path d="M14.5 5.5c1.7 2 2.5 4 2.5 6v7" />
    <path d="M13.5 12h4" />
  </svg>
);

const DessertIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M8.5 15h7.2a3.2 3.2 0 0 0 .3-6.4 4 4 0 0 0-7.5-.4 3.2 3.2 0 0 0-.1 6.8Z" />
    <path d="m10.5 15 1.5 4 1.5-4" />
  </svg>
);

const DrinkIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M8 5.5h8l-.9 13H8.9L8 5.5Z" />
    <path d="m11 5.5 3.5-3" />
    <path d="M10.1 10.2h4.8" />
  </svg>
);

const plateDataIcons = {
  ant: AntIcon,
  rooster: RoosterIcon,
  elephant: ElephantIcon,
  sizeS: (props: IconProps) => <BadgeWithLabelIcon label="S" {...props} />,
  sizeM: (props: IconProps) => <BadgeWithLabelIcon label="M" {...props} />,
  sizeL: (props: IconProps) => <BadgeWithLabelIcon label="L" {...props} />,
  sizeXL: (props: IconProps) => <BadgeWithLabelIcon label="XL" {...props} />,
  plateMain: MainCourseIcon,
  plateSide: SideDishIcon,
  plateSnack: SnackIcon,
  plateStarter: StarterIcon,
  plateDessert: DessertIcon,
  plateDrink: DrinkIcon,
  price: PriceTagIcon,
  availability: AvailabilityIcon,
  calories: FireIcon,
  protein: (props: IconProps) => <DropWithLabelIcon label="P" {...props} />,
  carbs: CarbsIcon,
  sugar: SugarCubeIcon,
  fat: (props: IconProps) => <DropWithLabelIcon label="G" {...props} />,
  fatSaturated: (props: IconProps) => <DropWithLabelIcon label="GS" {...props} />,
  fatTrans: (props: IconProps) => <DropWithLabelIcon label="GT" {...props} />,
  fatMonounsaturated: (props: IconProps) => <DropWithLabelIcon label="GM" {...props} />,
  fatPolyunsaturated: (props: IconProps) => <DropWithLabelIcon label="GP" {...props} />,
  fiber: BranchIcon,
  vitamin: MuscleIcon,
  sodium: SodiumIcon,
  dietaryTag: DietaryTagIcon,
  nutritionTag: NutritionTagIcon,
  allergen: AllergenIcon,
  recipe: RecipeIcon,
  info: InfoCircleIcon,
  ingredient: IngredientIcon,
  review: ReviewIcon,
  preparation: PreparationIcon,
  weight: WeightIcon,
  time: TimeIcon,
  animalProtein: AnimalProteinIcon,
  plantProtein: PlantProteinIcon,
  grain: GrainIcon,
  bread: BreadIcon,
  dairy: DairyIcon,
  vegetable: VegetableIcon,
  fruit: FruitIcon,
  condiment: CondimentIcon,
  beverage: BeverageIcon,
  otherIngredient: OtherIngredientIcon,
  cow: CowIcon,
  chicken: ChickenIcon,
  pig: PigIcon,
  fish: FishIcon,
  egg: EggIcon,
  cheese: CheeseIcon,
  tomato: TomatoIcon,
  lettuce: LettuceIcon,
  onion: OnionIcon,
  pepper: PepperIcon,
  potato: PotatoIcon,
  oil: OilIcon,
  sauce: SauceIcon,
  salt: SaltIngredientIcon,
  olive: OliveIcon,
  herb: HerbIcon,
} as const;

export type PlateDataIconKey = keyof typeof plateDataIcons;

export const PlateDataIcon = ({
  icon,
  ...props
}: {
  icon: PlateDataIconKey;
} & IconProps) => {
  const Icon = plateDataIcons[icon];

  return <Icon {...props} />;
};

const difficultyConfigs = {
  EASY: { stars: 1, fill: '#2f9f55', border: '#7bc78b', background: '#eaf8ef' },
  MEDIUM: { stars: 2, fill: '#d5a11c', border: '#e3c16a', background: '#fff7df' },
  HARD: { stars: 3, fill: '#d64b3c', border: '#e38b82', background: '#ffebe8' },
  CHEF: { stars: 4, fill: '#9f2e25', border: '#c56b63', background: '#fdeceb' },
} as const;

export const PlateDifficultyIcon = ({
  difficulty,
  ...props
}: IconProps & {
  difficulty?: string | null;
}) => {
  const config =
    difficultyConfigs[(difficulty ?? 'MEDIUM') as keyof typeof difficultyConfigs] ??
    difficultyConfigs.MEDIUM;
  const totalSlots = config.stars > 3 ? 4 : 3;
  const width = totalSlots > 3 ? 86 : 70;
  const slotGap = totalSlots > 3 ? 16 : 18;
  const startX = totalSlots > 3 ? 11 : 14;

  return (
    <svg viewBox={`0 0 ${width} 24`} aria-hidden="true" {...props}>
      <rect
        x="1"
        y="1"
        width={width - 2}
        height="22"
        rx="11"
        fill={config.background}
        stroke={config.border}
        strokeWidth="1.5"
      />
      {Array.from({ length: totalSlots }, (_, index) => {
        const isFilled = index < config.stars;

        return (
          <path
            key={index}
            d={STAR_PATH}
            transform={`translate(${startX + index * slotGap} 4.9) scale(0.58)`}
            fill={isFilled ? config.fill : 'transparent'}
            stroke={isFilled ? config.fill : '#c6c0b4'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
};

export const StarRatingDisplay = ({
  value,
  size = 14,
  showValue = true,
  reviewCount,
  className,
}: {
  value: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}) => {
  const safeValue = clamp(value, 0, 5);
  const percentage = (safeValue / 5) * 100;
  const gap = 2;
  const totalWidth = size * 5 + gap * 4;
  const clipId = useId();
  const filledWidth = (percentage / 100) * totalWidth;
  const scale = size / 24;

  return (
    <span className={cn(plateDataStyles.ratingRoot, className)}>
      <svg
        width={totalWidth}
        height={size}
        viewBox={`0 0 ${totalWidth} ${size}`}
        className={plateDataStyles.ratingSvg}
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={filledWidth} height={size} />
          </clipPath>
        </defs>

        {Array.from({ length: 5 }, (_, index) => {
          const x = index * (size + gap);

          return (
            <path
              key={`empty-${index}`}
              d={STAR_PATH}
              transform={`translate(${x} 0) scale(${scale})`}
              className={plateDataStyles.ratingStarEmpty}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}

        <g clipPath={`url(#${clipId})`}>
          {Array.from({ length: 5 }, (_, index) => {
            const x = index * (size + gap);

            return (
              <path
                key={`fill-${index}`}
                d={STAR_PATH}
                transform={`translate(${x} 0) scale(${scale})`}
                className={plateDataStyles.ratingStarFilled}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
        </g>
      </svg>

      {showValue && (
        <span className={plateDataStyles.ratingMeta}>
          <strong className={plateDataStyles.ratingValue}>{safeValue.toFixed(1)}</strong>
          {reviewCount != null ? (
            <span className={plateDataStyles.ratingCount}>{reviewCount} reseñas</span>
          ) : null}
        </span>
      )}
    </span>
  );
};

const normalizeLookupValue = (value: string | null | undefined) =>
  (value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const ingredientMatchers: Array<{ icon: PlateDataIconKey; patterns: RegExp[] }> = [
  { icon: 'chicken', patterns: [/\bpollo\b/] },
  { icon: 'pig', patterns: [/\bbacon\b/, /\bjamon\b/, /\bcerdo\b/, /\bpork\b/] },
  { icon: 'fish', patterns: [/\bpescado\b/, /\bmerluza\b/, /\batun\b/, /\bsalmon\b/] },
  {
    icon: 'cow',
    patterns: [
      /\bvaca\b/,
      /\bvacuno\b/,
      /milanesa de carne/,
      /medallon de carne/,
      /relleno de carne/,
    ],
  },
  { icon: 'cheese', patterns: [/\bmozzarella\b/, /\bqueso\b/, /\bcheddar\b/, /\bmuzza\b/] },
  { icon: 'egg', patterns: [/\bhuevo\b/] },
  { icon: 'bread', patterns: [/\bpan\b/, /\bmasa\b/, /\btapa\b/, /\bempanar\b/] },
  { icon: 'tomato', patterns: [/\btomate\b/] },
  { icon: 'lettuce', patterns: [/\blechuga\b/] },
  { icon: 'onion', patterns: [/\bcebolla\b/] },
  { icon: 'pepper', patterns: [/\bmorron\b/, /\baji\b/, /\bpimiento\b/] },
  { icon: 'potato', patterns: [/\bpapas?\b/, /\bpatata\b/] },
  { icon: 'oil', patterns: [/\baceite\b/] },
  { icon: 'sauce', patterns: [/\bmayonesa\b/, /\bketchup\b/, /\bmostaza\b/, /\bsalsa\b/] },
  { icon: 'olive', patterns: [/\baceituna\b/] },
  { icon: 'herb', patterns: [/\boregano\b/, /\balbahaca\b/, /\bromero\b/, /\bprovenzal\b/] },
  { icon: 'salt', patterns: [/\bsal\b/] },
];

const ingredientCategoryFallbacks: Record<string, PlateDataIconKey> = {
  PROTEIN_ANIMAL: 'animalProtein',
  PROTEIN_PLANT: 'plantProtein',
  VEGETABLE: 'vegetable',
  FRUIT: 'fruit',
  LEGUME: 'plantProtein',
  GRAIN: 'grain',
  BREAD: 'bread',
  DAIRY: 'dairy',
  FAT: 'oil',
  SAUCE: 'sauce',
  CONDIMENT: 'condiment',
  SWEETENER: 'condiment',
  BEVERAGE: 'beverage',
  OTHER: 'otherIngredient',
};

const plateSizeIconMap: Record<string, PlateDataIconKey> = {
  SMALL: 'sizeS',
  REGULAR: 'sizeM',
  LARGE: 'sizeL',
  XL: 'sizeXL',
};

const plateTypeIconMap: Record<string, PlateDataIconKey> = {
  MAIN: 'plateMain',
  SIDE: 'plateSide',
  SNACK: 'plateSnack',
  STARTER: 'plateStarter',
  DESSERT: 'plateDessert',
  DRINK: 'plateDrink',
};

export const getIngredientIconKey = (
  ingredientName: string | null | undefined,
  ingredientCategory?: string | null,
) => {
  const normalizedName = normalizeLookupValue(ingredientName);

  for (const matcher of ingredientMatchers) {
    if (matcher.patterns.some((pattern) => pattern.test(normalizedName))) {
      return matcher.icon;
    }
  }

  return ingredientCategoryFallbacks[ingredientCategory ?? ''] ?? 'ingredient';
};

export const getPlateSizeIconKey = (size: string | null | undefined) =>
  plateSizeIconMap[size ?? ''] ?? 'sizeM';

export const getPlateTypeIconKey = (type: string | null | undefined) =>
  plateTypeIconMap[type ?? ''] ?? 'recipe';
