import { useMemo } from 'react';
import AuthField from '../common/AuthField';

/* =========================================
   TYPES
========================================= */

export type SexType = 'male' | 'female' | 'other';

/* =========================================
   LABEL MAP
========================================= */

const labelMap: Record<SexType, string> = {
  female: 'Femenino',
  male: 'Masculino',
  other: 'Otro',
};

/* =========================================
   PROPS
========================================= */

interface Props {
  value: SexType;
  onChange: (value: SexType) => void;
  separatorTop?: boolean;
  separatorBottom?: boolean;
}

/* =========================================
   COMPONENT
========================================= */

const SexField = ({ value, onChange, separatorTop = false, separatorBottom = false }: Props) => {
  const messages = useMemo(() => {
    if (!value) {
      return [
        {
          type: 'error' as const,
          text: 'Debe seleccionar una opción',
        },
      ];
    }

    return [];
  }, [value]);

  const hasErrors = messages.length > 0;

  return (
    <AuthField
      label="Sexo"
      name="sex"
      type="select"
      value={value}
      onChange={(e: any) => onChange(e.target.value as SexType)}
      required
      error={hasErrors}
      success={!hasErrors}
      messages={messages}
      separatorTop={separatorTop}
      separatorBottom={separatorBottom}
      selectOptions={[
        { value: 'female', label: labelMap.female },
        { value: 'male', label: labelMap.male },
        { value: 'other', label: labelMap.other },
      ]}
    />
  );
};

export default SexField;
