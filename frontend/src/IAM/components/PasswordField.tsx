import { useMemo } from 'react';
import AuthField from '../common/AuthField';
import PasswordStrengthPlugin from '../utils/PasswordStrength';
import { useRegisterStore } from '@IAM/store/IAMStore';

type Mode = 'password' | 'confirm';

interface Props {
  mode: Mode;
}

const PasswordField = ({ mode }: Props) => {
  const {
    password,
    confirmPassword,
    vPassword,
    vConfirmPassword,
    setPassword,
    setConfirmPassword,
  } = useRegisterStore();

  const isMain = mode === 'password';

  /* =========================================
     STORE BINDING (100% aligned)
  ========================================= */

  const value = isMain ? password : confirmPassword;
  const validate = isMain ? vPassword : vConfirmPassword;
  const setter = isMain ? setPassword : setConfirmPassword;

  /* =========================================
     PASSWORD STRENGTH (ONLY MAIN PASSWORD)
  ========================================= */

  const plugins = useMemo(() => {
    if (!isMain) return [];
    if (!password) return [];

    return [
      {
        render: () => <PasswordStrengthPlugin password={password} mode="register" />,
      },
    ];
  }, [password, isMain]);

  /* =========================================
     HANDLER
  ========================================= */

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setter(e.target.value);
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <AuthField
      label={isMain ? 'Contraseña' : 'Confirmar contraseña'}
      name={isMain ? 'password' : 'confirmPassword'}
      type="password"
      autoComplete="new-password"
      value={value}
      onChange={handleChange}
      required
      maxLength={72}
      validate={validate}
      inputIcon={isMain ? '/lock-icon.png' : '/key-icon.png'}
      placeholder={isMain ? 'Creá una contraseña fuerte' : 'Repetí tu contraseña'}
      hint="8–72 caracteres"
      rules={
        isMain
          ? [
              'Debe tener entre 8 y 72 caracteres',
              'Incluir al menos una letra mayúscula',
              'Incluir al menos una letra minúscula',
              'Incluir al menos un número',
              'Incluir al menos un símbolo o carácter especial',
            ]
          : ['Debe coincidir exactamente con la contraseña anterior']
      }
      showHelpToggle={isMain}
      plugins={plugins}
      visionToggler
    />
  );
};

export default PasswordField;
