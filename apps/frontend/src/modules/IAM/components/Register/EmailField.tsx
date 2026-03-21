import { emailField } from '@app/sdk';
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
        { type: 'rules', rules: emailField.rules },
      ]}
      control="email"
    />
  );
};

export default EmailFieldComponent;
