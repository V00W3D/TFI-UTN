import { CORE_RULES } from '@contracts/CoreSchema';
import { PasswordField } from '../IAMField';

const PasswordFieldComponent = () => {
  return (
    <PasswordField
      placeholder="Crea una contraseña fuerte"
      label="Contraseña"
      addons={[
        { type: 'icon', src: '/lock-icon.png' },
        { type: 'hint', text: 'Intenta combinar letras,numeros y símbolos' },
        { type: 'passwordToggle' },
        { type: 'rubber' },
        { type: 'rules', rules: CORE_RULES.password },
        { type: 'strength' },
        { type: 'validation' },
      ]}
      control={'password'}
    />
  );
};

export default PasswordFieldComponent;
