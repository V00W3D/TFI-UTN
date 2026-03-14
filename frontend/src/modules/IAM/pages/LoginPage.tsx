import './AuthPages.css';
import { useLoginStore } from '@modules/IAM/IAMStore';
import { LoginHook } from '@modules/IAM/IAMHooks';

import IdentityFieldComponent from '@modules/IAM/components/Login/IdentityField';
import LPasswordFieldComponent from '@modules/IAM/components/Login/PasswordField';

const LoginPage = () => {
  const form = useLoginStore();
  const login = LoginHook();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = await form.validate();
    if (!isValid) return;

    try {
      const result = await login({
        body: form.getValues(),
      });

      console.log(result);
    } catch {
      console.log(login.error);
    }
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
            disabled={!form.isFormValid || login.loading}
          >
            {login.loading ? 'Entrando...' : 'Entrar'}
          </button>

          {login.error && <p className="auth-error">{login.error.error.code}</p>}

          {login.data && <p className="auth-success">Login exitoso</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
