import './AuthPages.css';

import { sdk } from '@tools/sdk';
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
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const RegisterPage = () => {
  const form = sdk.iam.register.$form();
  const { data, error, isFetching } = sdk.iam.register.$use();
  const navigate = useNavigate();

  useEffect(() => {
    sdk.iam.register.$reset();
  }, []);

  useEffect(() => {
    if (data && !error) {
      navigate('/iam/login', { replace: true });
    }
  }, [data, error]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isFetching) return;

    const isValid = await form.validate();
    if (!isValid) return;

    try {
      await sdk.iam.register(form.getValues());
    } catch {
      // el error ya queda en el store, el render lo muestra
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <form onSubmit={handleSubmit} className="auth-form">
          <h3 className="auth-section-title">Información Personal</h3>

          <FirstNameFieldComponent />
          <SecondNameFieldComponent />
          <LastNameFieldComponent />
          <SexFieldComponent />

          <h3 className="auth-section-title">Credenciales</h3>

          <UsernameFieldComponent />
          <PasswordFieldComponent />
          <CPasswordFieldComponent />

          <h3 className="auth-section-title">Contacto</h3>

          <EmailFieldComponent />
          <PhoneFieldComponent />

          <button type="submit" className="auth-button" disabled={isFetching || !form.isFormValid}>
            {isFetching ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          {error && <p className="auth-error">{error.message}</p>}
          {data && <p className="auth-success">Registro exitoso</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
