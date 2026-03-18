import { z } from 'zod';
import { type ErrorCode, createPublicErrorSchema } from './ErrorCodes';
//#region RESPONSE_TYPES
/**
 * @public
 * @summary A structured error payload returned by the backend on failure.
 * @openapi
 * ```yaml
 * PublicError:
 *   type: object
 *   required: [error]
 *   properties:
 *     error:
 *       type: object
 *       required: [code]
 *       properties:
 *         code: { type: string }
 *         params: { type: array, items: { type: string } }
 * ```
 */
export type PublicError = {
  error: {
    /** @description Machine-readable error code defined in {@link ErrorCode}. */
    code: ErrorCode;
    /** @description Optional field names or context values related to the error. */
    params?: string[];
  };
};
/**
 * @public
 * @summary Wraps a successful response payload.
 * @template TData The success data type.
 * @openapi Maps to a `{ data: TData }` response schema.
 */
export type ApiSuccess<TData> = { data: TData };
/**
 * @public
 * @summary A failed API response containing a {@link PublicError}.
 * @openapi Maps to a `{ error: { code, params? } }` response schema.
 */
export type ApiFailure = PublicError;
/**
 * @public
 * @summary Discriminated union of all possible API responses.
 * @remarks Discriminated by key presence: `'data'` = success, `'error'` = failure. No `ok` flag.
 * @template TData The success data type.
 * @see {@link isSuccessResponse}
 * @see {@link isFailureResponse}
 */
export type ApiResponse<TData> = ApiSuccess<TData> | ApiFailure;
/**
 * @public
 * @summary Narrows an {@link ApiResponse} to the {@link ApiSuccess} variant.
 * @param response - The API response to test.
 * @returns `true` when `response.data` is present.
 * @example
 * ```ts
 * const result = await sdk.iam.login(values);
 * if (isSuccessResponse(result)) console.log(result.data);
 * ```
 */
export function isSuccessResponse<TData>(
  response: ApiResponse<TData>,
): response is ApiSuccess<TData> {
  return 'data' in response;
}
/**
 * @public
 * @summary Narrows an {@link ApiResponse} to the {@link ApiFailure} variant.
 * @param response - The API response to test.
 * @returns `true` when `response.error` is present.
 */
export function isFailureResponse<TData>(response: ApiResponse<TData>): response is ApiFailure {
  return 'error' in response;
}
//#endregion
//#region PRIMITIVE_TYPES
/**
 * @public
 * @summary Supported HTTP verbs.
 * @openapi Maps to OpenAPI `PathItem` operation keys.
 */
export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
/**
 * @public
 * @summary Access level required to call an endpoint.
 * @remarks Used internally for authorization middleware — not validated client-side.
 */
export type AccessLevel = 'public' | 'auth' | 'role' | 'internal';
/**
 * @public
 * @summary A two-segment lowercase path identifying a module and an action.
 * @example `'/iam/login'`, `'/users/create'`
 * @openapi Maps to OpenAPI path keys under `paths`.
 */
export type EndpointPath = `/${Lowercase<string>}/${Lowercase<string>}`;
/** @internal Extracts the module name (first segment) from an {@link EndpointPath}. */
type ModuleSegmentOf<TPath extends EndpointPath> = TPath extends `/${infer M}/${string}`
  ? M
  : never;
/** @internal Extracts the action name (second segment) from an {@link EndpointPath}. */
type ActionSegmentOf<TPath extends EndpointPath> = TPath extends `/${string}/${infer A}`
  ? A
  : never;
//#endregion
//#region CONTRACT_TYPES
/**
 * @public
 * @summary Phantom type bundle for an endpoint contract — groups all inferred shapes in one place.
 * @remarks This type is never instantiated at runtime. Access it via `Contract['$type']`.
 * @template TInputSchema  - Zod schema for the request input.
 * @template TOutputSchema - Zod schema for the success output.
 */
export type ContractPhantomTypes<
  TInputSchema extends z.ZodTypeAny,
  TOutputSchema extends z.ZodTypeAny,
> = Readonly<{
  /** @description Inferred raw request input type (before Zod transforms). */
  request: z.input<TInputSchema>;
  /** @description Full response union (success or failure). */
  response: ApiResponse<z.output<TOutputSchema>>;
  /** @description Unwrapped success data type. */
  success: z.output<TOutputSchema>;
  /** @description Failure error shape `{ code, params? }`. */
  error: PublicError['error'];
}>;
/**
 * @public
 * @summary A fully typed, immutable endpoint contract.
 * @remarks
 * All `__` prefixed fields are metadata used internally by the SDK. `$type` is a phantom bundle —
 * it is never read or written at runtime.
 * @template TAccess       - Access level required.
 * @template TVerb         - HTTP verb.
 * @template TPath         - Endpoint path pattern.
 * @template TSummary      - One-line summary string literal.
 * @template TDescription  - Full description string literal.
 * @template TInputSchema  - Zod schema for the request.
 * @template TOutputSchema - Zod schema for the success response.
 */
