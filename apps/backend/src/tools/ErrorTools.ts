import { Prisma } from '../../prisma/generated/client';
import { z, ZodError } from 'zod';
import { ERROR_CODES, AppError, ERR, type ErrorCode, type PublicErrorEnvelope } from '@app/sdk';

/** @description Reserved system identifiers that cannot be used as input values in specific contexts. */
const RESERVED_WORDS = ['admin', 'root', 'system'] as const;

/**
 * @description Extracts top-level field names from a Zod schema.
 * Enables the error pipeline to filter database errors against the expected contract shape.
 */
const getSchemaFields = (schema?: z.ZodType): string[] => {
  if (!schema) return [];
  const base = schema instanceof z.ZodReadonly ? schema.unwrap() : schema;
  return base instanceof z.ZodObject ? Object.keys(base.shape) : [];
};

/** @description Recognizes Zod validation failures and maps them to SDK-native errors. */
const parseZod = (err: unknown): AppError | null => {
  if (!(err instanceof ZodError)) return null;
  const fields = [...new Set(err.issues.map((i) => String(i.path?.[0])).filter(Boolean))];
  return ERR.VALIDATION(fields);
};

/** @description Detects if any input field contains a restricted system keyword. */
const parseReserved = (input?: Record<string, unknown>): AppError | null => {
  if (!input) return null;
  const fields = Object.keys(input).filter((k) =>
    RESERVED_WORDS.some((r) => String(input[k]).toLowerCase().includes(r)),
  );
  return fields.length ? ERR.RESERVED(fields) : null;
};

/** @description Maps technical Prisma database errors to user-friendly SDK error codes. */
const parsePrisma = (err: unknown, schemaFields: string[]): AppError | null => {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) return null;
  const meta = (err.meta ?? {}) as Record<string, unknown>;
  const extract = () => {
    const targets = [
      ...(Array.isArray(meta.target) ? (meta.target as string[]) : [meta.target as string]),
      meta.field_name as string,
      meta.column_name as string,
    ].filter((v): v is string => typeof v === 'string');
    return [...new Set(targets)].filter((f) => schemaFields.includes(f));
  };
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
    default:
      return null;
  }
};

/** @description Set of error codes considered safe to reveal detailed parameters to the client. */
const SAFE_CODES: ReadonlySet<ErrorCode> = new Set([
  ERROR_CODES.VALIDATION_ERROR,
  ERROR_CODES.RESOURCE_ALREADY_EXISTS,
  ERROR_CODES.RESOURCE_NOT_FOUND,
  ERROR_CODES.RESERVED_VALUE,
  ERROR_CODES.VALUE_TOO_LONG,
  ERROR_CODES.VALUE_INVALID,
  ERROR_CODES.VALUE_OUT_OF_RANGE,
]);

/** @description Final normalization pipeline. Matches any error type against known parsers. */
const normalize = (error: unknown, fields: string[], input?: Record<string, unknown>): AppError => {
  const result =
    parseZod(error) ||
    parseReserved(input) ||
    parsePrisma(error, fields) ||
    (error instanceof AppError ? error : null);
  if (result) return result;
  console.error('[ErrorTools] UNHANDLED:', error);
  return ERR.INTERNAL();
};

/**
 * @description Centralized error catcher for the SDK.
 * Converts any thrown value (Zod, Prisma, logic) into a normalized PublicErrorEnvelope.
 */
export const ErrorTools = {
  catch: <T extends z.ZodType>(
    error: unknown,
    schema?: T,
    input?: Record<string, unknown>,
  ): PublicErrorEnvelope<T> => {
    const fields = getSchemaFields(schema);
    const e = normalize(error, fields, input);
    return (
      SAFE_CODES.has(e.code)
        ? { error: { code: e.code, ...(e.params.length && { params: [...e.params] }) } }
        : { error: { code: e.code } }
    ) as PublicErrorEnvelope<T>;
  },
};
