import { Prisma } from '@config/db/prisma/generated/client';
import { z, ZodError } from 'zod';

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

const ErrorCodeEnum = z.enum(Object.values(ERROR_CODES) as [ErrorCode, ...ErrorCode[]]);
//#endregion
//#region APP_ERROR
class AppError extends Error {
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
//#region UTILS
const RESERVED_WORDS = ['admin', 'root', 'system'];

const unique = <T>(a: T[]) => [...new Set(a)];

const getSchemaFields = (schema?: z.ZodTypeAny) => {
  if (!schema) return [];

  const base = schema instanceof z.ZodReadonly ? schema.unwrap() : schema;
  if (!(base instanceof z.ZodObject)) return [];

  return Object.keys(base.shape);
};

const filterFields = (fields: string[], schemaFields: string[]) =>
  fields.filter((f) => schemaFields.includes(f));
//#endregion
//#region PARSERS
const parseZod = (err: unknown) => {
  if (!(err instanceof ZodError)) return null;

  const fields = unique(
    err.issues
      .map((i) => i.path?.[0])
      .filter(Boolean)
      .map(String),
  );

  return ERR.VALIDATION(fields);
};

const parseReserved = (input?: Record<string, unknown>) => {
  if (!input) return null;

  const fields = Object.keys(input).filter((k) =>
    RESERVED_WORDS.some((r) => String(input[k]).toLowerCase().includes(r)),
  );

  return fields.length ? ERR.RESERVED(fields) : null;
};

const parsePrisma = (err: unknown, schemaFields: string[]) => {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) return null;

  const meta: any = err.meta ?? {};

  const extract = () =>
    filterFields(
      unique([...(meta.target ?? []), meta.field_name, meta.column_name].filter(Boolean)),
      schemaFields,
    );

  switch (err.code) {
    case 'P2000':
      return ERR.VALUE_TOO_LONG(extract());

    case 'P2001':
    case 'P2025':
      return ERR.NOT_FOUND(schemaFields.length ? schemaFields : ['resource']);

    case 'P2002':
      return ERR.ALREADY_EXISTS(extract());

    case 'P2003':
      return ERR.FOREIGN_KEY(extract());

    case 'P2004':
    case 'P2014':
      return ERR.RELATION(extract());

    case 'P2005':
    case 'P2006':
    case 'P2016':
      return ERR.VALUE_INVALID(extract());

    case 'P2011':
    case 'P2012':
      return ERR.NULL(extract());

    case 'P2020':
      return ERR.VALUE_OUT_OF_RANGE(extract());

    case 'P2028':
      return ERR.INTERNAL();

    default:
      return null;
  }
};
//#endregion
//#region SANITIZER
const SAFE: ErrorCode[] = [
  ERROR_CODES.VALIDATION_ERROR,
  ERROR_CODES.RESOURCE_ALREADY_EXISTS,
  ERROR_CODES.RESOURCE_NOT_FOUND,
  ERROR_CODES.RESERVED_VALUE,
  ERROR_CODES.VALUE_TOO_LONG,
  ERROR_CODES.VALUE_INVALID,
  ERROR_CODES.VALUE_OUT_OF_RANGE,
];

const sanitize = (e: AppError) =>
  SAFE.includes(e.code)
    ? { error: { code: e.code, ...(e.params.length && { params: e.params }) } }
    : { error: { code: e.code } };
//#endregion
//#region PIPELINE
const normalize = (
  error: unknown,
  schemaFields: string[],
  input?: Record<string, unknown>,
): AppError => {
  const parsers = [
    () => parseZod(error),
    () => parseReserved(input),
    () => parsePrisma(error, schemaFields),
    () => (error instanceof AppError ? error : null),
  ];

  for (const p of parsers) {
    const r = p();
    if (r) return r;
  }

  console.error('UNHANDLED ERROR:', error);

  return ERR.INTERNAL();
};
//#endregion
//#region CATCH
const catchError = <T extends z.ZodTypeAny>(
  error: unknown,
  schema?: T,
  input?: Record<string, unknown>,
): PublicErrorFromSchema<T> => {
  const schemaFields = getSchemaFields(schema);
  const internal = normalize(error, schemaFields, input);

  return sanitize(internal) as PublicErrorFromSchema<T>;
};
//#endregion
export const ErrorTools = {
  catch: catchError,
};
