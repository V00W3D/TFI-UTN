/**
 * @file FormStore.ts
 * @module SDK
 * @description Archivo FormStore alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: schemas, contratos, adapters y utilidades tipadas compartidas
 * outputs: infraestructura tipada reutilizable del workspace
 * rules: preservar una unica fuente de verdad y API funcional tipada
 *
 * @technical
 * dependencies: zustand, zod, FieldDef
 * flow: define artefactos compartidos del workspace; compone tipos, contratos o runtime reutilizable; exporta piezas consumidas por frontend y backend.
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: las piezas compartidas viven en packages para evitar duplicacion
 */
/**
 * @file FormStore.ts
 * @author Victor
 * @description Automatically enforced JSDoc header according to context.md guidelines.
 * @param null
 * @returns null
 * @example null
 * @remarks This file is part of the QART monorepo architecture.
 *
 * Metrics:
 * - LOC: 50
 * - Experience Level: Junior
 * - Estimated Time: 30m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */
import { create } from 'zustand';
import type { UseBoundStore, StoreApi } from 'zustand';
import * as z from 'zod';
import { resolveFieldDefault } from './FieldDef';

//#region PUBLIC_TYPES
/**
 * @public
 * @summary Controla cuándo se dispara la validación por campo.
 * - `'onChange'` — en cada keystroke.
 * - `'onBlur'`   — al perder el foco.
 * - `'onSubmit'` — solo al llamar `validate()` explícitamente.
 */
export type ValidationTrigger = 'onChange' | 'onBlur' | 'onSubmit';

/** @public Mapea cada clave del shape Zod a su tipo inferido de salida. */
export type FieldValues<TShape extends z.ZodRawShape> = {
  [K in keyof TShape]: z.infer<TShape[K]>;
};

/** @public Mapa de errores por campo — `undefined` significa campo sin errores. */
export type FieldErrors<TShape extends z.ZodRawShape> = Partial<Record<keyof TShape, string[]>>;

/** @public Mapa de flags booleanos por campo. */
export type FieldFlags<TShape extends z.ZodRawShape> = Partial<Record<keyof TShape, boolean>>;

/**
 * @public
 * @summary Estado reactivo del formulario derivado de un schema Zod.
 * @remarks
 * La capa de formulario SIEMPRE usa `''` como estado vacío.
 * `null` y `undefined` solo aparecen en el payload HTTP — nunca en el store.
 * Esto previene warnings de inputs controlados/no-controlados en React.
 *
 * **Campos opcionales:** el store convierte `''` → `undefined` antes de validar
 * con Zod, por lo que `z.string().optional()` funciona correctamente con inputs vacíos.
 */
export type FormState<TShape extends z.ZodRawShape> = {
  values: FieldValues<TShape>;
  errors: FieldErrors<TShape>;
  touched: FieldFlags<TShape>;
  dirty: FieldFlags<TShape>;
  isFormValid: boolean;
  isDirty: boolean;
  /**
   * Establece el valor de un campo y valida si `triggerMode === 'onChange'`.
   * El valor se guarda tal cual — la coerción a null ocurre en ApiClient antes del fetch.
   */
  set: <K extends keyof TShape>(key: K, value: FieldValues<TShape>[K]) => Promise<void>;
  /** Marca un campo como tocado. Valida si `triggerMode === 'onBlur'`. */
  blur: <K extends keyof TShape>(key: K) => Promise<void>;
  /** Valida todos los campos. Retorna `true` cuando el schema completo pasa. */
  validate: () => Promise<boolean>;
  /** Resetea todos los campos a sus defaults y limpia todo el estado. */
  reset: () => void;
  /** Snapshot puntual de todos los valores actuales. */
  getValues: () => FieldValues<TShape>;
  /** Fusiona valores parciales sin disparar validación. */
  setValues: (partial: Partial<FieldValues<TShape>>) => void;
};
//#endregion

//#region INTERNAL_HELPERS
/**
 * @internal
 * Castea un valor de TShape[K] al tipo público `z.ZodType`.
 * Cast inevitable — brecha interna/pública de Zod v4.
 */
const asZodType = (schema: z.ZodRawShape[string]): z.ZodType => schema as unknown as z.ZodType;

/**
 * @internal
 * Determina si un schema Zod es nullable (`z.string().nullable()`).
 * Un campo nullable acepta `null` — NO `undefined`.
 */
const isNullableSchema = (schema: z.ZodRawShape[string]): boolean =>
  asZodType(schema) instanceof z.ZodNullable;

/**
 * @internal
 * Determina si un schema Zod es optional (`z.string().optional()` o `z.ZodDefault`).
 * Un campo optional acepta `undefined` — NO `null`.
 */
const isOptionalSchema = (schema: z.ZodRawShape[string]): boolean => {
  const zodSchema = asZodType(schema);
  return zodSchema instanceof z.ZodOptional || zodSchema instanceof z.ZodDefault;
};

