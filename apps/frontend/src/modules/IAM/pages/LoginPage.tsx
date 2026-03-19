import './AuthPages.css';
import { sdk } from '@tools/sdk';

import IdentityFieldComponent from '@modules/IAM/components/Login/IdentityField';
import LPasswordFieldComponent from '@modules/IAM/components/Login/PasswordField';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import type React from 'react';

const LoginPage = () => {
  const form = sdk.iam.login.$form();
  const { data, error, isFetching } = sdk.iam.login.$use();
  const navigate = useNavigate();

  useEffect(() => {
    sdk.iam.login.$reset();
  }, []);

  useEffect(() => {
    if (data && !error) {
      navigate('/', { replace: true });
    }
  }, [data, error]);

  const handleSubmit: React.ReactEventHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isFetching) return;

    const isValid = await form.validate();
    if (!isValid) return;

    try {
      await sdk.iam.login(form.getValues());
    } catch {
      // el error ya queda en el store, el render lo muestra
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <form onSubmit={handleSubmit} className="auth-form">
          <IdentityFieldComponent />
          <LPasswordFieldComponent />

          <button type="submit" className="auth-button" disabled={!form.isFormValid || isFetching}>
            {isFetching ? 'Entrando...' : 'Entrar'}
          </button>

          {error && <p className="auth-error">{error.message}</p>}
          {data && <p className="auth-success">Login exitoso</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
