/**
 * @file IAMView.tsx
 * @module IAM
 * @description Orquestador unificado para el flujo de autenticación QART.
 */
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
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
import { AuthForm } from '@/modules/IAM/IAMView/AuthForm';
import { AuthHero } from '@/modules/IAM/IAMView/AuthHero';
import { RegisterHelpPanel } from '@/modules/IAM/IAMView/RegisterHelpPanel';
import { useAppStore } from '@/shared/store/appStore';
import type { AppUser } from '@/shared/store/appStore';
import { iamStyles } from '@/styles/modules/iam';

const REGISTER_FIELD_HELP = {
  name: { label: 'NOMBRE', required: true, rules: nameField.rules },
  sname: {
    label: 'SEGUNDO NOMBRE',
    required: false,
    rules: ['Campo opcional.', ...snameField.rules],
  },
  lname: { label: 'APELLIDO', required: true, rules: lnameField.rules },
  sex: { label: 'SEXO', required: true, rules: sexField.rules },
  username: { label: 'USUARIO', required: true, rules: usernameField.rules },
  email: { label: 'EMAIL', required: true, rules: emailField.rules },
  phone: { label: 'TELÉFONO', required: false, rules: ['Campo opcional.', ...phoneField.rules] },
  password: { label: 'CONTRASEÑA', required: true, rules: passwordField.rules },
  cpassword: { label: 'CONFIRMAR CONTRASEÑA', required: true, rules: cpasswordField.rules },
} as const;

const DEFAULT_REGISTER_HELP = {
  label: 'TOCÁ UN CAMPO',
  required: null,
  rules: [
    'ACÁ VAS A VER LAS REGLAS DEL CAMPO QUE ESTÉS COMPLETANDO.',
    'SEGUNDO NOMBRE Y TELÉFONO SON OPCIONALES.',
  ],
} as const;

export const IAMView: React.FC = () => {
  const { authView, setAuthView, setModule, setUser } = useAppStore();
  const location = useLocation();
  const [activeField, setActiveField] = React.useState<keyof typeof REGISTER_FIELD_HELP | null>(
    null,
  );

  useEffect(() => {
    setModule('IAM');

    if (location.pathname.includes('register')) {
      setAuthView('register');
    } else {
      setAuthView('login');
    }
  }, [setModule, location.pathname, setAuthView]);

  const handleSuccess = (data: AppUser) => {
    if (authView === 'login') {
      setUser(data);
    } else {
      setAuthView('login');
    }
  };

  const isLogin = authView === 'login';
  const activeHelp = activeField ? REGISTER_FIELD_HELP[activeField] : DEFAULT_REGISTER_HELP;

  const config = {
    badge: isLogin ? 'SISTEMA QART · ACCESO' : 'SISTEMA QART · REGISTRO',
    kicker: isLogin ? 'AUTENTICACIÓN DE USUARIO' : 'ALTA DE NUEVA CUENTA',
    title: isLogin ? 'FORMULARIO DE INGRESO' : 'FORMULARIO DE REGISTRO',
    footnote: isLogin
      ? 'INGRESE SUS CREDENCIALES PARA ACCEDER AL SISTEMA DE GESTIÓN.'
      : 'COMPLETE LOS DATOS SEGÚN LA NORMATIVA DE REGISTRO VIGENTE.',
    switchText: isLogin ? '¿SIN CUENTA ACTIVA?' : '¿YA POSEE UNA CUENTA?',
    switchAction: isLogin ? 'INICIAR REGISTRO' : 'VOLVER AL INGRESO',
  };

  return (
    <section className={iamStyles.shell}>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'circOut' }}
        className={iamStyles.panel}
      >
        <AuthHero badge={config.badge} kicker={config.kicker} title={config.title}>
          {authView === 'register' && <RegisterHelpPanel activeHelp={activeHelp} />}
        </AuthHero>

        <div className={iamStyles.formPanel}>
          <div className={iamStyles.panelHeader}>
            <h2 className={iamStyles.sectionHeading}>
              {isLogin ? 'AUTENTICACIÓN' : 'REGISTRO DE PERFIL'}
            </h2>
            <div className={iamStyles.panelMark}>Q</div>
          </div>

          <AuthForm
            view={authView}
            onSuccess={handleSuccess}
            onActiveFieldChange={(fieldKey: string | null) =>
              setActiveField(fieldKey as keyof typeof REGISTER_FIELD_HELP | null)
            }
          />

          <div className={iamStyles.metaRow}>
            <p className={iamStyles.footnote}>{config.footnote}</p>
            <p className={iamStyles.switch}>
              {config.switchText}{' '}
              <button
                type="button"
                onClick={() => setAuthView(isLogin ? 'register' : 'login')}
                className={iamStyles.inlineLink}
              >
                {config.switchAction}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default IAMView;
