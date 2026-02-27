import React from 'react';
import AuthField from '../common/AuthField';
import { useRegisterStore } from '@IAM/store/IAMStore';

/* =========================================
   CONFIG
========================================= */

const NAME_MIN = 2;
const NAME_MAX = 50;

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

/* =========================================
   PROPS
========================================= */

interface Props {
  field: 'firstName' | 'middleName' | 'lastName';
}

/* =========================================
   COMPONENT
========================================= */

const NameField = ({ field }: Props) => {
  const {
    firstName,
    middleName,
    lastName,
    vFirstName,
    vMiddleName,
    vLastName,
    setFirstName,
    setMiddleName,
    setLastName,
  } = useRegisterStore();

  const valueMap = {
    firstName,
    middleName,
    lastName,
  };

  const validationMap = {
    firstName: vFirstName,
    middleName: vMiddleName,
    lastName: vLastName,
  };

  const setterMap = {
    firstName: setFirstName,
    middleName: setMiddleName,
    lastName: setLastName,
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setterMap[field](e.target.value);
  };

  return (
    <AuthField
      label={labelMap[field]}
      name={field}
      type="text"
      autoComplete="given-name"
      value={valueMap[field]}
      onChange={handleChange}
      required={field !== 'middleName'}
      validate={validationMap[field]}
      inputIcon={iconMap[field]}
      hint={`${NAME_MIN}-${NAME_MAX} caracteres`}
      rules={[
        `Debe tener entre ${NAME_MIN} y ${NAME_MAX} caracteres`,
        'Solo puede contener letras, espacios, guiones y apóstrofes',
      ]}
      showHelpToggle
      maxLength={NAME_MAX}
    />
  );
};

export default NameField;
