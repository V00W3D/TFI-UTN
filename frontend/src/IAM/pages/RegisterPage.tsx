import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './register-page.css';

import { useRegisterStore } from '@IAM/store/IAMStore';

import UsernameField from '@IAM/components/UsernameField';
import PasswordField from '@IAM/components/PasswordField';
import NameField from '@IAM/components/NameField';
import SexField from '@IAM/components/SexField';
import EmailField from '@IAM/components/EmailField';
import PhoneField from '@IAM/components/PhoneField';

const RegisterPage = () => {
  const {
    firstName,
    middleName,
    lastName,
    username,
    email,
    phone,
    password,
    confirmPassword,
    sex,
    isFormValid,
  } = useRegisterStore();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    console.log({
      firstName,
      middleName,
      lastName,
      username,
      email,
      phone,
      password,
      confirmPassword,
      sex,
    });
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <form onSubmit={handleSubmit} className="register-form">
          {/* ================= PERSONAL ================= */}
          <h3 className="section-title">Información Personal</h3>

          <NameField field="firstName" />
          <NameField field="middleName" />
          <NameField field="lastName" />

          <SexField />

          {/* ================= CREDENTIALS ================= */}
          <h3 className="section-title">Credenciales</h3>

          <UsernameField />
          <PasswordField mode="password" />
          <PasswordField mode="confirm" />

          {/* ================= CONTACT ================= */}
          <h3 className="section-title">Contacto</h3>

          <EmailField />
          <PhoneField />

          <button type="submit" className="register-button" disabled={!isFormValid}>
            Crear Cuenta
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
