import { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './register-page.css';

import UsernameField from '@IAM/components/UsernameField';
import PasswordField from '@IAM/components/PasswordField';
import ConfirmPasswordField from '@IAM/components/ConfirmPasswordField';
import NameField from '@IAM/components/NameField';
import SexField from '@IAM/components/SexField';
import type { SexType } from '@IAM/components/SexField';
type SectionKey = 'personal' | 'credentials' | 'contact';

const RegisterPage = () => {
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    sex: '' as SexType | '',
  });

  /* =========================================
     INPUT HANDLER (ONLY REAL INPUTS)
  ========================================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isSectionComplete = (section: SectionKey) => {
    switch (section) {
      case 'personal':
        return form.firstName && form.lastName && form.sex;
      case 'credentials':
        return (
          form.username &&
          form.password &&
          form.confirmPassword &&
          form.password === form.confirmPassword
        );
      case 'contact':
        return form.email;
      default:
        return false;
    }
  };

  const isFormComplete =
    form.firstName &&
    form.lastName &&
    form.username &&
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword &&
    form.email &&
    form.sex;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;
    console.log(form);
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2 className="register-title">Crear Cuenta</h2>

        <form onSubmit={handleSubmit} className="register-form">
          {/* ================= PERSONAL ================= */}
          <h3 className={`section-title ${isSectionComplete('personal') ? 'section-done' : ''}`}>
            Información Personal
          </h3>

          <NameField field="firstName" value={form.firstName} onChange={handleChange} />

          <NameField field="middleName" value={form.middleName} onChange={handleChange} />

          <NameField field="lastName" value={form.lastName} onChange={handleChange} />

          <SexField
            value={form.sex || 'female'}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                sex: value,
              }))
            }
          />

          {/* ================= CREDENTIALS ================= */}
          <h3 className={`section-title ${isSectionComplete('credentials') ? 'section-done' : ''}`}>
            Credenciales
          </h3>

          <UsernameField value={form.username} onChange={handleChange} mode="register" />

          <PasswordField value={form.password} onChange={handleChange} mode="register" />

          <ConfirmPasswordField
            value={form.confirmPassword}
            onChange={handleChange}
            versus={form.password}
          />

          {/* ================= CONTACT ================= */}
          <h3 className={`section-title ${isSectionComplete('contact') ? 'section-done' : ''}`}>
            Contacto
          </h3>

          <div className="register-grid">
            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Teléfono</label>
              <PhoneInput
                defaultCountry="AR"
                value={form.phone}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    phone: value || '',
                  }))
                }
                className="phone-input"
              />
            </div>
          </div>

          <button type="submit" className="register-button" disabled={!isFormComplete}>
            Crear Cuenta
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