export type Contract<
  TAccess extends AccessLevel,
  TVerb extends HttpVerb,
  TPath extends EndpointPath,
  TSummary extends string,
  TDescription extends string,
  TInputSchema extends z.ZodTypeAny,
  TOutputSchema extends z.ZodTypeAny,
> = Readonly<{
  /** @internal Unique string key: `"{VERB} {PATH}"`. */
  __id: `${TVerb} ${TPath}`;
  /** @internal Access level guard for middleware. */
  __access: TAccess;
  /** @internal HTTP verb used when executing this endpoint. */
  __verb: TVerb;
  /** @internal Full path, e.g. `'/iam/login'`. */
  __path: TPath;
  /** @internal Module name extracted from the first path segment. */
  __module: ModuleSegmentOf<TPath>;
  /** @internal Action name extracted from the second path segment. */
  __action: ActionSegmentOf<TPath>;
  /** @internal One-line summary for documentation. @openapi maps to `summary`. */
  __summary: TSummary;
  /** @internal Full description for documentation. @openapi maps to `description`. */
  __description: TDescription;
  /** @internal Deprecation flag. @openapi maps to `deprecated`. */
  __deprecated: boolean;
  /** @internal Zod schema used to validate and parse the request input. */
  __requestSchema: TInputSchema;
  /** @internal Zod schema for the success-only output. */
  __outputSchema: TOutputSchema;
  /** @internal Full union schema (success | error) used for runtime response parsing. */
  __fullResponseSchema: z.ZodTypeAny;
  /** @internal Phantom — inferred raw request input type. Never accessed at runtime. */
  __phantomRequest: z.input<TInputSchema>;
  /** @internal Phantom — inferred full response type. Never accessed at runtime. */
  __phantomResponse: ApiResponse<z.output<TOutputSchema>>;
  /**
   * @description Phantom type bundle. Access inferred types without runtime cost.
   * @example `type Req = typeof LoginContract['$type']['request']`
   */
  $type: ContractPhantomTypes<TInputSchema, TOutputSchema>;
}>;
/**
 * @public
 * @summary Widened {@link Contract} for use in generic collections and mapped types.
 */
export type AnyContract = Contract<
  AccessLevel,
  HttpVerb,
  EndpointPath,
  string,
  string,
  z.ZodTypeAny,
  z.ZodTypeAny
>;
/**
 * @public
 * @summary Extracts the raw request input type from a contract.
 * @template TContract - Target contract.
 */
export type InferRequest<TContract extends AnyContract> = TContract['__phantomRequest'];
/**
 * @public
 * @summary Extracts the full response union type from a contract.
 * @template TContract - Target contract.
 */
export type InferResponse<TContract extends AnyContract> = TContract['__phantomResponse'];
/**
 * @public
 * @summary Extracts the unwrapped success data type from a contract.
 * @template TContract - Target contract.
 */
export type InferSuccess<TContract extends AnyContract> = TContract['$type']['success'];
/**
 * @public
 * @summary Extracts the error shape `{ code, params? }` from a contract.
 * @template TContract - Target contract.
 */
export type InferError<TContract extends AnyContract> = TContract['$type']['error'];
//#endregion
//#region INTERNAL_CONSTANTS
/** @internal Shared error response schema — built once and reused across all contracts. */
const sharedErrorSchema = createPublicErrorSchema();
/** @internal Wraps an output schema in `{ data: T }` (strict — no extra keys allowed). */
const wrapOutputAsSuccess = <TOutput extends z.ZodTypeAny>(outputSchema: TOutput) =>
  z.object({ data: outputSchema }).strict();
//#endregion
//#region CONTRACT_BUILDER
/**
 * @public
 * @summary Starts a fluent builder chain for a new endpoint contract.
 * @remarks
 * Chain `.IO(inputSchema, outputSchema)` → `.doc(summary, description)` → `.build()`.
 * @param access - The {@link AccessLevel} required to call this endpoint.
 * @param verb   - The {@link HttpVerb} for this endpoint.
 * @param path   - The two-segment {@link EndpointPath} (e.g. `'/iam/login'`).
 * @returns A builder object with `.IO()` as the next required step.
 * @example
 * ```ts
 * export const LoginContract = defineEndpoint('public', 'POST', '/iam/login')
 *   .IO(LoginInputSchema, z.void())
 *   .doc('Login', 'Authenticates a user and starts a session.')
 *   .build();
 * ```
 * @openapi
 * `path`, `verb`, `summary`, and `description` map directly to OpenAPI Operation Object fields.
 */
