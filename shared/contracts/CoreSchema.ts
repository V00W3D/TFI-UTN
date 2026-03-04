import { z } from 'zod';

/* ============================================================
   1. CORE MODES
============================================================ */

/**
 * Define el nivel de validación aplicado a los schemas base.
 *
 * - "full"
 *    Validación completa con reglas de negocio, límites y regex.
 *    Uso típico: registro, creación de entidades.
 *
 * - "minimal"
 *    Validación estructural ligera (normalización básica).
 *    Uso típico: login, filtros, búsquedas, queries internas.
 */
export type CoreMode = 'full' | 'minimal';

/* ============================================================
   2. DOMAIN CONSTRAINTS
============================================================ */

/**
 * Límites globales del dominio.
 *
 * Centraliza reglas cuantitativas para evitar números mágicos
 * distribuidos en el código.
 */
export const LIMITS = Object.freeze({
  NAME_MIN: 2,
  NAME_MAX: 50,
  USERNAME_MIN: 4,
  USERNAME_MAX: 20,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 72,
  EMAIL_MAX: 100,
} as const);

/**
 * Expresiones regulares del dominio.
 *
 * Encapsula validaciones sintácticas reutilizables.
 */
export const REGEX = Object.freeze({
  NAME: /^[A-Za-zÀ-ÿ\s'-]+$/,
  USERNAME: /^[a-zA-Z0-9_]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
  PHONE_E164: /^\+[1-9]\d{6,14}$/,
} as const);

/* ============================================================
   3. ERROR INFRASTRUCTURE
============================================================ */

/**
 * Estructura interna utilizada para construir mensajes de error.
 */
type ErrorOptions = {
  base: string;
  details?: string[];
};

/**
 * Compone el mensaje final de error.
 */
const buildMessage = ({ base, details }: ErrorOptions) =>
  details?.length ? `${base}. ${details.join('. ')}` : base;

/**
 * Inserta un error personalizado dentro del contexto Zod.
 */
const issue = (ctx: z.RefinementCtx, { base, details }: ErrorOptions) => {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: buildMessage({ base, details }),
  });
};

/* ============================================================
   4. GENERIC STRING SCHEMA BUILDER
============================================================ */

/**
 * Configuración declarativa para crear schemas string.
 */
type StringConfig = {
  min?: number;
  max?: number;
  regex?: RegExp;
  baseError: string;
  regexDetail?: string;
  transform?: (v: string) => string;
};

/**
 * Creador de schemas string dependiente del modo.
 *
 * En modo "minimal":
 *   - Solo aplica trim y transformaciones básicas.
 *
 * En modo "full":
 *   - Aplica validaciones de longitud y regex.
 *   - Construye errores detallados.
 */
const createStringSchema = (
  mode: CoreMode,
  { min, max, regex, baseError, regexDetail, transform }: StringConfig,
) => {
  let schema: z.ZodType<string> = z.string().trim();
  if (transform) {
    schema = schema.transform(transform);
  }

  if (mode === 'minimal') {
    return schema;
  }

  return schema.superRefine((value, ctx) => {
    const details: string[] = [];

    if (min && value.length < min) details.push(`Debe tener al menos ${min} caracteres`);

    if (max && value.length > max) details.push(`No puede tener más de ${max} caracteres`);

    if (regex && !regex.test(value)) details.push(regexDetail ?? 'Formato inválido');

    if (details.length) {
      issue(ctx, { base: baseError, details });
    }
  });
};

/* ============================================================
   5. CORE SCHEMA FACTORY
============================================================ */

/**
 * Genera el conjunto completo de schemas del dominio.
 *
 * Esta función representa el núcleo semántico del sistema.
 *
 * @param mode Nivel de validación requerido.
 *
 * @returns Objeto inmutable con todos los schemas del dominio.
 */
