import PhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import type { FocusEvent, ChangeEvent } from 'react';

/* =========================================================
   TYPES
========================================================= */

export type FieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'phone'
  | 'select'
  | 'textarea'
  | 'radio'
  | 'checkbox';

export interface FieldOption {
  value: string;
  label: string;
  icon?: string;
}

/**
 * Maps a FieldType to the native value type it produces.
 * checkbox → boolean, everything else → string.
 */
export type FieldValueType<T extends FieldType> = T extends 'checkbox' ? boolean : string;

/**
 * Synthetic event shape used by phone, checkbox, and other
 * non-standard controls that can't produce a real ChangeEvent.
 */
export type SyntheticChangeEvent<T extends FieldType> = {
  target: { value: FieldValueType<T> };
};

/**
 * The onChange signature for a given FieldType.
 * Standard HTML controls emit a real ChangeEvent; non-standard ones
 * emit a SyntheticChangeEvent so callers always read `e.target.value`.
 */
export type FieldChangeHandler<T extends FieldType> = T extends 'checkbox' | 'phone'
  ? (e: SyntheticChangeEvent<T>) => void
  : (
      e:
        | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
        | SyntheticChangeEvent<T>,
    ) => void;

interface InputProps<T extends FieldType> {
  value: FieldValueType<T>;
  onChange?: FieldChangeHandler<T>;
  onBlur?: (e: FocusEvent<HTMLElement>) => void;
}

interface RenderAuthFieldProps<T extends FieldType = FieldType> {
  type: T;
  inputId: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  resolvedType: string;
  options?: FieldOption[] | undefined;
  inputProps: InputProps<T>;
}

/* =========================================================
   RENDER
========================================================= */

export const renderAuthField = <T extends FieldType>({
  type,
  inputId,
  name,
  required,
  placeholder,
  resolvedType,
  options = [],
  inputProps,
}: RenderAuthFieldProps<T>) => {
  switch (type) {
    case 'select':
      return (
        <select
          id={inputId}
          name={name}
          required={required}
          className="auth-field__input"
          value={inputProps.value as string}
          onChange={inputProps.onChange as (e: ChangeEvent<HTMLSelectElement>) => void}
          onBlur={inputProps.onBlur}
        >
          {options.map((opt) => (
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
          value={inputProps.value as string}
          onChange={inputProps.onChange as (e: ChangeEvent<HTMLTextAreaElement>) => void}
          onBlur={inputProps.onBlur}
        />
      );

    case 'radio':
      return (
        <div className="auth-field__radio-group">
          {options.map((opt) => {
            const checked = inputProps.value === opt.value;
            return (
              <label key={opt.value} className="auth-field__radio-option" data-value={opt.value}>
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={checked}
                  onChange={inputProps.onChange as (e: ChangeEvent<HTMLInputElement>) => void}
                  onBlur={inputProps.onBlur}
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
            (inputProps.onChange as FieldChangeHandler<'phone'>)?.({
              target: { value: value ?? '' },
            });
          }}
          onBlur={(e: FocusEvent<HTMLElement>) => inputProps.onBlur?.(e)}
          className="auth-phone pl-3"
        />
      );

    case 'checkbox':
      return (
        <input
          id={inputId}
          name={name}
          type="checkbox"
          checked={Boolean(inputProps.value)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            (inputProps.onChange as FieldChangeHandler<'checkbox'>)?.({
              target: { value: e.target.checked },
            });
          }}
          onBlur={inputProps.onBlur}
          className="auth-field__checkbox"
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
          value={inputProps.value as string}
          onChange={inputProps.onChange as (e: ChangeEvent<HTMLInputElement>) => void}
          onBlur={inputProps.onBlur}
        />
      );
  }
};
