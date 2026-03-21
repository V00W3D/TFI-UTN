import { passwordField } from '@app/sdk';
import { PasswordField } from '../IAMField';

const PasswordFieldComponent = () => (
  <PasswordField
    placeholder="Crea una contraseña fuerte"
    label="Contraseña"
    addons={[
      { type: 'icon', src: '/lock-icon.png' },
      { type: 'hint', text: 'Intenta combinar letras, números y símbolos' },
      { type: 'passwordToggle' },
      { type: 'rubber' },
      { type: 'rules', rules: passwordField.rules },
      { type: 'strength' },
    ]}
    control="password"
  />
);

export default PasswordFieldComponent;
