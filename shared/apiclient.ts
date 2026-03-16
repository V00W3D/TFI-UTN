import { z } from 'zod';
import { createPublicErrorSchema } from '@tools/ErrorTools';
import { type ContractAny } from './ContractFactory';
import { BACKEND_URL } from '../backend/src/env';
import { contracts } from 'contracts';

/* ============================================================
BASE TYPES
============================================================ */

type CredentialsMode = 'include';

export type ClientOptions = Readonly<{
  baseURL: string;
  credentials?: CredentialsMode;
}>;

/* ============================================================
UTILS
============================================================ */

function encodeQuery(input: Record<string, unknown>) {
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
API RESPONSE TYPES
============================================================ */

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiError<E> = {
  ok: false;
  error: E;
};

export type ApiResponse<S, E> = ApiSuccess<S> | ApiError<E>;

/* ============================================================
CLIENT ENDPOINT TYPE
============================================================ */

export type ClientEndpoint<C extends ContractAny> = {
  (input: C['$type']['request']): Promise<C['$type']['response']>;

  readonly $contract: C;
  readonly $path: C['__endpoint'];
  readonly $method: C['__method'];

  readonly $isFetching: boolean;
  readonly $error: Error | null;
  readonly $data: C['$type']['response'] | null;
};

/* ============================================================
ENDPOINT FACTORY
============================================================ */

function createEndpoint<C extends ContractAny>(contract: C, options: ClientOptions) {
  const state = {
    isFetching: false,
    error: null as Error | null,
    data: null as C['$type']['response'] | null,
  };

  const fn = async (input: C['$type']['request']): Promise<C['$type']['response']> => {
    state.isFetching = true;
    state.error = null;

    try {
      const validatedInput = contract.__requestSchema.parse(input);

      let url = options.baseURL + contract.__endpoint;

      const init: RequestInit = {
        method: contract.__method,
        credentials: options.credentials ?? 'include',
        headers: {
          'content-type': 'application/json',
        },
      };

      if (isQueryMethod(contract.__method)) {
        const query = encodeQuery(validatedInput as Record<string, unknown>);

        if (query) url += `?${query}`;
      } else {
        init.body = JSON.stringify(validatedInput);
      }

      const res = await fetch(url, init);

      if (res.status === 204) {
        const empty = undefined as unknown as C['$type']['response'];
        state.data = empty;
        return empty;
      }

      const json: unknown = await res.json();

      const validated = contract.__responseSchema.parse(json) as C['$type']['response'];

      state.data = validated;

      return validated;
    } catch (err) {
      state.error = err instanceof Error ? err : new Error('Unknown API error');

      throw state.error;
    } finally {
      state.isFetching = false;
    }
  };

  return Object.assign(fn, {
    $contract: contract,
    $path: contract.__endpoint,
    $method: contract.__method,

    get $isFetching() {
      return state.isFetching;
    },

    get $error() {
      return state.error;
    },

    get $data() {
      return state.data;
    },
  });
}

/* ============================================================
API INSTANCE
============================================================ */

type ContractsArray = readonly ContractAny[];

type Modules<T extends ContractsArray> = T[number]['__module'];

type Actions<T extends ContractsArray, M extends Modules<T>> = Extract<
  T[number],
  { __module: M }
>['__action'];

type ContractOf<T extends ContractsArray, M extends Modules<T>, A extends Actions<T, M>> = Extract<
  T[number],
  { __module: M; __action: A }
>;

export function ApiInstance<const T extends readonly ContractAny[]>(
  contracts: T,
  options: ClientOptions,
) {
  type Modules = T[number]['__module'];

  type Actions<M extends Modules> = Extract<T[number], { __module: M }>['__action'];

  type ContractOf<M extends Modules, A extends Actions<M>> = Extract<
    T[number],
    { __module: M; __action: A }
  >;

  type ApiClient = Readonly<
    {
      [M in Modules]: Readonly<{
        [A in Actions<M>]: ClientEndpoint<ContractOf<M, A>>;
      }>;
    } & {
      $modules: readonly Modules[];
      $contracts: T;
    }
  >;

  // 🔥 CAMBIO CLAVE: usar Partial sin forzar Record genérico
  const api: Partial<{
    [M in Modules]: {
      [A: string]: unknown;
    };
  }> = {};

  const modules: Modules[] = [];

  for (const contract of contracts) {
    const module = contract.__module as Modules;
    const action = contract.__action;

    if (!modules.includes(module)) modules.push(module);

    if (!api[module]) {
      api[module] = {} as any;
    }

    (api[module] as any)[action] = createEndpoint(contract, options);
  }

  const client = {
    ...(api as object),
    $modules: Object.freeze(modules),
    $contracts: contracts,
  };

  return Object.freeze(client) as ApiClient;
}

/* ============================================================
INSTANCE
============================================================ */
export const api = ApiInstance(contracts, {
  baseURL: BACKEND_URL,
  credentials: 'include',
});
