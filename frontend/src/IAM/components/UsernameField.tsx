import React, { useMemo } from 'react';
import AuthField from '../common/AuthField';

/* =========================================
   LIMITS & REGEX
========================================= */

const USERNAME_MIN = 4;
const USERNAME_MAX = 20;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

/* =========================================
   ICON
========================================= */

const UserIcon = () => (
  <div className="flex items-center justify-center shrink-0">
    <img src="/user-icon.png" alt="user-icon" className="w-5 h-5 object-contain" />
  </div>
);

/* =========================================
   PROPS
========================================= */

interface Props {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  mode?: 'register' | 'login';

  /** Separators passthrough */
  separatorTop?: boolean;
  separatorBottom?: boolean;
}

/* =========================================
   COMPONENT
========================================= */

const UsernameField = ({
  value,
  onChange,
  mode = 'register',
  separatorTop = false,
  separatorBottom = false,
}: Props) => {
  const trimmed = value.trim();
  const isRegister = mode === 'register';

  /* =========================================
     VALIDATIONS
  ========================================= */

  const messages = useMemo(() => {
    if (!isRegister) return [];
    if (!trimmed) return [];

    const issues: { type: 'error' | 'warning'; text: string }[] = [];

    if (!USERNAME_REGEX.test(trimmed)) {
      issues.push({
        type: 'error',
        text: 'Solo se permiten letras, números y guiones bajos (_)',
      });
    }

    if (trimmed.length < USERNAME_MIN) {
      issues.push({
        type: 'warning',
        text: `Debe tener al menos ${USERNAME_MIN} caracteres`,
      });
    }

    if (trimmed.length > USERNAME_MAX) {
      issues.push({
        type: 'error',
        text: `No puede superar los ${USERNAME_MAX} caracteres`,
      });
    }

    return issues;
  }, [trimmed, isRegister]);

  /* =========================================
     STATES
  ========================================= */

  const hasErrors = messages.some((m) => m.type === 'error');
  const hasWarnings = messages.some((m) => m.type === 'warning');

  const success = isRegister && trimmed.length > 0 && !hasErrors && !hasWarnings;

  /* =========================================
     HANDLER (FORCE LOWERCASE)
  ========================================= */

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const lower = e.target.value.toLowerCase();
    e.target.value = lower;
    onChange(e);
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <AuthField
      label="Usuario"
      name="username"
      type="text"
      autoComplete="username"
      value={value}
      onChange={handleChange}
      required
      error={isRegister ? hasErrors : false}
      success={success}
      messages={isRegister ? messages : []}
      hint={isRegister ? `${USERNAME_MIN}-${USERNAME_MAX} caracteres` : undefined}
      description={
        isRegister ? (
          <>
            El nombre de usuario:
            <ul className="list-disc pl-4 mt-1 space-y-1">
              <li>
                Debe tener entre {USERNAME_MIN} y {USERNAME_MAX} caracteres
              </li>
              <li>Solo puede contener letras, números y guiones bajos (_)</li>
              <li>Se guardará siempre en minúsculas</li>
            </ul>
          </>
        ) : undefined
      }
      showHelpToggle={isRegister}
      leftSlot={[<UserIcon key="icon" />]}
      maxLength={USERNAME_MAX}
      separatorTop={separatorTop}
      separatorBottom={separatorBottom}
    />
  );
};

export default UsernameField;
