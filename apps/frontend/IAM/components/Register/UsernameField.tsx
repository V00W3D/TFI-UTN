import { CORE_RULES } from '@contracts/CoreSchema';
import { UsernameField } from '../IAMField';

const UsernameFieldComponent = () => {
  return (
    <UsernameField
      placeholder="ju4n_"
      label="Nombre de usuario"
      addons={[
        { type: 'icon', src: '/user-icon.png' },
        { type: 'hint', text: 'Como te identificarás en QART.' },
        { type: 'validation' },
        { type: 'rules', rules: CORE_RULES.username },
        { type: 'rubber' },
      ]}
    />
  );
};

export default UsernameFieldComponent;
