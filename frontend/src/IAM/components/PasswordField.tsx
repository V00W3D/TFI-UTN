import React, { useMemo, useState } from 'react';
import AuthField from '../common/AuthField';
import PasswordStrengthPlugin from '../utils/PasswordStrength';

/* =========================================
   LIMITS & REGEX (ALINEADO AL BACKEND)
========================================= */

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 72;

// Exactamente igual a tu backend
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

/* =========================================
   ICON
========================================= */

const LockIcon = () => (
  <div className="flex items-center justify-center shrink-0">
    <img src="/lock-icon.png" alt="lock-icon" className="w-5 h-5 object-contain" />
  </div>
);

/* =========================================
   TYPES
========================================= */

interface Props {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  mode?: 'register' | 'login';
  separatorTop?: boolean;
  separatorBottom?: boolean;
}

/* =========================================
   COMPONENT
========================================= */

const PasswordField = ({
  value,
  onChange,
  mode = 'register',
  separatorTop = false,
  separatorBottom = false,
}: Props) => {
  const [visible, setVisible] = useState(false);

  const password = value;
  const isRegister = mode === 'register';

  /* =========================================
     VALIDATIONS (100% IGUAL BACKEND)
  ========================================= */

  const messages = useMemo(() => {
    if (!isRegister || !password) return [];

    const issues: { type: 'warning' | 'error'; text: string }[] = [];

    if (password.length < PASSWORD_MIN) {
      issues.push({
        type: 'warning',
        text: `Debe tener al menos ${PASSWORD_MIN} caracteres`,
      });
    }

    if (password.length > PASSWORD_MAX) {
      issues.push({
        type: 'error',
        text: `No puede superar los ${PASSWORD_MAX} caracteres`,
      });
    }

    if (!PASSWORD_REGEX.test(password)) {
      issues.push({
        type: 'warning',
        text: 'Debe incluir al menos una mayúscula, una minúscula, un número y un símbolo',
      });
    }

    return issues;
  }, [password, isRegister]);

  const hasErrors = messages.some((m) => m.type === 'error');

  const success =
    isRegister &&
    password.length >= PASSWORD_MIN &&
    password.length <= PASSWORD_MAX &&
    PASSWORD_REGEX.test(password);

  /* =========================================
     PASSWORD STRENGTH PLUGIN
  ========================================= */

  const plugins = useMemo(() => {
    if (!isRegister) return [];

    return [
      {
        position: 'below-input' as const,
        render: () => <PasswordStrengthPlugin password={password} mode="register" />,
      },
    ];
  }, [isRegister, password]);

  /* =========================================
     RENDER
  ========================================= */

  return (
    <AuthField
      label="Contraseña"
      name="password"
      type={visible ? 'text' : 'password'}
      autoComplete={isRegister ? 'new-password' : 'current-password'}
      value={value}
      onChange={onChange}
      required
      error={isRegister ? hasErrors : false}
      success={success}
      messages={isRegister ? messages : []}
      hint={isRegister ? `${PASSWORD_MIN}-${PASSWORD_MAX} caracteres` : undefined}
      description={
        isRegister ? (
          <>
            La contraseña debe:
            <ul className="list-disc pl-4 mt-1 space-y-1">
              <li>
                Tener entre {PASSWORD_MIN} y {PASSWORD_MAX} caracteres
              </li>
              <li>Incluir mayúsculas</li>
              <li>Incluir minúsculas</li>
              <li>Incluir números</li>
              <li>Incluir símbolos</li>
            </ul>
          </>
        ) : undefined
      }
      showHelpToggle={isRegister}
      leftSlot={[<LockIcon key="icon" />]}
      rightSlot={[
        <button
          type="button"
          key="toggle"
          onClick={() => setVisible((v) => !v)}
          className="text-xs font-semibold text-(--text-secondary)"
        >
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>,
      ]}
      maxLength={PASSWORD_MAX}
      plugins={plugins}
      separatorTop={separatorTop}
      separatorBottom={separatorBottom}
    />
  );
};

export default PasswordField;
