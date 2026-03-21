/**
 * @file packages/sdk/ApiClient.ts
 * @description Frontend-only SDK factory. Uses fetch + zustand — no Node/express deps.
 * Never import this file from backend code. Use ApiServer.ts for backend.
 */

import { create } from 'zustand';
import type { UseBoundStore, StoreApi } from 'zustand';
import { z } from 'zod';
import type { AnyContract } from './Contracts';
import { getFullResponseSchema } from './Contracts';
import { createFormStore } from './FormStore';
import type { FormState, ValidationTrigger } from './FormStore';

//#region PUBLIC_TYPES
/** @public Reactive state for a single endpoint's in-flight request. */
export type RequestState<TResponse> = {
  isFetching: boolean;
  error: Error | null;
  data: TResponse | null;
};

/** @internal Extracts the Zod raw shape from a contract's request schema. */
export type RequestShapeOf<C extends AnyContract> =
  C['__requestSchema'] extends z.ZodObject<infer S> ? S : z.ZodRawShape;

/** @public Initialization config for {@link createClientApi}. */
export type ClientConfig = Readonly<{
  /** Base URL prepended to every request path (e.g. `'https://api.example.com'`). */
  baseURL: string;
  /** Credential forwarding mode for `fetch`. @defaultValue `'include'` */
  credentials?: 'include' | 'same-origin' | 'omit';
  /** When per-field form validation is triggered. @defaultValue `'onChange'` */
  formMode?: ValidationTrigger;
}>;

/** @internal Resolved config with all defaults applied. */
type ResolvedClientConfig = Required<ClientConfig>;

// ─────────────────────────────────────────────────────────────
//  CallableFn uses __phantomRequest / __phantomResponse directly
//  (not through $type) to avoid the double-index widening that
//  produces `unknown` when TContract is resolved through a union.
// ─────────────────────────────────────────────────────────────

/** @internal The callable function signature of a {@link CallableEndpoint}. */
type CallableFn<C extends AnyContract> = (
  input: C['__phantomRequest'],
) => Promise<C['__phantomResponse']>;

/** @internal Non-function properties attached to a {@link CallableEndpoint}. */
type CallableEndpointProps<C extends AnyContract> = {
  readonly $form: UseBoundStore<StoreApi<FormState<RequestShapeOf<C>>>>;
  readonly $use: UseBoundStore<StoreApi<RequestState<C['__phantomResponse']>>>;
  readonly $reset: () => void;
  readonly isFetching: boolean;
  readonly lastError: Error | null;
  readonly lastData: C['__phantomResponse'] | null;
};

/**
 * @public
 * @summary A callable, reactive endpoint.
 * @remarks
 * - **Call it** — executes the HTTP request.
 * - **`$form`** — pass to `FieldFactory` for field binding.
 * - **`$use`**  — reactive `{ data, error, isFetching }` in components.
 * - **`$reset`** — clears stale state on mount.
 * @example
 * ```ts
 * await sdk.iam.login(form.getValues());
 * const { data, error, isFetching } = sdk.iam.login.$use();
 * ```
 */
export type CallableEndpoint<C extends AnyContract> = CallableFn<C> & CallableEndpointProps<C>;

/** @internal All module name literals in a contract collection. */
type ModulesOf<TContracts extends readonly AnyContract[]> =
  TContracts[number]['__path'] extends `/${infer M}/${string}` ? M : never;

/** @internal All action name literals for a given module. */
type ActionsOf<
  TContracts extends readonly AnyContract[],
  TModule extends string,
> = TContracts[number] extends infer C
  ? C extends AnyContract
    ? C['__path'] extends `/${TModule}/${infer A}`
      ? A
      : never
    : never
  : never;

/** @internal Extracts the exact contract for a module + action pair. */
type ContractAt<
  TContracts extends readonly AnyContract[],
  TModule extends string,
  TAction extends string,
> = Extract<TContracts[number], { __path: `/${TModule}/${TAction}` }>;

/**
 * @public
 * @summary Fully typed SDK instance returned by {@link createClientApi}.
 * @remarks Organized as `sdk[module][action]`, each action is a {@link CallableEndpoint}.
 */
export type ClientApiInstance<TContracts extends readonly AnyContract[]> = Readonly<
  {
    readonly [TModule in ModulesOf<TContracts>]: Readonly<{
      readonly [TAction in ActionsOf<TContracts, TModule>]: CallableEndpoint<
        ContractAt<TContracts, TModule, TAction>
      >;
    }>;
  } & {
    readonly $modules: ReadonlyArray<ModulesOf<TContracts>>;
    readonly $contracts: TContracts;
  }
>;
//#endregion