/**
 * @internal
 * Coerciona el valor de un campo para validación con Zod.
 *
 * El browser siempre entrega `''` para inputs vacíos — nunca `null` ni `undefined`.
 * Zod no acepta `''` como valor vacío válido, por lo que hay que convertirlo
 * al tipo que cada schema espera antes de validar:
 *
 * - `ZodNullable`  → `''` se convierte en `null`    (`z.string().nullable()`)
 * - `ZodOptional`  → `''` se convierte en `undefined` (`z.string().optional()`)
 * - `ZodDefault`   → `''` se convierte en `undefined` (Zod aplica el default internamente)
 * - Cualquier otro → el valor se pasa tal cual
 *
 * `coerceEmptyStrings` en `ApiClient` hace la misma conversión `''` → `null`
 * antes del fetch HTTP — este helper replica esa lógica en la capa de validación.
 */
const coerceForValidation = (schema: z.ZodRawShape[string], value: unknown): unknown => {
  if (value !== '') return value;
  if (isNullableSchema(schema)) return null;
  if (isOptionalSchema(schema)) return undefined;
  return value;
};

/**
 * @internal
 * Valida un único valor de campo. Retorna mensajes de error o `undefined` si es válido.
 */
const validateField = async (
  schema: z.ZodRawShape[string],
  value: unknown,
): Promise<string[] | undefined> => {
  const result = await asZodType(schema).safeParseAsync(coerceForValidation(schema, value));
  if (result.success) return undefined;
  const messages = result.error.issues.map((i) => i.message);
  return messages.length > 0 ? messages : undefined;
};

/**
 * @internal
 * Coerciona todos los valores del formulario para validación del schema completo.
 * Idéntica lógica que `coerceForValidation` pero para el objeto entero.
 */
const coerceValuesForParse = <TShape extends z.ZodRawShape>(
  shape: TShape,
  values: FieldValues<TShape>,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(shape)) {
    result[key] = coerceForValidation(shape[key]!, (values as Record<string, unknown>)[key]);
  }
  return result;
};
//#endregion

//#region FORM_STORE_BUILDER
/**
 * @public
 * @summary Construye un store Zustand reactivo de formulario a partir de un schema Zod.
 * @remarks
 * - Llamado internamente por `createClientApi` para cada contrato.
 * - Expuesto en `CallableEndpoint.$form`, consumido por `FormFactory`.
 * - Todos los valores de campo usan `''` como estado vacío — nunca `null` o `undefined`.
 * - Los campos opcionales (`z.string().optional()`) se coercionan a `undefined`
 *   antes de validar, por lo que el store funciona correctamente con inputs vacíos.
 * @param schema      - Schema Zod del objeto que describe los campos del formulario.
 * @param triggerMode - Cuándo se dispara la validación por campo.
 */
export const createFormStore = <TShape extends z.ZodRawShape>(
  schema: z.ZodObject<TShape>,
  triggerMode: ValidationTrigger,
): UseBoundStore<StoreApi<FormState<TShape>>> => {
  const shape: TShape = schema.shape;
  const keys = Object.keys(shape) as (keyof TShape & string)[];

  const defaults = Object.fromEntries(
    keys.map((key) => [key, resolveFieldDefault(asZodType(shape[key]!))]),
  ) as FieldValues<TShape>;

  return create<FormState<TShape>>()((setState, getState) => {
    const recompute = (): void => {
      const s = getState();
      setState({
        isFormValid: schema.safeParse(coerceValuesForParse(shape, s.values)).success,
        isDirty: Object.values(s.dirty).some(Boolean),
      });
    };

    const applyErrors = (key: keyof TShape, errs: string[] | undefined): void => {
      setState((prev) => ({ errors: { ...prev.errors, [key]: errs } }));
    };

    return {
      values: defaults,
      errors: {},
      touched: {},
      dirty: {},
      isFormValid: schema.safeParse(coerceValuesForParse(shape, defaults)).success,
      isDirty: false,

      set: async (key, value) => {
        setState((prev) => ({
          values: { ...prev.values, [key]: value },
          dirty: { ...prev.dirty, [key]: true },
        }));
        if (triggerMode === 'onChange') {
          applyErrors(key, await validateField(shape[key as string]!, value));
          recompute();
        }
      },

      blur: async (key) => {
        setState((prev) => ({ touched: { ...prev.touched, [key]: true } }));
        if (triggerMode === 'onBlur') {
          applyErrors(key, await validateField(shape[key as string]!, getState().values[key]));
          recompute();
        }
      },

      validate: async () => {
        const current = getState().values;
        const allErrors: FieldErrors<TShape> = {};
        for (const key of keys) {
          const errs = await validateField(shape[key]!, current[key]);
          if (errs) allErrors[key] = errs;
        }
        setState({ errors: allErrors });
        recompute();
        return getState().isFormValid;
      },

      reset: () =>
        setState({
          values: defaults,
          errors: {},
          touched: {},
          dirty: {},
          isDirty: false,
          isFormValid: schema.safeParse(coerceValuesForParse(shape, defaults)).success,
        }),

      getValues: () => getState().values,

      setValues: (partial) => setState((prev) => ({ values: { ...prev.values, ...partial } })),
    };
  });
};
//#endregion
