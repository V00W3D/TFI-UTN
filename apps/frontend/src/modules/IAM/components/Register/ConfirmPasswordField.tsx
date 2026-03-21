import { cpasswordField } from '@app/sdk';
import { CPasswordField } from '../IAMField';

const CPasswordFieldComponent = () => (
  <CPasswordField
    label="Confirmar Contraseña"
    addons={[
      { type: 'icon', src: '/key-icon.png' },
      { type: 'hint', text: 'Confirma la contraseña' },
      { type: 'passwordToggle' },
      { type: 'rubber' },
      { type: 'rules', rules: cpasswordField.rules },
    ]}
    control="password"
  />
);

export default CPasswordFieldComponent;
