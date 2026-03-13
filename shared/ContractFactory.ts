import { z } from 'zod';
import { createPublicErrorSchema } from '@tools/ErrorTools';

/* ============================================================
SUCCESS BUILDER
============================================================ */

function buildSuccess<T extends z.ZodTypeAny>(data: T) {
  return z.object({
    ok: z.literal(true),
    data,
  });
}

/* ============================================================
ERROR BUILDER
============================================================ */

function buildError<TInput extends z.ZodTypeAny>() {
  const PublicErrorSchema = createPublicErrorSchema<TInput>();

  return z
    .object({
      ok: z.literal(false),
    })
    .extend(PublicErrorSchema.shape);
}

/* ============================================================
TYPES
============================================================ */

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type AccessLevel = 'public' | 'auth' | 'role' | 'internal';

type CacheStrategy = 'no-store' | 'no-cache' | `${number}s` | `${number}m` | `${number}h`;

/* ============================================================
CONFIG
============================================================ */

export type ContractConfig<TInput extends z.ZodTypeAny, TSuccess extends z.ZodTypeAny> = {
  method: HttpMethod;
  path: string;

  input: TInput;
  success: TSuccess;

  access?: AccessLevel;

  summary?: string;
  description?: string;
  tags?: readonly string[];

  cache?: CacheStrategy;
  timeout?: number;

  deprecated?: boolean;
};

/* ============================================================
CONTRACT
============================================================ */

export type Contract<TInput extends z.ZodTypeAny, TOutput extends z.ZodTypeAny> = {
  readonly method: HttpMethod;
  readonly path: string;

  readonly access: AccessLevel;

  readonly summary: string;
  readonly description: string;
  readonly tags: readonly string[];

  readonly cache: CacheStrategy;
  readonly timeout: number;

  readonly deprecated: boolean;

  readonly I: z.ZodReadonly<TInput>;
  readonly O: TOutput;

  readonly Input: z.input<TInput>;
  readonly Output: z.output<TOutput>;
};

/* ============================================================
FACTORY
============================================================ */

export function ContractFactory<TInput extends z.ZodTypeAny, TSuccess extends z.ZodTypeAny>(
  config: ContractConfig<TInput, TSuccess>,
) {
  const InputSchema = config.input.readonly();

  const SuccessSchema = buildSuccess(config.success);
  const ErrorSchema = buildError<TInput>();

  const OutputSchema = z.discriminatedUnion('ok', [SuccessSchema, ErrorSchema]).readonly();

  type TOutput = typeof OutputSchema;

  const contract: Contract<TInput, TOutput> = {
    method: config.method,
    path: config.path,

    access: config.access ?? 'public',

    summary: config.summary ?? '',
    description: config.description ?? '',
    tags: config.tags ?? [],

    cache: config.cache ?? 'no-store',
    timeout: config.timeout ?? 10000,

    deprecated: config.deprecated ?? false,

    I: InputSchema,
    O: OutputSchema,

    Input: undefined as unknown as z.input<TInput>,
    Output: undefined as unknown as z.output<TOutput>,
  };

  return contract;
}

/* ============================================================
HELPERS
============================================================ */

export type InferRequest<T extends Contract<any, any>> = T['Input'];
export type InferResponse<T extends Contract<any, any>> = T['Output'];
