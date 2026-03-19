import { create } from 'zustand';
import type { UseBoundStore, StoreApi } from 'zustand';
import { z } from 'zod';
import { resolveFieldDefault } from './FieldDef';

//#region PUBLIC_TYPES
// ─────────────────────────────────────────────────────────────
//  All types declared up-front.
// ─────────────────────────────────────────────────────────────

/**
 * @public
 * @summary Controls when per-field validation is triggered.
 * - `'onChange'` — every keystroke.
 * - `'onBlur'`   — when the field loses focus.
 * - `'onSubmit'` — only when `validate()` is called explicitly.
 */
export type ValidationTrigger = 'onChange' | 'onBlur' | 'onSubmit';

/** @public Maps each key of a Zod raw shape to its inferred output type. */
export type FieldValues<TShape extends z.ZodRawShape> = {
  [K in keyof TShape]: z.infer<TShape[K]>;
};

/** @public Per-field error map — `undefined` means the field is error-free. */
export type FieldErrors<TShape extends z.ZodRawShape> = Partial<Record<keyof TShape, string[]>>;

/** @public Per-field boolean flag map. */
export type FieldFlags<TShape extends z.ZodRawShape> = Partial<Record<keyof TShape, boolean>>;

/**
 * @public
 * @summary Reactive form state derived from a Zod object schema.
 * @remarks
 * The form layer ALWAYS uses `''` (empty string) as the "empty" state.
 * `null` and `undefined` never appear in form state — they are produced
 * by ApiClient only when converting `''` before a fetch request.
 * This prevents browser warnings about controlled/uncontrolled inputs.
 */
export type FormState<TShape extends z.ZodRawShape> = {
  values: FieldValues<TShape>;
  errors: FieldErrors<TShape>;
  touched: FieldFlags<TShape>;
  dirty: FieldFlags<TShape>;
  isFormValid: boolean;
  isDirty: boolean;
  /**
   * Sets a field value and validates if `triggerMode === 'onChange'`.
   * The value is stored as-is — no coercion to null happens here.
   */
  set: <K extends keyof TShape>(key: K, value: FieldValues<TShape>[K]) => Promise<void>;
  /** Marks a field as touched. Validates if `triggerMode === 'onBlur'`. */
  blur: <K extends keyof TShape>(key: K) => Promise<void>;
  /** Validates all fields. Returns `true` when the full schema passes. */
  validate: () => Promise<boolean>;
  /** Resets all fields to initial defaults and clears all state. */
  reset: () => void;
  /** Point-in-time snapshot of all current field values. */
  getValues: () => FieldValues<TShape>;
  /** Merges partial values without triggering validation. */
  setValues: (partial: Partial<FieldValues<TShape>>) => void;
};
//#endregion

//#region INTERNAL_HELPERS
// ─────────────────────────────────────────────────────────────
//  Zod v4 uses $ZodType internally, which does not extend the
//  public ZodType. The only way to call .safeParseAsync() on a
//  value from TShape[K] is to cast via unknown — this is an
//  inescapable Zod v4 internal/public type gap, not a design choice.
// ─────────────────────────────────────────────────────────────

/**
 * @internal
 * Casts a value from TShape[K] to the public `z.ZodType`.
 * This is the single unavoidable cast in the entire file — Zod v4 internal/public gap.
 */
function asZodType(schema: z.ZodRawShape[string]): z.ZodType {
  return schema as unknown as z.ZodType;
}

/**
 * @internal
 * Validates a single field value. Returns error messages or `undefined` when valid.
 */
async function validateField(
  schema: z.ZodRawShape[string],
  value: unknown,
): Promise<string[] | undefined> {
  const result = await asZodType(schema).safeParseAsync(value);
  if (result.success) return undefined;
  const messages = result.error.issues.map((i) => i.message);
  return messages.length > 0 ? messages : undefined;
}
//#endregion

//#region FORM_STORE_BUILDER
/**
 * @public
 * @summary Builds a reactive Zustand form store from a Zod object schema.
 * @remarks
 * - Called internally by `createClientApi` for every contract.
 * - Exposed at `CallableEndpoint.$form`, consumed by `FieldFactory`.
 * - All field values use `''` as the empty state — never `null` or `undefined`.
 * @param schema      - Zod object schema describing the form fields.
 * @param triggerMode - When per-field validation is triggered.
 */
export function createFormStore<TShape extends z.ZodRawShape>(
  schema: z.ZodObject<TShape>,
  triggerMode: ValidationTrigger,
): UseBoundStore<StoreApi<FormState<TShape>>> {
  const shape: TShape = schema.shape;
  const keys = Object.keys(shape) as (keyof TShape & string)[];

  // ── Non-null assertions on shape[key] are safe here ───────────
  // Object.keys(shape) returns exactly the keys that exist in shape.
  // noUncheckedIndexedAccess widens shape[key] to T | undefined, but
  // we know statically it is always T — the ! asserts that invariant.

  const defaults = Object.fromEntries(
    keys.map((key) => [key, resolveFieldDefault(asZodType(shape[key]!))]),
  ) as FieldValues<TShape>;

  return create<FormState<TShape>>()((setState, getState) => {
    function recompute(): void {
      const s = getState();
      setState({
        isFormValid: schema.safeParse(s.values).success,
        isDirty: Object.values(s.dirty).some(Boolean),
      });
    }

    function applyErrors(key: keyof TShape, errs: string[] | undefined): void {
      setState((prev) => ({ errors: { ...prev.errors, [key]: errs } }));
    }

    const initial: FormState<TShape> = {
      values: defaults,
      errors: {},
      touched: {},
      dirty: {},
      isFormValid: false,
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
          isFormValid: false,
        }),

      getValues: () => getState().values,

      setValues: (partial) => setState((prev) => ({ values: { ...prev.values, ...partial } })),
    };

    return initial;
  });
}
//#endregion
