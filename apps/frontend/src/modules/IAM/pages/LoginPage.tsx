import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../../appStore';
import { form, sdk } from '../../../tools/sdk';

/**
 * @file LoginPage.tsx
 * @description Dynamic, fast-casual Login with reactive Zustand SDK states.
 */
const LoginPage = () => {
  const { setModule, setUser } = useAppStore();
  const navigate = useNavigate();

  // The "Beautiful UX Component" SDK reactive state Hook
  const { data, error, isFetching, isFormValid } = sdk.iam.login.$use();
  const { Form, fields } = form.iam.login;

  useEffect(() => {
    setModule('IAM');
  }, [setModule]);

  useEffect(() => {
    if (data && 'data' in data) {
      setUser(data.data);
      navigate('/');
    }
  }, [data, setUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-qart-bg relative overflow-hidden">
      {/* Enterprise Solid Background Elements */}
      <div className="absolute top-0 right-0 w-[40vw] h-screen bg-gray-100 skew-x-12 translate-x-32" />

      <div className="w-full max-w-md bg-qart-surface p-8 md:p-10 shadow-bouncy rounded-xl relative z-10 border-2 border-qart-border">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-qart-primary text-white rounded-lg flex items-center justify-center font-display text-4xl shadow-md mx-auto mb-6 transform -rotate-3">
            🍔
          </div>
          <h2 className="text-3xl font-display text-qart-primary mb-2 uppercase tracking-tighter">
            Inicia Sesión
          </h2>
        </div>

        {/* --- DYNAMIC REACTIVE ERROR BANNER --- */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
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
                      Error:{' '}
                      {error.code === 'UNAUTHORIZED'
                        ? 'Credenciales incorrectas'
                        : 'Algo salió mal. Verifica tus datos.'}
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
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center rounded-lg">
              <div className="w-10 h-10 border-4 border-qart-border border-t-qart-primary rounded-full animate-spin"></div>
            </div>
          )}

          <Form buttonText={isFetching ? 'Verificando...' : 'Ingresar'}>
            <div className="space-y-6">
              <fields.identity label="Usuario o Email" placeholder="hola@qart.com" required />
              <fields.password label="Contraseña" control="password" required />
            </div>
          </Form>
        </div>

        {/* Validation hint based on reactive store */}
        {!isFormValid && !isFetching && (
          <p className="mt-4 text-xs text-center text-qart-text-muted font-bold">
            Completá todos los campos para ingresar.
          </p>
        )}

        <div className="mt-8 text-center text-sm font-bold text-qart-text-muted">
          ¿No tenés cuenta?{' '}
          <button
            onClick={() => navigate('/iam/register')}
            className="text-qart-accent hover:text-red-700 transition-colors cursor-pointer"
          >
            Registrate ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
