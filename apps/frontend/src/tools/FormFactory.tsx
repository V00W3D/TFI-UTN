/**
 * @file FormFactory.tsx
 * @description Fábrica de formularios reactivos tipados sobre el SDK de contratos.
 * Deriva automáticamente campos, validación y envío desde contratos Zod — sin configuración manual.
 * @module FormFactory
 */

import { useId, useState, useCallback, memo } from 'react';
import { useStore } from 'zustand';
import type { UseBoundStore, StoreApi } from 'zustand';
import type { ChangeEvent, FocusEvent, ReactNode, FormEvent } from 'react';
import PhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import 'react-phone-number-input/style.css';
import './FormFactory.css';
import type { ClientApiInstance } from '@app/sdk/ApiClient';
import type { FormState } from '@app/sdk';
import type { AnyContract, RequestShapeOf } from '@app/sdk';

//#region TIPOS_PRIMITIVOS
/**
 * @summary Tipos de control de entrada disponibles para un campo.
 * @remarks Controles primitivos como string; select y radio requieren opciones.
 */
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'phone'
  | 'select'
  | 'textarea'
  | 'radio'
  | 'checkbox';

/**
 * @summary Opción individual para controles `select` o `radio`.
 * @property value - Valor enviado al store.
 * @property label - Texto visible al usuario.
 * @property icon  - Ruta opcional a ícono decorativo.
 */
export interface FieldOption {
  value: string;
  label: string;
  icon?: string;
}

/**
 * @summary Complementos opcionales que extienden el comportamiento de un campo.
 * @remarks Cada addon es un discriminated union con `type` como discriminante.
 */
export type FieldAddon =
  | { type: 'icon'; src: string }
  | { type: 'passwordToggle' }
  | { type: 'hint'; text: string }
  | { type: 'rules'; rules: readonly string[] }
  | { type: 'rubber' }
  | { type: 'strength' };

/** @summary Control de un campo — primitivo o tuple `[tipo, opciones]`. */
export type FieldControl =
  | 'text'
  | 'email'
  | 'password'
  | 'phone'
  | ['select', FieldOption[]]
  | ['radio', FieldOption[]];

/** @summary Modo de operación del campo — afecta visibilidad de hints y reglas. */
export type FieldMode = 'login' | 'register';

/**
 * @summary Props públicas de un campo generado por `FormFactory`.
 * @remarks Pasadas al componente `Field` producido por `buildField`.
 */
export interface FieldProps {
  /** Texto del label visible. */
  label: string;
  /** Control de entrada. Por defecto: `'text'`. */
  control?: FieldControl;
  /** Placeholder del input. */
  placeholder?: string;
  /** Marca el campo como obligatorio con indicador visual. */
  required?: boolean;
  /** Modo del formulario — controla hints y reglas. Por defecto: `'register'`. */
  fieldMode?: FieldMode;
  /** Lista de addons a aplicar. */
  addons?: FieldAddon[];
}
//#endregion

//#region TIPOS_INTERNOS
/** @internal Evento sintético para controles no-nativos (phone, checkbox). */
type SyntheticEvent<V> = { target: { value: V } };

/** @internal Handler unificado de onChange para todos los tipos de control. */
type ChangeHandler = (
  e:
    | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    | SyntheticEvent<string>
    | SyntheticEvent<boolean>,
) => void;

/** @internal Props mínimas que recibe `FieldControl`. */
interface InputProps {
  value: string | boolean;
  onChange: ChangeHandler;
  onBlur: (e: FocusEvent<HTMLElement>) => void;
}

/** @internal Props de `BoundField` — extiende las props públicas con binding al store. */
interface BoundFieldProps extends FieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: StoreApi<FormState<any>>;
  name: string;
}

/** @internal Store opaco — evita la constraint `ZodRawShape` en el loop de construcción. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFormStore = UseBoundStore<StoreApi<FormState<any>>>;
//#endregion

//#region CONSTANTES_Y_UTILIDADES
/** @internal Etiquetas legibles por nivel de fortaleza (índice = score 0–5). */
const STRENGTH_LABELS = ['', 'muy débil', 'débil', 'decente', 'segura', 'muy segura'] as const;

/** @internal Clases Tailwind por nivel de fortaleza (índice = score 0–5). */
const STRENGTH_COLORS = [
  '',
  'bg-red-500',
  'bg-orange-400',
  'bg-yellow-400',
  'bg-blue-400',
  'bg-[hsl(220_90%_56%)]',
] as const;

