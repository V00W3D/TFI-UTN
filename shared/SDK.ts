import { create } from 'zustand';
import type { UseBoundStore, StoreApi, StateCreator } from 'zustand';
import { z } from 'zod';

import {
  type ContractAny,
  type ApiResponse,
  type ApiSuccess,
  type ApiFailure,
  isApiSuccess,
  isApiFailure,
} from './ContractFactory';

export type { ApiResponse, ApiSuccess, ApiFailure };
export { isApiSuccess, isApiFailure };

/* ============================================================
   SDK OPTIONS
============================================================ */

export type SdkOptions = Readonly<{
  baseURL: string;
  credentials?: 'include' | 'same-origin' | 'omit';
  formMode?: 'onChange' | 'onBlur' | 'onSubmit';
}>;

/* ============================================================
   FORM STORE
============================================================ */

type FormValues<S extends z.ZodRawShape> = { [K in keyof S]: z.infer<S[K]> };

type FormStore<S extends z.ZodRawShape> = {
  values: FormValues<S>;
  errors: Partial<Record<keyof S, string[]>>;
  touched: Partial<Record<keyof S, boolean>>;
  dirty: Partial<Record<keyof S, boolean>>;
  isFormValid: boolean;
  isDirty: boolean;
  set: <K extends keyof S>(key: K, value: FormValues<S>[K]) => Promise<void>;
  blur: <K extends keyof S>(key: K) => Promise<void>;
  validate: () => Promise<boolean>;
  reset: () => void;
  getValues: () => FormValues<S>;
  setValues: (v: Partial<FormValues<S>>) => void;
};

function toZodType(v: unknown): z.ZodTypeAny | undefined {
  if (v !== null && typeof v === 'object' && 'safeParse' in v) {
    return v as z.ZodTypeAny;
  }
  return undefined;
}

function fieldDefault(schema: z.ZodTypeAny): unknown {
  const raw = schema as unknown as Record<string, unknown>;
  const def = raw['_def'];
  if (def !== null && typeof def === 'object') {
    const fn = (def as Record<string, unknown>)['defaultValue'];
    if (typeof fn === 'function') return (fn as () => unknown)();
  }
  for (const candidate of [null, undefined, false, 0, '', [], {}]) {
    const r = schema.safeParse(candidate);
    if (r.success) return 'data' in r && r.data !== undefined ? r.data : candidate;
  }
  return '';
}

function schemaAcceptsNull(schema: z.ZodTypeAny): boolean {
  return schema.safeParse(null).success;
}

