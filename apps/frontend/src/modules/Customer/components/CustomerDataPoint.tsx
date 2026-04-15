/**
 * @file CustomerDataPoint.tsx
 * @module Customer
 * @description Archivo CustomerDataPoint alineado a la arquitectura y trazabilidad QART.
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
 * dependencies: react, PlateDataIcons
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
import type { ReactNode } from 'react';
import { PlateDataIcon, type PlateDataIconKey } from '@/shared/ui/PlateDataIcons';
import { customerStyles } from '@/styles/modules/customer';

interface CustomerDataPointProps {
  icon?: PlateDataIconKey;
  iconNode?: ReactNode;
  value: ReactNode;
  label?: string;
}

const CustomerDataPoint = ({ icon, iconNode, label, value }: CustomerDataPointProps) => (
  <span className={customerStyles.dataPoint}>
    {iconNode ?? (
      icon ? (
        <PlateDataIcon
          icon={icon}
          width={18}
          height={18}
          className={customerStyles.inlineIcon}
        />
      ) : null
    )}
    {label ? <strong className={customerStyles.dataPointStrong}>{label}: </strong> : null}
    {value}
  </span>
);

export default CustomerDataPoint;

