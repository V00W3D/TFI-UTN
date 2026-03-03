import { useState } from 'react';

/* =========================================================
   TYPES
========================================================= */

export type FieldAddon =
  | { type: 'icon'; src: string }
  | { type: 'passwordToggle' }
  | { type: 'hint'; text: string }
  | { type: 'rules'; rules: string[] }
  | { type: 'validation' }; // 👈 nuevo addon oficial

interface AddonsProps {
  addons?: FieldAddon[];
  context: {
    type: string;
    fieldMode: 'login' | 'register';
    value: any;
    touched: boolean;
    validation: any;
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
     VALIDATION ADDON LOGIC
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
          <img src={icon.src} alt="icon" className="w-5 h-5 object-contain" />
        </div>
      </div>
    );
  };

  const renderRightSlot = () => {
    if (!passwordToggle || context.type !== 'password') return null;

    return (
      <button
        type="button"
        onClick={() => setIsVisible((p) => !p)}
        className="auth-field__slot-right"
      >
        <img
          src={isVisible ? '/open-eye.png' : '/closed-eye.png'}
          alt="toggle"
          className="w-5 h-5 object-contain"
        />
      </button>
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
    if (!isRegister || !hint || error || isHelpVisible) return null;

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
  };
}
