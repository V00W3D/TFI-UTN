import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../../appStore';
import { useToastStore } from '../../../toastStore';
import { form, sdk } from '../../../tools/sdk';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  IdentityIcon,
  LockIcon,
} from '../../../components/shared/AppIcons';

const LoginPage = () => {
  const { setModule, setUser } = useAppStore();
  const { success } = useToastStore();
  const navigate = useNavigate();

  const { data, error, isFetching, isFormValid } = sdk.iam.login.$use();
  const { fields, submit, $form } = form.iam.login;

  useEffect(() => {
    setModule('IAM');
    return () => {
      sdk.iam.login.$reset();
      $form.getState().reset();
    };
  }, [$form, setModule]);

  useEffect(() => {
    if (data && 'data' in data) {
      setUser(data.data);
      success(`¡HOLA DE VUESTA, ${data.data.name.toUpperCase()}!`);
      navigate('/', { replace: true });
    }
  }, [data, navigate, setUser, success]);

  const handleSubmit = submit(async (values) => {
    if (isFetching) return;
    try {
      await sdk.iam.login(values);
    } catch {
      // El error queda reflejado en el store del endpoint.
    }
  });

  return (
    <section className="auth-shell auth-shell--login">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="auth-panel auth-panel--login"
      >
        <div className="auth-hero">
          <div className="auth-back-home">
            <Link to="/" className="auth-back-link-top">
              <ArrowLeftIcon className="size-[1.05rem]" />
              <span>VOLVER AL INICIO</span>
            </Link>
          </div>
          <div className="auth-badge">INGRESO A QART</div>

          <div className="auth-hero-copy">
            <p className="auth-kicker">INICIAR SESIÓN</p>
            <h1 className="auth-title">¡BIENVENIDO DE VUELTA!</h1>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-panel-header">
            <div>
              <p className="auth-kicker">INICIAR SESIÓN</p>
              <h2 className="auth-section-heading">INGRESÁ CON TUS DATOS</h2>
            </div>
            <div className="auth-panel-mark">Q</div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="auth-alert auth-alert--error"
              >
                <strong>NO PUDIMOS INICIAR SESIÓN</strong>
                <span>
                  {error.code === 'UNAUTHORIZED'
                    ? 'LOS DATOS INGRESADOS NO COINCIDEN CON UNA CUENTA ACTIVA.'
                    : 'NO PUDIMOS VALIDAR EL ACCESO. PROBÁ DE NUEVO.'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="auth-page-form">
            <div className="auth-form-section">
              <fields.identity
                label="Usuario, correo o teléfono"
                placeholder="TU_USUARIO / CORREO@DOMINIO.COM / +54 9 ..."
                required
                fieldMode="login"
                addons={[{ type: 'icon', icon: <IdentityIcon className="size-[1.05rem]" /> }]}
              />
              <fields.password
                label="Contraseña"
                placeholder="INGRESÁ TU CONTRASEÑA"
                control="password"
                required
                fieldMode="login"
                addons={[
                  { type: 'icon', icon: <LockIcon className="size-[1.05rem]" /> },
                  { type: 'passwordToggle' },
                ]}
              />
            </div>

            <button
              type="submit"
              disabled={isFetching || !isFormValid}
              className="auth-submit-button"
            >
              <span>{isFetching ? 'VALIDANDO...' : 'INGRESAR'}</span>
              <span className="auth-submit-arrow" aria-hidden="true">
                <ArrowRightIcon className="size-[1.05rem]" />
              </span>
            </button>
          </form>

          <div className="auth-meta-row">
            <p className="auth-footnote">
              {!isFormValid && !isFetching
                ? 'COMPLETÁ EL ACCESO Y LA CONTRASEÑA PARA CONTINUAR.'
                : 'PODÉS USAR USUARIO, CORREO O TELÉFONO PARA INGRESAR.'}
            </p>

            <p className="auth-switch">
              ¿TODAVÍA NO TENÉS CUENTA?{' '}
              <button
                type="button"
                onClick={() => navigate('/iam/register')}
                className="auth-inline-link"
              >
                CREAR CUENTA
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default LoginPage;
