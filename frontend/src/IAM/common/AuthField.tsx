import React, { useId, useState } from 'react';
import './AuthField.css';

/* =========================================
   TYPES
========================================= */

type PluginPosition = 'above-input' | 'below-input' | 'below-messages';

interface AuthPlugin {
  position: PluginPosition;
  render: () => React.ReactNode;
}

type FieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'tel'
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
}

interface AuthFieldProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className'
> {
  label: string;
  type?: FieldType;
  autoComplete?: string;

  error?: boolean;
  success?: boolean;

  messages?: { type: 'error' | 'warning' | 'info'; text: string }[];

  hint?: string;
  description?: React.ReactNode;
  showHelpToggle?: boolean;

  leftSlot?: React.ReactNode[];
  rightSlot?: React.ReactNode[];

  plugins?: AuthPlugin[];

  separatorTop?: boolean;
  separatorBottom?: boolean;

  /* NEW */
  selectOptions?: SelectOption[];
  radioOptions?: RadioOption[];
}

/* =========================================
   UI
========================================= */

const Separator = () => <div className="auth-field__separator">{'\u2500'.repeat(40)}</div>;

/* =========================================
   COMPONENT
========================================= */

const AuthField = ({
  label,
  id,
  name,
  type = 'text',
  autoComplete,
  error = false,
  success = false,
  messages = [],
  hint,
  description,
  showHelpToggle = false,
  leftSlot = [],
  rightSlot = [],
  plugins = [],
  separatorTop = false,
  separatorBottom = false,
  required,
  selectOptions = [],
  radioOptions = [],
  ...inputProps
}: AuthFieldProps) => {
  const reactId = useId();
  const inputId = id ?? name ?? reactId;

  const [isHelpVisible, setIsHelpVisible] = useState(false);

  const hasMessages = messages.length > 0;

  const renderPlugins = (position: PluginPosition) =>
    plugins
      .filter((p) => p.position === position)
      .map((p, i) => <React.Fragment key={i}>{p.render()}</React.Fragment>);

  /* =========================================
     INPUT RENDERER
  ========================================= */

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
            className="auth-field__input"
            {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        );

      case 'radio':
        return (
          <div className="auth-field__radio-group">
            {radioOptions.map((opt) => (
              <label key={opt.value} className="auth-field__radio-option">
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  required={required}
                  {...inputProps}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <input
            id={inputId}
            name={name}
            type="checkbox"
            required={required}
            className="auth-field__checkbox"
            {...inputProps}
          />
        );

      default:
        return (
          <input
            id={inputId}
            name={name}
            type={type}
            autoComplete={autoComplete}
            required={required}
            className="auth-field__input"
            {...inputProps}
          />
        );
    }
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div
      className={`auth-field ${
        error ? 'auth-field--error' : ''
      } ${success ? 'auth-field--success' : ''}`}
    >
      {separatorTop && <Separator />}

      <div className="auth-field__container">
        <div className="auth-field__label-row">
          <label htmlFor={inputId} className="auth-field__label">
            {label}
            {required && <span className="auth-field__required">*</span>}
          </label>

          {showHelpToggle && description && (
            <button
              type="button"
              onClick={() => setIsHelpVisible((prev) => !prev)}
              className="auth-field__help-btn"
            >
              (?)
            </button>
          )}
        </div>

        {renderPlugins('above-input')}

        <div className="auth-field__input-wrapper">
          {leftSlot.length > 0 && (
            <div className="auth-field__slot-left">
              {leftSlot.map((node, i) => (
                <div key={i} className="auth-field__slot-box-left">
                  {node}
                </div>
              ))}
            </div>
          )}

          {renderField()}

          {rightSlot.length > 0 && (
            <div className="auth-field__slot-right">
              {rightSlot.map((node, i) => (
                <div key={i} className="auth-field__slot-box-right">
                  {node}
                </div>
              ))}
            </div>
          )}
        </div>

        {renderPlugins('below-input')}

        {hasMessages && (
          <div className="auth-field__messages">
            {messages.map((msg, i) => (
              <span key={i} className={`auth-field__message auth-field__message--${msg.type}`}>
                {msg.text}
              </span>
            ))}
          </div>
        )}

        {renderPlugins('below-messages')}

        {!hasMessages && hint && !isHelpVisible && <span className="auth-field__hint">{hint}</span>}

        {!hasMessages && description && isHelpVisible && (
          <div className="auth-field__description">{description}</div>
        )}
      </div>

      {separatorBottom && <Separator />}
    </div>
  );
};

export default AuthField;
