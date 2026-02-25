import React, { useMemo, useState } from 'react';
import AuthField from '../common/AuthField';

/* =========================================
   ICON
========================================= */

const KeyIcon = () => (
  <div className="flex items-center justify-center shrink-0">
    <img src="/key-icon.png" alt="key-icon" className="w-5 h-5 object-contain" />
  </div>
);

/* =========================================
   TYPES
========================================= */

interface Props {
  value: string;
  versus: string; // contraseña original a comparar
  onChange: React.ChangeEventHandler<HTMLInputElement>;

  /** Separators passthrough */
  separatorTop?: boolean;
  separatorBottom?: boolean;
}

/* =========================================
   COMPONENT
========================================= */

const ConfirmPasswordField = ({
  value,
  versus,
  onChange,
  separatorTop = false,
  separatorBottom = false,
}: Props) => {
  const [visible, setVisible] = useState(false);

  const password = value;
  const original = versus;

  /* =========================================
     VALIDATION
  ========================================= */

  const { error, success, messages } = useMemo(() => {
    if (!password) {
      return {
        error: false,
        success: false,
        messages: [] as { type: 'error' | 'warning'; text: string }[],
      };
    }

    if (!original) {
      return {
        error: false,
        success: false,
        messages: [
          {
            type: 'warning' as const,
            text: 'Primero debes ingresar una contraseña',
          },
        ],
      };
    }

    if (password !== original) {
      return {
        error: true,
        success: false,
        messages: [
          {
            type: 'error' as const,
            text: 'Las contraseñas no coinciden',
          },
        ],
      };
    }

    return {
      error: false,
      success: true,
      messages: [] as { type: 'error' | 'warning'; text: string }[],
    };
  }, [password, original]);

  /* =========================================
     RENDER
  ========================================= */

  return (
    <AuthField
      label="Confirmar contraseña"
      name="confirmPassword"
      type={visible ? 'text' : 'password'}
      autoComplete="new-password"
      value={value}
      onChange={onChange}
      required
      error={error}
      success={success}
      messages={messages}
      hint="Vuelve a escribir la contraseña"
      description={
        <>
          Esta contraseña debe coincidir exactamente con la anterior.
          <ul className="list-disc pl-4 mt-1 space-y-1">
            <li>Debe ser idéntica carácter por carácter</li>
            <li>Respeta mayúsculas y símbolos</li>
          </ul>
        </>
      }
      showHelpToggle
      leftSlot={[<KeyIcon key="icon" />]}
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
      separatorTop={separatorTop}
      separatorBottom={separatorBottom}
    />
  );
};

export default ConfirmPasswordField;