/** @internal Calcula el score de fortaleza de una contraseña (0–5). */
const calcStrength = (val: string): number =>
  (val.length >= 8 ? 1 : 0) +
  (/[A-Z]/.test(val) ? 1 : 0) +
  (/[a-z]/.test(val) ? 1 : 0) +
  (/[0-9]/.test(val) ? 1 : 0) +
  (/[^A-Za-z0-9]/.test(val) ? 1 : 0);

/**
 * @internal Parsea los addons a flags y referencias tipadas.
 * Función pura sin hooks — segura para llamar dentro del render sin restricciones.
 */
const parseAddons = (addons: FieldAddon[]) => ({
  iconAddon: addons.find((a): a is Extract<FieldAddon, { type: 'icon' }> => a.type === 'icon'),
  hintAddon: addons.find((a): a is Extract<FieldAddon, { type: 'hint' }> => a.type === 'hint'),
  rulesAddon: addons.find((a): a is Extract<FieldAddon, { type: 'rules' }> => a.type === 'rules'),
  hasPasswordToggle: addons.some((a) => a.type === 'passwordToggle'),
  hasRubber: addons.some((a) => a.type === 'rubber'),
  hasStrength: addons.some((a) => a.type === 'strength'),
});
//#endregion

//#region SUBCOMPONENTES_INTERNOS
/**
 * @internal Botón de slot (toggle de contraseña, borrador).
 * `memo` garantiza que no re-renderiza cuando el valor del campo cambia.
 */
const SlotButton = memo(
  ({ onClick, src, alt }: { onClick: () => void; src: string; alt: string }) => (
    <button type="button" onClick={onClick} className="ff-slot-btn">
      <img src={src} alt={alt} className="size-6 object-contain pointer-events-none" />
    </button>
  ),
);

/** @internal Indicador de fortaleza de contraseña. Memoizado por valor. */
const FieldStrength = memo(({ value }: { value: string }) => {
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
        {'Fuerza: '}
        <span className="font-semibold">{STRENGTH_LABELS[score]}</span>
      </span>
    </div>
  );
});

