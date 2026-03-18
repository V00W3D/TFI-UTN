import type { AnyContract } from './Contracts';
import { buildEndpoint } from './ApiClient';
import type { CallableEndpoint, EndpointExecutorConfig } from './ApiClient';
import type { ValidationTrigger } from './FormStore';
//#region CONFIGURATION
/**
 * @public
 * @summary Initialization configuration for {@link createSDK}.
 * @openapi
 * - `baseURL` maps to the OpenAPI `servers[].url` field.
 */
export type SDKConfig = Readonly<{
  /**
   * @description Base URL prepended to every endpoint path (e.g. `'https://api.example.com'`).
   * @openapi maps to `servers[].url`
   */
  baseURL: string;
  /**
   * @description Credential forwarding mode passed verbatim to the browser `fetch` API.
   * @defaultValue `'include'`
   */
  credentials?: 'include' | 'same-origin' | 'omit';
  /**
   * @description When field-level validation is triggered across all forms in this SDK instance.
   * @defaultValue `'onChange'`
   * @see {@link ValidationTrigger}
   */
  formMode?: ValidationTrigger;
}>;
//#endregion
//#region SDK_TYPES
/** @internal All module names present across a contract collection. */
type CollectionModules<TCollection extends readonly AnyContract[]> =
  TCollection[number]['__module'];
/** @internal All action names for a given module in a contract collection. */
type ModuleActions<
  TCollection extends readonly AnyContract[],
  TModule extends CollectionModules<TCollection>,
> = Extract<TCollection[number], { __module: TModule }>['__action'];
/** @internal Extracts the specific contract for a module + action pair. */
type ContractAt<
  TCollection extends readonly AnyContract[],
  TModule extends CollectionModules<TCollection>,
  TAction extends ModuleActions<TCollection, TModule>,
> = Extract<TCollection[number], { __module: TModule; __action: TAction }>;
/**
 * @public
 * @summary The fully typed SDK instance returned by {@link createSDK}.
 * @remarks
 * Organized as `sdk[module][action]`, each action is a {@link CallableEndpoint}.
 * The `$modules` and `$contracts` properties expose SDK metadata for introspection.
 * @template TCollection - The const-typed tuple of contracts passed to `createSDK`.
 * @example
 * ```ts
 * sdk.iam.login(values);
 * const { data, error, isFetching } = sdk.iam.register.$use();
 * const Field = FieldFactory(sdk.iam.login.$form)('email');
 * ```
 */
export type SDKInstance<TCollection extends readonly AnyContract[]> = Readonly<
  {
    readonly [TModule in CollectionModules<TCollection>]: Readonly<{
      readonly [TAction in ModuleActions<TCollection, TModule>]: CallableEndpoint<
        ContractAt<TCollection, TModule, TAction>
      >;
    }>;
  } & {
    /** @description All module names present in this SDK instance. */
    readonly $modules: ReadonlyArray<CollectionModules<TCollection>>;
    /** @description The original contracts tuple used to build this instance. */
    readonly $contracts: TCollection;
  }
>;
//#endregion
//#region SDK_BUILDER
/**
 * @public
 * @summary Creates a fully typed {@link SDKInstance} from a collection of endpoint contracts.
 * @remarks
 * Each contract produces one {@link CallableEndpoint} at `sdk[module][action]`.
 * Form state (`$form`) and request state (`$use`) are automatically derived from the contract's schemas —
 * no separate Zustand stores or API clients are needed.
 * Defaults are applied here: `credentials` → `'include'`, `formMode` → `'onChange'`.
 * @param contractCollection - A const-typed tuple of contracts (use {@link collectContracts} from `Contracts.ts`).
 * @param config             - The {@link SDKConfig} (baseURL, credentials, formMode).
 * @returns A frozen {@link SDKInstance} organized by module and action.
 * @example
 * ```ts
 * import { createSDK } from '@shared/SDKFactory';
 * import { collectContracts } from '@shared/Contracts';
 * import { LoginContract, RegisterContract } from '@shared/contracts';
 * export const sdk = createSDK(
 *   collectContracts(LoginContract, RegisterContract),
 *   { baseURL: BACKEND_URL, credentials: 'include' },
 * );
 * ```
 * @openapi
 * `config.baseURL` maps to `servers[].url` in the generated OpenAPI specification.
 */
export function createSDK<const TCollection extends readonly AnyContract[]>(
  contractCollection: TCollection,
  config: SDKConfig,
): SDKInstance<TCollection> {
  const endpointsByModule: Record<string, Record<string, CallableEndpoint<AnyContract>>> = {};
  const registeredModules: Array<CollectionModules<TCollection>> = [];
  // Set provides O(1) deduplication for module names
  const seenModules = new Set<CollectionModules<TCollection>>();
  const resolvedConfig: EndpointExecutorConfig = {
    baseURL: config.baseURL,
    credentials: config.credentials ?? 'include',
    formMode: config.formMode ?? 'onChange',
  };
  for (const contract of contractCollection) {
    const moduleName = contract.__module as CollectionModules<TCollection>;
    if (!seenModules.has(moduleName)) {
      seenModules.add(moduleName);
      registeredModules.push(moduleName);
    }
    if (!endpointsByModule[moduleName]) endpointsByModule[moduleName] = {};
    endpointsByModule[moduleName]![contract.__action] = buildEndpoint(contract, resolvedConfig);
  }
  return Object.freeze({
    ...endpointsByModule,
    $modules: Object.freeze(registeredModules) as ReadonlyArray<CollectionModules<TCollection>>,
    $contracts: contractCollection,
  }) as unknown as SDKInstance<TCollection>;
}
export * from './ErrorCodes';
export * from './MyFields';
//#endregion
