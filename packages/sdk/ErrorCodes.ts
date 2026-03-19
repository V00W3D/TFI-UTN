import { z } from 'zod';

//#region ERROR_CODES
/** @public Exhaustive map of machine-readable error codes. */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  FOREIGN_KEY_CONSTRAINT: 'FOREIGN_KEY_CONSTRAINT',
  RELATION_VIOLATION: 'RELATION_VIOLATION',
  VALUE_TOO_LONG: 'VALUE_TOO_LONG',
  VALUE_INVALID: 'VALUE_INVALID',
  VALUE_OUT_OF_RANGE: 'VALUE_OUT_OF_RANGE',
  NULL_CONSTRAINT: 'NULL_CONSTRAINT',
  RESERVED_VALUE: 'RESERVED_VALUE',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const satisfies Record<string, string>;

/** @public Union of every valid error code string. */
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/** @public Zod enum for runtime validation of error codes. */
export const ErrorCodeEnum = z.enum(Object.values(ERROR_CODES) as [ErrorCode, ...ErrorCode[]]);
//#endregion

//#region APP_ERROR
/**
 * @public
 * @summary Structured error thrown by backend service functions.
 * @remarks
 * Always throw `AppError` (or one of the `ERR.*` factories) from service functions.
 * `ApiServer` catches it and converts it to the `PublicErrorEnvelope` shape.
 * `status` drives the HTTP response code.
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly params: readonly string[];

  constructor(code: ErrorCode, status: number, params: readonly string[] = []) {
    super(code);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.params = params;
  }

  /** @public Returns `true` when `value` is an {@link AppError}. */
  static is(value: unknown): value is AppError {
    return value instanceof AppError;
  }

  /** @public Converts this error to the public envelope shape. */
  toEnvelope(): PublicErrorEnvelope {
    return this.params.length
      ? { error: { code: this.code, params: [...this.params] } }
      : { error: { code: this.code } };
  }
}
//#endregion

//#region ERROR_FACTORY
/** @internal Produces a factory function for a specific code + status pair. */
type ErrorFactory = (params?: readonly string[]) => AppError;

const E =
  (code: ErrorCode, status: number): ErrorFactory =>
  (params = []) =>
    new AppError(code, status, params);

/**
 * @public
 * @summary Pre-built error factories. Each returns an {@link AppError}.
 * @remarks
 * Usage: `throw ERR.NOT_FOUND(['userId'])` or `return ERR.VALIDATION(['email', 'password'])`.
 */
export const ERR = {
  VALIDATION: E(ERROR_CODES.VALIDATION_ERROR, 400),
  ALREADY_EXISTS: E(ERROR_CODES.RESOURCE_ALREADY_EXISTS, 409),
  NOT_FOUND: E(ERROR_CODES.RESOURCE_NOT_FOUND, 404),
  FOREIGN_KEY: E(ERROR_CODES.FOREIGN_KEY_CONSTRAINT, 400),
  RELATION: E(ERROR_CODES.RELATION_VIOLATION, 400),
  VALUE_TOO_LONG: E(ERROR_CODES.VALUE_TOO_LONG, 400),
  VALUE_INVALID: E(ERROR_CODES.VALUE_INVALID, 400),
  VALUE_OUT_OF_RANGE: E(ERROR_CODES.VALUE_OUT_OF_RANGE, 400),
  NULL: E(ERROR_CODES.NULL_CONSTRAINT, 400),
  RESERVED: E(ERROR_CODES.RESERVED_VALUE, 400),
  INVALID_CREDENTIALS: E(ERROR_CODES.INVALID_CREDENTIALS, 401),
  UNAUTHORIZED: E(ERROR_CODES.UNAUTHORIZED, 401),
  FORBIDDEN: E(ERROR_CODES.FORBIDDEN, 403),
  INTERNAL: E(ERROR_CODES.INTERNAL_ERROR, 500),
} as const satisfies Record<string, ErrorFactory>;
//#endregion

//#region PUBLIC_ERROR_ENVELOPE
// ─────────────────────────────────────────────────────────────
//  The error envelope sent to clients.
//
//  When TSchema is a ZodObject, `params` is typed as the union of
//  the schema's field name strings — giving autocomplete on field names.
//  When TSchema is the generic z.ZodType, `params` falls back to string[].
//
//  This typing is best-effort: in buildRouterInternal the schema is
//  already widened to z.ZodType (AnyContract), so params = string[].
//  The narrowing only works when the schema type is known statically,
//  e.g. in typed service functions that receive the schema directly.
// ─────────────────────────────────────────────────────────────

/** @internal Extracts field name keys from a ZodObject schema, or falls back to string. */
type SchemaKeys<TSchema extends z.ZodType> =
  TSchema extends z.ZodObject<infer S> ? Extract<keyof S, string> : string;

/**
 * @public
 * @summary The `{ error: { code, params? } }` envelope for failed API responses.
 * @template TSchema - When a ZodObject is provided, `params` is typed as its field names.
 */
export type PublicErrorEnvelope<TSchema extends z.ZodType = z.ZodType> = {
  error: {
    code: ErrorCode;
    params?: SchemaKeys<TSchema>[];
  };
};

/** @public Zod schema for {@link PublicErrorEnvelope} — used to parse API error responses. */
export const publicErrorSchema = z.object({
  error: z.object({
    code: ErrorCodeEnum,
    params: z.array(z.string()).optional(),
  }),
});

/** @public Inferred TypeScript type from {@link publicErrorSchema}. */
export type PublicErrorSchema = z.infer<typeof publicErrorSchema>;

/** @public Returns the shared {@link publicErrorSchema} (backward-compat alias). */
export const createPublicErrorSchema = (): typeof publicErrorSchema => publicErrorSchema;
//#endregion

//#region GUARDS_AND_HELPERS
/**
 * @public
 * @summary Returns `true` when `response` is a {@link PublicErrorEnvelope}.
 * Useful in frontend code to distinguish success from error responses.
 */
export function isErrorEnvelope(response: unknown): response is PublicErrorEnvelope {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as PublicErrorEnvelope).error?.code === 'string'
  );
}

/**
 * @public
 * @summary Extracts the HTTP status that should be returned for a given error.
 * Falls back to 400 for unknown error shapes.
 */
export function httpStatusFrom(error: unknown): number {
  if (AppError.is(error)) return error.status;
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const s = (error as Record<string, unknown>).status;
    if (typeof s === 'number') return s;
  }
  return 400;
}
//#endregion
