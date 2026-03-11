import { Prisma } from '@config/db/prisma/generated/client';
import { z, ZodError } from 'zod';

/* =========================================================
   ERROR CODES
========================================================= */

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',

  FOREIGN_KEY_CONSTRAINT: 'FOREIGN_KEY_CONSTRAINT',

  RESERVED_VALUE: 'RESERVED_VALUE',

  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/* =========================================================
   INTERNAL ERROR
========================================================= */

class AppError extends Error {
  code: ErrorCode;
  status: number;
  params: string[];

  constructor(code: ErrorCode, status: number, params: string[] = []) {
    super(code);

    this.code = code;
    this.status = status;
    this.params = params;
  }
}

/* =========================================================
   ERROR FACTORY
========================================================= */

const createError =
  (code: ErrorCode, status: number) =>
  (params: string[] = []) =>
    new AppError(code, status, params);

export const ERR = {
  VALIDATION: createError(ERROR_CODES.VALIDATION_ERROR, 400),

  ALREADY_EXISTS: createError(ERROR_CODES.RESOURCE_ALREADY_EXISTS, 409),

  NOT_FOUND: createError(ERROR_CODES.RESOURCE_NOT_FOUND, 404),

  FOREIGN_KEY: createError(ERROR_CODES.FOREIGN_KEY_CONSTRAINT, 400),

  RESERVED: createError(ERROR_CODES.RESERVED_VALUE, 400),

  INVALID_CREDENTIALS: createError(ERROR_CODES.INVALID_CREDENTIALS, 401),

  INTERNAL: createError(ERROR_CODES.INTERNAL_ERROR, 500),
};

/* =========================================================
   PUBLIC ERROR SCHEMA
========================================================= */

const ErrorCodeEnum = z.enum(Object.values(ERROR_CODES) as [string, ...string[]]);

export const PublicErrorSchema = z.object({
  error: z.object({
    code: ErrorCodeEnum,
    params: z.array(z.string()).optional(),
  }),
});

export type PublicError = z.infer<typeof PublicErrorSchema>;

/* =========================================================
   RESERVED DETECTOR
========================================================= */

const RESERVED_WORDS = ['admin', 'root', 'system'];

const detectReserved = (input?: Record<string, unknown>): string[] => {
  if (!input) return [];

  const violations: string[] = [];

  for (const key in input) {
    const value = String(input[key]).toLowerCase();

    if (RESERVED_WORDS.some((r) => value.includes(r))) {
      violations.push(key);
    }
  }

  return violations;
};

/* =========================================================
   ZOD ERROR PARSER
========================================================= */

const parseZodError = (error: unknown): AppError | null => {
  if (!(error instanceof ZodError)) return null;

  const fields = error.issues
    .map((i) => i.path?.[0])
    .filter(Boolean)
    .map(String);

  return ERR.VALIDATION([...new Set(fields)]);
};

/* =========================================================
   PRISMA ERROR PARSER
========================================================= */

const parsePrismaError = (error: unknown, schemaFields: string[]): AppError | null => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return null;

  switch (error.code) {
    case 'P2002': {
      const fields = (error.meta?.target as string[]) ?? [];

      const valid = fields.filter((f) => schemaFields.includes(f));

      if (!valid.length) return null;

      return ERR.ALREADY_EXISTS(valid);
    }

    case 'P2003': {
      const field = (error.meta as { field_name?: string })?.field_name;

      return ERR.FOREIGN_KEY(field ? [field] : []);
    }

    case 'P2025': {
      return ERR.NOT_FOUND(schemaFields.length ? schemaFields : ['resource']);
    }

    default:
      return null;
  }
};

/* =========================================================
   RESERVED PARSER
========================================================= */

const parseReserved = (input?: Record<string, unknown>): AppError | null => {
  const fields = detectReserved(input);

  if (!fields.length) return null;

  return ERR.RESERVED(fields);
};

/* =========================================================
   SCHEMA FIELD EXTRACTOR
========================================================= */

const getSchemaFields = (schema?: z.ZodTypeAny): string[] => {
  if (!schema) return [];

  const base = schema instanceof z.ZodReadonly ? schema.unwrap() : schema;

  if (!(base instanceof z.ZodObject)) return [];

  return Object.keys(base.shape);
};

/* =========================================================
   ERROR SANITIZER
========================================================= */

const SAFE_ERRORS: ErrorCode[] = [
  ERROR_CODES.VALIDATION_ERROR,
  ERROR_CODES.RESOURCE_ALREADY_EXISTS,
  ERROR_CODES.RESOURCE_NOT_FOUND,
  ERROR_CODES.RESERVED_VALUE,
];

const sanitizeError = (error: AppError): PublicError => {
  if (!SAFE_ERRORS.includes(error.code)) {
    return {
      error: { code: error.code },
    };
  }

  return {
    error: {
      code: error.code,
      ...(error.params.length && { params: error.params }),
    },
  };
};

/* =========================================================
   INTERNAL ERROR PIPELINE
========================================================= */

const normalizeError = (
  error: unknown,
  schemaFields: string[],
  input?: Record<string, unknown>,
): AppError => {
  const parsers = [
    () => parseZodError(error),
    () => parseReserved(input),
    () => parsePrismaError(error, schemaFields),
    () => (error instanceof AppError ? error : null),
  ];

  for (const parse of parsers) {
    const result = parse();

    if (result) return result;
  }

  console.error('UNHANDLED ERROR:', error);

  return ERR.INTERNAL();
};

/* =========================================================
   ERROR CATCHER
========================================================= */

const catchError = (
  error: unknown,
  schema?: z.ZodTypeAny,
  input?: Record<string, unknown>,
): PublicError => {
  const schemaFields = getSchemaFields(schema);

  const internal = normalizeError(error, schemaFields, input);

  return sanitizeError(internal);
};

/* =========================================================
   TOOLKIT
========================================================= */

export const ErrorTools = {
  catch: catchError,
};
