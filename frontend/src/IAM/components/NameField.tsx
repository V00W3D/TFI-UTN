import React, { useMemo } from 'react';
import AuthField from '../common/AuthField';

/* =========================================
   BACKEND-ALIGNED LIMITS & REGEX
========================================= */

const NAME_MIN = 2;
const NAME_MAX = 50;
const NAME_REGEX = /^[A-Za-zÀ-ÿ\s'-]+$/;

/* =========================================
   ICON MAP
========================================= */

const iconMap: Record<'firstName' | 'middleName' | 'lastName', string> = {
  firstName: '/first-name.png',
  middleName: '/second-name.png',
  lastName: '/last-name.png',
};

const labelMap: Record<'firstName' | 'middleName' | 'lastName', string> = {
  firstName: 'Primer nombre',
  middleName: 'Segundo nombre',
  lastName: 'Apellido',
};

const NameIcon = ({ type }: { type: 'firstName' | 'middleName' | 'lastName' }) => (
  <div className="flex items-center justify-center shrink-0">
    <img src={iconMap[type]} alt={type} className="w-5 h-5 object-contain" />
  </div>
);

/* =========================================
   PROPS
========================================= */

interface Props {
  field: 'firstName' | 'middleName' | 'lastName';
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  separatorTop?: boolean;
  separatorBottom?: boolean;
}

/* =========================================
   COMPONENT
========================================= */

const NameField = ({
  field,
  value,
  onChange,
  separatorTop = false,
  separatorBottom = false,
}: Props) => {
  const trimmed = value.trim();

  const messages = useMemo(() => {
    if (!trimmed) return [];

    const issues: { type: 'error' | 'warning'; text: string }[] = [];

    if (!NAME_REGEX.test(trimmed)) {
      issues.push({
        type: 'error',
        text: 'Solo se permiten letras, espacios, guiones y apóstrofes',
      });
    }

    if (trimmed.length < NAME_MIN) {
      issues.push({
        type: 'warning',
        text: `Debe tener al menos ${NAME_MIN} caracteres`,
      });
    }

    if (trimmed.length > NAME_MAX) {
      issues.push({
        type: 'error',
        text: `No puede superar los ${NAME_MAX} caracteres`,
      });
    }

    return issues;
  }, [trimmed]);

  const hasErrors = messages.some((m) => m.type === 'error');
  const hasWarnings = messages.some((m) => m.type === 'warning');

  const success =
    trimmed.length >= NAME_MIN && trimmed.length <= NAME_MAX && NAME_REGEX.test(trimmed);

  return (
    <AuthField
      label={labelMap[field]}
      name={field}
      type="text"
      autoComplete="given-name"
      value={value}
      onChange={onChange}
      required
      error={hasErrors}
      success={success && !hasWarnings}
      messages={messages}
      hint={`${NAME_MIN}-${NAME_MAX} caracteres`}
      description={
        <>
          Este campo:
          <ul className="list-disc pl-4 mt-1 space-y-1">
            <li>
              Debe tener entre {NAME_MIN} y {NAME_MAX} caracteres
            </li>
            <li>Solo puede contener letras, espacios, guiones y apóstrofes</li>
          </ul>
        </>
      }
      showHelpToggle
      leftSlot={[<NameIcon key="icon" type={field} />]}
      maxLength={NAME_MAX}
      separatorTop={separatorTop}
      separatorBottom={separatorBottom}
    />
  );
};

export default NameField;
