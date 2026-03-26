import { Prisma } from '../../prisma/generated/client';
import { z, ZodError } from 'zod';
import { ERROR_CODES, AppError, ERR, type ErrorCode, type PublicErrorEnvelope } from '@app/sdk';

//#region UTILS
// ─────────────────────────────────────────────────────────────
//  Pure utility functions — no side effects.
// ─────────────────────────────────────────────────────────────

const RESERVED_WORDS = ['admin', 'root', 'system'] as const;

/** Deduplicates an array preserving order. */
const unique = <T>(a: T[]): T[] => [...new Set(a)];

/**
 * Extracts the top-level field names from a Zod object schema.
 * Returns [] for non-object schemas or when schema is undefined.
 */
const getSchemaFields = (schema?: z.ZodType): string[] => {
  if (!schema) return [];
  const base = schema instanceof z.ZodReadonly ? schema.unwrap() : schema;
  if (!(base instanceof z.ZodObject)) return [];
  return Object.keys(base.shape);
};

/** Keeps only the field names that exist in the schema. */
const filterFields = (fields: string[], schemaFields: string[]): string[] =>
  fields.filter((f) => schemaFields.includes(f));
//#endregion

//#region PARSERS
// ─────────────────────────────────────────────────────────────
//  Each parser tries to recognize a specific error type and
//  returns an AppError on match, or null to pass to the next.
// ─────────────────────────────────────────────────────────────

const parseZod = (err: unknown): AppError | null => {
  if (!(err instanceof ZodError)) return null;

  const fields = unique(
    err.issues
      .map((i) => i.path?.[0])
      .filter(Boolean)
      .map(String),
  );

  return ERR.VALIDATION(fields);
};

const parseReserved = (input?: Record<string, unknown>): AppError | null => {
  if (!input) return null;

  const fields = Object.keys(input).filter((k) =>
    RESERVED_WORDS.some((r) => String(input[k]).toLowerCase().includes(r)),
  );

  return fields.length ? ERR.RESERVED(fields) : null;
};

const parsePrisma = (err: unknown, schemaFields: string[]): AppError | null => {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) return null;

  // Prisma meta is typed as Record<string, unknown> — we access known fields safely.
  const meta = (err.meta ?? {}) as Record<string, unknown>;

  const extract = (): string[] =>
    filterFields(
      unique(
        [
          ...((meta['target'] as string[] | undefined) ?? []),
          meta['field_name'] as string | undefined,
          meta['column_name'] as string | undefined,
        ].filter((v): v is string => typeof v === 'string'),
      ),
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
// ─────────────────────────────────────────────────────────────
//  Safe codes are shown to the client with params.
//  All others are shown only as the error code — no params leak.
// ─────────────────────────────────────────────────────────────

const SAFE_CODES: ReadonlySet<ErrorCode> = new Set([
  ERROR_CODES.VALIDATION_ERROR,
  ERROR_CODES.RESOURCE_ALREADY_EXISTS,
  ERROR_CODES.RESOURCE_NOT_FOUND,
  ERROR_CODES.RESERVED_VALUE,
  ERROR_CODES.VALUE_TOO_LONG,
  ERROR_CODES.VALUE_INVALID,
  ERROR_CODES.VALUE_OUT_OF_RANGE,
]);

const sanitize = (e: AppError): PublicErrorEnvelope =>
  SAFE_CODES.has(e.code)
    ? { error: { code: e.code, ...(e.params.length && { params: [...e.params] }) } }
    : { error: { code: e.code } };
//#endregion

//#region PIPELINE
// ─────────────────────────────────────────────────────────────
//  Normalizes any thrown value to an AppError by running it
//  through each parser in order, first match wins.
// ─────────────────────────────────────────────────────────────

const normalize = (
  error: unknown,
  schemaFields: string[],
  input?: Record<string, unknown>,
): AppError => {
  const parsers: Array<() => AppError | null> = [
    () => parseZod(error),
    () => parseReserved(input),
    () => parsePrisma(error, schemaFields),
    () => (error instanceof AppError ? error : null),
  ];

  for (const parse of parsers) {
    const result = parse();
    if (result) return result;
  }

  console.error('[ErrorTools] UNHANDLED ERROR:', error);
  return ERR.INTERNAL();
};
//#endregion

//#region CATCH
// ─────────────────────────────────────────────────────────────
//  Public entry point — compatible with ErrorAdapter in ApiServer.
//
//  Return type: PublicErrorEnvelope<T>
//  When T is a ZodObject, params is typed as the schema's field name union.
//  When T is not provided, params is string[].
// ─────────────────────────────────────────────────────────────

const catchError = <T extends z.ZodType>(
  error: unknown,
  schema?: T,
  input?: Record<string, unknown>,
): PublicErrorEnvelope<T> => {
  const schemaFields = getSchemaFields(schema);
  const internal = normalize(error, schemaFields, input);
  return sanitize(internal) as PublicErrorEnvelope<T>;
};
//#endregion

export const ErrorTools = {
  catch: catchError,
};
