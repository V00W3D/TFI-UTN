import PhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';

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
  icon?: string; // solo usado en radio
}

interface RenderAuthFieldProps {
  type: FieldType;
  inputId: string;
  name: string;
  required?: boolean;
  placeholder?: string;

  resolvedType: string;

  options?: FieldOption[];

  inputProps: {
    value: any;
    onChange?: (e: any) => void;
    onBlur?: () => void;
  };
}

/* =========================================================
   RENDER
========================================================= */

export const renderAuthField = ({
  type,
  inputId,
  name,
  required,
  placeholder,
  resolvedType,
  options = [],
  inputProps,
}: RenderAuthFieldProps) => {
  switch (type) {
    /* ===================== SELECT ===================== */

    case 'select':
      return (
        <select
          id={inputId}
          name={name}
          required={required}
          className="auth-field__input"
          value={inputProps.value}
          onChange={inputProps.onChange}
          onBlur={inputProps.onBlur}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    /* ===================== TEXTAREA ===================== */

    case 'textarea':
      return (
        <textarea
          id={inputId}
          name={name}
          required={required}
          placeholder={placeholder}
          className="auth-field__input"
          value={inputProps.value}
          onChange={inputProps.onChange}
          onBlur={inputProps.onBlur}
        />
      );

    /* ===================== RADIO ===================== */

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
                  onChange={inputProps.onChange}
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

    /* ===================== PHONE ===================== */

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
              });
            }
          }}
          onBlur={inputProps.onBlur}
          className="auth-phone pl-3"
        />
      );

    /* ===================== CHECKBOX ===================== */

    case 'checkbox':
      return (
        <input
          id={inputId}
          name={name}
          type="checkbox"
          checked={Boolean(inputProps.value)}
          onChange={(e) =>
            inputProps.onChange?.({
              target: { value: e.target.checked },
            })
          }
          onBlur={inputProps.onBlur}
          className="auth-field__checkbox"
        />
      );

    /* ===================== DEFAULT INPUT ===================== */

    default:
      return (
        <input
          id={inputId}
          name={name}
          type={resolvedType}
          required={required}
          placeholder={placeholder}
          className="auth-field__input"
          value={inputProps.value}
          onChange={inputProps.onChange}
          onBlur={inputProps.onBlur}
        />
      );
  }
};
