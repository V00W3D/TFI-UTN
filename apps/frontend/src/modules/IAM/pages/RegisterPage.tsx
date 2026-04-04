import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../../appStore';
import { useToastStore } from '../../../toastStore';
import { form, sdk } from '../../../tools/sdk';
import {
  cpasswordField,
  emailField,
  lnameField,
  nameField,
  passwordField,
  phoneField,
  sexField,
  snameField,
  usernameField,
} from '@app/sdk';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FemaleIcon,
  LockIcon,
  MailIcon,
  MaleIcon,
  NeutralIcon,
  PhoneIcon,
  ProfileIcon,
  UsernameIcon,
} from '../../../components/shared/AppIcons';

const SEX_OPTIONS = [
  { value: 'MALE', label: 'HOMBRE', icon: <MaleIcon className="size-[1.1rem]" /> },
  { value: 'FEMALE', label: 'MUJER', icon: <FemaleIcon className="size-[1.1rem]" /> },
  { value: 'OTHER', label: 'OTRO', icon: <NeutralIcon className="size-[1.1rem]" /> },
] as const;

const REGISTER_FIELD_HELP = {
  name: {
    label: 'NOMBRE',
    required: true,
    rules: nameField.rules,
  },
  sname: {
    label: 'SEGUNDO NOMBRE',
    required: false,
    rules: ['Campo opcional.', ...snameField.rules],
  },
  lname: {
    label: 'APELLIDO',
    required: true,
    rules: lnameField.rules,
  },
  sex: {
    label: 'SEXO',
    required: true,
    rules: sexField.rules,
  },
  username: {
    label: 'USUARIO',
    required: true,
    rules: usernameField.rules,
  },
  email: {
    label: 'EMAIL',
    required: true,
    rules: emailField.rules,
  },
  phone: {
    label: 'TELÉFONO',
    required: false,
    rules: ['Campo opcional.', ...phoneField.rules],
  },
  password: {
    label: 'CONTRASEÑA',
    required: true,
    rules: passwordField.rules,
  },
  cpassword: {
    label: 'CONFIRMAR CONTRASEÑA',
    required: true,
    rules: cpasswordField.rules,
  },
} as const;

type RegisterFieldKey = keyof typeof REGISTER_FIELD_HELP;

const DEFAULT_REGISTER_HELP = {
  label: 'TOCÁ UN CAMPO',
  required: null,
  rules: [
    'ACÁ VAS A VER LAS REGLAS DEL CAMPO QUE ESTÉS COMPLETANDO.',
    'SEGUNDO NOMBRE Y TELÉFONO SON OPCIONALES.',
  ],
} as const;

