/**
 * @file FormFactory.tsx
 * @description Fábrica de formularios reactivos tipados sobre el SDK de contratos.
 * Genera automáticamente campos, validación, envío y UI a partir de contratos Zod.
 * @module FormFactory
 */

import { useId, useState, useCallback, useEffect, memo } from 'react';
import { useStore } from 'zustand';
import type { UseBoundStore, StoreApi } from 'zustand';
import type { ChangeEvent, FocusEvent, ReactNode, FormEvent } from 'react';
import PhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import 'react-phone-number-input/style.css';
import type { NavigateOptions } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import type { ClientApiInstance, RequestState } from '@app/sdk/ApiClient';
import type { FormState } from '@app/sdk';
import type { AnyContract, RequestShapeOf } from '@app/sdk';
import './FormFactoryStyles.css';

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 1 — TIPOS PÚBLICOS
// Todo lo que el consumidor del módulo necesita conocer.
// ─────────────────────────────────────────────────────────────────────────────

//#region FIELD_TYPES

/**
 * @summary Tipo de control visual de un campo.
 * Determina qué elemento HTML se renderiza para capturar el valor.
 */
export type ControlType =
  | 'text' // Texto libre
  | 'email' // Dirección de correo
  | 'password' // Contraseña (oculta por defecto)
  | 'phone' // Teléfono con selector de país
  | 'select' // Lista desplegable
  | 'textarea' // Área de texto multilínea
  | 'radio' // Selector de opción única con tarjetas
  | 'checkbox'; // Casilla de verificación

/**
 * @summary Opción individual para controles `select` o `radio`.
 * @property value - Valor interno enviado al store.
 * @property label - Texto visible al usuario.
 * @property icon  - Ruta a imagen decorativa (opcional).
 */
export interface ControlOption {
  value: string;
  label: string;
  icon?: string;
}

/**
 * @summary Control de entrada — texto simple o tuple `[tipo, opciones]`.
 * @remarks
 * - Primitivo: `'text'`, `'email'`, `'password'`, `'phone'`
 * - Con opciones: `['select', [...opciones]]` o `['radio', [...opciones]]`
 */
export type InputControl =
  | 'text'
  | 'email'
  | 'password'
  | 'phone'
  | ['select', ControlOption[]]
  | ['radio', ControlOption[]];

/**
 * @summary Complementos que extienden el comportamiento visual de un campo.
 * @remarks Cada complemento se identifica por su propiedad `type`.
 * - `icon`            — ícono decorativo a la izquierda del input
 * - `passwordToggle`  — botón para mostrar/ocultar contraseña
 * - `hint`            — texto de ayuda debajo del campo
 * - `rules`           — lista de reglas expandibles al hacer clic en `(?)`
 * - `strength`        — indicador visual de fortaleza de contraseña
 */
export type FieldAddon =
  | { type: 'icon'; src: string }
  | { type: 'passwordToggle' }
  | { type: 'hint'; text: string }
  | { type: 'rules'; rules: readonly string[] }
  | { type: 'strength' };

/** @summary Modo del formulario — afecta qué complementos se muestran. */
export type FormMode = 'login' | 'register';

/**
 * @summary Props públicas de un campo generado por `FormFactory`.
 */
export interface FieldProps {
  /** Texto del label visible sobre el campo. */
  label: string;
  /** Tipo de control de entrada. Por defecto: `'text'`. */
  control?: InputControl;
  /** Placeholder del input cuando está vacío. */
  placeholder?: string;
  /** Muestra un asterisco y bloquea el submit si está vacío. */
  required?: boolean;
  /** Modo del formulario — controla hints y reglas. Por defecto: `'register'`. */
  fieldMode?: FormMode;
  /** Complementos opcionales: ícono, toggle, hint, reglas, fortaleza. */
  addons?: FieldAddon[];
}

//#endregion

//#region FORM_TYPES

/**
 * @summary Props del componente `Form` generado por `FormFactory`.
 * @remarks
 * Usado principalmente por RegisterPage y otros formularios genéricos.
 * LoginPage usa el handler `submit` raw directamente para mayor control.
 */
