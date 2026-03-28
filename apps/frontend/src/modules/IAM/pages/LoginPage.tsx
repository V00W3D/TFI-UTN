import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../../appStore';
import { form, sdk } from '../../../tools/sdk';

/**
 * @file LoginPage.tsx
 * @description Architectural Login with sharp geometry and bold typography.
 */
const LoginPage = () => {
  const { setModule, setUser } = useAppStore();
  const navigate = useNavigate();

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
    <div className="auth-card">
      <div className="relative z-10">
        <div className="text-center mb-12">
          <div
            className="w-20 h-20 bg-qart-accent flex items-center justify-center font-display text-5xl border-4 border-qart-border shadow-hover mx-auto mb-8 -rotate-3 uppercase font-black"
            style={{ color: 'var(--qart-text-on-accent)' }}
          >
            Q
          </div>
          <h2 className="text-4xl font-display text-qart-primary mb-3 uppercase font-black tracking-tight">
            Acceso QART
          </h2>
          <p className="text-sm font-bold uppercase tracking-widest text-qart-text-muted">
            Gestión de Autor
          </p>
        </div>

        {/* ERROR BANNER (SHARP) */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mb-8"
            >
              <div className="banner-error">
                <span className="font-black">!</span>
                <p className="text-xs font-black uppercase tracking-widest leading-snug">
                  {error.code === 'UNAUTHORIZED'
                    ? 'Credenciales Inválidas. Intente de Nuevo.'
                    : 'Error de Sistema. Verifique sus Datos.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM OVERLAY */}
        <div className="relative">
          {isFetching && (
            <div className="absolute inset-x-0 -top-4 bottom-0 bg-qart-bg/80 z-20 flex items-center justify-center border-2 border-qart-border">
              <div className="w-12 h-12 border-4 border-qart-border border-t-qart-accent animate-spin"></div>
            </div>
          )}

          <Form buttonText={isFetching ? 'Verificando...' : 'Entrar'}>
            <div className="space-y-8">
              <fields.identity label="Usuario / Email" placeholder="NOMBRE_USUARIO" required />
              <fields.password label="Contraseña" control="password" required />
            </div>
          </Form>
        </div>

        {!isFormValid && !isFetching && (
          <p className="mt-8 text-[10px] text-center text-qart-text-muted font-black uppercase tracking-[0.3em]">
            Campos obligatorios pendientes
          </p>
        )}

        <div className="mt-12 pt-8 border-t-2 border-qart-border text-center">
          <p className="text-xs font-bold text-qart-text-muted uppercase tracking-widest">
            ¿Sin acceso?{' '}
            <span
              onClick={() => navigate('/iam/register')}
              className="text-qart-accent hover:underline cursor-pointer"
            >
              Registrar cuenta
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
