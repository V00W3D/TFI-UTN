import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';
import { form } from '../../../tools/sdk';
import { FormSection } from '../../../tools/FormFactory';
import './AuthPages.css';

/**
 * @file RegisterPage.tsx
 * @author Victor
 * @description User registration page.
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
      <div className="auth-card register-card-wide">
        <h2 className="auth-title">Crear Cuenta</h2>
        <p className="auth-subtitle">Únase a la experiencia QART</p>

        <Form buttonText="Finalizar Registro" onSuccess={() => navigate('/iam/login')}>
          <div className="grid md:grid-cols-2 gap-x-12">
            <FormSection title="Datos Personales">
              <fields.name label="Nombre" placeholder="Tu nombre" required />
              <fields.lname label="Apellido" placeholder="Tu apellido" required />
              <fields.sex
                label="Sexo"
                control={[
                  'radio',
                  [
                    { value: 'MALE', label: 'Hombre', icon: '/male-icon.png' },
                    { value: 'FEMALE', label: 'Mujer', icon: '/female-icon.png' },
                    { value: 'OTHER', label: 'Otro', icon: '/other-icon.png' },
                  ],
                ]}
                required
              />
            </FormSection>

            <FormSection title="Cuenta y Seguridad">
              <fields.username label="Usuario" placeholder="victor_qart" required />
              <fields.email
                label="Email"
                placeholder="victor@example.com"
                control="email"
                required
              />
              <fields.phone label="Teléfono" control="phone" required />
              <fields.password
                label="Contraseña"
                control="password"
                required
                addons={[{ type: 'passwordToggle' }, { type: 'strength' }]}
              />
              <fields.cpassword
                label="Confirmar Contraseña"
                control="password"
                required
                addons={[{ type: 'passwordToggle' }]}
              />
            </FormSection>
          </div>
        </Form>

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
