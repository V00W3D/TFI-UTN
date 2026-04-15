/**
 * @file AuthForm.tsx
 * @module IAM
 * @description Componente de formulario dual (Login/Registro) con lógica unificada.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-01, RF-02
 * rnf: RNF-03, RNF-05
 *
 * @business
 * inputs: modo de autenticación (view), eventos de usuario
 * outputs: ejecución de login/register, feedback de validación
 * rules: centralizar lógica de captura de campos y envío a SDK
 *
 * @technical
 * dependencies: @app/sdk, react, framer-motion, AppIcons
 * flow: detecta vista actual; mapea campos correspondientes; ejecuta submit via SDK; maneja estados de carga.
 *
 * @estimation
 * complexity: Medium
 * fpa: EO
 * story_points: 5
 * estimated_hours: 3
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { form, sdk } from '@/shared/utils/sdk';
import {
  IdentityIcon,
  LockIcon,
  ProfileIcon,
  UsernameIcon,
  MailIcon,
  MaleIcon,
  FemaleIcon,
  NeutralIcon,
} from '@/shared/ui/AppIcons';
import { SectionFactory } from '@/shared/ui/SectionFactory';
import type { AppUser } from '@/shared/store/appStore';
import { iamStyles } from '@/styles/modules/iam';

interface AuthFormProps {
  view: 'login' | 'register';
  onSuccess: (data: AppUser) => void;
  onActiveFieldChange?: (fieldKey: string | null) => void;
}

const SEX_OPTIONS = [
  { value: 'MALE', label: 'HOMBRE', icon: <MaleIcon width={20} height={20} /> },
  { value: 'FEMALE', label: 'MUJER', icon: <FemaleIcon width={20} height={20} /> },
  { value: 'OTHER', label: 'OTRO', icon: <NeutralIcon width={20} height={20} /> },
] as const;

/**
 * @component AuthForm
 */
export const AuthForm: React.FC<AuthFormProps> = ({ view, onSuccess, onActiveFieldChange }) => {
  const isLogin = view === 'login';

  // Login Logic
  const loginState = sdk.iam.login.$use();
  const loginForm = form.iam.login;

  // Register Logic
  const registerState = sdk.iam.register.$use();
  const registerForm = form.iam.register;

  const currentStatus = isLogin ? loginState : registerState;

  const handleLoginSubmit = loginForm.submit(async (values) => {
    if (loginState.isFetching) return;
    try {
      const response = await sdk.iam.login(values);
      if (response && typeof response === 'object' && 'data' in response) {
        onSuccess((response as { data: AppUser }).data);
      }
    } catch (error) {
      // Error is handled reactively by sdk stores
    }
  });

  const handleRegisterSubmit = registerForm.submit(async (values) => {
    if (registerState.isFetching) return;
    try {
      const response = await sdk.iam.register(values);
      if (response && typeof response === 'object' && 'data' in response) {
        onSuccess((response as { data: AppUser }).data);
      }
    } catch (error) {
      // Error is handled reactively by sdk stores
    }
  });

  const handleSubmit = isLogin ? handleLoginSubmit : handleRegisterSubmit;

  return (
    <AnimatePresence mode="wait">
      <motion.form
        key={view}
        initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit}
        className={iamStyles.form}
      >
        {isLogin ? (
          <div className={iamStyles.formSection}>
            <loginForm.fields.identity
              label="Usuario / Correo / Teléfono"
              placeholder="IDENTIFICATE ACÁ"
              required
              fieldMode="login"
              addons={[{ type: 'icon', icon: <IdentityIcon width={24} height={24} /> }]}
              onFocus={() => onActiveFieldChange?.(null)}
            />
            <loginForm.fields.password
              label="Contraseña"
              placeholder="INGRESÁ TU CLAVE"
              control="password"
              required
              fieldMode="login"
              addons={[
                { type: 'icon', icon: <LockIcon width={24} height={24} /> },
                { type: 'passwordToggle' },
              ]}
              onFocus={() => onActiveFieldChange?.(null)}
            />
          </div>
        ) : (
          <div className={iamStyles.formGrid}>
            <SectionFactory
              className={iamStyles.formSections}
              headerClassName={iamStyles.formSectionHeader}
              eyebrowClassName={iamStyles.formSectionEyebrow}
              titleClassName={iamStyles.formSectionTitle}
              sections={[
                {
                  key: 'profile',
                  eyebrow: 'PERFIL',
                  title: 'IDENTIDAD PERSONAL',
                  className: iamStyles.formSection,
                  content: (
                    <>
                      <registerForm.fields.name
                        label="Nombre"
                        placeholder="TU NOMBRE"
                        required
                        fieldMode="register"
                        addons={[{ type: 'icon', icon: <ProfileIcon width={24} height={24} /> }]}
                        onFocus={() => onActiveFieldChange?.('name')}
                      />
                      <registerForm.fields.lname
                        label="Apellido"
                        placeholder="TU APELLIDO"
                        required
                        fieldMode="register"
                        addons={[{ type: 'icon', icon: <ProfileIcon width={24} height={24} /> }]}
                        onFocus={() => onActiveFieldChange?.('lname')}
                      />
                      <registerForm.fields.sex
                        label="Sexo"
                        control={['radio', [...SEX_OPTIONS]]}
                        required
                        fieldMode="register"
                        nakedWrapper
                        onFocus={() => onActiveFieldChange?.('sex')}
                      />
                    </>
                  ),
                },
                {
                  key: 'account',
                  eyebrow: 'CUENTA',
                  title: 'DATOS DE ACCESO',
                  className: iamStyles.formSection,
                  content: (
                    <>
                      <registerForm.fields.username
                        label="Usuario"
                        placeholder="ELEGÍ UN USUARIO"
                        required
                        fieldMode="register"
                        addons={[{ type: 'icon', icon: <UsernameIcon width={24} height={24} /> }]}
                        onFocus={() => onActiveFieldChange?.('username')}
                      />
                      <registerForm.fields.email
                        label="Email"
                        placeholder="CORREO@DOMINIO.COM"
                        control="email"
                        required
                        fieldMode="register"
                        addons={[{ type: 'icon', icon: <MailIcon width={24} height={24} /> }]}
                        onFocus={() => onActiveFieldChange?.('email')}
                      />
                      <registerForm.fields.password
                        label="Contraseña"
                        control="password"
                        placeholder="CREÁ TU CLAVE"
                        required
                        fieldMode="register"
                        addons={[
                          { type: 'icon', icon: <LockIcon width={24} height={24} /> },
                          { type: 'passwordToggle' },
                        ]}
                        onFocus={() => onActiveFieldChange?.('password')}
                      />
                    </>
                  ),
                },
              ]}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={currentStatus.isFetching || !currentStatus.isFormValid}
          className={iamStyles.submitButton}
        >
          <span>
            {currentStatus.isFetching
              ? 'PROCESANDO...'
              : isLogin
                ? 'ENTRAR AL PANEL'
                : 'CREAR MI CUENTA'}
          </span>
          <IdentityIcon width={32} height={32} />
        </button>

        <AnimatePresence>
          {currentStatus.error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={iamStyles.alert}
            >
              <strong>ERROR EN LA OPERACIÓN</strong>
              <span>
                {currentStatus.error.code === 'UNAUTHORIZED'
                  ? 'LOS DATOS NO SON VÁLIDOS.'
                  : 'OCURRIÓ UN ERROR AL PROCESAR LA SOLICITUD.'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </AnimatePresence>
  );
};