//#region HTTP_HELPERS
/** @internal Returns `true` for verbs that carry params in the URL instead of a body. */
function isBodylessVerb(verb: string): verb is 'GET' | 'DELETE' {
  return verb === 'GET' || verb === 'DELETE';
}

/** @internal Serializes a flat object to a URL query string, skipping null/undefined. */
function buildQueryString(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) sp.append(key, String(value));
  }
  return sp.toString();
}

/**
 * @internal
 * Converts `''` → `null` before sending to the backend.
 * The form always stores `''` to avoid browser controlled-input warnings.
 * Prisma nullable columns receive `null` — never `''`.
 */
function coerceEmptyStrings(payload: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    result[key] = value === '' ? null : value;
  }
  return result;
}
//#endregion

//#region ENDPOINT_BUILDER
function buildEndpoint<C extends AnyContract>(
  contract: C,
  config: ResolvedClientConfig,
): CallableEndpoint<C> {
  type TResponse = C['__phantomResponse'];
  type TRequest = C['__phantomRequest'];

  const requestStore = create<RequestState<TResponse>>(() => ({
    isFetching: false,
    error: null,
    data: null,
  }));

  // después
  const formStore =
    contract.__requestSchema instanceof z.ZodObject
      ? createFormStore(contract.__requestSchema as z.ZodObject<RequestShapeOf<C>>, config.formMode)
      : createFormStore(z.object({}) as z.ZodObject<RequestShapeOf<C>>, config.formMode);

  async function executeRequest(input: TRequest): Promise<TResponse> {
    requestStore.setState({ isFetching: true, error: null });
    try {
      const rawParsed = contract.__requestSchema.parse(input) as Record<string, unknown>;
      const payload = coerceEmptyStrings(rawParsed);

      let url = config.baseURL + contract.__path;
      const init: RequestInit = {
        method: contract.__verb,
        credentials: config.credentials,
        headers: { 'content-type': 'application/json' },
      };

      if (isBodylessVerb(contract.__verb)) {
        const qs = buildQueryString(payload);
        if (qs) url = `${url}?${qs}`;
      } else {
        init.body = JSON.stringify(payload);
      }

      const httpResponse = await fetch(url, init);

      if (httpResponse.status === 204) {
        const empty = undefined as unknown as TResponse;
        requestStore.setState({ data: empty });
        return empty;
      }

      const json: unknown = await httpResponse.json();
      const response = getFullResponseSchema(contract).parse(json) as TResponse;
      requestStore.setState({ data: response });
      return response;
    } catch (thrown) {
      const error = thrown instanceof Error ? thrown : new Error('Unexpected API error');
      requestStore.setState({ error });
      throw error;
    } finally {
      requestStore.setState({ isFetching: false });
    }
  }

  const props: CallableEndpointProps<C> = {
    $form: formStore,
    $use: requestStore,
    $reset: () => requestStore.setState({ data: null, error: null, isFetching: false }),
    get isFetching() {
      return requestStore.getState().isFetching;
    },
    get lastError() {
      return requestStore.getState().error;
    },
    get lastData() {
      return requestStore.getState().data;
    },
  };

  return Object.assign(executeRequest, props) as CallableEndpoint<C>;
}
//#endregion

//#region CREATE_CLIENT_API
/**
 * @public
 * @summary Creates a fully typed frontend SDK from a set of contracts.
 * @remarks Call once in `apps/frontend/src/sdk.ts`.
 * @example
 * ```ts
 * export const sdk = createClientApi(contracts, {
 *   baseURL: import.meta.env.VITE_API_URL,
 * });
 * ```
 */
export function createClientApi<const TContracts extends readonly AnyContract[]>(
  contracts: TContracts,
  config: ClientConfig,
): ClientApiInstance<TContracts> {
  const resolved: ResolvedClientConfig = {
    baseURL: config.baseURL,
    credentials: config.credentials ?? 'include',
    formMode: config.formMode ?? 'onChange',
  };

  const modules: Record<string, Record<string, CallableEndpoint<AnyContract>>> = {};
  const moduleList: string[] = [];
  const seen = new Set<string>();

  for (const contract of contracts) {
    const parts = contract.__path.split('/');
    const moduleName = parts[1]!;
    const actionName = parts[2]!;

    if (!seen.has(moduleName)) {
      seen.add(moduleName);
      moduleList.push(moduleName);
      modules[moduleName] = {};
    }

    modules[moduleName]![actionName] = buildEndpoint(contract, resolved);
  }

  return Object.freeze({
    ...modules,
    $modules: Object.freeze(moduleList) as ReadonlyArray<ModulesOf<TContracts>>,
    $contracts: contracts,
  }) as ClientApiInstance<TContracts>;
}
//#endregion
