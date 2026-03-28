import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../../appStore';
import { form, sdk } from '../../../tools/sdk';
import { FormSection } from '../../../tools/FormFactory';

/**
 * @file RegisterPage.tsx
 * @description Architectural Register with sharp structural layout and high contrast.
 */
const RegisterPage = () => {
  const { setModule } = useAppStore();
  const navigate = useNavigate();

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
    <div className="auth-card max-w-4xl">
      <div className="relative z-10">
        <div className="text-center md:text-left mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-4 border-qart-border">
          <div>
            <h2 className="text-4xl md:text-5xl font-display text-qart-primary uppercase font-black tracking-tight leading-none mb-4">
              Registro QART
            </h2>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-qart-text-muted">
              Protocolo de Alta de Usuario
            </p>
          </div>
          <div
            className="w-16 h-16 bg-qart-primary border-4 border-qart-border flex items-center justify-center font-display text-4xl shadow-hover mx-auto md:mx-0 -rotate-6 uppercase font-black"
            style={{ color: 'var(--qart-text-on-primary)' }}
          >
            R
          </div>
        </div>

        {/* ERROR BANNER (SHARP) */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mb-8"
            >
              <div className="banner-error">
                <span className="font-black">ERROR</span>
                <p className="text-xs font-black uppercase tracking-widest leading-snug flex-1">
                  Inconsistencia en los datos. Revise los campos marcados.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOADING OVERLAY */}
        <div className="relative">
          {isFetching && (
            <div className="absolute inset-x-0 -top-4 bottom-0 bg-qart-bg/90 z-30 flex flex-col items-center justify-center border-2 border-qart-border">
              <div className="w-14 h-14 border-4 border-qart-border border-t-qart-accent animate-spin mb-4"></div>
              <p className="text-[10px] font-black text-qart-primary uppercase tracking-[0.4em]">
                PROCESANDO_REGISTRO...
              </p>
            </div>
          )}

          <Form buttonText={isFetching ? 'PROCESANDO...' : 'CONFIRMAR ALTA'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 text-left">
              <FormSection title="Identidad" className="space-y-6">
                <fields.name label="Nombre" placeholder="NOMBRE" required />
                <fields.lname label="Apellido" placeholder="APELLIDO" required />
                <fields.sex
                  label="Género"
                  control={[
                    'radio',
                    [
                      { value: 'MALE', label: 'MASCULINO', icon: '' },
                      { value: 'FEMALE', label: 'FEMENINO', icon: '' },
                      { value: 'OTHER', label: 'OTRO', icon: '' },
                    ],
                  ]}
                  required
                />
              </FormSection>

              <FormSection title="Seguridad" className="space-y-6">
                <fields.username label="Usuario" placeholder="USER_ID" required />
                <fields.email label="Email" placeholder="EMAIL_ADDR" control="email" required />
                <fields.password label="Contraseña" control="password" required />
                <fields.phone label="Teléfono" control="phone" required />
              </FormSection>
            </div>
          </Form>
        </div>

        {!isFormValid && !isFetching && (
          <p className="mt-12 text-[10px] text-center text-qart-text-muted font-black uppercase tracking-[0.3em]">
            Protocolo: Todos los campos son obligatorios.
          </p>
        )}

        <div className="mt-12 pt-8 border-t-2 border-qart-border text-center">
          <p className="text-xs font-bold text-qart-text-muted uppercase tracking-widest">
            ¿Ya tiene cuenta?{' '}
            <span
              onClick={() => navigate('/iam/login')}
              className="text-qart-accent hover:underline cursor-pointer"
            >
              Iniciar Sesión
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
