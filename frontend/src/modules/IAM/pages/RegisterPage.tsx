import './AuthPages.css';

import { useRegisterStore } from '@modules/IAM/IAMStore';

import { trpc } from '@tools/trpcClient';

import UsernameFieldComponent from '@modules/IAM/components/Register/UsernameField';
import PasswordFieldComponent from '@modules/IAM/components/Register/PasswordField';
import CPasswordFieldComponent from '@modules/IAM/components/Register/ConfirmPasswordField';

import {
  FirstNameFieldComponent,
  LastNameFieldComponent,
  SecondNameFieldComponent,
} from '@modules/IAM/components/Register/NameField';

import SexFieldComponent from '@modules/IAM/components/Register/SexField';
import EmailFieldComponent from '@modules/IAM/components/Register/EmailField';
import PhoneFieldComponent from '@modules/IAM/components/Register/PhoneField';

const RegisterPage = () => {
  const form = useRegisterStore();

  /* ================= TRPC MUTATION ================= */

  const register = trpc.iam.registerController.useMutation();
  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = await form.validateAllFields();
    if (!isValid) return;

    try {
      const response = await register.mutateAsync({
        body: form.getValues(),
      });

      console.log(response.message);
    } catch (err) {
      console.log(register.error);
    }
  };

  /* ================= UI ================= */

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

          <button type="submit" className="auth-button" disabled={register.isPending}>
            {register.isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          {register.isError && <p className="auth-error">{register.error.message}</p>}

          {register.isSuccess && <p className="auth-success">{register.data.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
