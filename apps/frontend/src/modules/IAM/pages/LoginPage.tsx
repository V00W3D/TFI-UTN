import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';
import { form } from '../../../tools/sdk';
import './AuthPages.css';

/**
 * @file LoginPage.tsx
 * @author Victor
 * @description Authentication entry point.
 */
const LoginPage = () => {
  const { setModule, setUser } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    setModule('IAM');
  }, [setModule]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Bienvenido de Nuevo</h2>
        <p className="auth-subtitle">Ingrese sus credenciales para continuar</p>

        <form.Login
          onSuccess={(user) => {
            setUser(user);
            navigate('/');
          }}
          className="auth-form"
        />

        <div className="auth-footer">
          ¿No tiene una cuenta?{' '}
          <button onClick={() => navigate('/iam/register')} className="auth-link">
            Regístrese
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
