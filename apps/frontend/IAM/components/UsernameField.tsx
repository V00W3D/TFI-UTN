import AuthFieldBuilder from '../../utils/FieldFactory';
import { useRegisterStore } from '@IAM/store/IAMStore';
import { LIMITS, MSG } from '@IAM/IAMSchema';

/* =========================================================
   TYPES
========================================================= */

type Mode = 'login' | 'register';

interface UsernameFieldProps {
  mode?: Mode;
}

/* =========================================================
   RULES (Derivadas del zSchema)
========================================================= */

const usernameRules = [
  MSG.MIN(LIMITS.USERNAME_MIN),
  MSG.MAX(LIMITS.USERNAME_MAX),
  MSG.USERNAME_INVALID,
  'Se guardará en minúsculas automáticamente',
];

/* =========================================================
   COMPONENT
========================================================= */

const UsernameField = ({ mode = 'register' }: UsernameFieldProps) => {
  const { username, vUsername, setUsername } = useRegisterStore();

  const isRegister = mode === 'register';

  return (
    <AuthFieldBuilder
      label="Nombre de usuario"
      name="username"
      type="text"
      placeholder="ju4n_"
      autoComplete="username"
      required={isRegister}
      value={username}
      validate={vUsername}
      onChange={(e) => setUsername(e.target.value)}
      rules={isRegister ? usernameRules : []}
      hint={isRegister ? 'Será visible públicamente' : undefined}
      showHelpToggle={isRegister}
      inputIcon="/user-icon.png"
      fieldMode={mode}
    />
  );
};

export default UsernameField;
