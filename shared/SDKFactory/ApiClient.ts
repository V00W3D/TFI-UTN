import { create } from 'zustand';
import type { UseBoundStore, StoreApi } from 'zustand';
import { z } from 'zod';
import type { AnyContract } from './Contracts';
import { createFormStore } from './FormStore';
import type { FormState, ValidationTrigger } from './FormStore';
//#region REQUEST_TYPES
/**
 * @public
 * @summary Reactive state for a single endpoint's in-flight request.
 * @remarks Exposed via `CallableEndpoint.$use`. Causes the component to re-render on every change.
 * @template TData - The expected success response type.
 */
export type RequestState<TData> = {
  /** @description `true` while a fetch is in progress. */
  isFetching: boolean;
  /** @description The last error thrown, or `null` if the request succeeded or has not run. */
  error: Error | null;
  /** @description The last successful response, or `null` if none yet. */
  data: TData | null;
};
//#endregion
//#region CALLABLE_ENDPOINT_TYPE
/** @internal Infers the Zod raw shape from a contract's request schema, falling back to an empty shape. */
export type RequestShapeOf<TContract extends AnyContract> =
  TContract['__requestSchema'] extends z.ZodObject<infer S> ? S : z.ZodRawShape;
/**
 * @public
 * @summary A callable, reactive endpoint returned for every contract by {@link createSDK}.
 * @remarks
 * - **Call** it directly to execute the HTTP request.
 * - **`$form`** — pass to `FieldFactory` for automatic field binding.
 * - **`$use`**  — subscribe in a component to get reactive `{ data, error, isFetching }`.
 * - **`$reset`** — call on mount to clear stale state from a previous session.
 * - **`isFetching` / `lastError` / `lastData`** — non-reactive snapshots for use outside components.
 * @template TContract - The underlying {@link AnyContract}.
 * @example
 * ```ts
 * // Execute the request
 * await sdk.iam.login(form.getValues());
 * // Reactive state in a component
 * const { data, error, isFetching } = sdk.iam.login.$use();
 * // Form binding via FieldFactory
 * const Field = FieldFactory(sdk.iam.login.$form)('email');
 * ```
 */
export type CallableEndpoint<TContract extends AnyContract> = {
  /**
   * @description Executes the HTTP request for this endpoint.
   * @param input - The request payload, validated against the contract's input schema.
   * @returns The full API response (success or failure).
   * @throws {Error} When the network request fails or the response cannot be parsed.
   */
  (input: TContract['$type']['request']): Promise<TContract['$type']['response']>;
  /**
   * @description Zustand store for the form derived from this endpoint's request schema.
   * @remarks Pass directly to `FieldFactory` for automatic field binding and per-field validation.
   * @see {@link FormState}
   */
  readonly $form: UseBoundStore<StoreApi<FormState<RequestShapeOf<TContract>>>>;
  /**
   * @description Zustand hook that subscribes to this endpoint's {@link RequestState}.
   * @remarks Causes the component to re-render whenever `data`, `error`, or `isFetching` changes.
   */
  readonly $use: UseBoundStore<StoreApi<RequestState<TContract['$type']['response']>>>;
  /**
   * @description Resets the request state to initial values (`data: null`, `error: null`, `isFetching: false`).
   * @remarks Call in a `useEffect` on mount to avoid stale redirects or stale error messages.
   */
  readonly $reset: () => void;
  /** @description Non-reactive snapshot of `isFetching`. Prefer `$use()` inside React components. */
  readonly isFetching: boolean;
  /** @description Non-reactive snapshot of the last error. Prefer `$use()` inside React components. */
  readonly lastError: Error | null;
  /** @description Non-reactive snapshot of the last response data. Prefer `$use()` inside React components. */
  readonly lastData: TContract['$type']['response'] | null;
};
//#endregion
//#region HTTP_HELPERS
/**
 * @public
 * @summary Resolved configuration forwarded from {@link SDKConfig} to each individual endpoint builder.
 * @remarks All fields are required here — defaults are applied by `createSDK` before passing this down.
 */
