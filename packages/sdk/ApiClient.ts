/**
 * @file packages/sdk/ApiClient.ts
 * @description Factory de SDK solo para frontend. Usa fetch + zustand — sin deps de Node/express.
 * Nunca importar desde código backend. Usar ApiServer.ts para el backend.
 */

import { create } from 'zustand';
import type { UseBoundStore, StoreApi } from 'zustand';
import { z } from 'zod';
import type { AnyContract, InferError } from './Contracts';
import { getFullResponseSchema } from './Contracts';
import { createFormStore } from './FormStore';
import type { FormState, ValidationTrigger } from './FormStore';

//#region PUBLIC_TYPES
/**
 * @public
 * @summary Estado reactivo de una request en vuelo para un endpoint específico.
 * @remarks
 * `error` preserva el tipo exacto del envelope de error del contrato — incluyendo
 * el literal union de `code` y los `params` tipados como field names del schema.
 * `isFormValid` refleja el estado del store de formulario asociado — permite
 * deshabilitar el botón de submit sin suscribirse manualmente al `$form`.
 */
export type RequestState<TResponse, TError> = {
  isFetching: boolean;
  error: TError | null;
  data: TResponse | null;
  isFormValid: boolean;
};

/** @internal Extrae el Zod raw shape del schema de request de un contrato. */
export type RequestShapeOf<C extends AnyContract> =
  C['__requestSchema'] extends z.ZodObject<infer S> ? S : z.ZodRawShape;

/** @public Configuración de inicialización para {@link createClientApi}. */
export type ClientConfig = Readonly<{
  /** URL base antepuesta a cada path de request (ej. `'https://api.example.com'`). */
  baseURL: string;
  /** Modo de forwarding de credenciales para `fetch`. @defaultValue `'include'` */
  credentials?: 'include' | 'same-origin' | 'omit';
  /** Cuándo se dispara la validación por campo. @defaultValue `'onChange'` */
  formMode?: ValidationTrigger;
}>;

/** @internal Configuración resuelta con todos los defaults aplicados. */
type ResolvedClientConfig = Required<ClientConfig>;

/** @internal Firma callable de un {@link CallableEndpoint}. */
type CallableFn<C extends AnyContract> = (
  input: C['__phantomRequest'],
) => Promise<C['__phantomResponse']>;

/** @internal Propiedades no-función adjuntas a un {@link CallableEndpoint}. */
type CallableEndpointProps<C extends AnyContract> = {
  readonly $form: UseBoundStore<StoreApi<FormState<RequestShapeOf<C>>>>;
  readonly $use: UseBoundStore<StoreApi<RequestState<C['__phantomResponse'], InferError<C>>>>;
  readonly $reset: () => void;
  readonly isFetching: boolean;
  readonly lastError: InferError<C> | null;
  readonly lastData: C['__phantomResponse'] | null;
};

/**
 * @public
 * @summary Endpoint callable y reactivo.
 * @remarks
 * - **Llamarlo** — ejecuta el request HTTP.
 * - **`$form`** — pasar a `FormFactory` para binding de campos.
 * - **`$use`**  — `{ data, error, isFetching, isFormValid }` reactivos en componentes.
 *   `error` está completamente tipado con el envelope del contrato.
 *   `isFormValid` se sincroniza automáticamente con el store del formulario.
 * - **`$reset`** — limpia el estado stale al montar.
 * @example
 * ```ts
 * await sdk.iam.login(values);
 * const { data, error, isFetching, isFormValid } = sdk.iam.login.$use();
 * // error.code → 'INVALID_CREDENTIALS' | 'VALIDATION_ERROR' | ...
 * // error.params → ('identity' | 'password')[]
 * ```
 */
export type CallableEndpoint<C extends AnyContract> = CallableFn<C> & CallableEndpointProps<C>;

/** @internal Union de nombres de módulo como literales de string. */
type ModulesOf<TContracts extends readonly AnyContract[]> =
  TContracts[number]['__path'] extends `/${infer M}/${string}` ? M : never;

/** @internal Union de nombres de acción para un módulo dado. */
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

/** @internal Extrae el contrato exacto para un par módulo+acción. */
type ContractAt<
  TContracts extends readonly AnyContract[],
  TModule extends string,
  TAction extends string,
> = Extract<TContracts[number], { __path: `/${TModule}/${TAction}` }>;

/**
 * @public
 * @summary Instancia de SDK completamente tipada retornada por {@link createClientApi}.
 * @remarks Organizada como `sdk[módulo][acción]`, cada acción es un {@link CallableEndpoint}.
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
/** @internal Retorna `true` para verbos que pasan params en la URL en lugar del body. */
const isBodylessVerb = (verb: string): verb is 'GET' | 'DELETE' =>
  verb === 'GET' || verb === 'DELETE';

/** @internal Serializa un objeto plano a query string, saltando null/undefined. */
const buildQueryString = (params: Record<string, unknown>): string => {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) sp.append(key, String(value));
  }
  return sp.toString();
};

/**
 * @internal
 * Convierte `''` → `null` antes de enviar al backend.
 * El formulario siempre guarda `''` para evitar warnings de inputs controlados.
 * Las columnas nullable de Prisma reciben `null` — nunca `''`.
 */
const coerceEmptyStrings = (payload: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    result[key] = value === '' ? null : value;
  }
  return result;
};
//#endregion

//#region ENDPOINT_BUILDER
const buildEndpoint = <C extends AnyContract>(
  contract: C,
  config: ResolvedClientConfig,
): CallableEndpoint<C> => {
  type TResponse = C['__phantomResponse'];
  type TError = InferError<C>;

  const formStore =
    contract.__requestSchema instanceof z.ZodObject
      ? createFormStore(contract.__requestSchema as z.ZodObject<RequestShapeOf<C>>, config.formMode)
      : createFormStore(z.object({}) as z.ZodObject<RequestShapeOf<C>>, config.formMode);

  const requestStore = create<RequestState<TResponse, TError>>(() => ({
    isFetching: false,
    error: null,
    data: null,
    isFormValid: formStore.getState().isFormValid,
  }));

  // Sincroniza isFormValid del formStore → requestStore reactivamente
  formStore.subscribe((s) => {
    if (requestStore.getState().isFormValid !== s.isFormValid) {
      requestStore.setState({ isFormValid: s.isFormValid });
    }
  });

  const executeRequest = async (input: C['__phantomRequest']): Promise<TResponse> => {
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
      // Si la respuesta del servidor es un error envelope, preserva el tipo exacto
      const error = thrown instanceof Error ? thrown : new Error('Unexpected API error');
      requestStore.setState({ error: error as unknown as TError });
      throw error;
    } finally {
      requestStore.setState({ isFetching: false });
    }
  };

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
};
//#endregion

//#region CREATE_CLIENT_API
/**
 * @public
 * @summary Crea una instancia de SDK completamente tipada a partir de un conjunto de contratos.
 * @remarks Llamar una sola vez en `apps/frontend/src/sdk.ts`.
 * @example
 * ```ts
 * export const sdk = createClientApi(contracts, {
 *   baseURL: import.meta.env.VITE_API_URL,
 * });
 * ```
 */
export const createClientApi = <const TContracts extends readonly AnyContract[]>(
  contracts: TContracts,
  config: ClientConfig,
): ClientApiInstance<TContracts> => {
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
};
//#endregion
