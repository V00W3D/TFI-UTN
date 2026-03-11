import { Prisma } from '@config/db/prisma/generated/client';
import { ZodError } from 'zod';
import type { ZodTypeAny } from 'zod';

/* =========================================================
   TYPES
========================================================= */

export type ErrorPayload = {
  message: string;
  status: number;
  params?: string[];
  forbidden_fields?: string[];
};

/* =========================================================
   APP ERROR
========================================================= */

export class AppError extends Error {
  status: number;
  params?: string[];
  forbidden_fields?: string[];

  constructor(message: string, status = 400, params?: string[], forbidden_fields?: string[]) {
    super(message);
    this.status = status;

    if (params) this.params = params;
    if (forbidden_fields) this.forbidden_fields = forbidden_fields;
  }
}

/* =========================================================
   SCHEMA FIELD EXTRACTOR
========================================================= */

const getSchemaFields = (schema: ZodTypeAny): string[] => {
  const shape = (schema as any)?._def?.shape?.();

  if (!shape) return [];

  return Object.keys(shape);
};

/* =========================================================
   MESSAGE BUILDER
========================================================= */

const buildMessage = (field: string, type: string) => `${field.toUpperCase()}_${type}`;

/* =========================================================
   ERROR FACTORY
========================================================= */

export const ERR = {
  VALIDATION: (fields?: string[]) => new AppError('VALIDATION_ERROR', 400, fields),

  ALREADY_EXISTS: (field: string) =>
    new AppError(buildMessage(field, 'ALREADY_EXISTS'), 409, [field]),

  RESERVED: (field: string) => new AppError(buildMessage(field, 'RESERVED'), 400, [field]),

  NOT_FOUND: (field: string) => new AppError(buildMessage(field, 'NOT_FOUND'), 404, [field]),

  FORBIDDEN_FIELDS: (fields: string[]) =>
    new AppError('INVALID_CREDENTIALS', 401, undefined, fields),

  FOREIGN_KEY: (field?: string) =>
    new AppError('FOREIGN_KEY_CONSTRAINT', 400, field ? [field] : undefined),

  INTERNAL: () => new AppError('INTERNAL_ERROR', 500),
};

/* =========================================================
   RESERVED DETECTOR
========================================================= */

const reservedWords = ['admin', 'root', 'system'];

const detectReserved = (input: Record<string, unknown>): string | null => {
  for (const key in input) {
    const value = String(input[key]).toLowerCase();

    if (reservedWords.some((r) => value.includes(r))) {
      return key;
    }
  }

  return null;
};

/* =========================================================
   PRISMA INTERPRETER
========================================================= */

const prismaInterpreter = (
  error: Prisma.PrismaClientKnownRequestError,
  schemaFields: string[],
): ErrorPayload | null => {
  switch (error.code) {
    /* UNIQUE */

    case 'P2002': {
      const fields = error.meta?.target as string[] | undefined;
      const field = fields?.[0];

      if (!field) return null;

      if (!schemaFields.includes(field)) return null;

      const err = ERR.ALREADY_EXISTS(field);

      return {
        message: err.message,
        status: err.status,
        ...(err.params && { params: err.params }),
      };
    }

    /* FOREIGN KEY */

    case 'P2003': {
      const field = (error.meta as any)?.field_name as string | undefined;

      const err = ERR.FOREIGN_KEY(field);

      return {
        message: err.message,
        status: err.status,
        ...(err.params && { params: err.params }),
      };
    }

    /* NOT FOUND */

    case 'P2025': {
      const field = schemaFields[0] ?? 'resource';

      const err = ERR.NOT_FOUND(field);

      return {
        message: err.message,
        status: err.status,
        ...(err.params && { params: err.params }),
      };
    }

    default:
      return null;
  }
};

/* =========================================================
   ERROR CATCHER
========================================================= */

export const errorCatcher = (
  error: unknown,
  schema?: ZodTypeAny,
  input?: Record<string, unknown>,
): ErrorPayload => {
  const schemaFields = schema ? getSchemaFields(schema) : [];

  /* =====================================================
     ZOD VALIDATION
  ===================================================== */

  if (error instanceof ZodError) {
    const issue = error.issues[0];
    const params = issue?.path?.map(String);

    const err = ERR.VALIDATION(params);

    return {
      message: err.message,
      status: err.status,
      ...(err.params && { params: err.params }),
    };
  }

  /* =====================================================
     RESERVED WORDS
  ===================================================== */

  if (input) {
    const field = detectReserved(input);

    if (field && schemaFields.includes(field)) {
      const err = ERR.RESERVED(field);

      return {
        message: err.message,
        status: err.status,
        ...(err.params && { params: err.params }),
      };
    }
  }

  /* =====================================================
     PRISMA
  ===================================================== */

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const parsed = prismaInterpreter(error, schemaFields);

    if (parsed) return parsed;
  }

  /* =====================================================
     LOGIN SECURITY
  ===================================================== */

  if (error instanceof AppError && error.forbidden_fields) {
    return {
      message: error.message,
      status: error.status,
      forbidden_fields: error.forbidden_fields,
    };
  }

  /* =====================================================
     UNKNOWN
  ===================================================== */

  console.error('UNHANDLED ERROR:', error);

  const err = ERR.INTERNAL();

  return {
    message: err.message,
    status: err.status,
  };
};
