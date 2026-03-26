import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../../appStore';
import { form, sdk } from '../../../tools/sdk';
import { FormSection } from '../../../tools/FormFactory';

/**
 * @file RegisterPage.tsx
 * @description Dynamic, fast-casual Register with reactive Zustand SDK states.
 */
const RegisterPage = () => {
  const { setModule } = useAppStore();
  const navigate = useNavigate();

  // The "Beautiful UX Component" SDK reactive state Hook
  const { data, error, isFetching, isFormValid } = sdk.iam.register.$use();
  const { Form, fields } = form.iam.register;

  useEffect(() => {
    setModule('IAM');
  }, [setModule]);

  useEffect(() => {
    if (data && 'data' in data) {
      navigate('/iam/login');
    }
  }, [data, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-qart-bg relative overflow-hidden">
      {/* Enterprise Solid Background Elements */}
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-gray-100 skew-y-6 transform origin-bottom-left" />

      <div className="w-full max-w-4xl bg-qart-surface p-8 md:p-12 shadow-bouncy rounded-xl relative z-10 border-2 border-qart-border">
        <div className="text-center md:text-left mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-2 border-qart-border">
          <div>
            <h2 className="text-3xl md:text-4xl font-display text-qart-primary mb-2 uppercase tracking-tighter">
              Únete a QART
            </h2>
            <p className="text-sm font-bold text-qart-text-muted">Crea tu cuenta en 1 minuto.</p>
          </div>
          <div className="w-16 h-16 bg-qart-primary text-white rounded-lg flex items-center justify-center font-display text-4xl shadow-md mx-auto md:mx-0 transform rotate-3">
            🍟
          </div>
        </div>

        {/* --- DYNAMIC REACTIVE ERROR BANNER --- */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-red-50 border-l-4 border-qart-error p-4 rounded-r-md">
                <div className="flex">
                  <div className="shrink-0">
                    <svg
                      className="h-5 w-5 text-qart-error"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-bold text-red-800">
                      Error: Revisa los datos ingresados.{' '}
                      {error.code === 'VALIDATION_ERROR' && 'Formato inválido.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- DYNAMIC LOADING OVERLAY --- */}
        <div className="relative">
          {isFetching && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-lg">
              <div className="w-12 h-12 border-4 border-qart-border border-t-qart-accent rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-bold text-qart-primary">Creando cuenta...</p>
            </div>
          )}

          <Form buttonText={isFetching ? 'Procesando...' : 'Crear Cuenta'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 text-left">
              <FormSection title="Tus Datos" className="space-y-4">
                <fields.name label="Nombre" placeholder="Tu nombre" required />
                <fields.lname label="Apellido" placeholder="Tu apellido" required />
                <fields.sex
                  label="Género"
                  control={[
                    'radio',
                    [
                      { value: 'MALE', label: 'Él', icon: '/m.png' },
                      { value: 'FEMALE', label: 'Ella', icon: '/f.png' },
                      { value: 'OTHER', label: 'Otro', icon: '/o.png' },
                    ],
                  ]}
                  required
                />
              </FormSection>

              <FormSection title="Cuenta" className="space-y-4">
                <fields.username label="Usuario" placeholder="ej. burger_lover" required />
                <fields.email
                  label="Email"
                  placeholder="hola@example.com"
                  control="email"
                  required
                />
                <fields.password label="Contraseña" control="password" required />
                <fields.phone label="Teléfono" control="phone" required />
              </FormSection>
            </div>
          </Form>
        </div>

        {/* Validation hint based on reactive store */}
        {!isFormValid && !isFetching && (
          <p className="mt-6 text-xs text-center text-qart-text-muted font-bold">
            Todos los campos marcados con * son obligatorios.
          </p>
        )}

        <div className="mt-10 pt-8 border-t-2 border-qart-border text-center text-sm font-bold text-qart-text-muted">
          ¿Ya tenés cuenta?{' '}
          <button
            onClick={() => navigate('/iam/login')}
            className="text-qart-accent hover:text-red-700 transition-colors cursor-pointer"
          >
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
