import 'react-phone-number-input/style.css';
import './register-page.css';
import { useRegisterStore } from '@IAM/store/IAMStore';
import axios from 'axios';
import UsernameField from '@IAM/components/UsernameField';

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
    const compras = axios.get('https://apirest-production-8554.up.railway.app/compras');

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
      compras,
    });
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <form onSubmit={handleSubmit} className="register-form">
          {/* ================= PERSONAL ================= */}
          <h3 className="section-title">Información Personal</h3>
          {/* <RegisterField for="firstName" />
          <RegisterField for="middleName" />
          <RegisterField for="lastName" />
          <RegisterField for="sex" /> */}
          {/* ================= CREDENTIALS ================= */}
          <h3 className="section-title">Credenciales</h3>
          {/* <RegisterField for="username" /> */}
          <UsernameField />
          {/* <RegisterField for="password" />
          <RegisterField for="confirmPassword" /> */}
          {/* ================= CONTACT ================= */}
          <h3 className="section-title">Contacto</h3>
          {/* <RegisterField for="email" />
          <RegisterField for="phone" /> */}
          <button type="submit" className="register-button" disabled={!isFormValid}>
            Crear Cuenta
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
