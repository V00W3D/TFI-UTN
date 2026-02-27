import AuthField from '../common/AuthField';
import { useRegisterStore } from '@IAM/store/IAMStore';
import type { SexType } from '@IAM/store/IAMStore';
/* =========================================
   COMPONENT
========================================= */

const SexField = () => {
  const { sex, vSex, setSex } = useRegisterStore();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSex(e.target.value as SexType);
  };

  return (
    <AuthField
      label="Sexo"
      name="sex"
      type="radio"
      value={sex}
      onChange={handleChange}
      required
      validate={vSex}
      hint="Seleccioná cómo te identificás"
      radioOptions={[
        {
          value: 'male',
          label: 'Masculino',
          icon: '/masculine-icon.png',
        },
        {
          value: 'female',
          label: 'Femenino',
          icon: '/femenine-icon.png',
        },
        {
          value: 'other',
          label: 'Otro',
          icon: '/other-gender.png',
        },
      ]}
    />
  );
};

export default SexField;
