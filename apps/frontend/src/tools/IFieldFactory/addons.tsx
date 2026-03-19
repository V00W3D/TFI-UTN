import { useState } from 'react';

/* =========================================================
   TYPES
========================================================= */

export type FieldAddon =
  | { type: 'icon'; src: string }
  | { type: 'passwordToggle' }
  | { type: 'hint'; text: string }
  | { type: 'rules'; rules: string[] }
  | { type: 'validation' }
  | { type: 'rubber' } // 👈 NUEVO
  | { type: 'strength' }; // 👈 NUEVO

interface AddonsProps {
  addons?: FieldAddon[];
  context: {
    type: string;
    fieldMode: 'login' | 'register';
    value: any;
    touched: boolean;
    validation: any;
    reset?: () => void; // 👈 necesario para rubber
  };
}

/* =========================================================
   FACTORY
========================================================= */

export function useFieldAddons({ addons = [], context }: AddonsProps) {
  const icon = addons.find((a) => a.type === 'icon') as
    | Extract<FieldAddon, { type: 'icon' }>
    | undefined;

  const passwordToggle = addons.some((a) => a.type === 'passwordToggle');
  const rubber = addons.some((a) => a.type === 'rubber');
  const strength = addons.some((a) => a.type === 'strength');

  const hint = addons.find((a) => a.type === 'hint') as
    | Extract<FieldAddon, { type: 'hint' }>
    | undefined;

  const rules = addons.find((a) => a.type === 'rules') as
    | Extract<FieldAddon, { type: 'rules' }>
    | undefined;

  const enableValidation = addons.some((a) => a.type === 'validation');

  const [isVisible, setIsVisible] = useState(false);
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  const isRegister = context.fieldMode === 'register';

  /* =========================================================
     VALIDATION LOGIC
  ========================================================= */

  let error = false;
  let success = false;
  let errors: string[] = [];

  if (enableValidation) {
    const hasValue =
      typeof context.value === 'string' ? context.value.trim().length > 0 : Boolean(context.value);

    const isValid = context.validation === true;
    errors = Array.isArray(context.validation) ? context.validation : [];

    error = context.touched && errors.length > 0;
    success = context.touched && hasValue && isValid;
  }

  const stateClass = error ? 'auth-field--error' : success ? 'auth-field--success' : '';

  /* =========================================================
     RENDERERS
  ========================================================= */

  const renderLeftSlot = () => {
    if (!icon) return null;

    return (
      <div className="auth-field__slot-left">
        <div className="auth-field__slot-box-left">
          <img src={icon.src} alt="icon" className="w-6 h-6 object-contain" />
        </div>
      </div>
    );
  };

  /* ================= RIGHT SLOT (rubber + toggle) ================= */

  const renderRightSlot = () => {
    const showPasswordToggle = passwordToggle && context.type === 'password';
    const showRubber = rubber && context.reset;

    if (!showPasswordToggle && !showRubber) return null;

    return (
      <div className="auth-field__slot-right flex items-center gap-2">
        {showRubber && (
          <button type="button" onClick={() => context.reset?.()} className="auth-field__slot-btn">
            <img src="/rubber-icon.png" alt="reset" className="w-6 h-6 object-contain" />
          </button>
        )}

        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setIsVisible((p) => !p)}
            className="auth-field__slot-btn"
          >
            <img
              src={isVisible ? '/open-eye.png' : '/closed-eye.png'}
              alt="toggle"
              className="w-6 h-6 object-contain"
            />
          </button>
        )}
      </div>
    );
  };

  /* ================= LABEL ACTION ================= */

  const renderLabelAction = () => {
    if (!isRegister || !rules) return null;

    return (
      <button
        type="button"
        onClick={() => setIsHelpVisible((p) => !p)}
        className="auth-field__help-btn"
      >
        (?)
      </button>
    );
  };

  /* ================= HINT ================= */

  const renderHint = () => {
    if (!isRegister || !hint || error || isHelpVisible) return null;

    return <span className="auth-field__hint">{hint.text}</span>;
  };

  /* ================= RULES ================= */

  const renderRules = () => {
    if (!isRegister || !rules || !isHelpVisible) return null;

    return (
      <div className="auth-field__rules-container">
        <ul className="auth-field__rules">
          {rules.rules.map((rule, i) => (
            <li key={i} className="auth-field__rule">
              <span className="auth-field__rule-dot" />
              <span className="auth-field__rule-text">{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  /* ================= ERRORS ================= */

  const renderError = () => {
    if (!enableValidation || !error) return null;

    return (
      <div className="auth-field__messages">
        {errors.map((msg, i) => (
          <span key={i} className="auth-field__message auth-field__message--error">
            {msg}
          </span>
        ))}
      </div>
    );
  };

  /* ================= PASSWORD STRENGTH ================= */

  const renderStrength = () => {
    if (!strength || context.type !== 'password') return null;
    if (!isRegister || !context.value) return null;

    const PASSWORD_MIN = 8;

    const HAS_UPPER = /[A-Z]/;
    const HAS_LOWER = /[a-z]/;
    const HAS_NUMBER = /[0-9]/;
    const HAS_SYMBOL = /[^A-Za-z0-9]/;

    let score = 0;

    if (context.value.length >= PASSWORD_MIN) score++;
    if (HAS_UPPER.test(context.value)) score++;
    if (HAS_LOWER.test(context.value)) score++;
    if (HAS_NUMBER.test(context.value)) score++;
    if (HAS_SYMBOL.test(context.value)) score++;

    const labels = ['', 'muy débil', 'débil', 'decente', 'segura', 'muy segura'];

    const colors = [
      '',
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-400',
      'bg-green-500',
      'bg-rgb-soft animate-rgb-soft',
    ];

    const width = `${(score / 5) * 100}%`;

    return (
      <div className="flex flex-col gap-1 mt-2">
        <div className="w-full h-2 bg-(--border) rounded overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${colors[score]}`}
            style={{ width }}
          />
        </div>

        {score > 0 && (
          <span className="text-xs text-(--text-secondary)">
            Fuerza: <span className="font-semibold">{labels[score]}</span>
          </span>
        )}

        <style>
          {`
            @keyframes rgbShift {
              0% { background-color: #22c55e; }
              33% { background-color: #3b82f6; }
              66% { background-color: #a855f7; }
              100% { background-color: #22c55e; }
            }
            .bg-rgb-soft { background-color: #22c55e; }
            .animate-rgb-soft { animation: rgbShift 3s linear infinite; }
          `}
        </style>
      </div>
    );
  };

  /* ================= RESOLVED TYPE ================= */

  const resolvedType =
    passwordToggle && context.type === 'password'
      ? isVisible
        ? 'text'
        : 'password'
      : context.type;

  return {
    resolvedType,
    stateClass,
    renderLeftSlot,
    renderRightSlot,
    renderLabelAction,
    renderHint,
    renderRules,
    renderError,
    renderStrength,
  };
}
