import React from 'react';
import PhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';

/* =========================================================
   TYPES
========================================================= */

export type FieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'tel'
  | 'phone'
  | 'select'
  | 'textarea'
  | 'radio'
  | 'checkbox';

export interface SelectOption {
  value: string;
  label: string;
}

export interface RadioOption {
  value: string;
  label: string;
  icon?: string;
}

interface RenderAuthFieldProps {
  type: FieldType;
  inputId: string;
  name?: string;
  required?: boolean;
  placeholder?: string;

  resolvedType: string;

  inputProps: any;

  selectOptions: SelectOption[];
  radioOptions: RadioOption[];
}

export const renderAuthField = ({
  type,
  inputId,
  name,
  required,
  placeholder,
  resolvedType,
  inputProps,
  selectOptions,
  radioOptions,
}: RenderAuthFieldProps) => {
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
          required={required}
          placeholder={placeholder}
          className="auth-field__input"
          {...inputProps}
        />
      );
  }
};
