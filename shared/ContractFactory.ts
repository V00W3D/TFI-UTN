import { z } from 'zod';
import { createPublicErrorSchema } from '@tools/ErrorTools';

/* ============================================================
BASE TYPES
============================================================ */

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type AccessLevel = 'public' | 'auth' | 'role' | 'internal';

type Segment = `${Lowercase<string>}`;

export type EndpointPattern = `/${Segment}/${Segment}`;

type ExtractModule<E extends EndpointPattern> = E extends `/${infer M}/${string}` ? M : never;

type ExtractAction<E extends EndpointPattern> = E extends `/${string}/${infer A}` ? A : never;

/* ============================================================
REQUEST / RESPONSE INFERENCE
============================================================ */

type InferInput<T extends z.ZodTypeAny> = z.input<T>;
type InferOutput<T extends z.ZodTypeAny> = z.output<T>;

/* ============================================================
STANDARD API RESPONSE (NEW)
============================================================ */

type ApiSuccess<T> = {
  ok: true;
  data: T;
};

type ApiError<E> = {
  ok: false;
  error: E;
};

export type ApiResponse<S, E> = ApiSuccess<S> | ApiError<E>;

/* ============================================================
CONTRACT TYPE HELPER
============================================================ */

type ContractTypeHelper<I extends z.ZodTypeAny, O extends z.ZodTypeAny> = Readonly<{
  request: InferInput<I>;
  response: ApiResponse<InferOutput<O>, z.infer<ReturnType<typeof createPublicErrorSchema>>>;

  success: InferOutput<O>;
  error: z.infer<ReturnType<typeof createPublicErrorSchema>>;

  requestSchema: I;
  responseSchema: O;
}>;

/* ============================================================
CONTRACT TYPE
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
  __responseSchema: O;

  /* phantom types */

  __request: InferInput<I>;

  __response: ApiResponse<InferOutput<O>, z.infer<ReturnType<typeof createPublicErrorSchema>>>;

  $type: ContractTypeHelper<I, O>;
}>;

/* ============================================================
GENERIC CONTRACT TYPE
============================================================ */

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
CONTRACT BUILDER
============================================================ */

const errorSchema = createPublicErrorSchema();

const success = <T extends z.ZodTypeAny>(data: T) => z.object({ data }).strict();

export function createContract<
  A extends AccessLevel,
  M extends HttpMethod,
  E extends EndpointPattern,
>(access: A, method: M, endpoint: E) {
  type Module = ExtractModule<E>;
  type Action = ExtractAction<E>;

  return {
    IO<I extends z.ZodTypeAny, O extends z.ZodTypeAny>(input: I, output: O) {
      const responseSchema = z.union([success(output), z.object({ error: errorSchema }).strict()]);

      let deprecated = false;

      return {
        doc<S extends string, D extends string>(summary: S, description: D) {
          const builder = {
            deprecated() {
              deprecated = true;
              return builder;
            },

            build(): Contract<A, M, E, S, D, I, typeof output> {
              const contract = {
                __id: `${method} ${endpoint}`,

                __access: access,
                __method: method,
                __endpoint: endpoint,

                __module: endpoint.slice(1, endpoint.indexOf('/', 1)) as Module,

                __action: endpoint.slice(endpoint.indexOf('/', 1) + 1) as Action,

                __summary: summary,
                __description: description,
                __deprecated: deprecated,

                __requestSchema: input,
                __responseSchema: output,

                /* phantom */

                __request: undefined as unknown as InferInput<I>,

                __response: undefined as unknown as ApiResponse<
                  InferOutput<O>,
                  z.infer<ReturnType<typeof createPublicErrorSchema>>
                >,

                $type: undefined as unknown as ContractTypeHelper<I, typeof output>,
              } satisfies Contract<A, M, E, S, D, I, typeof output>;

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

export function defineContracts<
  const T extends readonly Contract<
    AccessLevel,
    HttpMethod,
    EndpointPattern,
    string,
    string,
    z.ZodTypeAny,
    z.ZodTypeAny
  >[],
>(...contracts: T): T {
  return Object.freeze(contracts) as T;
}

/* ============================================================
TYPE HELPERS
============================================================ */

export type InferRequest<T extends ContractAny> = T['__request'];

export type InferResponse<T extends ContractAny> = T['__response'];

export type InferSuccess<T extends ContractAny> = T['$type']['success'];

export type InferError<T extends ContractAny> = T['$type']['error'];

/* ============================================================
TYPE GUARD
============================================================ */

export function isContract(value: unknown): value is ContractAny {
  if (typeof value !== 'object' || value === null) return false;

  const v = value as Record<string, unknown>;

  return '__endpoint' in v && '__method' in v;
}
