import {
  type ContractAny,
  type ApiResponse,
  type ApiSuccess,
  type ApiFailure,
  isApiSuccess,
  isApiFailure,
} from './ContractFactory';

/* ============================================================
   CLIENT OPTIONS
============================================================ */

export type ClientOptions = Readonly<{
  baseURL: string;
  credentials?: 'include' | 'same-origin' | 'omit';
}>;

/* ============================================================
   RE-EXPORTS FOR CONSUMERS
============================================================ */

export type { ApiResponse, ApiSuccess, ApiFailure };
export { isApiSuccess, isApiFailure };

/* ============================================================
   CLIENT ENDPOINT
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

function createEndpoint<C extends ContractAny>(
  contract: C,
  options: ClientOptions,
): ClientEndpoint<C> {
  const state = {
    isFetching: false,
    error: null as Error | null,
    data: null as C['$type']['response'] | null,
  };

  const fn = async (input: C['$type']['request']): Promise<C['$type']['response']> => {
    state.isFetching = true;
    state.error = null;

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
        const empty = undefined as unknown as C['$type']['response'];
        state.data = empty;
        return empty;
      }

      const json: unknown = await res.json();

      // Use the full union schema (success | error) built inside the contract.
      const validated = contract.__fullResponseSchema.parse(json) as C['$type']['response'];

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
  }) as unknown as ClientEndpoint<C>;
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

export type ApiClient<T extends ContractsArray> = Readonly<
  {
    readonly [M in ModulesOf<T>]: Readonly<{
      readonly [A in ActionsOf<T, M>]: ClientEndpoint<ContractOf<T, M, A>>;
    }>;
  } & {
    readonly $modules: ReadonlyArray<ModulesOf<T>>;
    readonly $contracts: T;
  }
>;

/* ============================================================
   INSTANCE FACTORY
============================================================ */

export function ApiInstance<const T extends readonly ContractAny[]>(
  contracts: T,
  options: ClientOptions,
): ApiClient<T> {
  const api: Record<string, Record<string, unknown>> = {};
  const modules: Array<ModulesOf<T>> = [];

  for (const contract of contracts) {
    const mod = contract.__module as ModulesOf<T>;
    const action = contract.__action;

    if (!modules.includes(mod)) modules.push(mod);
    if (!api[mod]) api[mod] = {};
    api[mod]![action] = createEndpoint(contract, options);
  }

  const client = {
    ...api,
    $modules: Object.freeze(modules) as ReadonlyArray<ModulesOf<T>>,
    $contracts: contracts,
  };

  return Object.freeze(client) as unknown as ApiClient<T>;
}
