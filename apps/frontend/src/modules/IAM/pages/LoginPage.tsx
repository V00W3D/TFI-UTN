import './AuthPages.css';
import { sdk, form } from '@tools/sdk';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const LoginPage = () => {
  const { fields, submit } = form.iam.login;
  const { data, error, isFetching, isFormValid } = sdk.iam.login.$use();
  const navigate = useNavigate();

  useEffect(() => {
    sdk.iam.login.$reset();
  }, []);

  useEffect(() => {
    if (data && !error) {
      navigate('/', { replace: true });
    }
  }, [data, error, navigate]);

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <form
          onSubmit={submit(async (values) => {
            if (isFetching) return;
            try {
              await sdk.iam.login(values);
            } catch {
              // el error ya queda en el store
            }
          })}
          className="auth-form"
        >
          <fields.identity
            label="Usuario o Email"
            required
            fieldMode="login"
            addons={[{ type: 'rubber' }]}
          />

          <fields.password
            label="Contraseña"
            required
            fieldMode="login"
            control="password"
            addons={[{ type: 'passwordToggle' }, { type: 'rubber' }]}
          />

          <button type="submit" className="auth-button" disabled={isFetching || !isFormValid}>
            {isFetching ? 'Entrando...' : 'Entrar'}
          </button>

          {error && <p className="auth-error">{error.code.toString()}</p>}
          {data && <p className="auth-success">Login exitoso</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
