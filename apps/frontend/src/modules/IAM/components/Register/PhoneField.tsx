import { phoneField } from '@app/sdk';
import { PhoneField } from '../IAMField';

const PhoneFieldComponent = () => (
  <PhoneField
    label="Teléfono"
    addons={[
      { type: 'icon', src: '/phone-icon.png' },
      { type: 'hint', text: '(Opcional) - Tu número telefónico' },
      { type: 'rubber' },
      { type: 'rules', rules: phoneField.rules },
    ]}
    control="phone"
    required={false}
  />
);

export default PhoneFieldComponent;
