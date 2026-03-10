import { CPasswordField } from '../IAMField';

const CPasswordFieldComponent = () => {
  return (
    <CPasswordField
      label="Confirmar Contraseña"
      addons={[
        { type: 'icon', src: '/key-icon.png' },
        { type: 'hint', text: 'Confirma la contraseña' },
        { type: 'passwordToggle' },
        { type: 'rubber' },
        { type: 'rules', rules: ['Debe ser la misma contraseña dada'] },
        { type: 'validation' },
      ]}
      control={'password'}
    />
  );
};

export default CPasswordFieldComponent;
