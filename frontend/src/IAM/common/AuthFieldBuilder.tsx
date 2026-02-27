import React, { useId, useState } from 'react';
import './AuthField.css';
import 'react-phone-number-input/style.css';
import { renderAuthField } from './RenderAuthField';
import type { FieldType, SelectOption, RadioOption } from './RenderAuthField';

/* =========================================================
   TYPES
========================================================= */

interface AuthPlugin {
  render: () => React.ReactNode;
}

export type ValidationState = true | string[] | undefined | false;
type FieldMode = 'login' | 'register';

interface AuthFieldBuilderProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className'
> {
  label: string;
  type?: FieldType;
  autoComplete?: string;

  validate?: ValidationState;
  inputIcon?: string;
  rules?: string[];
  placeholder?: string;
  hint?: string;
  showHelpToggle?: boolean;

  plugins?: AuthPlugin[];
  selectOptions?: SelectOption[];
  radioOptions?: RadioOption[];

  visionToggler?: boolean;
  fieldMode?: FieldMode;
}

/* =========================================================
   COMPONENT
========================================================= */

const AuthFieldBuilder = ({
  label,
  id,
  name,
  type = 'text',
  autoComplete,

  validate,
  inputIcon,
  rules = [],
  placeholder,
  hint,
  showHelpToggle = false,

  plugins = [],
  required,
  selectOptions = [],
  radioOptions = [],

  visionToggler = false,
  fieldMode = 'register',

  ...inputProps
}: AuthFieldBuilderProps) => {
  const inputId = id ?? name ?? useId();

  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  /* ===================== MODE ===================== */

  const isRegister = fieldMode === 'register';

  /* ===================== VALIDATION ===================== */

  const value = inputProps.value;
  const hasValue = typeof value === 'string' && value.trim().length > 0;

  const isValid = validate === true;
  const errors = Array.isArray(validate) ? validate : [];

  const error = hasValue && errors.length > 0;
  const success = hasValue && isValid;

  const stateClass = error ? 'auth-field--error' : success ? 'auth-field--success' : '';

  /* ===================== VISIBILITY ===================== */

  const showRules = isRegister && rules.length > 0 && isHelpVisible;

  const hasHint = Boolean(hint);

  const showHint = isRegister && !error && !isHelpVisible && hasHint;
  const resolvedType =
    visionToggler && type === 'password' ? (isVisible ? 'text' : 'password') : type;

  /* ===================== RENDER HELPERS ===================== */

  const renderIf = (condition: boolean, node: React.ReactNode) => (condition ? node : null);

  const renderLabel = () => (
    <div className="auth-field__label-row">
      <label htmlFor={inputId} className="auth-field__label">
        {label}
        {required && <span className="auth-field__required">*</span>}
      </label>

      {renderIf(
        isRegister && showHelpToggle && rules.length > 0,
        <button
          type="button"
          onClick={() => setIsHelpVisible((p) => !p)}
          className="auth-field__help-btn"
        >
          (?)
        </button>,
      )}
    </div>
  );

  const renderInputWrapper = () => (
    <div className="auth-field__input-wrapper">
      {renderIf(
        !!inputIcon,
        <div className="auth-field__slot-left">
          <div className="auth-field__slot-box-left">
            <img src={inputIcon} alt="icon" className="w-5 h-5 object-contain" />
          </div>
        </div>,
      )}

      {renderAuthField({
        type,
        inputId,
        name,
        required,
        placeholder,
        resolvedType,
        inputProps,
        selectOptions,
        radioOptions,
      })}

      {renderIf(
        visionToggler && type === 'password',
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
        </button>,
      )}
    </div>
  );

  const renderErrors = () =>
    renderIf(
      error,
      <div className="auth-field__messages">
        {errors.map((msg, i) => (
          <span key={i} className="auth-field__message auth-field__message--error">
            {msg}
          </span>
        ))}
      </div>,
    );

  const renderHint = () => renderIf(showHint, <span className="auth-field__hint">{hint}</span>);

  const renderRules = () =>
    renderIf(
      showRules,
      <div className="auth-field__rules-container">
        <ul className="auth-field__rules">
          {rules.map((rule, i) => (
            <li key={i} className="auth-field__rule">
              <span className="auth-field__rule-dot" />
              <span className="auth-field__rule-text">{rule}</span>
            </li>
          ))}
        </ul>
      </div>,
    );

  const renderPlugins = () =>
    renderIf(
      isRegister && plugins.length > 0,
      <div className="auth-field__plugins">
        {plugins.map((p, i) => (
          <React.Fragment key={i}>{p.render()}</React.Fragment>
        ))}
      </div>,
    );

  /* ===================== RENDER ===================== */

  return (
    <div className={`auth-field ${stateClass}`}>
      {renderLabel()}
      {renderInputWrapper()}
      {renderErrors()}
      {renderHint()}
      {renderRules()}
      {renderPlugins()}
    </div>
  );
};

export default AuthFieldBuilder;
