import './AuthPages.css';
import { useLoginStore } from '@modules/IAM/IAMStore';
import { api } from '@shared/apiclient';

import IdentityFieldComponent from '@modules/IAM/components/Login/IdentityField';
import LPasswordFieldComponent from '@modules/IAM/components/Login/PasswordField';

const LoginPage = () => {
  const form = useLoginStore();
  const login = api.iam.login;

  const handleSubmit: React.ReactEventHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = await form.validate();
    if (!isValid) return;

    const result = await login(form.getValues());
    console.log(result);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <form onSubmit={handleSubmit} className="auth-form">
          <IdentityFieldComponent />
          <LPasswordFieldComponent />

          <button
            type="submit"
            className="auth-button"
            disabled={!form.isFormValid || login.$isFetching}
          >
            {login.$isFetching ? 'Entrando...' : 'Entrar'}
          </button>

          {login.$error && <p className="auth-error">{login.$data?.data}</p>}

          {login.$data && <p className="auth-success">Login exitoso</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
