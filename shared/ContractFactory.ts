import { z } from 'zod';
import { type ErrorCode, createPublicErrorSchema } from '@tools/ErrorTools';

/* ============================================================
   PRIMITIVES
============================================================ */

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type AccessLevel = 'public' | 'auth' | 'role' | 'internal';
type Segment = Lowercase<string>;

export type EndpointPattern = `/${Segment}/${Segment}`;

type ExtractModule<E extends EndpointPattern> = E extends `/${infer M}/${string}` ? M : never;
type ExtractAction<E extends EndpointPattern> = E extends `/${string}/${infer A}` ? A : never;

type InferInput<T extends z.ZodTypeAny> = z.input<T>;
type InferOutput<T extends z.ZodTypeAny> = z.output<T>;

/* ============================================================
   PUBLIC ERROR  — typed directly from exported ErrorCode,
   no generic chain that could collapse to any.
============================================================ */

export type PublicError = {
  error: {
    code: ErrorCode;
    params?: string[];
  };
};

/* ============================================================
   RESPONSE ENVELOPE
   Discriminated by key presence — no `ok` flag.
     { data: T }                → success
     { error: { code, params? } } → failure
============================================================ */

export type ApiSuccess<T> = { data: T };
export type ApiFailure = PublicError;
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

/* Type guards for consumers */
export function isApiSuccess<T>(r: ApiResponse<T>): r is ApiSuccess<T> {
  return 'data' in r;
}
export function isApiFailure<T>(r: ApiResponse<T>): r is ApiFailure {
  return 'error' in r;
}

/* ============================================================
   CONTRACT PHANTOM HELPER
============================================================ */

export type ContractTypes<I extends z.ZodTypeAny, O extends z.ZodTypeAny> = Readonly<{
  request: InferInput<I>;
  response: ApiResponse<InferOutput<O>>;
  success: InferOutput<O>; // just the data, unwrapped
  error: PublicError['error']; // { code, params? }
}>;

/* ============================================================
   CONTRACT
============================================================ */

export type Contract<
  A extends AccessLevel,
  M extends HttpMethod,
  E extends EndpointPattern,
  S extends string,
  D extends string,
  I extends z.ZodTypeAny,
  O extends z.ZodTypeAny,
> = Readonly<{
  __id: `${M} ${E}`;
  __access: A;
  __method: M;
  __endpoint: E;
  __module: ExtractModule<E>;
  __action: ExtractAction<E>;
  __summary: S;
  __description: D;
  __deprecated: boolean;

  __requestSchema: I;
  __outputSchema: O; // success-only schema, for type inference
  __fullResponseSchema: z.ZodTypeAny; // union schema used at runtime for parsing

  /* phantom */
  __request: InferInput<I>;
  __response: ApiResponse<InferOutput<O>>;
  $type: ContractTypes<I, O>;
}>;

export type ContractAny = Contract<
  AccessLevel,
  HttpMethod,
  EndpointPattern,
  string,
  string,
  z.ZodTypeAny,
  z.ZodTypeAny
>;

/* ============================================================
   TYPE HELPERS
============================================================ */

export type InferRequest<C extends ContractAny> = C['__request'];
export type InferResponse<C extends ContractAny> = C['__response'];
export type InferSuccess<C extends ContractAny> = C['$type']['success'];
export type InferError<C extends ContractAny> = C['$type']['error'];

/* ============================================================
   CONTRACT BUILDER
============================================================ */

const _errorSchema = createPublicErrorSchema();
const _successWrap = <T extends z.ZodTypeAny>(data: T) => z.object({ data }).strict();

export function createContract<
  A extends AccessLevel,
  M extends HttpMethod,
  E extends EndpointPattern,
>(access: A, method: M, endpoint: E) {
  type Mod = ExtractModule<E>;
  type Act = ExtractAction<E>;

  return {
    IO<I extends z.ZodTypeAny, O extends z.ZodTypeAny>(input: I, output: O) {
      // Full runtime schema — validates both success and error shapes.
      const fullResponseSchema = z.union([_successWrap(output), _errorSchema]);

      let _deprecated = false;

      return {
        doc<S extends string, D extends string>(summary: S, description: D) {
          const builder = {
            deprecated() {
              _deprecated = true;
              return builder;
            },

            build(): Contract<A, M, E, S, D, I, O> {
              const contract = {
                __id: `${method} ${endpoint}` as `${M} ${E}`,
                __access: access,
                __method: method,
                __endpoint: endpoint,
                __module: endpoint.slice(1, endpoint.indexOf('/', 1)) as Mod,
                __action: endpoint.slice(endpoint.indexOf('/', 1) + 1) as Act,
                __summary: summary,
                __description: description,
                __deprecated: _deprecated,

                __requestSchema: input,
                __outputSchema: output,
                __fullResponseSchema: fullResponseSchema,

                /* phantom — never read at runtime */
                __request: undefined as unknown as InferInput<I>,
                __response: undefined as unknown as ApiResponse<InferOutput<O>>,
                $type: undefined as unknown as ContractTypes<I, O>,
              } satisfies Contract<A, M, E, S, D, I, O>;

              return Object.freeze(contract);
            },
          };

          return builder;
        },
      };
    },
  };
}

/* ============================================================
   CONTRACT COLLECTION
============================================================ */

export function defineContracts<const T extends readonly ContractAny[]>(...contracts: T): T {
  return Object.freeze(contracts) as T;
}

/* ============================================================
   TYPE GUARD
============================================================ */

export function isContract(value: unknown): value is ContractAny {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return '__endpoint' in v && '__method' in v;
}
