import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';
import { form } from '../../../tools/sdk';
import { FormSection } from '../../../tools/FormFactory';
import './AuthPages.css';

/**
 * @file RegisterPage.tsx
 * @description Sovereign V4 Symmetric Register.
 */
const RegisterPage = () => {
  const { setModule } = useAppStore();
  const navigate = useNavigate();
  const { Form, fields } = form.iam.register;

  useEffect(() => {
    setModule('IAM');
  }, [setModule]);

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="auth-header">
          <h2 className="auth-title">Membresía</h2>
          <p className="auth-subtitle">Suscríbase a la Excelencia</p>
        </div>

        <Form buttonText="Finalizar Registro" onSuccess={() => navigate('/iam/login')}>
          <div className="grid md:grid-cols-2 gap-x-[var(--p-12)] gap-y-[var(--p-8)] text-left">
            <FormSection title="Perfil de Autor">
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

            <FormSection title="Credenciales">
              <fields.username label="Socio ID" required />
              <fields.email label="Email Personal" control="email" required />
              <fields.password label="Contraseña" control="password" required />
              <fields.phone label="Teléfono" control="phone" required />
            </FormSection>
          </div>
        </Form>

        <div className="auth-footer">
          ¿Ya tiene una cuenta?{' '}
          <button onClick={() => navigate('/iam/login')} className="auth-link">
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
