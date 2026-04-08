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
import type { ReactNode } from 'react';
import { PlateDataIcon, type PlateDataIconKey } from '../../../components/shared/PlateDataIcons';

interface CustomerDataPointProps {
  icon?: PlateDataIconKey;
  iconNode?: ReactNode;
  value: ReactNode;
  label?: string;
}

const iconStyle = {
  width: 18,
  height: 18,
  marginRight: 7,
  verticalAlign: 'text-bottom',
} as const;

const CustomerDataPoint = ({ icon, iconNode, label, value }: CustomerDataPointProps) => (
  <span>
    {iconNode ?? (icon ? <PlateDataIcon icon={icon} style={iconStyle} /> : null)}
    {label ? <strong>{label}: </strong> : null}
    {value}
  </span>
);

export default CustomerDataPoint;
