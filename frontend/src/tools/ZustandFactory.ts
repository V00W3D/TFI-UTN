import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StateCreator } from 'zustand';
import { z } from 'zod';

type ValidationResult = true | string[];
type ValidationMode = 'onChange' | 'onBlur' | 'onSubmit';

type AnySchema = {
  safeParse(data: unknown): {
    success: boolean;
    data?: unknown;
    error?: { issues: { message: string; path: (string | number)[] }[] };
  };
};

type FieldConfig<T = unknown> = {
  schema?: AnySchema;
  validate?: (value: T, state: unknown) => ValidationResult;
  asyncValidate?: (value: T, state: unknown) => Promise<ValidationResult>;
  defaultValue?: T;
};

type ContractLike = {
  __requestSchema: z.ZodObject<z.ZodRawShape>;
};

type ExtractShape<T> = T extends ContractLike
  ? T['__requestSchema'] extends z.ZodObject<infer S>
    ? S
    : never
  : T extends z.ZodReadonly<z.ZodObject<infer S>>
    ? S
    : T extends z.ZodObject<infer S>
      ? S
      : T extends Record<string, FieldConfig>
        ? {
            [K in keyof T]: NonNullable<T[K]['schema']> extends z.ZodTypeAny
              ? NonNullable<T[K]['schema']>
              : z.ZodString;
          }
        : never;

type Values<S extends z.ZodRawShape> = { [K in keyof S]: z.infer<S[K]> };

type Store<S extends z.ZodRawShape> = {
  values: Values<S>;
  errors: Partial<Record<keyof S, string[]>>;
  touched: Partial<Record<keyof S, boolean>>;
  dirty: Partial<Record<keyof S, boolean>>;
  isFormValid: boolean;
  isDirty: boolean;
  set: <K extends keyof S>(key: K, value: Values<S>[K]) => Promise<void>;
  blur: <K extends keyof S>(key: K) => Promise<void>;
  validate: () => Promise<boolean>;
  reset: () => void;
  getValues: () => Values<S>;
  setValues: (v: Partial<Values<S>>) => void;
};

function fieldDefault(schema: AnySchema): unknown {
  const raw = schema as Record<string, unknown>;
  const def = raw['_def'];
  if (def !== null && typeof def === 'object') {
    const fn = (def as Record<string, unknown>)['defaultValue'];
    if (typeof fn === 'function') return (fn as () => unknown)();
  }
  for (const candidate of [undefined, false, 0, '', [], {}]) {
    const r = schema.safeParse(candidate);
    if (r.success) return r.data !== undefined ? r.data : candidate;
  }
  return '';
}

function isZodObjectLike(
  v: unknown,
): v is { shape: Record<string, AnySchema>; safeParse: AnySchema['safeParse'] } {
  return (
    typeof v === 'object' &&
    v !== null &&
    'shape' in v &&
    typeof (v as Record<string, unknown>)['shape'] === 'object' &&
    (v as Record<string, unknown>)['shape'] !== null
  );
}

function isZodReadonlyLike(v: unknown): v is { unwrap(): unknown } {
  return (
    typeof v === 'object' &&
    v !== null &&
    'unwrap' in v &&
    typeof (v as Record<string, unknown>)['unwrap'] === 'function'
  );
}

function normalize(input: unknown): {
  shape: Record<string, FieldConfig>;
  schema: z.ZodObject<z.ZodRawShape> | null;
} {
  let v = input;

  if (v !== null && typeof v === 'object' && '__requestSchema' in v)
    v = (v as ContractLike).__requestSchema;

  if (v !== null && typeof v === 'object' && 'I' in v) v = (v as { I: unknown }).I;

  if (isZodReadonlyLike(v)) v = v.unwrap();

  if (isZodObjectLike(v)) {
    const shape: Record<string, FieldConfig> = {};
    for (const key in v.shape) shape[key] = { schema: v.shape[key] };
    return { shape, schema: v as unknown as z.ZodObject<z.ZodRawShape> };
  }

  return { shape: v as Record<string, FieldConfig>, schema: null };
}

export function ZustandFactory<
  TInput extends
    | Record<string, FieldConfig>
    | z.ZodObject<z.ZodRawShape>
    | z.ZodReadonly<z.ZodObject<z.ZodRawShape>>
    | ContractLike,
>(input: TInput, opts?: { persist?: boolean; persistKey?: string; mode?: ValidationMode }) {
  type Shape = ExtractShape<TInput>;

  const { shape, schema } = normalize(input);
  const mode = opts?.mode ?? 'onChange';

  const defaults = Object.fromEntries(
    Object.entries(shape).map(([k, cfg]) => {
      const field = cfg as FieldConfig;
      if (field.defaultValue !== undefined) return [k, field.defaultValue];
      if (field.schema) return [k, fieldDefault(field.schema)];
      return [k, ''];
    }),
  ) as Values<Shape>;

  const validateField = async (
    key: string,
    value: unknown,
    getState: () => Store<Shape>,
  ): Promise<string[] | true> => {
    const cfg = shape[key] as FieldConfig;
    const errors: string[] = [];

    if (cfg.schema) {
      const r = cfg.schema.safeParse(value);
      if (!r.success) errors.push(...(r.error?.issues.map((i) => i.message) ?? []));
    }

    if (cfg.validate) {
      const r = cfg.validate(value, getState());
      if (r !== true) errors.push(...r);
    }

    if (cfg.asyncValidate) {
      const r = await cfg.asyncValidate(value, getState());
      if (r !== true) errors.push(...r);
    }

    return errors.length ? errors : true;
  };

  const initializer: StateCreator<Store<Shape>> = (set, get) => {
    const checkForm = () => {
      const s = get();
      const valid = schema
        ? schema.safeParse(s.values).success
        : Object.keys(shape).every((k) => !s.errors[k as keyof Shape]?.length);
      set({ isFormValid: valid, isDirty: Object.values(s.dirty).some(Boolean) });
    };

    return {
      values: defaults,
      errors: {},
      touched: {},
      dirty: {},
      isFormValid: false,
      isDirty: false,

      set: async (key, value) => {
        set((s) => ({
          values: { ...s.values, [key]: value },
          dirty: { ...s.dirty, [key]: true },
        }));
        if (mode === 'onChange') {
          const r = await validateField(key as string, value, get);
          set((s) => ({ errors: { ...s.errors, [key]: r === true ? undefined : r } }));
          checkForm();
        }
      },

      blur: async (key) => {
        set((s) => ({ touched: { ...s.touched, [key]: true } }));
        if (mode === 'onBlur') {
          const r = await validateField(key as string, get().values[key], get);
          set((s) => ({ errors: { ...s.errors, [key]: r === true ? undefined : r } }));
          checkForm();
        }
      },

      validate: async () => {
        const vals = get().values;
        const errors: Partial<Record<keyof Shape, string[]>> = {};
        for (const k in shape) {
          const r = await validateField(k, vals[k as keyof Shape], get);
          if (r !== true) errors[k as keyof Shape] = r;
        }
        set({ errors });
        checkForm();
        return get().isFormValid;
      },

      reset: () =>
        set({
          values: defaults,
          errors: {},
          touched: {},
          dirty: {},
          isDirty: false,
          isFormValid: false,
        }),

      getValues: () => get().values,

      setValues: (v) => set((s) => ({ values: { ...s.values, ...v } })),
    };
  };

  return opts?.persist
    ? create<Store<Shape>>()(persist(initializer, { name: opts.persistKey ?? 'zustand-form' }))
    : create<Store<Shape>>()(initializer);
}
