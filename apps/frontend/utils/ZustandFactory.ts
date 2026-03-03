import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ZodTypeAny, z } from 'zod';

/* ============================================================
   CORE TYPES
============================================================ */

/**
 * Resultado estándar de una validación.
 *
 * - `true`  → válido
 * - `string[]` → lista de errores
 */
export type ValidationResult = true | string[];

/**
 * Define cuándo se ejecuta la validación automática.
 *
 * - `onChange` → cada vez que cambia el valor
 * - `onBlur`   → cuando el campo pierde foco
 * - `onSubmit` → únicamente al enviar el formulario
 */
export type ValidationMode = 'onChange' | 'onBlur' | 'onSubmit';

/**
 * Configuración declarativa de un campo del formulario.
 *
 * @template T Tipo del valor del campo
 */
export type FieldConfig<T = any> = {
  /**
   * Schema Zod asociado al campo.
   * Se usa como validación estructural principal.
   */
  schema?: ZodTypeAny;

  /**
   * Validador síncrono personalizado.
   *
   * @param value Valor actual del campo
   * @param state Estado completo del formulario
   */
  validate?: (value: T, state: any) => ValidationResult;

  /**
   * Validador asíncrono personalizado.
   * Útil para checks contra API (ej: username existente).
   */
  asyncValidate?: (value: T, state: any) => Promise<ValidationResult>;

  /**
   * Valor por defecto del campo.
   * Si no se define, se intenta inferir desde el schema.
   */
  defaultValue?: T;

  /**
   * Lista de campos de los que depende este.
   *
   * Si alguno cambia, este campo se revalida automáticamente.
   *
   * Ejemplo:
   * confirmPassword depende de password.
   */
  dependsOn?: string[];
};

/* ============================================================
   TYPE INFERENCE
============================================================ */

/**
 * Extrae el tipo real del campo desde:
 * - su schema Zod
 * - o el tipo genérico de FieldConfig
 */
type InferFieldValue<F> = F extends { schema: infer S }
  ? S extends ZodTypeAny
    ? z.infer<S>
    : F extends FieldConfig<infer U>
      ? U
      : never
  : F extends FieldConfig<infer U>
    ? U
    : never;

/**
 * Mapea los valores del formulario.
 */
type InferValues<T> = {
  [K in keyof T]: InferFieldValue<T[K]>;
};

/**
 * Genera propiedades tipo:
 * vUsername, vPassword...
 */
type InferValidations<T> = {
  [K in keyof T as `v${Capitalize<string & K>}`]: ValidationResult;
};

/**
 * Genera propiedades tipo:
 * tUsername, tPassword...
 */
type InferTouched<T> = {
  [K in keyof T as `t${Capitalize<string & K>}`]: boolean;
};

/**
 * Genera setters:
 * setUsername, blurUsername, resetUsername...
 */
type InferSetters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: InferFieldValue<T[K]>) => void;
} & {
  [K in keyof T as `blur${Capitalize<string & K>}`]: () => void;
} & {
  [K in keyof T as `reset${Capitalize<string & K>}`]: () => void;
};

/**
 * Métodos internos del formulario.
 */
type InternalStore<T> = {
  /** Indica si todos los campos son válidos */
  isFormValid: boolean;

  /** Indica si el formulario está enviándose */
  isSubmitting: boolean;

  /** Indica si algún campo fue modificado */
  isDirty: boolean;

  /** Mapa de campos modificados */
  dirtyFields: Record<string, boolean>;

  /** Recalcula si el formulario completo es válido */
  validateForm: () => void;

  /** Ejecuta validación en todos los campos */
  validateAllFields: () => Promise<boolean>;

  /** Resetea todo el formulario */
  reset: () => void;

  /** Limpia todos los errores */
  clearErrors: () => void;

  /** Obtiene los valores actuales */
  getValues: () => InferValues<T>;

  /** Setea múltiples valores */
  setValues: (values: Partial<InferValues<T>>) => void;

  /**
   * Ejecuta submit con validación automática.
   *
   * @param handler Función que recibe los valores válidos
   */
  submit: (handler: (values: InferValues<T>) => Promise<void> | void) => Promise<void>;
};

