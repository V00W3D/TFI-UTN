import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';
import { form } from '../../../tools/sdk';
import './AuthPages.css';

/**
 * @file LoginPage.tsx
 * @description The elegant, stable Login page based on Tailwind grids and deep bordeaux backgrounds.
 */
const LoginPage = () => {
  const { setModule, setUser } = useAppStore();
  const navigate = useNavigate();
  const { Form, fields } = form.iam.login;

  useEffect(() => {
    setModule('IAM');
  }, [setModule]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-qart-bg">
      <div className="w-full max-w-md bg-qart-surface border border-qart-border p-8 md:p-12 shadow-elegant rounded-sm relative overflow-hidden">
        
        {/* Decorative Golden Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-qart-accent" />

        <div className="text-center mb-10">
          <img src="/QART_LOGO.png" alt="QART" className="h-8 mx-auto mb-4" />
          <h2 className="text-3xl font-serif text-qart-primary mb-2">Bienvenido</h2>
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-qart-text-muted">
            Privilege Club
          </p>
        </div>

        <Form 
          buttonText="Iniciar Sesión" 
          onSuccess={(res) => {
            setUser(res.data);
            navigate('/');
          }}
        >
          <div className="space-y-6">
            <fields.identity label="Usuario o Email" placeholder="victor_qart" required />
            <fields.password label="Contraseña" control="password" required />
          </div>
        </Form>

        <div className="mt-10 text-center text-sm text-qart-text-muted">
          ¿No es socio aún?{' '}
          <button 
            onClick={() => navigate('/iam/register')} 
            className="font-bold text-qart-primary hover:text-qart-accent transition-colors border-b border-qart-primary/30 hover:border-qart-accent"
          >
            Solicitar Membresía
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
