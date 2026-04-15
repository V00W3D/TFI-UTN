/**
 * @file index.tsx
 * @module Form
 * @description Fábrica de formularios reactivos tipados sobre el SDK de contratos.
 */
import { useEffect, useCallback } from 'react';
import type { ReactNode, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UseBoundStore, StoreApi } from 'zustand';
import type { FormState, RequestShapeOf, AnyContract } from '@app/sdk';
import type { ClientApiInstance } from '@app/sdk/ApiClient';
import type {
  FormProps,
  FieldProps,
  TypedFields,
  FormInstance,
  FormFactoryInstance,
  OpaqueEndpoint,
  FormStore,
  SDKModules,
} from '@/shared/ui/Form/types';
import { BoundField } from '@/shared/ui/Form/components/BoundField';
import { cardStyles } from '@/styles/components/card';
import { buttonStyles } from '@/styles/components/button';
import { formStyles } from '@/styles/modules/form';
import { cn } from '@/styles/utils/cn';
import { typography } from '@/styles/typography';

// ── EXPORTS ──
export * from '@/shared/ui/Form/types';

export const FormSection = ({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn(formStyles.section, className)}>
    <h3 className={cn(typography.displaySm, formStyles.sectionTitle)}>
      {title}
    </h3>
    {children}
  </div>
);

const createField = (store: FormStore, name: string) => (props: FieldProps) => (
  <BoundField {...props} store={store} name={name} />
);

const buildForm =
  (endpoint: OpaqueEndpoint): ((props: FormProps) => ReactNode) =>
  ({
    children,
    buttonText = 'Enviar',
    loadingText = 'Cargando...',
    redirectTo,
    redirectOptions,
    onSuccess,
  }: FormProps) => {
    const navigate = useNavigate();
    const { data, error, isFetching, isFormValid } = endpoint.$use();
    const store = endpoint.$form;

    useEffect(() => {
      endpoint.$reset();
    }, []);

    useEffect(() => {
      if (data && !error) {
        if (onSuccess) onSuccess(data);
        if (redirectTo) navigate(redirectTo, redirectOptions);
      }
    }, [data, error, navigate, onSuccess, redirectTo, redirectOptions]);

    const handleSubmit = useCallback(
      async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isFetching) return;
        const isValid = await store.getState().validate();
        if (!isValid) return;
        try {
          await endpoint(store.getState().getValues());
        } catch {
          // El error queda guardado en el requestStore
        }
      },
      [isFetching, store],
    );

    return (
      <div className={formStyles.formShell}>
        <div
          className={cn(cardStyles({ variant: 'elevated', padding: 'md' }), formStyles.formCard)}
        >
          <form onSubmit={handleSubmit} className={formStyles.formStack}>
            <div className={formStyles.formContent}>{children}</div>

            <div className={formStyles.formActions}>
              <button
                type="submit"
                disabled={isFetching || !isFormValid}
                className={buttonStyles({ variant: 'primary' })}
              >
                {isFetching ? loadingText : buttonText}
              </button>

              {!!error && (
                <p className={formStyles.feedbackError}>
                  {String((error as { code?: string })?.code ?? 'Error desconocido')}
                </p>
              )}
              {!!data && !error && <p className={formStyles.feedbackSuccess}>Operación exitosa</p>}
            </div>
          </form>
        </div>
      </div>
    );
  };

export const FormFactory = <const TContracts extends readonly AnyContract[]>(
  sdk: ClientApiInstance<TContracts>,
): FormFactoryInstance<TContracts> => {
  const result: Record<string, Record<string, FormInstance<AnyContract>>> = {};

  for (const moduleName of sdk.$modules) {
    result[moduleName] = {};
    const module = sdk[moduleName as SDKModules<TContracts>] as Record<string, OpaqueEndpoint>;

    for (const actionName of Object.keys(module)) {
      const endpoint = module[actionName]!;
      const store = endpoint.$form;
      const fields = Object.fromEntries(
        Object.keys(store.getState().values).map((key) => [key, createField(store, key)]),
      ) as TypedFields<AnyContract>;

      result[moduleName]![actionName] = {
        fields,
        $form: store as UseBoundStore<StoreApi<FormState<RequestShapeOf<AnyContract>>>>,
        Form: buildForm(endpoint),
        submit: (onComplete) => async (e) => {
          e.preventDefault();
          const isValid = await store.getState().validate();
          if (isValid) onComplete(store.getState().values);
        },
      };
    }
  }

  return result as FormFactoryInstance<TContracts>;
};
