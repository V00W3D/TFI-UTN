import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';
import { form } from '../../../tools/sdk';
import './AuthPages.css';

/**
 * @file LoginPage.tsx
 * @description Sovereign V4 Symmetric Login.
 */
const LoginPage = () => {
  const { setModule, setUser } = useAppStore();
  const navigate = useNavigate();
  const { Form, fields } = form.iam.login;

  useEffect(() => {
    setModule('IAM');
  }, [setModule]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Bienvenido</h2>
          <p className="auth-subtitle">Socio QART Privilege</p>
        </div>

        <Form 
          buttonText="Iniciar Sesión" 
          onSuccess={(res) => {
            setUser(res.data);
            navigate('/');
          }}
        >
          <div className="auth-form">
            <fields.identity label="Identidad" placeholder="victor_qart" required />
            <fields.password label="Contraseña" control="password" required />
          </div>
        </Form>

        <div className="auth-footer">
          ¿No es socio aún?{' '}
          <button onClick={() => navigate('/iam/register')} className="auth-link">
            Unirse al Legado
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
