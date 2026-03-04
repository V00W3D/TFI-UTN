import { CORE_RULES } from '@contracts/CoreSchema';
import { NameField, LNameField, SNameField } from '../IAMField';

export const FirstNameFieldComponent = () => {
  return (
    <NameField
      label="Primer Nombre"
      addons={[
        { type: 'icon', src: '/first-name.png' },
        { type: 'hint', text: 'Nombre de pila' },
        { type: 'rubber' },
        { type: 'rules', rules: CORE_RULES.name },
        { type: 'validation' },
      ]}
    />
  );
};

export const SecondNameFieldComponent = () => {
  return (
    <SNameField
      label="Segundo Nombre"
      addons={[
        { type: 'icon', src: '/second-name.png' },
        { type: 'hint', text: '(Opcional) - Nombre/s secundario/s' },
        { type: 'rubber' },
        { type: 'rules', rules: CORE_RULES.name },
        { type: 'validation' },
      ]}
      required={false}
    />
  );
};

export const LastNameFieldComponent = () => {
  return (
    <LNameField
      label="Apellido"
      addons={[
        { type: 'icon', src: '/last-name.png' },
        { type: 'hint', text: 'Nombre de Familia' },
        { type: 'rubber' },
        { type: 'rules', rules: CORE_RULES.name },
        { type: 'validation' },
      ]}
    />
  );
};
