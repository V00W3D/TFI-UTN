import type { ReactNode } from 'react';
import type { NavigateOptions } from 'react-router-dom';
import type { UseBoundStore, StoreApi } from 'zustand';
import type { FormState, AnyContract, RequestShapeOf } from '@app/sdk';

export type ControlType =
  | 'text' | 'email' | 'password' | 'phone' | 'select' | 'textarea' | 'radio' | 'checkbox';

export interface ControlOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export type InputControl =
  | 'text' | 'email' | 'password' | 'phone'
  | ['select', ControlOption[]]
  | ['radio', ControlOption[]];

export type FieldAddon =
  | { type: 'icon'; icon: ReactNode }
  | { type: 'passwordToggle' }
  | { type: 'hint'; text: string }
  | { type: 'rules'; rules: readonly string[] }
  | { type: 'strength' };

export type FormMode = 'login' | 'register';

export interface FieldProps {
  label: string;
  control?: InputControl;
  placeholder?: string;
  required?: boolean;
  fieldMode?: FormMode;
  addons?: FieldAddon[];
  nakedWrapper?: boolean;
  onFocus?: (() => void);
  className?: string;
}

export interface FormProps {
  children: ReactNode;
  buttonText?: string;
  loadingText?: string;
  redirectTo?: string;
  redirectOptions?: NavigateOptions;
  onSuccess?: (data: unknown) => void;
}

export type TypedFields<C extends AnyContract> = {
  readonly [K in keyof RequestShapeOf<C> & string]: (props: FieldProps) => ReactNode;
};

export interface FormInstance<C extends AnyContract> {
  readonly fields: TypedFields<C>;
  readonly Form: (props: FormProps) => ReactNode;
  readonly $form: UseBoundStore<StoreApi<FormState<RequestShapeOf<C>>>>;
  submit: (
    onComplete: (values: FormState<RequestShapeOf<C>>['values']) => void,
  ) => (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export type FormFactoryInstance<TContracts extends readonly AnyContract[]> = {
  readonly [TModule in SDKModules<TContracts>]: {
    readonly [TAction in SDKActions<TContracts, TModule>]: FormInstance<
      ContractFor<TContracts, TModule, TAction>
    >;
  };
};

export type SDKModules<TContracts extends readonly AnyContract[]> =
  TContracts[number]['__path'] extends `/${infer M}/${string}` ? M : never;

export type SDKActions<
  TContracts extends readonly AnyContract[],
  TModule extends string,
> = TContracts[number] extends infer C
  ? C extends AnyContract
    ? C['__path'] extends `/${TModule}/${infer A}`
      ? A
      : never
    : never
  : never;

export type ContractFor<
  TContracts extends readonly AnyContract[],
  TModule extends string,
  TAction extends string,
> = Extract<TContracts[number], { __path: `/${TModule}/${TAction}` }>;

export type FormStore = UseBoundStore<StoreApi<FormState<any>>>;

export type OpaqueEndpoint = {
  $form: FormStore;
  $use: UseBoundStore<StoreApi<any>>;
  $reset: () => void;
  (input: unknown): Promise<unknown>;
};
