import './AuthPages.css';
import { useRegisterStore } from '@IAM/IAMStore';
import { RegisterHook } from '@IAM/IAMHooks';

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
  const form = useRegisterStore();
  const register = RegisterHook();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = await form.validateAllFields();
    if (!isValid) return;

    try {
      await register.execute({
        body: form.getValues(),
      });

      console.log(register.response?.message);
    } catch (err) {
      console.log(register.error);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <form onSubmit={handleSubmit} className="auth-form">
          {/* ================= PERSONAL ================= */}
          <h3 className="auth-section-title">Información Personal</h3>
          <FirstNameFieldComponent />
          <SecondNameFieldComponent />
          <LastNameFieldComponent />
          <SexFieldComponent />

          {/* ================= CREDENTIALS ================= */}
          <h3 className="auth-section-title">Credenciales</h3>
          <UsernameFieldComponent />
          <PasswordFieldComponent />
          <CPasswordFieldComponent />

          {/* ================= CONTACT ================= */}
          <h3 className="auth-section-title">Contacto</h3>
          <EmailFieldComponent />
          <PhoneFieldComponent />

          <button
            type="submit"
            className="auth-button"
            disabled={!form.isFormValid || register.isLoading}
          >
            {register.isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          {register.isError && <p className="auth-error">{register.error?.message}</p>}

          {register.isSuccess && <p className="auth-success">{register.response?.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
