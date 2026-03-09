import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ZodType, ZodObject } from 'zod';
import { z } from 'zod';

/* ============================================================
   CORE TYPES
============================================================ */
type ExtractShape<T> =
  // Caso contrato completo
  T extends { I: infer I }
    ? I extends ZodObject<infer Shape>
      ? {
          [K in keyof Shape]: {
            schema: Shape[K];
          };
        }
      : never
    : // Caso z.object directo
      T extends ZodObject<infer Shape>
      ? {
          [K in keyof Shape]: {
            schema: Shape[K];
          };
        }
      : // Caso manual
        T extends Record<string, FieldConfig<any>>
        ? T
        : never;

export type ValidationResult = true | string[];

export type ValidationMode = 'onChange' | 'onBlur' | 'onSubmit';

export type FieldConfig<T = any> = {
  schema?: ZodType;
  validate?: (value: T, state: any) => ValidationResult;
  asyncValidate?: (value: T, state: any) => Promise<ValidationResult>;
  defaultValue?: T;
  dependsOn?: string[];
};

/* ============================================================
   TYPE INFERENCE
============================================================ */

type InferFieldValue<F> = F extends { schema: infer S }
  ? S extends ZodType
    ? z.infer<S>
    : F extends FieldConfig<infer U>
      ? U
      : never
  : F extends FieldConfig<infer U>
    ? U
    : never;

type InferValues<T> = {
  [K in keyof T]: InferFieldValue<T[K]>;
};

type InferValidations<T> = {
  [K in keyof T as `v${Capitalize<string & K>}`]: ValidationResult;
};

type InferTouched<T> = {
  [K in keyof T as `t${Capitalize<string & K>}`]: boolean;
};

type InferSetters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: InferFieldValue<T[K]>) => void;
} & {
  [K in keyof T as `blur${Capitalize<string & K>}`]: () => void;
} & {
  [K in keyof T as `reset${Capitalize<string & K>}`]: () => void;
};

type InternalStore<T> = {
  isFormValid: boolean;
  isDirty: boolean;
  dirtyFields: Record<string, boolean>;

  validateForm: () => void;
  validateAllFields: () => Promise<boolean>;
  reset: () => void;
  clearErrors: () => void;

  getValues: () => InferValues<T>;
  setValues: (values: Partial<InferValues<T>>) => void;
};

export type ZustandFactoryReturn<T> = InferValues<T> &
  InferValidations<T> &
  InferTouched<T> &
  InferSetters<T> &
  InternalStore<T>;

/* ============================================================
   SHAPE NORMALIZER
============================================================ */

function normalizeShape(input: any): Record<string, FieldConfig> {
  // Caso 1: contrato completo (LoginSchema)
  if (input?.I instanceof z.ZodObject) {
    input = input.I;
  }

  // Caso 2: z.object() directo
  if (input instanceof z.ZodObject) {
    const shape = input.shape;

    return Object.fromEntries(Object.entries(shape).map(([key, schema]) => [key, { schema }]));
  }

  // Caso 3: ya es shape manual
  return input;
}

/* ============================================================
   FACTORY
============================================================ */

export function ZustandFactory<
  TInput extends Record<string, FieldConfig<any>> | ZodObject<any> | { I: ZodObject<any> },
