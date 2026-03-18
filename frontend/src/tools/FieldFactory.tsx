import { useId } from 'react';
import type { UseBoundStore, StoreApi } from 'zustand';
import './AuthField.css';
import 'react-phone-number-input/style.css';

import { renderAuthField, type FieldType, type FieldOption } from './IFieldFactory/RenderField';

import { useFieldAddons, type FieldAddon } from './IFieldFactory/addons';

/* =========================================================
   TYPES
========================================================= */

type FieldMode = 'login' | 'register';

type PrimitiveControl = 'text' | 'email' | 'password' | 'phone';
type SelectControl = ['select', FieldOption[]];
type RadioControl = ['radio', FieldOption[]];

export type FieldControl = PrimitiveControl | SelectControl | RadioControl;

interface FieldProps {
  label: string;
  control?: FieldControl;
  placeholder?: string;
  required?: boolean;
  fieldMode?: FieldMode;
  addons?: FieldAddon[];
}

type ZustandStore<T extends Record<string, any>> = {
  values: T;
  errors: Partial<Record<keyof T, string[]>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isFormValid: boolean;
  isDirty: boolean;
  set: <K extends keyof T>(key: K, value: T[K]) => Promise<void>;
  blur: <K extends keyof T>(key: K) => Promise<void>;
  validate: () => Promise<boolean>;
  reset: () => void;
  getValues: () => T;
  setValues: (v: Partial<T>) => void;
};

/* =========================================================
   FACTORY
========================================================= */

export function FieldFactory<T extends Record<string, any>>(
  useStore: UseBoundStore<StoreApi<ZustandStore<T>>>,
) {
  return function bindField<K extends keyof T & string>(name: K) {
    return function Field({
      label,
      control = 'text',
      placeholder,
      required,
      fieldMode = 'register',
      addons = [],
    }: FieldProps) {
      const inputId = useId();

      /* ===================== STORE ===================== */

      const value = useStore((s) => s.values[name]);
      const validation = useStore((s) => {
        const errs = s.errors[name];
        return errs && errs.length > 0 ? errs : true;
      });
      const touched = useStore((s) => s.touched[name] ?? false) as boolean;

      const storeSet = useStore((s) => s.set);
      const storeBlur = useStore((s) => s.blur);
      const reset = useStore((s) => s.reset);

      const setValue = (val: any) => storeSet(name, val);
      const blur = () => storeBlur(name);

      /* ===================== CONTROL PARSING ===================== */

      let type: FieldType = 'text';
      let options: FieldOption[] | undefined;

      if (Array.isArray(control)) {
        type = control[0] as FieldType;
        options = control[1];
      } else {
        type = control as FieldType;
      }

      /* ===================== ADDONS ===================== */

      const {
        resolvedType,
        stateClass,
        renderLeftSlot,
        renderRightSlot,
        renderLabelAction,
        renderHint,
        renderRules,
        renderError,
        renderStrength,
      } = useFieldAddons({
        addons,
        context: {
          type,
          fieldMode,
          value,
          touched,
          validation,
          reset,
        },
      });

      /* ===================== RENDER ===================== */

      return (
        <div className={`auth-field ${stateClass}`}>
          <div className="auth-field__label-row">
            <label htmlFor={inputId} className="auth-field__label">
              {label}
              {required && <span className="auth-field__required">*</span>}
            </label>

            {renderLabelAction()}
          </div>
          <div className="auth-field__input-wrapper">
            {renderLeftSlot()}

            {renderAuthField({
              type,
              inputId,
              name,
              required,
              placeholder,
              resolvedType,
              options,
              inputProps: {
                value,
                onChange: (e: any) => {
                  if (e?.target?.value !== undefined) {
                    setValue(e.target.value);
                  } else {
                    setValue(e);
                  }
                },
                onBlur: blur,
              },
            })}

            {renderRightSlot()}
          </div>
          {renderError()}
          {renderStrength()}
          {renderHint()}
          {renderRules()}
        </div>
      );
    };
  };
}
