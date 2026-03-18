import { create } from 'zustand';
import type { UseBoundStore, StoreApi } from 'zustand';
import { z } from 'zod';
//#region FORM_TYPES
/**
 * @public
 * @summary Controls when field-level validation is triggered across all fields in a form.
 * @remarks
 * - `'onChange'` — validates on every keystroke.
 * - `'onBlur'`   — validates when the field loses focus.
 * - `'onSubmit'` — validates only when {@link FormState.validate} is called explicitly.
 */
export type ValidationTrigger = 'onChange' | 'onBlur' | 'onSubmit';
/**
 * @public
 * @summary Maps each key in a Zod raw shape to its inferred output type.
 * @remarks Used as the `values` map type inside {@link FormState}.
 * @template TShape - A Zod raw shape (object schema's `.shape`).
 */
export type FormFieldValues<TShape extends z.ZodRawShape> = {
  [K in keyof TShape]: z.infer<TShape[K]>;
};
/**
 * @public
 * @summary Reactive form state generated per endpoint from its request schema.
 * @remarks
 * Exposed via `CallableEndpoint.$form` and consumed directly by `FieldFactory`.
 * Every field operation (`set`, `blur`, `validate`) updates the store atomically.
 * @template TShape - The Zod raw shape of the request schema.
 */
export type FormState<TShape extends z.ZodRawShape> = {
  /** @description Current field values, keyed by field name. */
  values: FormFieldValues<TShape>;
  /** @description Validation errors per field. `undefined` entry means the field is error-free. */
  errors: Partial<Record<keyof TShape, string[]>>;
  /** @description Tracks which fields have been blurred at least once. */
  touched: Partial<Record<keyof TShape, boolean>>;
  /** @description Tracks which fields have been changed from their initial defaults. */
  dirty: Partial<Record<keyof TShape, boolean>>;
  /** @description `true` when the entire request schema validates without errors. */
  isFormValid: boolean;
  /** @description `true` when at least one field differs from its initial default value. */
  isDirty: boolean;
  /**
   * @description Sets a field value and optionally validates it based on the active {@link ValidationTrigger}.
   * @param fieldKey - Name of the field to update.
   * @param newValue - The new value to assign (empty strings are coerced to `null` for nullable fields).
   */
  set: <K extends keyof TShape>(fieldKey: K, newValue: FormFieldValues<TShape>[K]) => Promise<void>;
  /**
   * @description Marks a field as touched and optionally validates it based on the active {@link ValidationTrigger}.
   * @param fieldKey - Name of the field that lost focus.
   */
  blur: <K extends keyof TShape>(fieldKey: K) => Promise<void>;
  /**
   * @description Validates all fields against the full request schema and updates error state.
   * @returns `true` when all fields pass validation, `false` otherwise.
   */
  validate: () => Promise<boolean>;
  /** @description Resets all fields to their initial defaults and clears errors, touched, and dirty state. */
  reset: () => void;
  /** @description Returns a point-in-time snapshot of all current field values. */
  getValues: () => FormFieldValues<TShape>;
  /**
   * @description Merges partial values into the form without triggering any validation.
   * @param partialValues - Partial map of field names to new values.
   */
  setValues: (partialValues: Partial<FormFieldValues<TShape>>) => void;
};
//#endregion
//#region FORM_HELPERS
/**
 * @internal
 * @summary Resolves a safe initial default value for a single Zod field schema.
 * @remarks
 * Respects explicit Zod `.default()` declarations first.
 * Then tries `null` before other primitives so nullable fields default to `null` rather than `''`.
 * @param fieldSchema - The Zod schema for a single form field.
 * @returns The first value accepted by `safeParse`, or `''` as a final fallback.
 */
function resolveFieldDefault(fieldSchema: z.ZodTypeAny): unknown {
  // `_def.defaultValue` is an internal Zod API — one necessary internal touch to respect .default()
  const internalDef = (fieldSchema as { _def?: { defaultValue?: () => unknown } })._def;
  if (typeof internalDef?.defaultValue === 'function') return internalDef.defaultValue();
  for (const candidate of [null, undefined, false, 0, '', [], {}]) {
    const result = fieldSchema.safeParse(candidate);
    if (result.success) return result.data;
  }
  return '';
}
/**
 * @internal
 * @summary Returns `true` when the schema accepts `null` as a valid value.
 * @param fieldSchema - The Zod schema for a single form field.
 */
function isNullableSchema(fieldSchema: z.ZodTypeAny): boolean {
  return fieldSchema.safeParse(null).success;
}
/**
 * @internal
 * @summary Coerces an empty string to `null` for nullable fields; all other values pass through unchanged.
 * @remarks Prevents empty text inputs from being stored as `''` when the schema expects `null`.
 * @param rawValue    - The raw value coming from a form input.
 * @param fieldSchema - The Zod schema for this field.
 * @returns `null` when `rawValue === ''` and the schema accepts null, otherwise the original `rawValue`.
 */
