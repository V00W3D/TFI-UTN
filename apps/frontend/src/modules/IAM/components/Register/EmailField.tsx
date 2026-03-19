import { CORE_RULES } from '@shared/CoreSchema';
import { EmailField } from '../IAMField';

const EmailFieldComponent = () => {
  return (
    <EmailField
      label="Correo Electrónico"
      addons={[
        { type: 'icon', src: '/email-icon.png' },
        {
          type: 'hint',
          text: 'Tu correo electrónico',
        },
        { type: 'rubber' },
        { type: 'validation' },
        { type: 'rules', rules: CORE_RULES.email },
      ]}
      control="email"
    />
  );
};

export default EmailFieldComponent;