export function defineEndpoint<
  TAccess extends AccessLevel,
  TVerb extends HttpVerb,
  TPath extends EndpointPath,
>(access: TAccess, verb: TVerb, path: TPath) {
  return {
    /**
     * @summary Attaches input and output Zod schemas to this endpoint.
     * @param inputSchema  - Validates and types the request payload.
     * @param outputSchema - Types the success response data.
     */
    IO<TInputSchema extends z.ZodTypeAny, TOutputSchema extends z.ZodTypeAny>(
      inputSchema: TInputSchema,
      outputSchema: TOutputSchema,
    ) {
      const fullResponseSchema = z.union([wrapOutputAsSuccess(outputSchema), sharedErrorSchema]);
      let isDeprecated = false;
      return {
        /**
         * @summary Attaches human-readable documentation to this endpoint.
         * @param summary     - A one-line summary. @openapi maps to `summary`.
         * @param description - A longer description. @openapi maps to `description`.
         */
        doc<TSummary extends string, TDescription extends string>(
          summary: TSummary,
          description: TDescription,
        ) {
          const builder = {
            /**
             * @summary Marks this endpoint as deprecated.
             * @openapi Sets `deprecated: true` in the OpenAPI Operation Object.
             * @returns The same builder for chaining.
             */
            deprecated() {
              isDeprecated = true;
              return builder;
            },
            /**
             * @summary Finalizes and freezes the endpoint contract.
             * @returns A frozen {@link Contract} ready for use with {@link collectContracts} and {@link createSDK}.
             */
            build(): Contract<
              TAccess,
              TVerb,
              TPath,
              TSummary,
              TDescription,
              TInputSchema,
              TOutputSchema
            > {
              const separatorIndex = path.indexOf('/', 1);
              return Object.freeze({
                __id: `${verb} ${path}` as `${TVerb} ${TPath}`,
                __access: access,
                __verb: verb,
                __path: path,
                __module: path.slice(1, separatorIndex) as ModuleSegmentOf<TPath>,
                __action: path.slice(separatorIndex + 1) as ActionSegmentOf<TPath>,
                __summary: summary,
                __description: description,
                __deprecated: isDeprecated,
                __requestSchema: inputSchema,
                __outputSchema: outputSchema,
                __fullResponseSchema: fullResponseSchema,
                // Phantom fields — never read at runtime; exist solely for type inference
                __phantomRequest: undefined as unknown as z.input<TInputSchema>,
                __phantomResponse: undefined as unknown as ApiResponse<z.output<TOutputSchema>>,
                $type: undefined as unknown as ContractPhantomTypes<TInputSchema, TOutputSchema>,
              }) as Contract<
                TAccess,
                TVerb,
                TPath,
                TSummary,
                TDescription,
                TInputSchema,
                TOutputSchema
              >;
            },
          };
          return builder;
        },
      };
    },
  };
}
/**
 * @public
 * @summary Collects multiple contracts into a frozen, const-inferred tuple.
 * @remarks Pass the result directly to {@link createSDK}.
 * @param contracts - One or more {@link AnyContract} values produced by {@link defineEndpoint}.
 * @returns A frozen, const-typed tuple of contracts.
 * @example
 * ```ts
 * export const contracts = collectContracts(LoginContract, RegisterContract);
 * ```
 */
type Flatten<T> = T extends readonly (infer U)[]
  ? U extends readonly any[]
    ? Flatten<U>
    : U
  : never;

export function collectContracts<
  const TCollection extends readonly (AnyContract | readonly AnyContract[])[],
>(...items: TCollection) {
  const flattened = items.flatMap((item) => (Array.isArray(item) ? item : [item]));

  return Object.freeze(flattened) as readonly Flatten<TCollection>[];
}
/**
 * @public
 * @summary Runtime type guard — returns `true` if `value` is an {@link AnyContract}.
 * @param value - Any value to inspect.
 * @returns `true` when `value` has both `__path` and `__verb` fields.
 */
export function isContract(value: unknown): value is AnyContract {
  if (typeof value !== 'object' || value === null) return false;
  return '__path' in value && '__verb' in value;
}
//#endregion
