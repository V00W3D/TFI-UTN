import { sexField } from '@app/sdk';
import { SexField } from '../IAMField';

const SexFieldComponent = () => (
  <SexField
    label="Género"
    addons={[
      { type: 'hint', text: 'Selecciona como te identificas' },
      { type: 'rules', rules: sexField.rules },
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

export default SexFieldComponent;
