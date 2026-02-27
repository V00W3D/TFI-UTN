import React, { useId, useState } from 'react';
import './AuthField.css';
import PhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import 'react-phone-number-input/style.css';
/* =========================================================
   TYPES
========================================================= */

type FieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'tel'
  | 'phone'
  | 'select'
  | 'textarea'
  | 'radio'
  | 'checkbox';

interface SelectOption {
  value: string;
  label: string;
}

interface RadioOption {
  value: string;
  label: string;
  icon?: string;
}

interface AuthPlugin {
  render: () => React.ReactNode;
}

type ValidationState = true | string[] | undefined | false;

interface AuthFieldProps extends Omit<
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

  /* 🔥 NUEVO */
  visionToggler?: boolean;
}

/* =========================================================
   COMPONENT
========================================================= */

const AuthField = ({
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

  ...inputProps
}: AuthFieldProps) => {
  const reactId = useId();
  const inputId = id ?? name ?? reactId;

  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  /* =========================================================
     VALIDATION DERIVED
  ========================================================= */

  const hasValue = typeof inputProps.value === 'string' && inputProps.value.trim().length > 0;

  const isValid = validate === true;
  const errorMessages = Array.isArray(validate) ? validate : [];

  const error = hasValue && errorMessages.length > 0;
  const success = hasValue && isValid;

  const stateClass = error ? 'auth-field--error' : success ? 'auth-field--success' : '';

  /* =========================================================
     HELP / RULES VISIBILITY
  ========================================================= */

  const showRules = rules.length > 0 && isHelpVisible;
  const showHint = !error && !isHelpVisible && hint;

  /* =========================================================
     PASSWORD TYPE RESOLUTION
  ========================================================= */

  const resolvedType =
    visionToggler && type === 'password' ? (isVisible ? 'text' : 'password') : type;

  /* =========================================================
     FIELD RENDERER
  ========================================================= */

  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <select
            id={inputId}
            name={name}
            required={required}
            className="auth-field__input"
            {...(inputProps as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {selectOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            id={inputId}
            name={name}
            required={required}
            placeholder={placeholder}
            className="auth-field__input"
            {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        );
      case 'radio':
        return (
          <div className="auth-field__radio-group">
            {radioOptions.map((opt) => {
              const checked = inputProps.value === opt.value;

              return (
                <label key={opt.value} className="auth-field__radio-option" data-value={opt.value}>
                  <input
                    type="radio"
                    name={name}
                    value={opt.value}
                    checked={checked}
                    onChange={inputProps.onChange}
                    className="auth-field__radio-input"
                  />
                  <div
                    className={`auth-field__radio-card ${
                      checked ? 'auth-field__radio-card--checked' : ''
                    } auth-field__radio-card--${opt.value}`}
                  >
                    <div className="auth-field__radio-circle">
                      {checked && <div className="auth-field__radio-dot" />}
                    </div>

                    {opt.icon && (
                      <img src={opt.icon} alt={opt.label} className="auth-field__radio-icon" />
                    )}

                    <span className="auth-field__radio-label">{opt.label}</span>
                  </div>
                </label>
              );
            })}
          </div>
        );
      case 'phone':
        return (
          <PhoneInput
            international
            countryCallingCodeEditable
            defaultCountry="AR"
            flags={flags}
            value={inputProps.value as string}
            onChange={(value) => {
              if (inputProps.onChange) {
                inputProps.onChange({
                  target: { value: value ?? '' },
                } as any);
              }
            }}
            className="auth-phone pl-3"
          />
        );

      default:
        return (
          <input
            id={inputId}
            name={name}
            type={resolvedType}
            autoComplete={autoComplete}
            required={required}
            placeholder={placeholder}
            className="auth-field__input"
            {...inputProps}
          />
        );
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className={`auth-field ${stateClass}`}>
      {/* ===== LABEL ===== */}
      <div className="auth-field__label-row">
        <label htmlFor={inputId} className="auth-field__label">
          {label}
          {required && <span className="auth-field__required">*</span>}
        </label>

        {showHelpToggle && rules.length > 0 && (
          <button
            type="button"
            onClick={() => setIsHelpVisible((prev) => !prev)}
            className="auth-field__help-btn"
          >
            (?)
          </button>
        )}
      </div>

      {/* ===== INPUT WRAPPER ===== */}
      <div className="auth-field__input-wrapper">
        {/* LEFT ICON */}
        {inputIcon && (
          <div className="auth-field__slot-left">
            <div className="auth-field__slot-box-left">
              <img src={inputIcon} alt="input-icon" className="w-5 h-5 object-contain" />
            </div>
          </div>
        )}

        {renderField()}

        {/* 🔥 RIGHT VISION TOGGLER */}
        {visionToggler && type === 'password' && (
          <button
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
            className="auth-field__slot-right"
          >
            <img
              src={isVisible ? '/open-eye.png' : '/closed-eye.png'}
              alt="toggle-visibility"
              className="w-5 h-5 object-contain"
            />
          </button>
        )}
      </div>

      {/* ===== ERROR MESSAGES ===== */}
      {error && (
        <div className="auth-field__messages">
          {errorMessages.map((msg, i) => (
            <span key={i} className="auth-field__message auth-field__message--error">
              {msg}
            </span>
          ))}
        </div>
      )}

      {/* ===== HINT ===== */}
      {showHint && <span className="auth-field__hint">{hint}</span>}

      {/* ===== RULES ===== */}
      {showRules && rules.length > 0 && (
        <div className="auth-field__rules-container">
          <ul className="auth-field__rules">
            {rules.map((rule, i) => (
              <li key={i} className="auth-field__rule">
                <span className="auth-field__rule-dot" />
                <span className="auth-field__rule-text">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ===== PLUGINS ===== */}
      {plugins.length > 0 && (
        <div className="auth-field__plugins">
          {plugins.map((plugin, i) => (
            <React.Fragment key={i}>{plugin.render()}</React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthField;