/**
 * Tipo final del store generado.
 */
export type ZustandFactoryReturn<T> = InferValues<T> &
  InferValidations<T> &
  InferTouched<T> &
  InferSetters<T> &
  InternalStore<T>;

/* ============================================================
   FACTORY
============================================================ */

/**
 * Crea un store de formulario completamente tipado.
 *
 * @param shape Definición declarativa de los campos
 * @param persistEnabled Si se debe persistir en localStorage
 * @param options Configuración adicional
 */
export function ZustandFactory<T extends Record<string, FieldConfig<any>>>(
  shape: T,
  persistEnabled: boolean = false,
  options?: { mode?: ValidationMode },
) {
  const mode = options?.mode ?? 'onChange';

  const initializer = (set: any, get: any): ZustandFactoryReturn<T> => {
    /**
     * Intenta inferir un valor por defecto basado en el schema.
     */
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

    /**
     * Inicialización dinámica del estado base.
     */
    for (const fieldName in shape) {
      const config = shape[fieldName];
      const defaultValue = getDefaultValue(config);

      baseState[fieldName] = defaultValue;
      baseState[`v${capitalize(fieldName)}`] = [];
      baseState[`t${capitalize(fieldName)}`] = false;
    }

    baseState.isFormValid = false;
    baseState.isSubmitting = false;
    baseState.isDirty = false;
    baseState.dirtyFields = {};

    /**
     * Ejecuta todas las validaciones de un campo.
     */
    const validateField = async (fieldName: string, value: any) => {
      const config = shape[fieldName];
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

    /**
     * Revalida automáticamente campos dependientes.
     */
    const validateDependents = async (changedField: string) => {
      for (const fieldName in shape) {
        const config = shape[fieldName];

        if (config.dependsOn?.includes(changedField)) {
          const value = get()[fieldName];
          const result = await validateField(fieldName, value);
          set({ [`v${capitalize(fieldName)}`]: result });
        }
      }
    };

    /**
     * Recalcula si el formulario es válido.
     */
    const validateForm = () => {
      const current = get();
      const isValid = Object.keys(shape).every(
        (fieldName) => current[`v${capitalize(fieldName)}`] === true,
      );
      set({ isFormValid: isValid });
    };

    /**
     * Marca campos como dirty.
     */
    const updateDirty = (fieldName: string, value: any) => {
      const defaultValue = getDefaultValue(shape[fieldName]);
      const isDirtyField = value !== defaultValue;

      const dirtyFields = {
        ...get().dirtyFields,
        [fieldName]: isDirtyField,
      };

      const isDirty = Object.values(dirtyFields).some(Boolean);
      set({ dirtyFields, isDirty });
    };

    /**
     * Generación dinámica de setters.
     */
    for (const fieldName in shape) {
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
        const defaultValue = getDefaultValue(shape[fieldName]);

        set({
          [fieldName]: defaultValue,
          [`v${capitalize(fieldName)}`]: [],
          [`t${capitalize(fieldName)}`]: false,
        });

        updateDirty(fieldName, defaultValue);
        validateForm();
      };
    }

    /**
     * Ejecuta validación completa.
     */
    baseState.validateAllFields = async () => {
      for (const fieldName in shape) {
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
      for (const fieldName in shape) values[fieldName] = get()[fieldName];
      return values;
    };

    baseState.submit = async (handler: any) => {
      set({ isSubmitting: true });

      const valid = await baseState.validateAllFields();
      if (valid) await handler(baseState.getValues());

      set({ isSubmitting: false });
    };

    return baseState;
  };

  return persistEnabled
    ? create<ZustandFactoryReturn<T>>()(persist(initializer, { name: 'zustand-form' }))
    : create<ZustandFactoryReturn<T>>()(initializer);
}

/* ============================================================ */

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
