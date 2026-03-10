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

    const isValid = await form.validateAllFields();
    if (!isValid) return;

    try {
      await login.execute({
        body: form.getValues(),
      });

      console.log(login.response?.message);
    } catch (err) {
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
            disabled={!form.isFormValid || login.isLoading}
          >
            {login.isLoading ? 'Entrando...' : 'Entrar'}
          </button>

          {login.isError && <p className="auth-error">{login.error?.message}</p>}

          {login.isSuccess && <p className="auth-success">{login.response?.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
