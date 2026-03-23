import { useId, useState } from 'react';
import type { UseBoundStore, StoreApi } from 'zustand';
import type { ChangeEvent, FocusEvent, ReactNode } from 'react';
import PhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import 'react-phone-number-input/style.css';
import type { FormState, AnyContract, RequestShapeOf } from '@app/sdk';

/* =========================================================
   § PRIMITIVE TYPES
========================================================= */

type FieldMode = 'login' | 'register';

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
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

export type FieldAddon =
  | { type: 'icon'; src: string }
  | { type: 'passwordToggle' }
  | { type: 'hint'; text: string }
  | { type: 'rules'; rules: readonly string[] }
  | { type: 'rubber' }
  | { type: 'strength' };

type PrimitiveControl = 'text' | 'email' | 'password' | 'phone';
type SelectControl = ['select', FieldOption[]];
type RadioControl = ['radio', FieldOption[]];

export type FieldControl = PrimitiveControl | SelectControl | RadioControl;

export interface FieldProps {
  label: string;
  control?: FieldControl;
  placeholder?: string;
  required?: boolean;
  fieldMode?: FieldMode;
  addons?: FieldAddon[];
}

/* =========================================================
   § INTERNAL TYPES
========================================================= */

type SyntheticEvent<V> = { target: { value: V } };

type ChangeHandler =
  | ((
      e:
        | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
        | SyntheticEvent<string>,
    ) => void)
  | ((e: SyntheticEvent<boolean>) => void);

interface InputProps {
  value: string | boolean;
  onChange?: ChangeHandler;
  onBlur?: (e: FocusEvent<HTMLElement>) => void;
}

/* =========================================================
   § STRENGTH SCORES — defined once, never re-created
========================================================= */

const STRENGTH_LABELS = ['', 'muy débil', 'débil', 'decente', 'segura', 'muy segura'] as const;

const STRENGTH_COLORS = [
  '',
  'bg-red-500',
  'bg-orange-400',
  'bg-yellow-400',
  'bg-blue-400',
  'bg-[hsl(220_90%_56%)]',
] as const;

function calcStrength(val: string): number {
  return (
    (val.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(val) ? 1 : 0) +
    (/[a-z]/.test(val) ? 1 : 0) +
    (/[0-9]/.test(val) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(val) ? 1 : 0)
  );
}

/* =========================================================
   § SUB-COMPONENTS
   Pure, internal — not exported. Each renders exactly one concern.
========================================================= */

/* ── FieldControl: the actual <input>, <select>, etc. ── */

interface FieldControlProps {
  type: FieldType;
  resolvedType: string;
  inputId: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  options: FieldOption[];
  inputProps: InputProps;
}

