import React from 'react';
import AuthField from '../common/AuthField';
import { useRegisterStore } from '@IAM/store/IAMStore';

/* =========================================
   COMPONENT
========================================= */

const EmailField = () => {
  const { email, vEmail, setEmail } = useRegisterStore();

  /* =========================================
     HANDLER
  ========================================= */

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setEmail(e.target.value);
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <AuthField
      label="Correo electrónico"
      name="email"
      type="email"
      autoComplete="email"
      value={email}
      onChange={handleChange}
      required
      maxLength={254}
      validate={vEmail}
      inputIcon="/email-icon.png"
      placeholder="ejemplo@correo.com"
      hint="Ingresa un correo válido"
      rules={[
        'Debe ser un correo electrónico válido',
        'Debe incluir un @',
        'Debe incluir un dominio válido (ej: .com, .net)',
      ]}
      showHelpToggle
    />
  );
};

export default EmailField;
