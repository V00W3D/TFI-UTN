import { useId } from 'react';
import type { UseBoundStore, StoreApi } from 'zustand';
import type { ChangeEvent, FocusEvent } from 'react';
import './AuthField.css';
import 'react-phone-number-input/style.css';

import { renderAuthField, type FieldType, type FieldOption } from './IFieldFactory/RenderField';
import { useFieldAddons, type FieldAddon } from './IFieldFactory/addons';
import type { FormState, AnyContract, RequestShapeOf } from '@app/sdk';

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

export function FieldFactory<C extends AnyContract>(
  $form: UseBoundStore<StoreApi<FormState<RequestShapeOf<C>>>>,
) {
  return function bindField<K extends keyof RequestShapeOf<C> & string>(name: K) {
    return function Field({
      label,
      control = 'text',
      placeholder = '',
      required = false,
      fieldMode = 'register',
      addons = [],
    }: FieldProps) {
      const inputId = useId();

      /* ===================== STORE ===================== */

      const value = $form((s) => s.values[name]);
      const rawErrors = $form((s) => s.errors[name]);
      const errors = (rawErrors ?? []) as string[];
      const isValid = !rawErrors?.length && $form((s) => s.isFormValid);
      const reset = $form((s) => s.reset);
      const storeSet = $form((s) => s.set);
      const storeBlur = $form((s) => s.blur);

      const setValue = (val: unknown) => storeSet(name, val as never);
      const blur = () => storeBlur(name);

      /* ===================== CONTROL PARSING ===================== */

      const type: FieldType = Array.isArray(control) ? (control[0] as FieldType) : control;
      const options: FieldOption[] | undefined = Array.isArray(control) ? control[1] : undefined;

      /* ===================== ADDONS ===================== */

      const {
        resolvedType,
        stateClass,
        hasInteracted,
        setHasInteracted,
        renderLeftSlot,
        renderRightSlot,
        renderLabelAction,
        renderHint,
        renderRules,
        renderError,
        renderStrength,
      } = useFieldAddons({
        addons,
        context: { type, fieldMode, value, errors, isValid, reset },
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
                value: value as string | boolean,
                onChange: (
                  e:
                    | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
                    | { target: { value: string | boolean } },
                ) => {
                  if (!hasInteracted) setHasInteracted(true);
                  setValue(e.target.value);
                },
                onBlur: (_e: FocusEvent<HTMLElement>) => blur(),
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
