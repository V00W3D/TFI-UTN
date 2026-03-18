import { z } from 'zod';

//#region ERROR_CODES
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

  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const ErrorCodeEnum = z.enum(Object.values(ERROR_CODES) as [ErrorCode, ...ErrorCode[]]);
//#endregion
//#region APP_ERROR
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public status: number,
    public params: string[] = [],
  ) {
    super(code);
  }
}
//#endregion
//#region FACTORY
const E =
  (code: ErrorCode, status: number) =>
  (params: string[] = []) =>
    new AppError(code, status, params);

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

  INTERNAL: E(ERROR_CODES.INTERNAL_ERROR, 500),
};
//#endregion
//#region TYPES
type UnwrapReadonly<T> = T extends z.ZodReadonly<infer U> ? U : T;

type SchemaKeys<T extends z.ZodTypeAny | undefined> =
  UnwrapReadonly<T> extends z.ZodObject<infer S> ? Extract<keyof S, string> : never;

export type PublicErrorFromSchema<T extends z.ZodTypeAny | undefined> = {
  error: {
    code: ErrorCode;
    params?: SchemaKeys<T>[];
  };
};

export const createPublicErrorSchema = <T extends z.ZodTypeAny>() =>
  z.object({
    error: z.object({
      code: ErrorCodeEnum,
      params: z.array(z.string()).optional(),
    }),
  }) as unknown as z.ZodObject<{
    error: z.ZodObject<{
      code: typeof ErrorCodeEnum;
      params: z.ZodOptional<z.ZodArray<z.ZodType<SchemaKeys<T>>>>;
    }>;
  }>;
//#endregion