export type EndpointExecutorConfig = {
  /** @description Base URL prepended to every endpoint path. */
  baseURL: string;
  /** @description Credential forwarding mode for `fetch`. */
  credentials: 'include' | 'same-origin' | 'omit';
  /** @description When per-field form validation runs. */
  formMode: ValidationTrigger;
};
/**
 * @internal
 * @summary Serializes a flat object into a URL-encoded query string, skipping null/undefined values.
 * @param params - Key-value pairs to encode.
 * @returns A query string without the leading `?`, or `''` if there are no encodable values.
 */
function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) searchParams.append(key, String(value));
  }
  return searchParams.toString();
}
/**
 * @internal
 * @summary Returns `true` for HTTP verbs that carry parameters in the URL rather than a request body.
 * @param verb - Any string; narrowed to `'GET' | 'DELETE'` when `true`.
 */
function isBodylessVerb(verb: string): verb is 'GET' | 'DELETE' {
  return verb === 'GET' || verb === 'DELETE';
}
//#endregion
//#region ENDPOINT_BUILDER
/**
 * @public
 * @summary Builds a fully typed, reactive {@link CallableEndpoint} from a contract and executor config.
 * @remarks
 * Called once per contract inside {@link createSDK}. Each endpoint gets its own isolated
 * {@link RequestState} store and {@link FormState} store derived from the contract's schemas.
 * @param contract - The {@link AnyContract} describing this endpoint.
 * @param config   - The {@link EndpointExecutorConfig} for this SDK instance.
 * @returns A {@link CallableEndpoint} with form store, request store, and HTTP execution wired together.
 */
export function buildEndpoint<TContract extends AnyContract>(
  contract: TContract,
  config: EndpointExecutorConfig,
): CallableEndpoint<TContract> {
  type TResponse = TContract['$type']['response'];
  const requestStateStore = create<RequestState<TResponse>>(() => ({
    isFetching: false,
    error: null,
    data: null,
  }));
  const formStateStore = createFormStore(
    contract.__requestSchema as z.ZodObject<RequestShapeOf<TContract>>,
    config.formMode,
  );
  async function executeRequest(input: TContract['$type']['request']): Promise<TResponse> {
    requestStateStore.setState({ isFetching: true, error: null });
    try {
      const parsedInput = contract.__requestSchema.parse(input) as Record<string, unknown>;
      let targetUrl = config.baseURL + contract.__path;
      const fetchOptions: RequestInit = {
        method: contract.__verb,
        credentials: config.credentials,
        headers: { 'content-type': 'application/json' },
      };
      if (isBodylessVerb(contract.__verb)) {
        const qs = buildQueryString(parsedInput);
        if (qs) targetUrl = `${targetUrl}?${qs}`;
      } else {
        fetchOptions.body = JSON.stringify(parsedInput);
      }
      const httpResponse = await fetch(targetUrl, fetchOptions);
      if (httpResponse.status === 204) {
        const emptyResult = undefined as unknown as TResponse;
        requestStateStore.setState({ data: emptyResult });
        return emptyResult;
      }
      const rawJson: unknown = await httpResponse.json();
      const parsedResponse = contract.__fullResponseSchema.parse(rawJson) as TResponse;
      requestStateStore.setState({ data: parsedResponse });
      return parsedResponse;
    } catch (thrown) {
      const error = thrown instanceof Error ? thrown : new Error('Unexpected API error');
      requestStateStore.setState({ error });
      throw error;
    } finally {
      requestStateStore.setState({ isFetching: false });
    }
  }
  const resetRequestState = (): void =>
    requestStateStore.setState({ data: null, error: null, isFetching: false });
  return Object.assign(executeRequest, {
    $form: formStateStore,
    $use: requestStateStore,
    $reset: resetRequestState,
    get isFetching() {
      return requestStateStore.getState().isFetching;
    },
    get lastError() {
      return requestStateStore.getState().error;
    },
    get lastData() {
      return requestStateStore.getState().data;
    },
  }) as unknown as CallableEndpoint<TContract>;
}
//#endregion