function buildFormStore<S extends z.ZodRawShape>(
  schema: z.ZodObject<S>,
  mode: 'onChange' | 'onBlur' | 'onSubmit',
): UseBoundStore<StoreApi<FormStore<S>>> {
  const shape = schema.shape;

  const defaults = Object.fromEntries(
    Object.entries(shape).map(([k, s]) => {
      const zs = toZodType(s);
      return [k, zs ? fieldDefault(zs) : ''];
    }),
  ) as FormValues<S>;

  const validateField = async (key: string, value: unknown): Promise<string[] | true> => {
    const raw = shape[key as keyof S];
    const fieldSchema = toZodType(raw);
    if (!fieldSchema) return true;
    const r = fieldSchema.safeParse(value);
    if (!r.success) {
      const issues = (r as { error?: { issues?: { message: string }[] } }).error?.issues ?? [];
      const messages = issues.map((i) => i.message).filter(Boolean);
      return messages.length ? messages : true;
    }
    return true;
  };

  const coerce = (key: string, value: unknown): unknown => {
    if (value !== '') return value;
    const raw = shape[key as keyof S];
    const fieldSchema = toZodType(raw);
    if (fieldSchema && schemaAcceptsNull(fieldSchema)) return null;
    return value;
  };

  const initializer: StateCreator<FormStore<S>> = (set, get) => {
    const checkForm = () => {
      const s = get();
      const valid = schema.safeParse(s.values).success;
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
        const coerced = coerce(key as string, value) as FormValues<S>[typeof key];
        set((s) => ({
          values: { ...s.values, [key]: coerced },
          dirty: { ...s.dirty, [key]: true },
        }));
        if (mode === 'onChange') {
          const r = await validateField(key as string, coerced);
          set((s) => ({ errors: { ...s.errors, [key]: r === true ? undefined : r } }));
          checkForm();
        }
      },

      blur: async (key) => {
        set((s) => ({ touched: { ...s.touched, [key]: true } }));
        if (mode === 'onBlur') {
          const r = await validateField(key as string, get().values[key]);
          set((s) => ({ errors: { ...s.errors, [key]: r === true ? undefined : r } }));
          checkForm();
        }
      },

      validate: async () => {
        const vals = get().values;
        const errors: Partial<Record<keyof S, string[]>> = {};
        for (const k in shape) {
          const r = await validateField(k, vals[k as keyof S]);
          if (r !== true) errors[k as keyof S] = r;
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

  return create<FormStore<S>>()(initializer);
}

/* ============================================================
   REQUEST STORE
============================================================ */

type RequestState<R> = {
  isFetching: boolean;
  error: Error | null;
  data: R | null;
};

/* ============================================================
   ENDPOINT TYPE
============================================================ */

type RequestSchema<C extends ContractAny> =
  C['__requestSchema'] extends z.ZodObject<infer S> ? S : z.ZodRawShape;

export type Endpoint<C extends ContractAny> = {
  (input: C['$type']['request']): Promise<C['$type']['response']>;

  readonly $contract: C;
  readonly $path: C['__endpoint'];
  readonly $method: C['__method'];
  readonly $isFetching: boolean;
  readonly $error: Error | null;
  readonly $data: C['$type']['response'] | null;
  readonly $use: UseBoundStore<StoreApi<RequestState<C['$type']['response']>>>;
  readonly $form: UseBoundStore<StoreApi<FormStore<RequestSchema<C>>>>;
  readonly $reset: () => void;
};

/* ============================================================
   UTILS
============================================================ */

function encodeQuery(input: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(input)) {
    if (v === undefined || v === null) continue;
    params.append(k, String(v));
  }
  return params.toString();
}

function isQueryMethod(method: string): method is 'GET' | 'DELETE' {
  return method === 'GET' || method === 'DELETE';
}

/* ============================================================
   ENDPOINT FACTORY
============================================================ */

function createEndpoint<C extends ContractAny>(contract: C, options: SdkOptions): Endpoint<C> {
  type R = C['$type']['response'];

  const requestStore = create<RequestState<R>>(() => ({
    isFetching: false,
    error: null,
    data: null,
  }));

  const requestSchema = contract.__requestSchema;
  const formStore = buildFormStore(
    requestSchema as unknown as z.ZodObject<RequestSchema<C>>,
    options.formMode ?? 'onChange',
  );

  const fn = async (input: C['$type']['request']): Promise<R> => {
    requestStore.setState({ isFetching: true, error: null });

    try {
      const validatedInput = contract.__requestSchema.parse(input) as Record<string, unknown>;

      let url = options.baseURL + contract.__endpoint;

      const init: RequestInit = {
        method: contract.__method,
        credentials: options.credentials ?? 'include',
        headers: { 'content-type': 'application/json' },
      };

      if (isQueryMethod(contract.__method)) {
        const query = encodeQuery(validatedInput);
        if (query) url += `?${query}`;
      } else {
        init.body = JSON.stringify(validatedInput);
      }

      const res = await fetch(url, init);

      if (res.status === 204) {
        const empty = undefined as unknown as R;
        requestStore.setState({ data: empty });
        return empty;
      }

      const json: unknown = await res.json();
      const validated = contract.__fullResponseSchema.parse(json) as R;
      requestStore.setState({ data: validated });
      return validated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown API error');
      requestStore.setState({ error });
      throw error;
    } finally {
      requestStore.setState({ isFetching: false });
    }
  };

  const reset = () => requestStore.setState({ data: null, error: null, isFetching: false });

  return Object.assign(fn, {
    $contract: contract,
    $path: contract.__endpoint,
    $method: contract.__method,
    get $isFetching() {
      return requestStore.getState().isFetching;
    },
    get $error() {
      return requestStore.getState().error;
    },
    get $data() {
      return requestStore.getState().data;
    },
    $use: requestStore,
    $form: formStore,
    $reset: reset,
  }) as unknown as Endpoint<C>;
}

/* ============================================================
   DERIVED MAPPED TYPES
============================================================ */

type ContractsArray = readonly ContractAny[];

type ModulesOf<T extends ContractsArray> = T[number]['__module'];

type ActionsOf<T extends ContractsArray, M extends ModulesOf<T>> = Extract<
  T[number],
  { __module: M }
>['__action'];

type ContractOf<
  T extends ContractsArray,
  M extends ModulesOf<T>,
  A extends ActionsOf<T, M>,
> = Extract<T[number], { __module: M; __action: A }>;

export type SDK<T extends ContractsArray> = Readonly<
  {
    readonly [M in ModulesOf<T>]: Readonly<{
      readonly [A in ActionsOf<T, M>]: Endpoint<ContractOf<T, M, A>>;
    }>;
  } & {
    readonly $modules: ReadonlyArray<ModulesOf<T>>;
    readonly $contracts: T;
  }
>;

/* ============================================================
   SDK FACTORY
============================================================ */

export function createSDK<const T extends readonly ContractAny[]>(
  contracts: T,
  options: SdkOptions,
): SDK<T> {
  const api: Record<string, Record<string, unknown>> = {};
  const modules: Array<ModulesOf<T>> = [];

  for (const contract of contracts) {
    const mod = contract.__module as ModulesOf<T>;
    const action = contract.__action;

    if (!modules.includes(mod)) modules.push(mod);
    if (!api[mod]) api[mod] = {};
    api[mod]![action] = createEndpoint(contract, options);
  }

  return Object.freeze({
    ...api,
    $modules: Object.freeze(modules) as ReadonlyArray<ModulesOf<T>>,
    $contracts: contracts,
  }) as unknown as SDK<T>;
}
