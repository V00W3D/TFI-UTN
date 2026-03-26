import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';
import { form } from '../../../tools/sdk';
import { FormSection } from '../../../tools/FormFactory';
import './AuthPages.css';

/**
 * @file RegisterPage.tsx
 * @description The fully un-collapsible, elegant 2-column Register layout.
 */
const RegisterPage = () => {
  const { setModule } = useAppStore();
  const navigate = useNavigate();
  const { Form, fields } = form.iam.register;

  useEffect(() => {
    setModule('IAM');
  }, [setModule]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-qart-bg">
      <div className="w-full max-w-4xl bg-qart-surface border border-qart-border p-8 md:p-14 shadow-elegant rounded-sm relative overflow-hidden">
        
        {/* Decorative Golden Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-qart-accent" />

        <div className="text-center md:text-left mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-qart-border">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-qart-primary mb-2">Membresía</h2>
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-qart-text-muted">
              Únase al Legado Gastronómico
            </p>
          </div>
          <img src="/QART_LOGO.png" alt="QART" className="h-10 mx-auto md:mx-0 opacity-80" />
        </div>

        <Form buttonText="Finalizar Registro" onSuccess={() => navigate('/iam/login')}>
          {/* Un-collapsible Grid: 1 col on mobile, 2 col on md/lg */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 text-left">
            <FormSection title="Perfil de Autor" className="space-y-6">
              <fields.name label="Nombre" placeholder="Tu nombre" required />
              <fields.lname label="Apellido" placeholder="Tu apellido" required />
              <fields.sex
                label="Género"
                control={[
                  'radio',
                  [
                    { value: 'MALE', label: 'H', icon: '/m.png' },
                    { value: 'FEMALE', label: 'M', icon: '/f.png' },
                    { value: 'OTHER', label: '?', icon: '/o.png' },
                  ],
                ]}
                required
              />
            </FormSection>

            <FormSection title="Credenciales" className="space-y-6">
              <fields.username label="Socio ID" required />
              <fields.email label="Email Personal" control="email" required />
              <fields.password label="Contraseña" control="password" required />
              <fields.phone label="Teléfono" control="phone" required />
            </FormSection>
          </div>
        </Form>

        <div className="mt-12 pt-8 border-t border-qart-border text-center text-sm text-qart-text-muted">
          ¿Ya es socio activo?{' '}
          <button 
            onClick={() => navigate('/iam/login')} 
            className="font-bold text-qart-primary hover:text-qart-accent transition-colors border-b border-qart-primary/30 hover:border-qart-accent"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
