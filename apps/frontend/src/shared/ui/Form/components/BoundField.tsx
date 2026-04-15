import { memo, useId, useState, useCallback } from 'react';
import { useStore } from 'zustand';
import { ClearIcon, EyeClosedIcon, EyeOpenIcon } from '@/shared/ui/AppIcons';
import { ErrorMessages, RulesList, SlotButton, StrengthIndicator } from '@/shared/ui/Form/components/FormDisplay';
import { NativeInput } from '@/shared/ui/Form/components/NativeInput';
import type { ControlOption, ControlType, FieldProps, FormStore } from '@/shared/ui/Form/types';
import { extractAddons } from '@/shared/ui/Form/utils';
import { formFieldWrapperStyles, formStyles } from '@/styles/modules/form';
import { cn } from '@/styles/utils/cn';

interface BoundFieldProps extends FieldProps {
  store: FormStore;
  name: string;
}

interface BoundStoreShape {
  values: Record<string, unknown>;
  errors: Record<string, unknown[] | undefined>;
  isFormValid: boolean;
  set: (name: string, value: unknown) => void;
  blur: (name: string) => void;
}

export const BoundField = memo(
  ({
    store,
    name,
    label,
    control = 'text',
    placeholder = '',
    required = false,
    fieldMode = 'register',
    addons = [],
    nakedWrapper = false,
    onFocus,
    className,
  }: BoundFieldProps) => {
    const inputId = useId();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [rulesVisible, setRulesVisible] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const value = useStore(store, (s) => (s as unknown as BoundStoreShape).values[name]);
    const rawErrors = useStore(store, (s) => (s as unknown as BoundStoreShape).errors[name]);
    const isFormValid = useStore(store, (s) => (s as unknown as BoundStoreShape).isFormValid);
    const save = useStore(store, (s) => (s as unknown as BoundStoreShape).set);
    const markBlur = useStore(store, (s) => (s as unknown as BoundStoreShape).blur);

    const errors = (rawErrors ?? []) as string[];
    const type: ControlType = Array.isArray(control) ? (control[0] as ControlType) : control;
    const options: ControlOption[] = Array.isArray(control) ? control[1] : [];
    const { iconAddon, hintAddon, rulesAddon, hasPasswordToggle, hasStrength } =
      extractAddons(addons);

    const isRegisterMode = fieldMode === 'register';
    const hasValue = typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
    const isFieldValid = !errors.length && isFormValid;
    const showError = hasInteracted && errors.length > 0;
    const showSuccess = hasInteracted && hasValue && isFieldValid && !showError;
    const intent = showError ? 'error' : showSuccess ? 'success' : 'default';
    const resolvedType =
      hasPasswordToggle && type === 'password' ? (passwordVisible ? 'text' : 'password') : type;

    const handleChange = useCallback(
      (e: { target: { value: unknown } }) => {
        setHasInteracted(true);
        save(name, e.target.value as never);
      },
      [save, name],
    );
    const handleBlur = useCallback((_e: unknown) => markBlur(name), [markBlur, name]);
    const togglePassword = useCallback(() => setPasswordVisible((p) => !p), []);
    const toggleRules = useCallback(() => setRulesVisible((p) => !p), []);
    const handleClear = useCallback(() => {
      setHasInteracted(true);
      save(name, '' as never);
    }, [name, save]);

    return (
      <div className={formStyles.field}>
        <div className={formStyles.labelRow}>
          <label htmlFor={inputId} className={formStyles.label}>
            {label}
            {required && <span className={formStyles.required}>{'*'}</span>}
          </label>
          {isRegisterMode && rulesAddon && (
            <button type="button" onClick={toggleRules} className={formStyles.helpToggle}>
              {rulesVisible ? 'cerrar' : '(?)'}
            </button>
          )}
        </div>
        <div className={formFieldWrapperStyles({ intent, naked: nakedWrapper })}>
          {iconAddon && (
            <div className={formStyles.slot}>
              <div className={formStyles.slotIcon}>
                <span className={formStyles.icon} aria-hidden="true">
                  {iconAddon.icon}
                </span>
              </div>
            </div>
          )}
          <NativeInput
            type={type}
            resolvedType={resolvedType}
            inputId={inputId}
            name={name}
            required={required}
            placeholder={placeholder}
            options={options}
            inputProps={{
              value: value as string | boolean,
              onChange: handleChange,
              onBlur: handleBlur,
              onFocus,
              nakedWrapper,
              className,
              intent,
            }}
          />
          <div className={formStyles.slot}>
            {type !== 'radio' && type !== 'checkbox' && hasValue && (
              <SlotButton
                onClick={handleClear}
                icon={<ClearIcon width={17} height={17} />}
                description="Limpiar campo"
              />
            )}
            {hasPasswordToggle && type === 'password' && (
              <SlotButton
                onClick={togglePassword}
                icon={
                  passwordVisible ? (
                    <EyeOpenIcon width={17} height={17} />
                  ) : (
                    <EyeClosedIcon width={17} height={17} />
                  )
                }
                description={passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              />
            )}
          </div>
        </div>
        {showError && <ErrorMessages errors={errors} />}
        {hasStrength && isRegisterMode && type === 'password' && !!value && (
          <StrengthIndicator value={String(value)} />
        )}
        {isRegisterMode && hintAddon && !showError && !rulesVisible && (
          <span className={formStyles.hint}>{hintAddon.text}</span>
        )}
        {isRegisterMode && rulesAddon && rulesVisible && <RulesList rules={rulesAddon.rules} />}
      </div>
    );
  },
);
