/**
 * @file Contracts.ts
 * @module SDK
 * @description Define el sistema de contratos tipados compartidos entre frontend y backend.
 *
 * @tfi
 * section: IEEE 830 11 / 12.1
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: schemas Zod, verbos HTTP y metadata de endpoints
 * outputs: contratos tipados, inferencias y builders de endpoints
 * rules: preservar tipos literales; compartir contratos via SDK; validar envelopes consistentes
 *
 * @technical
 * dependencies: zod, ./ErrorCodes
 * flow: define tipos base; arma schemas de respuesta; colecta contratos; construye endpoints inmutables
 *
 * @estimation
 * complexity: High
 * fpa: EIF
 * story_points: 5
 * estimated_hours: 4
 *
 * @testing
 * cases: TC-CONTRACT-01
 *
 * @notes
 * decisions: se usan builders funcionales y overloads tipados sin clases ni function keyword
 */
/**
 * @file Contracts.ts
 * @author Victor
 * @description Automatically enforced JSDoc header according to context.md guidelines.
 * @param null
 * @returns null
 * @example null
 * @remarks This file is part of the QART monorepo architecture.
 *
 * Metrics:
 * - LOC: 50
 * - Experience Level: Junior
 * - Estimated Time: 30m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */
import * as z from 'zod';
import { createPublicErrorSchema } from './ErrorCodes';
import type { PublicErrorEnvelope } from './ErrorCodes';

//#region PRIMITIVE_TYPES
/** @public Supported HTTP verbs. */
export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** @public Access level required to call an endpoint. */
export type AccessLevel = 'public' | 'auth' | 'role' | 'internal';

/**
 * @public Two-segment lowercase path.
 * @example `'/iam/login'`, `'/users/create'`
 */
export type EndpointPath = `/${Lowercase<string>}/${Lowercase<string>}`;

/** @public Unique contract identifier — verb + space + path. */
export type ContractId = `${HttpVerb} ${EndpointPath}`;

/** @internal Extracts the HTTP verb from a {@link ContractId} as a literal type. */
type VerbOf<TId extends ContractId> = TId extends `${infer V} ${EndpointPath}`
  ? V extends HttpVerb
    ? V
    : never
  : never;

/** @internal Extracts the URL path from a {@link ContractId} as a literal type. */
type PathOf<TId extends ContractId> = TId extends `${HttpVerb} ${infer P}`
  ? P extends EndpointPath
    ? P
    : never
  : never;
//#endregion

//#region RESPONSE_TYPES
/** @public Wraps a successful response payload. */
export type ApiSuccess<TData> = { data: TData };

/** @public A failed API response (error envelope). */
export type ApiFailure = PublicErrorEnvelope;

/**
 * @public Discriminated union of all possible API responses.
 * @remarks Key presence: `'data'` = success, `'error'` = failure.
 */
export type ApiResponse<TData> = ApiSuccess<TData> | ApiFailure;

/** @public Narrows an {@link ApiResponse} to the success variant. */
export const isSuccessResponse = <TData>(
  response: ApiResponse<TData>,
): response is ApiSuccess<TData> => 'data' in response;

/** @public Narrows an {@link ApiResponse} to the failure variant. */
export const isFailureResponse = <TData>(response: ApiResponse<TData>): response is ApiFailure =>
  'error' in response;
//#endregion

//#region CONTRACT_TYPES
/**
 * @public
 * @summary Phantom type bundle — all inferred shapes grouped in one place.
 * @remarks Never instantiated at runtime — access via `Contract['$type']`.
 */
export type ContractPhantomTypes<TIn extends z.ZodType, TOut extends z.ZodType> = Readonly<{
  request: z.input<TIn>;
  response: ApiResponse<z.output<TOut>>;
  success: z.output<TOut>;
  /**
   * Failure error shape.
   * When TIn is a ZodObject, `params` is typed as the union of its field names.
   */
  error: PublicErrorEnvelope<TIn>['error'];
}>;

/**
 * @public
 * @summary A fully typed, immutable endpoint contract.
 * @remarks
 * All 7 type parameters are preserved as literals.
 * `__phantomRequest` and `__phantomResponse` live top-level (not in `$type`) so
 * `InferRequest<C>` / `InferSuccess<C>` resolve correctly through union members.
 */
export type Contract<
  TId extends ContractId,
  TAccess extends AccessLevel,
  TDeprecated extends boolean,
  TSummary extends string,
  TDescription extends string,
  TIn extends z.ZodType,
  TOut extends z.ZodType,