export interface FormProps {
  /** Contenido del formulario — campos y secciones. */
  children: ReactNode;
  /** Texto del botón en estado normal. Por defecto: `'Enviar'`. */
  buttonText?: string;
  /** Texto del botón mientras se procesa la solicitud. Por defecto: `'Cargando...'`. */
  loadingText?: string;
  /** Ruta a la que navegar cuando el submit es exitoso. */
  redirectTo?: string;
  /** Opciones de navegación (ej. `{ replace: true }`). */
  redirectOptions?: NavigateOptions;
  /** Callback ejecutado tras un envío exitoso del servidor. */
  onSuccess?: (data: unknown) => void;
}

/**
 * @summary Map de campos tipados para un contrato específico del SDK.
 */
export type TypedFields<C extends AnyContract> = {
  readonly [K in keyof RequestShapeOf<C> & string]: (props: FieldProps) => ReactNode;
};

/**
 * @summary Instancia completa de formulario para un endpoint del SDK.
 */
export interface FormInstance<C extends AnyContract> {
  readonly fields: TypedFields<C>;
  /**
   * Componente completo del formulario.
   * @example
   * ```tsx
   * const { Form, fields } = form.iam.register;
   * <Form buttonText="Crear Cuenta" redirectTo="/iam/login" redirectOptions={{ replace: true }}>
   *   <fields.name label="Nombre" required />
   * </Form>
   * ```
   */
  readonly Form: (props: FormProps) => ReactNode;
  readonly $form: UseBoundStore<StoreApi<FormState<RequestShapeOf<C>>>>;
  /**
   * Handler raw de `onSubmit` — para control total del submit sin usar `Form`.
   * @param onComplete - Callback ejecutado con los valores validados si el form es válido.
   * @example
   * ```tsx
   * // LoginPage — inyectar rememberMe antes de llamar al SDK
   * const handleSubmit = submit(async (values) => {
   *   await sdk.iam.login({ ...values, rememberMe: rememberMeRef.current });
   * });
   * ```
   */
  submit: (
    onComplete: (values: FormState<RequestShapeOf<C>>['values']) => void,
  ) => (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * @summary API completa de formularios generada por `FormFactory`.
 */
export type FormFactoryInstance<TContracts extends readonly AnyContract[]> = {
  readonly [TModule in SDKModules<TContracts>]: {
    readonly [TAction in SDKActions<TContracts, TModule>]: FormInstance<
      ContractFor<TContracts, TModule, TAction>
    >;
  };
};

//#endregion

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 2 — TIPOS INTERNOS
// ─────────────────────────────────────────────────────────────────────────────

//#region INTERNAL_TYPES

type SyntheticEvent<V> = { target: { value: V } };

type ChangeHandler = (
  e:
    | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    | SyntheticEvent<string>
    | SyntheticEvent<boolean>,
) => void;

interface NativeInputProps {
  value: string | boolean;
  onChange: ChangeHandler;
  onBlur: (e: FocusEvent<HTMLElement>) => void;
}

interface BoundFieldProps extends FieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: StoreApi<FormState<any>>;
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormStore = UseBoundStore<StoreApi<FormState<any>>>;

type OpaqueEndpoint = {
  $form: FormStore;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $use: UseBoundStore<StoreApi<RequestState<any, any>>>;
  $reset: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (input: any): Promise<any>;
};

type SDKModules<TContracts extends readonly AnyContract[]> =
  TContracts[number]['__path'] extends `/${infer M}/${string}` ? M : never;

type SDKActions<
  TContracts extends readonly AnyContract[],
  TModule extends string,
> = TContracts[number] extends infer C
  ? C extends AnyContract
    ? C['__path'] extends `/${TModule}/${infer A}`
      ? A
      : never
    : never
  : never;

type ContractFor<
  TContracts extends readonly AnyContract[],
  TModule extends string,
  TAction extends string,
> = Extract<TContracts[number], { __path: `/${TModule}/${TAction}` }>;

//#endregion

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 3 — CONSTANTES Y UTILIDADES INTERNAS
// ─────────────────────────────────────────────────────────────────────────────

//#region CONSTANTS_AND_UTILS

const STRENGTH_LABELS = ['', 'muy débil', 'débil', 'decente', 'segura', 'muy segura'] as const;

const STRENGTH_COLORS = [
  '',
  'bg-red-500',
  'bg-orange-400',
  'bg-yellow-400',
  'bg-blue-400',
  'bg-[hsl(220_90%_56%)]',
] as const;

const calculateStrength = (value: string): number =>
  (value.length >= 8 ? 1 : 0) +
  (/[A-Z]/.test(value) ? 1 : 0) +
  (/[a-z]/.test(value) ? 1 : 0) +
  (/[0-9]/.test(value) ? 1 : 0) +
  (/[^A-Za-z0-9]/.test(value) ? 1 : 0);

const extractAddons = (addons: FieldAddon[]) => ({
  iconAddon: addons.find((a): a is Extract<FieldAddon, { type: 'icon' }> => a.type === 'icon'),
  hintAddon: addons.find((a): a is Extract<FieldAddon, { type: 'hint' }> => a.type === 'hint'),
  rulesAddon: addons.find((a): a is Extract<FieldAddon, { type: 'rules' }> => a.type === 'rules'),
  hasPasswordToggle: addons.some((a) => a.type === 'passwordToggle'),
  hasStrength: addons.some((a) => a.type === 'strength'),
});

//#endregion

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 4 — SUBCOMPONENTES INTERNOS
// ─────────────────────────────────────────────────────────────────────────────

//#region SUBCOMPONENTS

const SlotButton = memo(
  ({ onClick, icon, description }: { onClick: () => void; icon: string; description: string }) => (
    <button type="button" onClick={onClick} className="ff-slot-btn">
      <img
        src={icon}
        alt={description}
        className="size-6 object-contain pointer-events-none ff-icon"
      />
    </button>
  ),
);

const StrengthIndicator = memo(({ value }: { value: string }) => {
  const level = calculateStrength(value);
  if (!level) return null;
  return (
    <div className="ff-strength">
      <div className="ff-strength-bar">
        <div
          className={`ff-strength-fill ${STRENGTH_COLORS[level]} ${level === 5 ? 'animate-[ff-rgb-shift_3s_linear_infinite]' : ''}`}
          style={{ width: `${(level / 5) * 100}%` }}
        />
      </div>
      <span className="text-xs text-(--text-secondary)">
        {'Fortaleza: '}
        <span className="font-semibold">{STRENGTH_LABELS[level]}</span>
      </span>
    </div>
  );
});

const RulesList = memo(({ rules }: { rules: readonly string[] }) => (
  <div className="ff-rules">
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
));

const ErrorMessages = memo(({ errors }: { errors: string[] }) => (
  <div className="ff-errors">
    {errors.map((msg, i) => (
      <span key={i} className="ff-error-msg">
        {msg}
      </span>
    ))}
  </div>
));

const NativeInput = memo(
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
            className="ff-input"
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
            className="ff-input"
            value={inputProps.value as string}
            onChange={inputProps.onChange as (e: ChangeEvent<HTMLTextAreaElement>) => void}
            onBlur={inputProps.onBlur}
          />
        );
      case 'radio':
        return (
          <div className="ff-radio-group">
            {options.map((opt) => {
              const isSelected = inputProps.value === opt.value;
              return (
                <label key={opt.value} className="ff-radio-option" data-value={opt.value}>
                  <input
                    type="radio"
                    name={name}
                    value={opt.value}
                    checked={isSelected}
                    className="hidden"
                    onChange={inputProps.onChange as (e: ChangeEvent<HTMLInputElement>) => void}
                    onBlur={inputProps.onBlur}
                  />
                  <div
                    className={`ff-radio-card${isSelected ? ' ff-radio-card--checked' : ''} ff-radio-card--${opt.value}`}
                  >
                    <div className="ff-radio-circle">
                      {isSelected && <div className="ff-radio-dot" />}
                    </div>
                    {opt.icon && (
                      <img
                        src={opt.icon}
                        alt={opt.label}
                        className="size-6 object-contain transition-all duration-300 ff-icon"
                      />
                    )}
                    <span className="ff-radio-label">{opt.label}</span>
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
            className="ff-phone pl-3"
          />
        );
      case 'checkbox':
        return (
          <input
            id={inputId}
            name={name}
            type="checkbox"
            checked={Boolean(inputProps.value)}
            className="ff-checkbox"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              inputProps.onChange({ target: { value: e.target.checked } })
            }
            onBlur={inputProps.onBlur}
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
            className="ff-input"
            value={inputProps.value as string}
            onChange={inputProps.onChange as (e: ChangeEvent<HTMLInputElement>) => void}
            onBlur={inputProps.onBlur}
          />
        );
    }
  },
);

//#endregion

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 5 — CAMPO VINCULADO AL STORE
// ─────────────────────────────────────────────────────────────────────────────

//#region BOUND_FIELD

const BoundField = memo(
  ({
    store,
    name,
    label,
    control = 'text',
    placeholder = '',
    required = false,
    fieldMode = 'register',
    addons = [],
  }: BoundFieldProps) => {
    const inputId = useId();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [rulesVisible, setRulesVisible] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const value = useStore(store, (s) => s.values[name]);
    const rawErrors = useStore(store, (s) => s.errors[name]);
    const isFormValid = useStore(store, (s) => s.isFormValid);
    const save = useStore(store, (s) => s.set);
    const markBlur = useStore(store, (s) => s.blur);
    const clear = useStore(store, (s) => s.reset);

    const errors = (rawErrors ?? []) as string[];
    const type: ControlType = Array.isArray(control) ? (control[0] as ControlType) : control;
    const options: ControlOption[] = Array.isArray(control) ? control[1] : [];
    const { iconAddon, hintAddon, rulesAddon, hasPasswordToggle, hasStrength } =
      extractAddons(addons);

    const isRegisterMode = fieldMode === 'register';
    const hasValue = typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
    const isFieldValid = !errors.length && isFormValid;
    const showError = hasInteracted && errors.length > 0;
    const showSuccess = hasInteracted && hasValue && isFieldValid && !showError;
    const stateClass = showError ? 'ff-field--error' : showSuccess ? 'ff-field--success' : '';
    const resolvedType =
      hasPasswordToggle && type === 'password' ? (passwordVisible ? 'text' : 'password') : type;

    const handleChange = useCallback(
      (
        e:
          | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
          | SyntheticEvent<string | boolean>,
      ) => {
        setHasInteracted(true);
        save(name, e.target.value as never);
      },
      [save, name],
    );
    const handleBlur = useCallback(
      (_e: FocusEvent<HTMLElement>) => markBlur(name),
      [markBlur, name],
    );
    const togglePassword = useCallback(() => setPasswordVisible((p) => !p), []);
    const toggleRules = useCallback(() => setRulesVisible((p) => !p), []);
    const handleClear = useCallback(() => clear(), [clear]);

    return (
      <div className={`ff-field ${stateClass}`}>
        <div className="ff-label-row">
          <label htmlFor={inputId} className="ff-label">
            {label}
            {required && <span className="ff-required">{'*'}</span>}
          </label>
          {isRegisterMode && rulesAddon && (
            <button type="button" onClick={toggleRules} className="ff-help-btn">
              {rulesVisible ? 'cerrar' : '(?)'}
            </button>
          )}
        </div>
        <div className="ff-input-wrapper">
          {iconAddon && (
            <div className="ff-slot-left">
              <div className="ff-slot-icon">
                <img
                  src={iconAddon.src}
                  alt="ícono del campo"
                  className="size-5 object-contain ff-icon"
                />
              </div>
            </div>
          )}
          <NativeInput
            type={type}
            resolvedType={resolvedType}
            inputId={inputId}
            name={name}
            required={required}
            placeholder={placeholder}
            options={options}
            inputProps={{
              value: value as string | boolean,
              onChange: handleChange,
              onBlur: handleBlur,
            }}
          />
          <div className="ff-slot-right">
            <SlotButton onClick={handleClear} icon="/rubber-icon.png" description="Limpiar campo" />
            {hasPasswordToggle && type === 'password' && (
              <SlotButton
                onClick={togglePassword}
                icon={passwordVisible ? '/open-eye.png' : '/closed-eye.png'}
                description={passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              />
            )}
          </div>
        </div>
        {showError && <ErrorMessages errors={errors} />}
        {hasStrength && isRegisterMode && type === 'password' && value && (
          <StrengthIndicator value={String(value)} />
        )}
        {isRegisterMode && hintAddon && !showError && !rulesVisible && (
          <span className="text-xs text-(--text-muted)">{hintAddon.text}</span>
        )}
        {isRegisterMode && rulesAddon && rulesVisible && <RulesList rules={rulesAddon.rules} />}
      </div>
    );
  },
);

const createField = (store: FormStore, name: string) => (props: FieldProps) => (
  <BoundField {...props} store={store} name={name} />
);

//#endregion

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 6 — CONSTRUCTOR DEL FORMULARIO COMPLETO
// Usado por RegisterPage y otros formularios genéricos.
// LoginPage usa el handler `submit` raw directamente.
// ─────────────────────────────────────────────────────────────────────────────

//#region FORM_BUILDER

const buildForm =
  (endpoint: OpaqueEndpoint): ((props: FormProps) => ReactNode) =>
  ({
    children,
    buttonText = 'Enviar',
    loadingText = 'Cargando...',
    redirectTo,
    redirectOptions,
    onSuccess,
  }: FormProps) => {
    const navigate = useNavigate();
    const { data, error, isFetching, isFormValid } = endpoint.$use();
    const store = endpoint.$form;

    useEffect(() => {
      endpoint.$reset();
    }, []);

    useEffect(() => {
      // eslint-disable-next-line no-console
      if (data) console.log('[FormFactory] respuesta exitosa:', data);
      // eslint-disable-next-line no-console
      if (error) console.log('[FormFactory] error de servidor:', error);
      if (data && !error) {
        if (onSuccess) onSuccess(data);
        if (redirectTo) navigate(redirectTo, redirectOptions);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, error, navigate]);

    const handleSubmit = useCallback(
      async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isFetching) return;
        const isValid = await store.getState().validate();
        if (!isValid) return;
        try {
          await endpoint(store.getState().getValues());
        } catch {
          // El error queda guardado en el requestStore
        }
      },
      [isFetching, store],
    );

    return (
      <div className="auth-wrapper">
        {/* register-card para layout de columna única */}
        <div className="auth-card register-card">
          <form onSubmit={handleSubmit} className="auth-form">
            {children}
            <button type="submit" disabled={isFetching || !isFormValid} className="auth-button">
              {isFetching ? loadingText : buttonText}
            </button>
            {error && (
              <p className="auth-feedback auth-feedback--error">
                {(error as { code?: string }).code ?? 'Error desconocido'}
              </p>
            )}
            {data && !error && (
              <p className="auth-feedback auth-feedback--success">Operación exitosa</p>
            )}
          </form>
        </div>
      </div>
    );
  };

//#endregion

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 7 — API PÚBLICA
// ─────────────────────────────────────────────────────────────────────────────

//#region PUBLIC_API

/**
 * @public
 * @summary Agrupa campos dentro de un `<Form>` con un título de sección.
 */
export const FormSection = ({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={`flex flex-col ${className || 'gap-8'}`}>
    <h3
      className="auth-section-title"
      style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", Georgia, serif)' }}
    >
      {title}
    </h3>
    {children}
  </div>
);

/**
 * @public
 * @summary Crea una instancia de formularios reactivos para todos los endpoints del SDK.
 */
export const FormFactory = <const TContracts extends readonly AnyContract[]>(
  sdk: ClientApiInstance<TContracts>,
): FormFactoryInstance<TContracts> => {
  const result: Record<string, Record<string, FormInstance<AnyContract>>> = {};

  for (const moduleName of sdk.$modules) {
    result[moduleName] = {};
    const module = sdk[moduleName as SDKModules<TContracts>] as Record<string, OpaqueEndpoint>;

    for (const actionName of Object.keys(module)) {
      const endpoint = module[actionName]!;
      const store = endpoint.$form;
      const fields = Object.fromEntries(
        Object.keys(store.getState().values).map((key) => [key, createField(store, key)]),
      ) as TypedFields<AnyContract>;

      result[moduleName]![actionName] = {
        fields,
        $form: store as UseBoundStore<StoreApi<FormState<RequestShapeOf<AnyContract>>>>,
        Form: buildForm(endpoint),
        submit: (onComplete) => async (e) => {
          e.preventDefault();
          const isValid = await store.getState().validate();
          if (isValid) onComplete(store.getState().values);
        },
      };
    }
  }

  return result as FormFactoryInstance<TContracts>;
};

//#endregion
