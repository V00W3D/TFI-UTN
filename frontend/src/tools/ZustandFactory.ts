import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';

type ValidationResult = true | string[];
type ValidationMode = 'onChange' | 'onBlur' | 'onSubmit';

type FieldConfig<T = any> = {
  schema?: z.ZodTypeAny;
  validate?: (value: T, state: any) => ValidationResult;
  asyncValidate?: (value: T, state: any) => Promise<ValidationResult>;
  defaultValue?: T;
  dependsOn?: string[];
};

/* ============================================================
   CONTRACT SUPPORT
============================================================ */

type ContractLike = {
  __requestSchema: z.ZodObject<any>;
};

/* ============================================================
   TYPE EXTRACTION
============================================================ */

type ExtractShape<T> = T extends ContractLike
  ? T['__requestSchema'] extends z.ZodObject<infer Shape>
    ? Shape
    : never
  : T extends { I: infer I }
    ? I extends z.ZodReadonly<z.ZodObject<infer Shape>>
      ? Shape
      : I extends z.ZodObject<infer Shape>
        ? Shape
        : never
    : T extends z.ZodObject<infer Shape>
      ? Shape
      : T extends Record<string, FieldConfig<any>>
        ? { [K in keyof T]: T[K]['schema'] }
        : never;

type Values<T> = { [K in keyof T]: z.infer<T[K]> };

type Store<T> = {
  values: Values<T>;
  errors: Partial<Record<keyof T, string[]>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;

  isFormValid: boolean;
  isDirty: boolean;

  set: <K extends keyof T>(key: K, value: Values<T>[K]) => Promise<void>;
  blur: <K extends keyof T>(key: K) => Promise<void>;

  validate: () => Promise<boolean>;
  reset: () => void;

  getValues: () => Values<T>;
  setValues: (v: Partial<Values<T>>) => void;
};

/* ============================================================
   NORMALIZER
============================================================ */

function normalize(input: any): {
  shape: Record<string, FieldConfig>;
  schema: z.ZodObject<any> | null;
} {
  let schema: z.ZodObject<any> | null = null;

  /* contract support */

  if (input?.__requestSchema) {
    input = input.__requestSchema;
  }

  if (input?.I) {
    input = input.I;
  }

  if (input instanceof z.ZodReadonly) {
    input = input.unwrap();
  }

  if (input instanceof z.ZodObject) {
    schema = input;

    const shape: Record<string, FieldConfig> = {};

    for (const key in input.shape) {
      shape[key] = {
        schema: input.shape[key],
      };
    }

    return { shape, schema };
  }

  return { shape: input, schema };
}

/* ============================================================
   FACTORY
============================================================ */

export function ZustandFactory<
  TInput extends
    | Record<string, FieldConfig>
    | z.ZodObject<any>
    | { I: z.ZodObject<any> | z.ZodReadonly<z.ZodObject<any>> }
    | ContractLike,
>(input: TInput, opts?: { persist?: boolean; mode?: ValidationMode }) {
  type Shape = ExtractShape<TInput>;

  const { shape, schema } = normalize(input);

  const mode = opts?.mode ?? 'onChange';

  const initializer = (set: any, get: any): Store<Shape> => {
    const defaults = Object.fromEntries(
      Object.entries(shape).map(([k, cfg]) => {
        const field = cfg as FieldConfig;

        if (field.defaultValue !== undefined) return [k, field.defaultValue];

        const t = (field.schema as any)?._def?.typeName;

        if (t === 'ZodNumber') return [k, 0];
        if (t === 'ZodBoolean') return [k, false];

        return [k, ''];
      }),
    );

    const validateField = async (key: string, value: any) => {
      const cfg = shape[key] as FieldConfig;

      const errors: string[] = [];

      if (cfg.schema) {
        const r = cfg.schema.safeParse(value);

        if (!r.success) {
          errors.push(...r.error.issues.map((i) => i.message));
        }
      }

      if (cfg.validate) {
        const r = cfg.validate(value, get());

        if (r !== true) errors.push(...r);
      }

      if (cfg.asyncValidate) {
        const r = await cfg.asyncValidate(value, get());

        if (r !== true) errors.push(...r);
      }

      return errors.length ? errors : true;
    };

    const validateForm = () => {
      const s = get();

      let valid = true;

      if (schema) {
        const result = schema.safeParse(s.values);

        valid = result.success;
      } else {
        valid = Object.keys(shape).every((k) => !s.errors[k as keyof Shape]?.length);
      }

      set({
        isFormValid: valid,
        isDirty: Object.values(s.dirty).some(Boolean),
      });
    };

    return {
      values: defaults as Values<Shape>,
      errors: {},
      touched: {},
      dirty: {},

      isFormValid: false,
      isDirty: false,

      set: async (key, value) => {
        set((s: any) => ({
          values: { ...s.values, [key]: value },
          dirty: { ...s.dirty, [key]: true },
        }));

        if (mode === 'onChange') {
          const r = await validateField(key as string, value);

          set((s: any) => ({
            errors: {
              ...s.errors,
              [key]: r === true ? undefined : r,
            },
          }));

          validateForm();
        }
      },

      blur: async (key) => {
        set((s: any) => ({
          touched: { ...s.touched, [key]: true },
        }));

        if (mode === 'onBlur') {
          const v = get().values[key];

          const r = await validateField(key as string, v);

          set((s: any) => ({
            errors: {
              ...s.errors,
              [key]: r === true ? undefined : r,
            },
          }));

          validateForm();
        }
      },

      validate: async () => {
        const vals = get().values;

        const errors: Record<string, string[]> = {};

        for (const k in shape) {
          const r = await validateField(k, vals[k]);

          if (r !== true) errors[k] = r;
        }

        set({ errors });

        validateForm();

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

      setValues: (v) =>
        set((s: any) => ({
          values: { ...s.values, ...v },
        })),
    };
  };

  return opts?.persist
    ? create<Store<Shape>>()(
        persist(initializer, {
          name: 'zustand-form',
        }),
      )
    : create<Store<Shape>>()(initializer);
}