> = Readonly<{
  __id: TId;
  __verb: VerbOf<TId>;
  __path: PathOf<TId>;
  __access: TAccess;
  __deprecated: TDeprecated;
  __doc: Readonly<{ summary: TSummary; description: TDescription }>;
  __requestSchema: TIn;
  __responseSchema: TOut;
  readonly __phantomRequest: z.input<TIn>;
  readonly __phantomResponse: ApiResponse<z.output<TOut>>;
  $type: ContractPhantomTypes<TIn, TOut>;
}>;

/** @public Widened {@link Contract} used in generic collections and mapped types. */
export type AnyContract = Contract<
  ContractId,
  AccessLevel,
  boolean,
  string,
  string,
  z.ZodType,
  z.ZodType
>;
//#endregion

//#region INFERENCE_HELPERS
/** @public Raw request input type for a contract. */
export type InferRequest<C extends AnyContract> = C['__phantomRequest'];

/** @public Full response union type for a contract. */
export type InferResponse<C extends AnyContract> = C['__phantomResponse'];

/** @public Unwrapped success data type for a contract. */
export type InferSuccess<C extends AnyContract> = C['$type']['success'];

/** @public Error shape `{ code, params? }` for a contract. */
export type InferError<C extends AnyContract> = C['$type']['error'];
//#endregion

//#region RUNTIME_SCHEMA_STORAGE
const FULL_SCHEMA: unique symbol = Symbol('fullResponseSchema');

type ContractWithSchema = AnyContract & { readonly [FULL_SCHEMA]: z.ZodType };

/** @internal Retrieves the hidden full response schema. Used by ApiClient/ApiServer only. */
export const getFullResponseSchema = (contract: AnyContract): z.ZodType =>
  (contract as ContractWithSchema)[FULL_SCHEMA];
//#endregion

//#region COLLECT_CONTRACTS
// ─────────────────────────────────────────────────────────────
//  Three overloads covering every usage pattern:
//
//  1. Single tuple:      collectContracts([A, B, C] as const)
//  2. Spread contracts:  collectContracts(A, B, C)
//  3. Spread modules:    collectContracts(IAMContracts, StaffContracts)
//                        where each arg is a readonly AnyContract[]
//
//  Overload 3 uses the Flatten<T> type to merge N module tuples into
//  a single flat readonly tuple — preserving all literal types.
//
//  TypeScript resolves the correct overload because AnyContract has
//  __id / __verb / __path (it's an object with those keys), while a
//  readonly AnyContract[] does not — so the two cases are distinguishable.
// ─────────────────────────────────────────────────────────────

/**
 * @internal
 * Recursively flattens a tuple of readonly contract arrays into a single flat tuple.
 * @example
 *   Flatten<[readonly [A, B], readonly [C]]> = readonly [A, B, C]
 */
type Flatten<TArrays extends readonly (readonly AnyContract[])[]> = TArrays extends readonly [
  infer Head,
  ...infer Tail,
]
  ? Head extends readonly AnyContract[]
    ? Tail extends readonly (readonly AnyContract[])[]
      ? readonly [...Head, ...Flatten<Tail>]
      : readonly [...Head]
    : never
  : readonly [];

/**
 * @public
 * @summary Collects contracts into a frozen, const-inferred readonly tuple.
 * @remarks
 * Three usage patterns — all preserve exact literal types:
 *
 * ```ts
 * // 1. Single const tuple
 * const arr = [LoginContract, RegisterContract] as const;
 * export const contracts = collectContracts(arr);
 *
 * // 2. Spread of individual contracts
 * export const contracts = collectContracts(LoginContract, RegisterContract);
 *
 * // 3. Spread of module arrays (most ergonomic for large APIs)
 * export const contracts = collectContracts(IAMContract, STAFFContract);
 * //           ^^ each is a `readonly AnyContract[]` exported from its module file
 * ```
 *
 * ⚠️ Never annotate the receiving variable — a type annotation widens to
 * `AnyContract[]` and destroys all literal type information downstream.
 */
// Overload 1 — single const tuple
type CollectContracts = {
  <const TTuple extends readonly AnyContract[]>(tuple: TTuple): TTuple;
  <const TItems extends readonly AnyContract[]>(...items: TItems): TItems;
  <const TArrays extends readonly (readonly AnyContract[])[]>(...arrays: TArrays): Flatten<TArrays>;
};

export const collectContracts = ((
  ...args: AnyContract[] | [readonly AnyContract[]] | (readonly AnyContract[])[]
): readonly AnyContract[] => {
  // Overload 1: single array argument
  if (args.length === 1 && Array.isArray(args[0])) {
    return Object.freeze(args[0]);
  }
  // Overload 3: all arguments are arrays (module groups)
  if (args.every(Array.isArray)) {
    return Object.freeze((args as (readonly AnyContract[])[]).flat());
  }
  // Overload 2: spread of individual contracts
  return Object.freeze(args as AnyContract[]);
}) as CollectContracts;
//#endregion

