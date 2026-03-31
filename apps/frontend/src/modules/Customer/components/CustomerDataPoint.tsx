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
