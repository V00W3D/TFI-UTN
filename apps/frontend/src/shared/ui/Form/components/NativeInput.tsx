import { memo } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import PhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import type { ControlOption, ControlType } from '@/shared/ui/Form/types';
import { inputStyles } from '@/styles/components/input';
import { formRadioCardStyles, formRadioGroupStyles, formStyles } from '@/styles/modules/form';
import { cn } from '@/styles/utils/cn';

interface NativeInputProps {
  value: string | boolean;
  onChange: (e: { target: { value: unknown } }) => void;
  onBlur: (e: FocusEvent<HTMLElement>) => void;
  onFocus?: (() => void) | undefined;
  className?: string | undefined;
  nakedWrapper?: boolean | undefined;
  intent?: 'default' | 'error' | 'success';
}

export const NativeInput = memo(
  ({
    type,
    resolvedType,
    inputId,
    name,
    required,
    placeholder,
    options,
    inputProps,
  }: {
    type: ControlType;
    resolvedType: string;
    inputId: string;
    name: string;
    required?: boolean;
    placeholder?: string;
    options: ControlOption[];
    inputProps: NativeInputProps;
  }) => {
    switch (type) {
      case 'select':
        return (
          <select
            id={inputId}
            name={name}
            required={required}
            className={cn(inputStyles({ intent: inputProps.intent }), inputProps.className)}
            value={inputProps.value as string}
            onChange={inputProps.onChange as (e: ChangeEvent<HTMLSelectElement>) => void}
            onBlur={inputProps.onBlur}
            onFocus={inputProps.onFocus}
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
            className={cn(
              inputStyles({ intent: inputProps.intent }),
              formStyles.textarea,
              inputProps.className,
            )}
            value={inputProps.value as string}
            onChange={inputProps.onChange as (e: ChangeEvent<HTMLTextAreaElement>) => void}
            onBlur={inputProps.onBlur}
            onFocus={inputProps.onFocus}
          />
        );
      case 'radio':
        return (
          <div
            className={cn(
              formRadioGroupStyles({ layout: inputProps.nakedWrapper ? 'inline' : 'stacked' }),
              inputProps.className,
            )}
          >
            {options.map((opt) => {
              const isSelected = inputProps.value === opt.value;
              return (
                <label key={opt.value} className={formStyles.radioOption}>
                  <input
                    type="radio"
                    name={name}
                    value={opt.value}
                    checked={isSelected}
                    className={formStyles.radioInputHidden}
                    onChange={inputProps.onChange as (e: ChangeEvent<HTMLInputElement>) => void}
                    onBlur={inputProps.onBlur}
                    onFocus={inputProps.onFocus}
                  />
                  <div className={formRadioCardStyles({ selected: isSelected })}>
                    {opt.icon && (
                      <span className={formStyles.radioIcon} aria-hidden="true">
                        {opt.icon}
                      </span>
                    )}
                    <span className={formStyles.radioLabel}>{opt.label}</span>
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
            onChange={(val) => inputProps.onChange({ target: { value: val ?? '' } })}
            onBlur={(e: FocusEvent<HTMLElement>) => inputProps.onBlur(e)}
            {...(inputProps.onFocus ? { onFocus: () => inputProps.onFocus!() } : {})}
            className={cn(formStyles.phone, inputProps.className)}
          />
        );
      case 'checkbox':
        return (
          <input
            id={inputId}
            name={name}
            type="checkbox"
            checked={Boolean(inputProps.value)}
            className={cn(formStyles.checkbox, inputProps.className)}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              inputProps.onChange({ target: { value: e.target.checked } })
            }
            onBlur={inputProps.onBlur}
            onFocus={inputProps.onFocus}
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
            className={cn(inputStyles({ intent: inputProps.intent }), inputProps.className)}
            value={inputProps.value as string}
            onChange={inputProps.onChange as (e: ChangeEvent<HTMLInputElement>) => void}
            onBlur={inputProps.onBlur}
            onFocus={inputProps.onFocus}
          />
        );
    }
  },
);