//#region RUNTIME_GUARD
/** @public Returns `true` when `value` is an {@link AnyContract}. */
export const isContract = (value: unknown): value is AnyContract => {
  return (
    typeof value === 'object' &&
    value !== null &&
    '__id' in value &&
    '__verb' in value &&
    '__path' in value
  );
};
//#endregion

//#region CONTRACT_BUILDER
const errorSchema = createPublicErrorSchema();

type SuccessWrapper<TOut extends z.ZodType> = z.ZodObject<{ data: TOut }>;

const wrapAsSuccess = <TOut extends z.ZodType>(output: TOut): SuccessWrapper<TOut> =>
  z.object({ data: output }).strict() as SuccessWrapper<TOut>;

type DocBuilder<
  TId extends ContractId,
  TAccess extends AccessLevel,
  TDeprecated extends boolean,
  TSummary extends string,
  TDescription extends string,
  TIn extends z.ZodType,
  TOut extends z.ZodType,
> = {
  deprecated(): DocBuilder<TId, TAccess, true, TSummary, TDescription, TIn, TOut>;
  build(): Contract<TId, TAccess, TDeprecated, TSummary, TDescription, TIn, TOut>;
};

type IOBuilder<
  TId extends ContractId,
  TAccess extends AccessLevel,
  TIn extends z.ZodType,
  TOut extends z.ZodType,
> = {
  doc<const TSummary extends string, const TDescription extends string>(
    summary: TSummary,
    description: TDescription,
  ): DocBuilder<TId, TAccess, false, TSummary, TDescription, TIn, TOut>;
};

type EndpointBuilder<TId extends ContractId, TAccess extends AccessLevel> = {
  IO<TIn extends z.ZodType, TOut extends z.ZodType>(
    input: TIn,
    output: TOut,
  ): IOBuilder<TId, TAccess, TIn, TOut>;
};

/**
 * @public
 * @summary Starts a fluent builder chain for a new endpoint contract.
 * @example
 * ```ts
 * export const LoginContract = defineEndpoint('public', 'POST /iam/login')
 *   .IO(LoginInputSchema, LoginSuccessSchema)
 *   .doc('Session initializer', 'Authenticates a user and starts a session.')
 *   .build();
 * ```
 */
export const defineEndpoint = <const TAccess extends AccessLevel, const TId extends ContractId>(
  access: TAccess,
  id: TId,
): EndpointBuilder<TId, TAccess> => {
  const spaceIndex = id.indexOf(' ');
  const verb = id.slice(0, spaceIndex) as VerbOf<TId>;
  const path = id.slice(spaceIndex + 1) as PathOf<TId>;

  return {
    IO<TIn extends z.ZodType, TOut extends z.ZodType>(
      inputSchema: TIn,
      outputSchema: TOut,
    ): IOBuilder<TId, TAccess, TIn, TOut> {
      const fullSchema = z.union([wrapAsSuccess(outputSchema), errorSchema]);

      return {
        doc<const TSummary extends string, const TDescription extends string>(
          summary: TSummary,
          description: TDescription,
        ): DocBuilder<TId, TAccess, false, TSummary, TDescription, TIn, TOut> {
          let isDeprecated = false;

          const makeBuilder = <const TDep extends boolean>(
            _dep: TDep,
          ): DocBuilder<TId, TAccess, TDep, TSummary, TDescription, TIn, TOut> => ({
            deprecated() {
              isDeprecated = true;
              return makeBuilder<true>(true);
            },
            build(): Contract<TId, TAccess, TDep, TSummary, TDescription, TIn, TOut> {
              const contractShape = {
                __id: id,
                __verb: verb,
                __path: path,
                __access: access,
                __deprecated: (isDeprecated ? true : false) as TDep,
                __doc: Object.freeze({ summary, description }) as Readonly<{
                  summary: TSummary;
                  description: TDescription;
                }>,
                __requestSchema: inputSchema,
                __responseSchema: outputSchema,
                __phantomRequest: undefined as unknown as z.input<TIn>,
                __phantomResponse: undefined as unknown as ApiResponse<z.output<TOut>>,
                $type: undefined as unknown as ContractPhantomTypes<TIn, TOut>,
              } satisfies Contract<TId, TAccess, TDep, TSummary, TDescription, TIn, TOut>;

              Object.defineProperty(contractShape, FULL_SCHEMA, {
                value: fullSchema,
                writable: false,
                enumerable: false,
                configurable: false,
              });

              return Object.freeze(contractShape) as unknown as Contract<
                TId,
                TAccess,
                TDep,
                TSummary,
                TDescription,
                TIn,
                TOut
              >;
            },
          });

          return makeBuilder<false>(false);
        },
      };
    },
  };
};
//#endregion