/** @internal Lista de reglas de validación. Memoizada — las reglas son estáticas. */
const FieldRules = memo(({ rules }: { rules: readonly string[] }) => (
  <div className="ff-rules-container">
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

/** @internal Mensajes de error. Memoizado por referencia del array. */
const FieldErrors = memo(({ errors }: { errors: string[] }) => (
  <div className="flex flex-col gap-1 text-xs animate-[fadeIn_.15s_ease]">
    {errors.map((msg, i) => (
      <span key={i} className="text-(--color-error)">
        {msg}
      </span>
    ))}
  </div>
));

/**
 * @internal Renderer del control de entrada según `FieldType`.
 * Memoizado — re-renderiza solo cuando cambian value, type o los handlers.
 * Normaliza eventos no-nativos (phone, checkbox) a `SyntheticEvent`.
 */
const FieldControl = memo(
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
    type: FieldType;
    resolvedType: string;
    inputId: string;
    name: string;
    required?: boolean;
    placeholder?: string;
    options: FieldOption[];
    inputProps: InputProps;
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
              const checked = inputProps.value === opt.value;
              return (
                <label key={opt.value} className="ff-radio-option" data-value={opt.value}>
                  <input
                    type="radio"
                    name={name}
                    value={opt.value}
                    checked={checked}
                    className="hidden"
                    onChange={inputProps.onChange as (e: ChangeEvent<HTMLInputElement>) => void}
                    onBlur={inputProps.onBlur}
                  />
                  <div
                    className={`ff-radio-card${checked ? ' ff-radio-card--checked' : ''} ff-radio-card--${opt.value}`}
                  >
                    <div className="ff-radio-circle">
                      {checked && <div className="ff-radio-dot" />}
                    </div>
                    {opt.icon && (
                      <img
                        src={opt.icon}
                        alt={opt.label}
                        className="size-6 object-contain transition-all duration-300"
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

//#region BOUND_FIELD
/**
 * @internal Componente de campo estable y memoizado.
 * @remarks
 * **Garantías de hooks y re-renders:**
 *
 * - Orden fijo e incondicional: `useId` × 1, `useState` × 3, `useStore` × 6, `useCallback` × 4.
 * - Cada `useStore(store, selector)` suscribe a **un único valor primitivo**.
 *   `useStore` compara con `Object.is` — valores primitivos iguales nunca disparan re-renders.
 *   Este es el patrón correcto de Zustand para evitar el error "getSnapshot should be cached":
 *   el selector devuelve un primitivo estable, no un objeto nuevo en cada llamada.
 * - `useShallow` fue descartado porque su uso como argumento de `$form()` viola las reglas
 *   de hooks al llamar un hook dentro de otra función.
 * - `memo` en `BoundField` evita re-renders cuando el padre re-renderiza sin cambiar las props.
 * - `useCallback` estabiliza handlers — `FieldControl` y `SlotButton` (memoizados)
 *   no re-renderizan por cambios de estado local (`isVisible`, `isHelpVisible`, `hasInteracted`).
 */
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
    const [isVisible, setIsVisible] = useState(false);
    const [isHelpVisible, setIsHelpVisible] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Selectores atómicos — cada uno devuelve un primitivo, Object.is nunca falla.
    const value = useStore(store, (s) => s.values[name]);
    const rawErrors = useStore(store, (s) => s.errors[name]);
    const isFormValid = useStore(store, (s) => s.isFormValid);
    const storeSet = useStore(store, (s) => s.set);
    const storeBlur = useStore(store, (s) => s.blur);
    const storeReset = useStore(store, (s) => s.reset);

    const errors = (rawErrors ?? []) as string[];

    const type: FieldType = Array.isArray(control) ? (control[0] as FieldType) : control;
    const options: FieldOption[] = Array.isArray(control) ? control[1] : [];
    const { iconAddon, hintAddon, rulesAddon, hasPasswordToggle, hasRubber, hasStrength } =
      parseAddons(addons);

    const isRegister = fieldMode === 'register';
    const hasValue = typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
    const isValid = !errors.length && isFormValid;
    const showError = hasInteracted && errors.length > 0;
    const showSuccess = hasInteracted && hasValue && isValid && !showError;
    const stateClass = showError ? 'ff-field--error' : showSuccess ? 'ff-field--success' : '';
    const resolvedType =
      hasPasswordToggle && type === 'password' ? (isVisible ? 'text' : 'password') : type;

    const onChange = useCallback(
      (
        e:
          | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
          | SyntheticEvent<string | boolean>,
      ) => {
        setHasInteracted(true);
        storeSet(name, e.target.value as never);
      },
      [storeSet, name],
    );

    const onBlur = useCallback((_e: FocusEvent<HTMLElement>) => storeBlur(name), [storeBlur, name]);
    const toggleVisible = useCallback(() => setIsVisible((p) => !p), []);
    const toggleHelp = useCallback(() => setIsHelpVisible((p) => !p), []);
    const handleReset = useCallback(() => storeReset(), [storeReset]);

    return (
      <div className={`ff-field ${stateClass}`}>
        <div className="ff-label-row">
          <label htmlFor={inputId} className="ff-label">
            {label}
            {required && <span className="ff-required">{'*'}</span>}
          </label>
          {isRegister && rulesAddon && (
            <button type="button" onClick={toggleHelp} className="ff-help-btn">
              {isHelpVisible ? 'cerrar' : '(?)'}
            </button>
          )}
        </div>
        <div className="ff-input-wrapper">
          {iconAddon && (
            <div className="ff-slot-left">
              <div className="ff-slot-icon">
                <img src={iconAddon.src} alt="icon" className="size-5 object-contain" />
              </div>
            </div>
          )}
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
          {((hasPasswordToggle && type === 'password') || hasRubber) && (
            <div className="ff-slot-right">
              {hasRubber && (
                <SlotButton onClick={handleReset} src="/rubber-icon.png" alt="Limpiar campo" />
              )}
              {hasPasswordToggle && type === 'password' && (
                <SlotButton
                  onClick={toggleVisible}
                  src={isVisible ? '/open-eye.png' : '/closed-eye.png'}
                  alt={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                />
              )}
            </div>
          )}
        </div>
        {showError && <FieldErrors errors={errors} />}
        {hasStrength && isRegister && type === 'password' && value && (
          <FieldStrength value={String(value)} />
        )}
        {isRegister && hintAddon && !showError && !isHelpVisible && (
          <span className="text-xs text-(--text-muted)">{hintAddon.text}</span>
        )}
        {isRegister && rulesAddon && isHelpVisible && <FieldRules rules={rulesAddon.rules} />}
      </div>
    );
  },
);

/**
 * @internal
 * Produce un componente `Field` con `store` y `name` previnculados como props.
 * El tipo renderizado es siempre `BoundField` (memoizado) — React mantiene el mismo
 * nodo en el árbol y reutiliza estado entre renders del padre.
 */
const buildField = (store: AnyFormStore, name: string) => (props: FieldProps) => (
  <BoundField {...props} store={store} name={name} />
);
//#endregion

//#region TIPOS_FORM_FACTORY
/**
 * @internal Extrae los nombres de módulo del SDK como union de strings literales.
 * @example `'iam' | 'menu' | 'orders'`
 */
type ModulesOf<TContracts extends readonly AnyContract[]> =
  TContracts[number]['__path'] extends `/${infer M}/${string}` ? M : never;

/**
 * @internal Extrae los nombres de acción para un módulo específico del SDK.
 * @example Para `'iam'`: `'login' | 'register'`
 */
type ActionsOf<
  TContracts extends readonly AnyContract[],
  TModule extends string,
> = TContracts[number] extends infer C
  ? C extends AnyContract
    ? C['__path'] extends `/${TModule}/${infer A}`
      ? A
      : never
    : never
  : never;

/** @internal Extrae el contrato exacto para un par módulo+acción. */
type ContractAt<
  TContracts extends readonly AnyContract[],
  TModule extends string,
  TAction extends string,
> = Extract<TContracts[number], { __path: `/${TModule}/${TAction}` }>;

/**
 * @summary Map de campos tipados para un contrato específico.
 * @remarks Cada clave corresponde a un campo del schema de request.
 */
export type FormFields<C extends AnyContract> = {
  readonly [K in keyof RequestShapeOf<C> & string]: (props: FieldProps) => ReactNode;
};

/**
 * @summary Instancia de formulario para un endpoint específico del SDK.
 * @remarks
 * - `fields` — map de componentes `Field` listos para renderizar.
 * - `$form`  — store Zustand (`validate`, `getValues`, `reset`, etc.).
 * - `submit` — handler `onSubmit` que valida antes de ejecutar el callback.
 */
export interface FormInstance<C extends AnyContract> {
  /** Componentes de campo tipados, uno por clave del schema de request. */
  readonly fields: FormFields<C>;
  /** Store Zustand del formulario. */
  readonly $form: UseBoundStore<StoreApi<FormState<RequestShapeOf<C>>>>;
  /**
   * Handler para `onSubmit` del `<form>`.
   * Previene el comportamiento por defecto, valida todos los campos
   * y ejecuta `onSuccess` solo si la validación pasa.
   * @param onSuccess - Callback con los valores validados.
   */
  submit: (
    onSuccess: (values: FormState<RequestShapeOf<C>>['values']) => void,
  ) => (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * @summary API de formularios generada por `FormFactory` para el SDK completo.
 * @remarks Organizada como `form[módulo][acción]` — espeja `sdk[módulo][acción]`.
 */
export type FormFactoryInstance<TContracts extends readonly AnyContract[]> = {
  readonly [TModule in ModulesOf<TContracts>]: {
    readonly [TAction in ActionsOf<TContracts, TModule>]: FormInstance<
      ContractAt<TContracts, TModule, TAction>
    >;
  };
};
//#endregion

//#region FORM_FACTORY
/**
 * @public
 * @summary Crea una instancia de formularios reactivos para todos los endpoints del SDK.
 * @remarks
 * Recorre los contratos del SDK e instancia un `FormInstance` por cada endpoint.
 * La estructura resultante espeja `sdk[módulo][acción]` para máxima coherencia.
 *
 * @param sdk - Instancia del SDK creada con `createClientApi`.
 * @returns `FormFactoryInstance` — mapa tipado de formularios listos para usar.
 *
 * @example
 * ```tsx
 * export const sdk  = createClientApi(contracts, { baseURL: BACKEND_URL });
 * export const form = FormFactory(sdk);
 *
 * const { fields, submit } = form.iam.register;
 * <form onSubmit={submit(async (values) => { await sdk.iam.register(values); })}>
 *   <fields.name     label="Nombre"     required />
 *   <fields.email    label="Email"      control="email"    required />
 *   <fields.password label="Contraseña" control="password" required
 *     addons={[{ type: 'passwordToggle' }, { type: 'strength' }]} />
 *   <button type="submit">Registrarse</button>
 * </form>
 * ```
 */
export const FormFactory = <const TContracts extends readonly AnyContract[]>(
  sdk: ClientApiInstance<TContracts>,
): FormFactoryInstance<TContracts> => {
  const result: Record<string, Record<string, FormInstance<AnyContract>>> = {};
  for (const moduleName of sdk.$modules) {
    result[moduleName] = {};
    const mod = sdk[moduleName as ModulesOf<TContracts>] as Record<string, { $form: AnyFormStore }>;
    for (const actionName of Object.keys(mod)) {
      const $form = mod[actionName]!.$form;
      const fields = Object.fromEntries(
        Object.keys($form.getState().values).map((key) => [key, buildField($form, key)]),
      ) as FormFields<AnyContract>;
      result[moduleName]![actionName] = {
        fields,
        $form: $form as UseBoundStore<StoreApi<FormState<RequestShapeOf<AnyContract>>>>,
        submit: (onSuccess) => async (e) => {
          e.preventDefault();
          const valid = await $form.getState().validate();
          if (valid) onSuccess($form.getState().values);
        },
      };
    }
  }
  return result as FormFactoryInstance<TContracts>;
};
//#endregion
