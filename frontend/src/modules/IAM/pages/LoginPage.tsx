import './AuthPages.css';
import { useLoginStore } from '@modules/IAM/IAMStore';
import { api } from '@tools/api';

import IdentityFieldComponent from '@modules/IAM/components/Login/IdentityField';
import LPasswordFieldComponent from '@modules/IAM/components/Login/PasswordField';

const LoginPage = () => {
  const form = useLoginStore();
  const login = api.IAM.login;

  const handleSubmit: React.ReactEventHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = await form.validate();
    if (!isValid) return;

    const result = await login.call(form.getValues());
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
            disabled={!form.isFormValid || login.isLoading}
          >
            {login.isLoading ? 'Entrando...' : 'Entrar'}
          </button>

          {login.error && <p className="auth-error">{login.error.error.code}</p>}

          {login.data && <p className="auth-success">Login exitoso</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
