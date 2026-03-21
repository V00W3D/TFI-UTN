import { identityField } from '@app/sdk';
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
        { type: 'rules', rules: identityField.rules },
      ]}
    />
  );
};

export default IdentityFieldComponent;