>(input: TInput, persistEnabled: boolean = false, options?: { mode?: ValidationMode }) {
  type T = ExtractShape<TInput>;
  const normalizedShape = normalizeShape(input);

  const mode = options?.mode ?? 'onChange';

  const initializer = (set: any, get: any): ZustandFactoryReturn<T> => {
    const getDefaultValue = (config: FieldConfig) => {
      if (config.defaultValue !== undefined) return config.defaultValue;

      if (config.schema) {
        const typeName = (config.schema as any)._def?.typeName;

        switch (typeName) {
          case 'ZodString':
            return '';
          case 'ZodNumber':
            return 0;
          case 'ZodBoolean':
            return false;
          case 'ZodEnum':
            return (config.schema as any)._def.values?.[0];
          default:
            return '';
        }
      }

      return '';
    };

    const baseState: any = {};

    /* ================= INITIALIZATION ================= */

    for (const fieldName in normalizedShape) {
      const config = normalizedShape[fieldName];
      const defaultValue = getDefaultValue(config);

      baseState[fieldName] = defaultValue;
      baseState[`v${capitalize(fieldName)}`] = [];
      baseState[`t${capitalize(fieldName)}`] = false;
    }

    baseState.isFormValid = false;
    baseState.isDirty = false;
    baseState.dirtyFields = {};

    /* ================= VALIDATION ================= */

    const validateField = async (fieldName: string, value: any) => {
      const config = normalizedShape[fieldName];
      const errors: string[] = [];

      if (config.schema) {
        const result = config.schema.safeParse(value);
        if (!result.success) {
          errors.push(...result.error.issues.map((i) => i.message));
        }
      }

      if (config.validate) {
        const custom = config.validate(value, get());
        if (custom !== true) errors.push(...custom);
      }

      if (config.asyncValidate) {
        const asyncResult = await config.asyncValidate(value, get());
        if (asyncResult !== true) errors.push(...asyncResult);
      }

      return errors.length ? errors : true;
    };

    const validateDependents = async (changedField: string) => {
      for (const fieldName in normalizedShape) {
        const config = normalizedShape[fieldName];

        if (config.dependsOn?.includes(changedField)) {
          const value = get()[fieldName];
          const result = await validateField(fieldName, value);

          set({ [`v${capitalize(fieldName)}`]: result });
        }
      }
    };

    const validateForm = () => {
      const current = get();

      const isValid = Object.keys(normalizedShape).every((fieldName) => {
        const config = normalizedShape[fieldName];
        const value = current[fieldName];
        const validation = current[`v${capitalize(fieldName)}`];

        if (!config.schema) return validation === true;

        const acceptsUndefined = config.schema.safeParse(undefined).success;

        const hasValue =
          typeof value === 'string'
            ? value.trim().length > 0
            : value !== undefined && value !== null;

        if (acceptsUndefined && !hasValue) return true;

        return validation === true;
      });

      set({ isFormValid: isValid });
    };

    const updateDirty = (fieldName: string, value: any) => {
      const defaultValue = getDefaultValue(normalizedShape[fieldName]);
      const isDirtyField = value !== defaultValue;

      const dirtyFields = {
        ...get().dirtyFields,
        [fieldName]: isDirtyField,
      };

      const isDirty = Object.values(dirtyFields).some(Boolean);

      set({ dirtyFields, isDirty });
    };

    /* ================= SETTERS ================= */

    for (const fieldName in normalizedShape) {
      baseState[`set${capitalize(fieldName)}`] = async (value: any) => {
        set({ [fieldName]: value });

        updateDirty(fieldName, value);

        if (mode === 'onChange') {
          const result = await validateField(fieldName, value);

          set({ [`v${capitalize(fieldName)}`]: result });

          await validateDependents(fieldName);

          validateForm();
        }
      };

      baseState[`blur${capitalize(fieldName)}`] = async () => {
        set({ [`t${capitalize(fieldName)}`]: true });

        if (mode === 'onBlur') {
          const value = get()[fieldName];
          const result = await validateField(fieldName, value);

          set({ [`v${capitalize(fieldName)}`]: result });

          await validateDependents(fieldName);

          validateForm();
        }
      };

      baseState[`reset${capitalize(fieldName)}`] = () => {
        const defaultValue = getDefaultValue(normalizedShape[fieldName]);

        set({
          [fieldName]: defaultValue,
          [`v${capitalize(fieldName)}`]: [],
          [`t${capitalize(fieldName)}`]: false,
        });

        updateDirty(fieldName, defaultValue);

        validateForm();
      };
    }

    /* ================= INTERNAL METHODS ================= */

    baseState.validateAllFields = async () => {
      for (const fieldName in normalizedShape) {
        const value = get()[fieldName];
        const result = await validateField(fieldName, value);

        set({ [`v${capitalize(fieldName)}`]: result });
      }

      validateForm();

      return get().isFormValid;
    };

    baseState.validateForm = validateForm;

    baseState.getValues = () => {
      const values: any = {};

      for (const fieldName in normalizedShape) {
        values[fieldName] = get()[fieldName];
      }

      return values;
    };

    baseState.setValues = (values: any) => {
      for (const key in values) {
        if (normalizedShape[key]) {
          baseState[`set${capitalize(key)}`](values[key]);
        }
      }
    };

    baseState.reset = () => {
      for (const fieldName in normalizedShape) {
        baseState[`reset${capitalize(fieldName)}`]();
      }
    };

    baseState.clearErrors = () => {
      for (const fieldName in normalizedShape) {
        set({ [`v${capitalize(fieldName)}`]: [] });
      }
    };

    return baseState;
  };

  return persistEnabled
    ? create<ZustandFactoryReturn<T>>()(persist(initializer, { name: 'zustand-form' }))
    : create<ZustandFactoryReturn<T>>()(initializer);
}

/* ============================================================ */

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
