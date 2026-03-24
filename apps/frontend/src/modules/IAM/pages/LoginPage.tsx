/**
 * @file LoginPage.tsx
 * @description Página de inicio de sesión.
 * Layout: card dividido — credenciales (60%) a la izquierda, QR (40%) a la derecha.
 *
 * ── Arquitectura de rememberMe ───────────────────────────────────────────────
 * `rememberMe` vive en estado local — NO es un campo del FormFactory porque
 * no tiene validación Zod ni input visible en el sistema de campos.
 * Se inyecta en el payload usando el handler `submit` raw de FormInstance,
 * que da control total antes de llamar al SDK:
 *
 *   submit(async (values) => {
 *     await sdk.iam.login({ ...values, rememberMe: rememberMeRef.current });
 *   })
 *
 * Requiere agregar `rememberMe: z.boolean().optional()` al LoginContract.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { useState, useCallback, useEffect, useRef, memo, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPages.css';
import { sdk, form } from '@tools/sdk';
import { QRLogin } from '../components/QRLogin';
// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMPONENTES
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

const LoginPage = () => {
  const navigate = useNavigate();
  const { fields, submit } = form.iam.login;
  const [rememberMe, setRememberMe] = useState(false);
  const rememberMeRef = useRef(rememberMe);
  rememberMeRef.current = rememberMe;

  const { data, error, isFetching, isFormValid } = sdk.iam.login.$use();

  // Reset del requestStore al montar
  useEffect(() => {
    sdk.iam.login.$reset();
  }, []);

  // Navegar al completar exitosamente
  useEffect(() => {
    if (data && !error) navigate('/', { replace: true });
  }, [data, error, navigate]);

  /**
   * Submit raw con rememberMe inyectado.
   * `submit(onComplete)` valida el form y, si es válido, llama `onComplete(values)`.
   */
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) =>
    submit(async (values) => {
      try {
        await sdk.iam.login({
          ...values,
          rememberMe: rememberMeRef.current,
        });
      } catch {
        //
      }
    })(e);

  const handleQRSuccess = useCallback(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="login-wrapper">
      {/* Fila horizontal: card de credenciales + QR flotante a la derecha */}
      <div className="login-layout">
        {/* ── Card de credenciales ── */}
        <div className="auth-card login-card">
          <div className="login-credentials">
            {/* Encabezado */}
            <div className="login-header">
              <h2 className="login-title">Bienvenido de nuevo</h2>
              <p className="login-subtitle">Ingresá con tu cuenta para continuar</p>
            </div>

            {/* Campos */}
            <form
              onSubmit={handleSubmit as (e: FormEvent<HTMLFormElement>) => void}
              className="login-form"
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

              <button
                type="submit"
                disabled={isFetching || !isFormValid}
                className="auth-button login-submit"
              >
                {isFetching ? 'Entrando…' : 'Entrar'}
              </button>

              {error && (
                <p className="auth-feedback auth-feedback--error">
                  {(error as { code?: string }).code ?? 'Error desconocido'}
                </p>
              )}
              {data && !error && (
                <p className="auth-feedback auth-feedback--success">
                  Sesión iniciada correctamente
                </p>
              )}

              <SupportLinks />
            </form>
          </div>
        </div>

        {/* ── QR flotante — fuera del card, a la derecha ── */}
        <QRLogin onSuccess={handleQRSuccess} />
      </div>
    </div>
  );
};

export default LoginPage;
