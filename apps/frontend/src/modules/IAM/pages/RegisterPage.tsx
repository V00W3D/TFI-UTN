import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';
import { form } from '../../../tools/sdk';
import './AuthPages.css';

/**
 * @file RegisterPage.tsx
 * @author Victor
 * @description User registration page.
 */
const RegisterPage = () => {
  const { setModule } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    setModule('IAM');
  }, [setModule]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Crear Cuenta</h2>
        <p className="auth-subtitle">Únase a la experiencia QART</p>

        <form.Register
          onSuccess={() => {
            navigate('/iam/login');
          }}
          className="auth-form"
        />

        <div className="auth-footer">
          ¿Ya tiene una cuenta?{' '}
          <button onClick={() => navigate('/iam/login')} className="auth-link">
            Inicie sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
