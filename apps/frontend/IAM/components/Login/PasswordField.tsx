import { LPasswordField } from '../IAMField';

const LPasswordFieldComponent = () => {
  return (
    <LPasswordField
      label="Contraseña"
      addons={[
        { type: 'icon', src: '/lock-icon.png' },
        { type: 'hint', text: 'Tu clave supersecreta' },
        { type: 'passwordToggle' },
        { type: 'rubber' },
      ]}
      control="password"
    />
  );
};

export default LPasswordFieldComponent;
