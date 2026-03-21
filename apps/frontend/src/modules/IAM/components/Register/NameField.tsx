import { nameField, snameField, lnameField } from '@app/sdk';
import { NameField, LNameField, SNameField } from '../IAMField';

export const FirstNameFieldComponent = () => (
  <NameField
    label="Primer Nombre"
    addons={[
      { type: 'icon', src: '/first-name.png' },
      { type: 'hint', text: 'Nombre de pila' },
      { type: 'rubber' },
      { type: 'rules', rules: nameField.rules },
    ]}
  />
);

export const SecondNameFieldComponent = () => (
  <SNameField
    label="Segundo Nombre"
    addons={[
      { type: 'icon', src: '/second-name.png' },
      { type: 'hint', text: '(Opcional) - Nombre/s secundario/s' },
      { type: 'rubber' },
      { type: 'rules', rules: snameField.rules },
    ]}
    required={false}
  />
);

export const LastNameFieldComponent = () => (
  <LNameField
    label="Apellido"
    addons={[
      { type: 'icon', src: '/last-name.png' },
      { type: 'hint', text: 'Nombre de Familia' },
      { type: 'rubber' },
      { type: 'rules', rules: lnameField.rules },
    ]}
  />
);