function FieldControl({
  type,
  resolvedType,
  inputId,
  name,
  required,
  placeholder,
  options,
  inputProps,
}: FieldControlProps) {
  const baseInput = (
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
                  className="hidden"
                />
                <div
                  className={[
                    'auth-field__radio-card',
                    checked ? 'auth-field__radio-card--checked' : '',
                    `auth-field__radio-card--${opt.value}`,
                  ].join(' ')}
                >
                  <div className="auth-field__radio-circle">
                    {checked && <div className="auth-field__radio-dot" />}
                  </div>
                  {opt.icon && (
                    <img
                      src={opt.icon}
                      alt={opt.label}
                      className="size-6 object-contain transition-all duration-300"
                    />
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
            (inputProps.onChange as (e: SyntheticEvent<string>) => void)?.({
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
            (inputProps.onChange as (e: SyntheticEvent<boolean>) => void)?.({
              target: { value: e.target.checked },
            });
          }}
          onBlur={inputProps.onBlur}
          className="auth-field__checkbox"
        />
      );

    default:
      return baseInput;
  }
}

/* ── FieldStrength ── */

interface FieldStrengthProps {
  value: string;
}

function FieldStrength({ value }: FieldStrengthProps) {
  const score = calcStrength(value);
  if (!score) return null;

  return (
    <div className="flex flex-col gap-1 mt-2">
      <div className="w-full h-2 rounded overflow-hidden bg-(--border)">
        <div
          className={`h-full transition-all duration-300 ${STRENGTH_COLORS[score]} ${score === 5 ? 'animate-[rgbShift_3s_linear_infinite]' : ''}`}
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <span className="text-xs text-(--text-secondary)">
        Fuerza: <span className="font-semibold">{STRENGTH_LABELS[score]}</span>
      </span>
    </div>
  );
}

/* ── FieldRules ── */

interface FieldRulesProps {
  rules: readonly string[];
}

function FieldRules({ rules }: FieldRulesProps) {
  return (
    <div className="mt-2 p-3 border border-(--border) bg-(--surface-soft) animate-[fadeIn_.15s_ease]">
      <ul className="space-y-2">
        {rules.map((rule, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-xs leading-relaxed text-(--text-secondary)"
          >
            <span className="mt-1 size-1.5 rounded-full shrink-0 bg-(--color-primary-muted)" />
            <span className="flex-1">{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── FieldErrors ── */

interface FieldErrorsProps {
  errors: string[];
}

function FieldErrors({ errors }: FieldErrorsProps) {
  return (
    <div className="flex flex-col gap-1 text-xs animate-[fadeIn_.15s_ease]">
      {errors.map((msg, i) => (
        <span key={i} className="text-(--color-error-dark)">
          {msg}
        </span>
      ))}
    </div>
  );
}

/* ── SlotButton — shared by rubber + passwordToggle ── */

interface SlotButtonProps {
  onClick: () => void;
  src: string;
  alt: string;
}

function SlotButton({ onClick, src, alt }: SlotButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center size-10 shrink-0 cursor-pointer bg-transparent border-none
                 text-(--text-muted) transition-colors duration-200
                 hover:bg-(--surface-soft)
                 dark:text-(--color-primary) dark:filter-[invert(1)]"
    >
      <img src={src} alt={alt} className="size-6 object-contain pointer-events-none" />
    </button>
  );
}

/* =========================================================
   § useFieldState — pure logic hook, zero JSX
========================================================= */

interface FieldStateOptions {
  addons: FieldAddon[];
  type: FieldType;
  fieldMode: FieldMode;
  value: unknown;
  errors: string[];
  isValid: boolean;
  reset?: () => void;
}

function useFieldState({
  addons,
  type,
  fieldMode,
  value,
  errors,
  isValid,
  reset,
}: FieldStateOptions) {
  /* ── addon flags ── */
  const iconAddon = addons.find(
    (a): a is Extract<FieldAddon, { type: 'icon' }> => a.type === 'icon',
  );
  const hintAddon = addons.find(
    (a): a is Extract<FieldAddon, { type: 'hint' }> => a.type === 'hint',
  );
  const rulesAddon = addons.find(
    (a): a is Extract<FieldAddon, { type: 'rules' }> => a.type === 'rules',
  );
  const hasPasswordToggle = addons.some((a) => a.type === 'passwordToggle');
  const hasRubber = addons.some((a) => a.type === 'rubber');
  const hasStrength = addons.some((a) => a.type === 'strength');

  /* ── local state ── */
  const [isVisible, setIsVisible] = useState(false);
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const isRegister = fieldMode === 'register';

  /* ── derived ── */
  const hasValue = typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
  const showError = hasInteracted && errors.length > 0;
  const showSuccess = hasInteracted && hasValue && isValid && !showError;

  const stateClass = showError ? 'auth-field--error' : showSuccess ? 'auth-field--success' : '';

  const resolvedType =
    hasPasswordToggle && type === 'password' ? (isVisible ? 'text' : 'password') : type;

  /* ── slot contents ── */
  const leftSlot: ReactNode = iconAddon ? (
    <div className="flex items-end">
      <div
        className={`flex items-center justify-center size-10 shrink-0 transition-colors duration-200
                       text-(--text-muted) auth-field__slot-box-left`}
      >
        <img src={iconAddon.src} alt="icon" className="size-6 object-contain" />
      </div>
    </div>
  ) : null;

  const rightSlot: ReactNode = (() => {
    const showToggle = hasPasswordToggle && type === 'password';
    const showRubber = hasRubber && reset;
    if (!showToggle && !showRubber) return null;
    return (
      <div className="flex items-center gap-2 shrink-0">
        {showRubber && <SlotButton onClick={() => reset?.()} src="/rubber-icon.png" alt="reset" />}
        {showToggle && (
          <SlotButton
            onClick={() => setIsVisible((p) => !p)}
            src={isVisible ? '/open-eye.png' : '/closed-eye.png'}
            alt="toggle visibility"
          />
        )}
      </div>
    );
  })();

  const labelAction: ReactNode =
    isRegister && rulesAddon ? (
      <button
        type="button"
        onClick={() => setIsHelpVisible((p) => !p)}
        className="text-xs font-medium cursor-pointer bg-transparent border-none
                 text-(--text-muted) transition-colors duration-200
                 hover:text-(--color-primary)"
      >
        (?)
      </button>
    ) : null;

  const hint: ReactNode =
    isRegister && hintAddon && !showError && !isHelpVisible ? (
      <span className="text-xs text-(--text-muted)">{hintAddon.text}</span>
    ) : null;

  const rulesBlock: ReactNode =
    isRegister && rulesAddon && isHelpVisible ? <FieldRules rules={rulesAddon.rules} /> : null;

  const errorBlock: ReactNode = showError ? <FieldErrors errors={errors} /> : null;

  const strengthBlock: ReactNode =
    hasStrength && isRegister && type === 'password' && value ? (
      <FieldStrength value={String(value)} />
    ) : null;

  return {
    resolvedType,
    stateClass,
    hasInteracted,
    setHasInteracted,
    leftSlot,
    rightSlot,
    labelAction,
    hint,
    rulesBlock,
    errorBlock,
    strengthBlock,
  };
}

/* =========================================================
   § FIELD FACTORY
========================================================= */

export function FieldFactory<C extends AnyContract>(
  $form: UseBoundStore<StoreApi<FormState<RequestShapeOf<C>>>>,
) {
  return function bindField<K extends keyof RequestShapeOf<C> & string>(name: K) {
    return function Field({
      label,
      control = 'text',
      placeholder = '',
      required = false,
      fieldMode = 'register',
      addons = [],
    }: FieldProps) {
      const inputId = useId();

      /* ── store selectors ── */
      const value = $form((s) => s.values[name]);
      const errors = ($form((s) => s.errors[name]) ?? []) as string[];
      const isValid = !errors.length && $form((s) => s.isFormValid);
      const reset = $form((s) => s.reset);
      const storeSet = $form((s) => s.set);
      const storeBlur = $form((s) => s.blur);

      /* ── control parsing ── */
      const type: FieldType = Array.isArray(control) ? (control[0] as FieldType) : control;
      const options: FieldOption[] = Array.isArray(control) ? control[1] : [];

      /* ── field state ── */
      const {
        resolvedType,
        stateClass,
        hasInteracted,
        setHasInteracted,
        leftSlot,
        rightSlot,
        labelAction,
        hint,
        rulesBlock,
        errorBlock,
        strengthBlock,
      } = useFieldState({ addons, type, fieldMode, value, errors, isValid, reset });

      /* ── handlers ── */
      const onChange = (
        e:
          | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
          | SyntheticEvent<string | boolean>,
      ) => {
        if (!hasInteracted) setHasInteracted(true);
        storeSet(name, e.target.value as never);
      };

      const onBlur = (_e: FocusEvent<HTMLElement>) => storeBlur(name);

      /* ── render ── */
      return (
        <div className={`auth-field ${stateClass}`}>
          <div className="flex items-center justify-between">
            <label htmlFor={inputId} className="auth-field__label">
              {label}
              {required && <span className="ml-1 text-(--color-error)">*</span>}
            </label>
            {labelAction}
          </div>

          <div className="auth-field__input-wrapper">
            {leftSlot}
            <FieldControl
              type={type}
              resolvedType={resolvedType}
              inputId={inputId}
              name={name}
              required={required}
              placeholder={placeholder}
              options={options}
              inputProps={{ value: value as string | boolean, onChange, onBlur }}
            />
            {rightSlot}
          </div>

          {errorBlock}
          {strengthBlock}
          {hint}
          {rulesBlock}
        </div>
      );
    };
  };
}
