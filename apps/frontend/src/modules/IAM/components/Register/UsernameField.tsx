import { usernameField } from '@app/sdk';
import { UsernameField } from '../IAMField';

const UsernameFieldComponent = () => (
  <UsernameField
    placeholder="ju4n_"
    label="Nombre de usuario"
    addons={[
      { type: 'icon', src: '/user-icon.png' },
      { type: 'hint', text: 'Como te identificarás en QART.' },
      { type: 'rules', rules: usernameField.rules },
      { type: 'rubber' },
    ]}
  />
);

export default UsernameFieldComponent;