const RegisterPage = () => {
  const { setModule } = useAppStore();
  const { success } = useToastStore();
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState<RegisterFieldKey | null>(null);

  const { data, error, isFetching, isFormValid } = sdk.iam.register.$use();
  const { fields, submit, $form } = form.iam.register;

  useEffect(() => {
    setModule('IAM');
    return () => {
      sdk.iam.register.$reset();
      $form.getState().reset();
    };
  }, [$form, setModule]);

  useEffect(() => {
    if (data && 'data' in data) {
      success('¡CUENTA CREADA CON ÉXITO! AHORA PODÉS INGRESAR.');
      navigate('/iam/login', { replace: true });
    }
  }, [data, navigate, success]);

  const handleSubmit = submit(async (values) => {
    if (isFetching) return;
    try {
      await sdk.iam.register(values);
    } catch {
      // El error queda reflejado en el store del endpoint.
    }
  });

  const activeHelp = activeField ? REGISTER_FIELD_HELP[activeField] : DEFAULT_REGISTER_HELP;

  return (
    <section className="auth-shell auth-shell--register">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="auth-panel auth-panel--register"
      >
        <div className="auth-hero">
          <div className="auth-back-home auth-back-home--register">
            <Link to="/" className="auth-back-link-top">
              <ArrowLeftIcon className="size-[1.05rem]" />
              <span>VOLVER AL INICIO</span>
            </Link>
          </div>
          <div className="auth-badge">NUEVA CUENTA</div>

          <div className="auth-hero-copy">
            <p className="auth-kicker">REGISTRO</p>
            <h1 className="auth-title">¡CREÁ TU CUENTA!</h1>
          </div>

          <section className="auth-context-panel" aria-live="polite">
            <p className="auth-context-kicker">REGLAS DEL CAMPO</p>
            <div className="auth-context-header">
              <h2 className="auth-context-title">{activeHelp.label}</h2>
              {activeHelp.required !== null && (
                <span className="auth-context-badge">
                  {activeHelp.required ? 'OBLIGATORIO' : 'OPCIONAL'}
                </span>
              )}
            </div>

            <div className="auth-context-scroll">
              <ul className="auth-context-rules">
                {activeHelp.rules.map((rule) => (
                  <li key={`${activeHelp.label}-${rule}`} className="auth-context-rule">
                    {rule.toUpperCase()}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className="auth-form-panel">
          <div className="auth-panel-header">
            <div>
              <p className="auth-kicker">CREAR CUENTA</p>
              <h2 className="auth-section-heading">TUS DATOS Y TU ACCESO</h2>
            </div>
            <div className="auth-panel-mark">R</div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="auth-alert auth-alert--error"
              >
                <strong>NO PUDIMOS CREAR LA CUENTA</strong>
                <span>REVISÁ LOS DATOS OBLIGATORIOS Y PROBÁ DE NUEVO.</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="auth-page-form">
            <div className="auth-form-grid auth-form-grid--sections">
              <section className="auth-form-section">
                <div className="auth-form-section-header">
                  <p className="auth-form-section-eyebrow">PERFIL</p>
                  <h3 className="auth-form-section-title">DATOS PERSONALES</h3>
                </div>

                <div onFocusCapture={() => setActiveField('name')}>
                  <fields.name
                    label="Nombre"
                    placeholder="TU NOMBRE"
                    required
                    fieldMode="register"
                    addons={[{ type: 'icon', icon: <ProfileIcon className="size-[1.05rem]" /> }]}
                  />
                </div>
                <div onFocusCapture={() => setActiveField('sname')}>
                  <fields.sname
                    label="Segundo nombre"
                    placeholder="OPCIONAL"
                    fieldMode="register"
                    addons={[{ type: 'icon', icon: <ProfileIcon className="size-[1.05rem]" /> }]}
                  />
                </div>
                <div onFocusCapture={() => setActiveField('lname')}>
                  <fields.lname
                    label="Apellido"
                    placeholder="TU APELLIDO"
                    required
                    fieldMode="register"
                    addons={[{ type: 'icon', icon: <ProfileIcon className="size-[1.05rem]" /> }]}
                  />
                </div>
                <div onFocusCapture={() => setActiveField('sex')}>
                  <fields.sex
                    label="Sexo"
                    control={['radio', [...SEX_OPTIONS]]}
                    required
                    fieldMode="register"
                  />
                </div>
              </section>

              <section className="auth-form-section">
                <div className="auth-form-section-header">
                  <p className="auth-form-section-eyebrow">CUENTA</p>
                  <h3 className="auth-form-section-title">ACCESO Y CONTACTO</h3>
                </div>

                <div onFocusCapture={() => setActiveField('username')}>
                  <fields.username
                    label="Usuario"
                    placeholder="TU_USUARIO"
                    required
                    fieldMode="register"
                    addons={[{ type: 'icon', icon: <UsernameIcon className="size-[1.05rem]" /> }]}
                  />
                </div>
                <div onFocusCapture={() => setActiveField('email')}>
                  <fields.email
                    label="Email"
                    placeholder="CORREO@DOMINIO.COM"
                    control="email"
                    required
                    fieldMode="register"
                    addons={[{ type: 'icon', icon: <MailIcon className="size-[1.05rem]" /> }]}
                  />
                </div>
                <div onFocusCapture={() => setActiveField('phone')}>
                  <fields.phone
                    label="Teléfono"
                    control="phone"
                    placeholder="+54 9 381 ..."
                    fieldMode="register"
                    addons={[{ type: 'icon', icon: <PhoneIcon className="size-[1.05rem]" /> }]}
                  />
                </div>
                <div onFocusCapture={() => setActiveField('password')}>
                  <fields.password
                    label="Contraseña"
                    control="password"
                    placeholder="CREÁ UNA CONTRASEÑA"
                    required
                    fieldMode="register"
                    addons={[
                      { type: 'icon', icon: <LockIcon className="size-[1.05rem]" /> },
                      { type: 'passwordToggle' },
                    ]}
                  />
                </div>
                <div onFocusCapture={() => setActiveField('cpassword')}>
                  <fields.cpassword
                    label="Confirmar contraseña"
                    control="password"
                    placeholder="REPETILA ACÁ"
                    required
                    fieldMode="register"
                    addons={[
                      { type: 'icon', icon: <LockIcon className="size-[1.05rem]" /> },
                      { type: 'passwordToggle' },
                    ]}
                  />
                </div>
              </section>
            </div>

            <button
              type="submit"
              disabled={isFetching || !isFormValid}
              className="auth-submit-button"
            >
              <span>{isFetching ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}</span>
              <span className="auth-submit-arrow" aria-hidden="true">
                <ArrowRightIcon className="size-[1.05rem]" />
              </span>
            </button>
          </form>

          <div className="auth-meta-row">
            <p className="auth-footnote">
              {!isFormValid && !isFetching
                ? 'SEGUNDO NOMBRE Y TELÉFONO SON OPCIONALES. EL RESTO DE LOS DATOS SON NECESARIOS PARA CREAR LA CUENTA.'
                : 'SEGUNDO NOMBRE Y TELÉFONO SON OPCIONALES. USÁ DATOS REALES PARA PODER VALIDAR LA CUENTA Y RECUPERAR EL ACCESO MÁS ADELANTE.'}
            </p>

            <p className="auth-switch">
              ¿YA TENÉS CUENTA?{' '}
              <button
                type="button"
                onClick={() => navigate('/iam/login')}
                className="auth-inline-link"
              >
                INICIAR SESIÓN
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default RegisterPage;
