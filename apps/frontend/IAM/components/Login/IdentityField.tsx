import { CORE_RULES } from '@contracts/CoreSchema';
import { IdentityField } from '../IAMField';

const IdentityFieldComponent = () => {
  return (
    <IdentityField
      label="Identidad"
      addons={[
        { type: 'icon', src: '/identity-icon.png' },
        {
          type: 'hint',
          text: 'Ingrese su Correo Electrónico, Nombre de Usuario o Teléfono con el que se registró',
        },
        { type: 'rubber' },
        { type: 'rules', rules: CORE_RULES.identity },
        { type: 'validation' },
      ]}
    />
  );
};

export default IdentityFieldComponent;
