import { useId } from 'react';
import type { UseBoundStore, StoreApi } from 'zustand';
import './AuthField.css';
import 'react-phone-number-input/style.css';

import { renderAuthField, type FieldType, type FieldOption } from './RenderAuthField';

import type { ZustandFactoryReturn } from './ZustandFactory';
import { useFieldAddons, type FieldAddon } from './addons';

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

/* =========================================================
   FACTORY
========================================================= */

export function FieldFactory<T extends Record<string, any>>(
  useStore: UseBoundStore<StoreApi<ZustandFactoryReturn<T>>>,
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

      const value = useStore((s) => s[name]);
      const validation = useStore((s) => s[`v${capitalize(name)}` as keyof typeof s]);
      const touched = useStore((s) => s[`t${capitalize(name)}` as keyof typeof s]) as boolean;

      const setValue = useStore((s) => s[`set${capitalize(name)}` as keyof typeof s]) as (
        value: any,
      ) => void;

      const blur = useStore((s) => s[`blur${capitalize(name)}` as keyof typeof s]) as () => void;

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
      } = useFieldAddons({
        addons,
        context: {
          type,
          fieldMode,
          value,
          touched,
          validation,
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
                  // soporta checkbox / phone / input estándar
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
          {renderHint()}
          {renderRules()}
        </div>
      );
    };
  };
}

/* ========================================================= */

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
