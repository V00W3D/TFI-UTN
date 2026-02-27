import AuthField from '../common/AuthField';
import { useRegisterStore } from '@IAM/store/IAMStore';

const PhoneField = () => {
  const { phone, vPhone, setPhone } = useRegisterStore();

  return (
    <AuthField
      label="Teléfono"
      name="phone"
      type="phone"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      required={false}
      validate={vPhone}
      inputIcon="/phone-icon.png"
      hint="Opcional — incluye código de país"
      rules={['Debe ser un número válido', 'Debe incluir el código de país (ej: +54)']}
      showHelpToggle
    />
  );
};

export default PhoneField;
