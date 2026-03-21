import { useState } from 'react';

/* =========================================================
   TYPES
========================================================= */

export type FieldAddon =
  | { type: 'icon'; src: string }
  | { type: 'passwordToggle' }
  | { type: 'hint'; text: string }
  | { type: 'rules'; rules: readonly string[] }
  | { type: 'rubber' }
  | { type: 'strength' };

interface AddonsProps {
  addons?: FieldAddon[];
  context: {
    type: string;
    fieldMode: 'login' | 'register';
    value: unknown;
    errors: string[];
    isValid: boolean;
    reset?: () => void;
  };
}

/* =========================================================
   HOOK
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

  const [isVisible, setIsVisible] = useState(false);
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  // Se activa en el primer onChange, no en blur
  const [hasInteracted, setHasInteracted] = useState(false);

  const isRegister = context.fieldMode === 'register';

  /* =========================================================
     VALIDATION STATE
  ========================================================= */

  const hasValue =
    typeof context.value === 'string' ? context.value.trim().length > 0 : Boolean(context.value);

  const showError = hasInteracted && context.errors.length > 0;
  const showSuccess = hasInteracted && hasValue && context.isValid;

  const stateClass = showError ? 'auth-field--error' : showSuccess ? 'auth-field--success' : '';

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

  const renderHint = () => {
    if (!isRegister || !hint || showError || isHelpVisible) return null;
    return <span className="auth-field__hint">{hint.text}</span>;
  };

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

  const renderError = () => {
    if (!showError) return null;
    return (
      <div className="auth-field__messages">
        {context.errors.map((msg, i) => (
          <span key={i} className="auth-field__message auth-field__message--error">
            {msg}
          </span>
        ))}
      </div>
    );
  };

  const renderStrength = () => {
    if (!strength || context.type !== 'password') return null;
    if (!isRegister || !context.value) return null;

    const val = String(context.value);

    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[a-z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const labels = ['', 'muy débil', 'débil', 'decente', 'segura', 'muy segura'];
    const colors = [
      '',
      'bg-red-500',
      'bg-orange-400',
      'bg-yellow-400',
      'bg-blue-400',
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
        <style>{`
          @keyframes rgbShift {
            0%   { background-color: #3b82f6; }
            33%  { background-color: #8b5cf6; }
            66%  { background-color: #06b6d4; }
            100% { background-color: #3b82f6; }
          }
          .bg-rgb-soft { background-color: #3b82f6; }
          .animate-rgb-soft { animation: rgbShift 3s linear infinite; }
        `}</style>
      </div>
    );
  };

  const resolvedType =
    passwordToggle && context.type === 'password'
      ? isVisible
        ? 'text'
        : 'password'
      : context.type;

  return {
    resolvedType,
    stateClass,
    hasInteracted,
    setHasInteracted,
    renderLeftSlot,
    renderRightSlot,
    renderLabelAction,
    renderHint,
    renderRules,
    renderError,
    renderStrength,
  };
}