function coerceEmptyToNull(rawValue: unknown, fieldSchema: z.ZodTypeAny): unknown {
  if (rawValue !== '') return rawValue;
  return isNullableSchema(fieldSchema) ? null : rawValue;
}
//#endregion
//#region FORM_STORE_BUILDER
/**
 * @public
 * @summary Builds a reactive Zustand form store from a Zod object schema.
 * @remarks
 * Called internally by `createSDK` for every contract whose `__requestSchema` is a `ZodObject`.
 * The resulting store is exposed at `CallableEndpoint.$form` and is fully compatible with `FieldFactory`.
 * @param requestSchema - The Zod object schema that describes the form fields.
 * @param triggerMode   - When per-field validation runs (see {@link ValidationTrigger}).
 * @returns A Zustand `UseBoundStore` implementing the full {@link FormState} interface.
 */
export function createFormStore<TShape extends z.ZodRawShape>(
  requestSchema: z.ZodObject<TShape>,
  triggerMode: ValidationTrigger,
): UseBoundStore<StoreApi<FormState<TShape>>> {
  // Double cast required: Zod v4 uses `$ZodType` (dollar-prefixed) internally while the public
  // `z.ZodTypeAny` alias resolves to `ZodType`. The two are structurally incompatible for direct cast.
  const schemaByField = requestSchema.shape as unknown as Record<string, z.ZodTypeAny>;
  const fieldKeys = Object.keys(schemaByField);
  const defaultValues = Object.fromEntries(
    fieldKeys.map((key) => [key, resolveFieldDefault(schemaByField[key]!)]),
  ) as FormFieldValues<TShape>;
  function getFieldSchema(key: string): z.ZodTypeAny | undefined {
    return schemaByField[key];
  }
  async function validateField(fieldKey: string, value: unknown): Promise<string[] | undefined> {
    const schema = getFieldSchema(fieldKey);
    if (!schema) return undefined;
    const result = schema.safeParse(value);
    if (result.success) return undefined;
    const messages = result.error.issues.map((issue) => issue.message);
    return messages.length > 0 ? messages : undefined;
  }
  return create<FormState<TShape>>()((setState, getState) => {
    function recomputeValidity(): void {
      const snapshot = getState();
      setState({
        isFormValid: requestSchema.safeParse(snapshot.values).success,
        isDirty: Object.values(snapshot.dirty).some(Boolean),
      });
    }
    function applyFieldErrors(fieldKey: keyof TShape, errors: string[] | undefined): void {
      setState((prev) => ({
        errors: { ...prev.errors, [fieldKey]: errors },
      }));
    }
    const initialState: FormState<TShape> = {
      values: defaultValues,
      errors: {},
      touched: {},
      dirty: {},
      isFormValid: false,
      isDirty: false,
      set: async (fieldKey, rawValue) => {
        const schema = getFieldSchema(fieldKey as string);
        const finalValue = schema
          ? (coerceEmptyToNull(rawValue, schema) as FormFieldValues<TShape>[typeof fieldKey])
          : (rawValue as FormFieldValues<TShape>[typeof fieldKey]);
        setState((prev) => ({
          values: { ...prev.values, [fieldKey]: finalValue },
          dirty: { ...prev.dirty, [fieldKey]: true },
        }));
        if (triggerMode !== 'onChange') return;
        applyFieldErrors(fieldKey, await validateField(fieldKey as string, finalValue));
        recomputeValidity();
      },
      blur: async (fieldKey) => {
        setState((prev) => ({ touched: { ...prev.touched, [fieldKey]: true } }));
        if (triggerMode !== 'onBlur') return;
        applyFieldErrors(
          fieldKey,
          await validateField(fieldKey as string, getState().values[fieldKey]),
        );
        recomputeValidity();
      },
      validate: async () => {
        const currentValues = getState().values;
        const allErrors: Partial<Record<keyof TShape, string[]>> = {};
        for (const key of fieldKeys) {
          const errors = await validateField(key, currentValues[key as keyof TShape]);
          if (errors) allErrors[key as keyof TShape] = errors;
        }
        setState({ errors: allErrors });
        recomputeValidity();
        return getState().isFormValid;
      },
      reset: () =>
        setState({
          values: defaultValues,
          errors: {},
          touched: {},
          dirty: {},
          isDirty: false,
          isFormValid: false,
        }),
      getValues: () => getState().values,
      setValues: (partial) => setState((prev) => ({ values: { ...prev.values, ...partial } })),
    };
    return initialState;
  });
}
//#endregion
