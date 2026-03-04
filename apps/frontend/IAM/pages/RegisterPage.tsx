import './register-page.css';
import { useRegisterStore } from '@IAM/store/IAMStore';

import UsernameFieldComponent from '@IAM/components/Register/UsernameField';
import PasswordFieldComponent from '@IAM/components/Register/PasswordField';
import CPasswordFieldComponent from '@IAM/components/Register/ConfirmPasswordField';
import {
  FirstNameFieldComponent,
  LastNameFieldComponent,
  SecondNameFieldComponent,
} from '@IAM/components/Register/NameField';
import SexFieldComponent from '@IAM/components/Register/SexField';
import EmailFieldComponent from '@IAM/components/Register/EmailField';
import PhoneFieldComponent from '@IAM/components/Register/PhoneField';

const RegisterPage = () => {
  const submit = useRegisterStore((s) => s.submit);
  const isSubmitting = useRegisterStore((s) => s.isSubmitting);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await submit(async (values) => {
      console.log('Valores válidos:', values);

      // acá iría tu llamada a API
      // await api.register(values)
    });
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <form onSubmit={handleSubmit} className="register-form">
          {/* ================= PERSONAL ================= */}
          <h3 className="section-title">Información Personal</h3>
          <FirstNameFieldComponent />
          <SecondNameFieldComponent />
          <LastNameFieldComponent />
          <SexFieldComponent />

          {/* ================= CREDENTIALS ================= */}
          <h3 className="section-title">Credenciales</h3>
          <UsernameFieldComponent />
          <PasswordFieldComponent />
          <CPasswordFieldComponent />

          {/* ================= CONTACT ================= */}
          <h3 className="section-title">Contacto</h3>
          <EmailFieldComponent />
          <PhoneFieldComponent />

          <button type="submit" className="register-button">
            {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
