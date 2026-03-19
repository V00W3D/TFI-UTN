import { CORE_RULES } from '@shared/CoreSchema';
import { SexField } from '../IAMField';

const SexFieldComponent = () => {
  return (
    <SexField
      label="Género"
      addons={[
        { type: 'validation' },
        { type: 'hint', text: 'Selecciona como te identificas' },
        { type: 'rules', rules: CORE_RULES.sex },
        { type: 'validation' },
      ]}
      control={[
        'radio',
        [
          { value: 'MALE', label: 'Masculino', icon: '/masculine-icon.png' },
          { value: 'FEMALE', label: 'Femenino', icon: '/femenine-icon.png' },
          { value: 'OTHER', label: 'Otro', icon: '/other-gender.png' },
        ],
      ]}
    />
  );
};

export default SexFieldComponent;
