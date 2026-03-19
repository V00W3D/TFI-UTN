import { CORE_RULES } from '@shared/CoreSchema';
import { PhoneField } from '../IAMField';

const PhoneFieldComponent = () => {
  return (
    <PhoneField
      label="Teléfono"
      addons={[
        { type: 'icon', src: '/phone-icon.png' },
        {
          type: 'hint',
          text: '(Opcional) - Tu número telefónico',
        },
        { type: 'rubber' },
        { type: 'validation' },
        { type: 'rules', rules: CORE_RULES.phone },
      ]}
      control="phone"
      required={false}
    />
  );
};

export default PhoneFieldComponent;
