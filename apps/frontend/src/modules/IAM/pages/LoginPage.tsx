/**
 * @file LoginPage.tsx
 * @author Victor
 * @description Automatically enforced JSDoc header according to context.md guidelines.
 * @param null
 * @returns null
 * @example null
 * @remarks This file is part of the QART monorepo architecture.
 *
 * Metrics:
 * - LOC: 50
 * - Experience Level: Junior
 * - Estimated Time: 30m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */
import { useState, memo, useEffect } from 'react';
import './AuthPages.css';
import { form, sdk } from '@tools/sdk';
import { useAppStore } from '@store'; // ajustá el path a tu store
import { isSuccessResponse } from '@app/sdk';
const { Form, fields } = form.iam.login;

/** @internal Toggle "Recuérdame" */
const RememberMe = memo(
  ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="login-remember">
      <input
        type="checkbox"
        className="login-remember__native"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="login-remember__box" aria-hidden="true" />
      <span className="login-remember__text">Recordarme en este dispositivo</span>
    </label>
  ),
);

/** @internal Links de soporte */
const SupportLinks = memo(() => (
  <div className="login-support">
    <a href="#" className="login-support__link">
      ¿Olvidaste tu contraseña?
    </a>
    <span className="login-support__dot" aria-hidden="true" />
    <a href="#" className="login-support__link login-support__link--soft">
      ¿No podés ingresar? Contáctanos
    </a>
  </div>
));

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const setUser = useAppStore((s) => s.setUser);
  const { data } = sdk.iam.login.$use();

  // Cuando el login es exitoso, poblar el store con el usuario
  useEffect(() => {
    if (data && isSuccessResponse(data)) setUser(data.data);
  }, [data, setUser]);

  return (
    <Form
      buttonText="Entrar"
      loadingText="Entrando…"
      redirectTo="/"
      redirectOptions={{ replace: true }}
    >
      <fields.identity
        placeholder="Usuario, teléfono o email"
        label="Identidad"
        required
        fieldMode="login"
      />
      <fields.password
        placeholder="••••••••"
        label="Contraseña"
        required
        fieldMode="login"
        control="password"
        addons={[{ type: 'passwordToggle' }]}
      />

      <RememberMe checked={rememberMe} onChange={setRememberMe} />
      <SupportLinks />
    </Form>
  );
};

export default LoginPage;