export const createCore = (mode: CoreMode = 'full') => {
  /* ---------------- USERNAME ---------------- */

  const username = createStringSchema(mode, {
    min: LIMITS.USERNAME_MIN,
    max: LIMITS.USERNAME_MAX,
    regex: REGEX.USERNAME,
    baseError: 'Usuario inválido',
    regexDetail: 'Solo puede contener letras, números y guiones bajos',
  });

  /* ---------------- PASSWORD ---------------- */

  const password = createStringSchema(mode, {
    min: LIMITS.PASSWORD_MIN,
    max: LIMITS.PASSWORD_MAX,
    regex: REGEX.PASSWORD,
    baseError: 'Contraseña inválida',
    regexDetail: 'Debe contener mayúscula, minúscula, número y carácter especial',
  });

  /* ---------------- EMAIL ---------------- */

  const emailBase = createStringSchema(mode, {
    max: LIMITS.EMAIL_MAX,
    baseError: 'Email inválido',
    transform: (v) => v.toLowerCase(),
  });

  const email =
    mode === 'minimal'
      ? emailBase
      : emailBase.superRefine((value, ctx) => {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            issue(ctx, {
              base: 'Email inválido',
              details: ['Debe contener @ y un dominio válido'],
            });
          }
        });

  /* ---------------- PHONE ---------------- */

  const phone =
    mode === 'minimal'
      ? createStringSchema(mode, {
          baseError: 'Teléfono inválido',
        })
      : createStringSchema(mode, {
          baseError: 'Teléfono inválido',
        }).superRefine((value, ctx) => {
          if (!REGEX.PHONE_E164.test(value)) {
            issue(ctx, {
              base: 'Teléfono inválido',
              details: ['Debe estar en formato internacional (+549...)'],
            });
          }
        });

  /* ---------------- NAME ---------------- */

  const name = createStringSchema(mode, {
    min: LIMITS.NAME_MIN,
    max: LIMITS.NAME_MAX,
    regex: REGEX.NAME,
    baseError: 'Nombre inválido',
    regexDetail: 'Solo se permiten letras, espacios, guiones y apóstrofes',
  });

  /* ---------------- SEX ---------------- */

  /* ---------------- SEX ---------------- */

  const SexEnum = z.enum(['MALE', 'FEMALE', 'OTHER']);

  const sex =
    mode === 'minimal'
      ? z
          .string()
          .transform((v) => v.toUpperCase())
          .pipe(SexEnum)
      : SexEnum;

  /* ---------------- IDENTITY ---------------- */

  const identitySchemas = [username, email, phone] as const;

  const identity =
    mode === 'minimal'
      ? z.string().trim().toLowerCase()
      : z
          .string()
          .trim()
          .toLowerCase()
          .superRefine((value, ctx) => {
            const matches = identitySchemas.some((schema) => schema.safeParse(value).success);

            if (!matches) {
              issue(ctx, {
                base: 'Identidad inválida',
                details: ['Debe ser un usuario, email o teléfono válido'],
              });
            }
          });

  return Object.freeze({
    username,
    password,
    email,
    phone,
    name,
    sex,
    identity,
  });
};

/* ============================================================
   6. DEFAULT EXPORT (FULL MODE)
============================================================ */

/**
 * Conjunto de schemas con validación completa.
 *
 * Recomendado para registro y operaciones de escritura.
 */
export const CORE = createCore('full');

/* ============================================================
   7. TYPE INFERENCE (FULL MODE)
============================================================ */

/**
 * Tipos inferidos desde el modo completo.
 * Representan el contrato semántico fuerte del dominio.
 */
export type CoreUsername = z.infer<ReturnType<typeof createCore>['username']>;
export type CorePassword = z.infer<ReturnType<typeof createCore>['password']>;
export type CoreEmail = z.infer<ReturnType<typeof createCore>['email']>;
export type CorePhone = z.infer<ReturnType<typeof createCore>['phone']>;
export type CoreName = z.infer<ReturnType<typeof createCore>['name']>;
export type CoreSex = z.infer<ReturnType<typeof createCore>['sex']>;
export type CoreIdentity = z.infer<ReturnType<typeof createCore>['identity']>;

/* ============================================================
   8. DOMAIN RULES (HUMAN FRIENDLY)
============================================================ */

export const CORE_RULES = Object.freeze({
  username: [
    `Debe tener entre ${LIMITS.USERNAME_MIN} y ${LIMITS.USERNAME_MAX} caracteres.`,
    'Puede incluir letras, números y guiones bajos (_).',
    'No se permiten espacios.',
  ],

  password: [
    `Debe tener entre ${LIMITS.PASSWORD_MIN} y ${LIMITS.PASSWORD_MAX} caracteres.`,
    'Incluir al menos una letra mayúscula.',
    'Incluir al menos una letra minúscula.',
    'Incluir al menos un número.',
    'Incluir al menos un símbolo (por ejemplo: ! @ # $ %).',
  ],

  email: [
    `No puede superar los ${LIMITS.EMAIL_MAX} caracteres.`,
    'Debe incluir un @.',
    'Debe tener un dominio válido (por ejemplo: usuario@correo.com).',
  ],

  phone: [
    'Ingresalo en formato internacional.',
    'Debe comenzar con el código de país (por ejemplo: +54).',
    'Ejemplo válido: +5493811234567.',
  ],

  name: [
    `Debe tener entre ${LIMITS.NAME_MIN} y ${LIMITS.NAME_MAX} caracteres.`,
    'Solo se permiten letras.',
    "Puede incluir espacios, guiones (-) y apóstrofes (').",
  ],

  sex: ['Elegí una de las opciones disponibles.'],

  identity: [
    'Podés ingresar tu nombre de usuario, email o teléfono.',
    'El formato debe ser válido según el tipo que elijas.',
  ],
});
