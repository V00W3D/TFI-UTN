import { z } from 'zod';

//#region CONFIG_TYPES
/** @public Minimum or maximum string-length constraint. */
export type LengthConstraint = {
  value: number;
  message?: string;
};

/** @public Regex pattern constraint. */
export type PatternConstraint = {
  pattern: RegExp;
  message: string;
};

/** @public Reserved-word constraint. */
export type ReservedConstraint = {
  words: string[];
  message?: string;
};

/**
 * @public
 * @summary Native Zod v4 format validators applied before custom pattern checks.
 * When both `format` and `pattern` are present, both are checked.
 *
 * @remarks
 * Zod v4 format validators are standalone schemas, not string methods:
 *   `'email'` → `z.email()`   (not `z.string().email()`)
 *   `'url'`   → `z.url()`
 *   `'uuid'`  → `z.uuid()`
 *   `'phone'` → `z.e164()`
 */
export type FieldFormat = 'email' | 'url' | 'uuid' | 'phone';

/** @public Full configuration for {@link defineField}. */
export type FieldDefConfig = {
  label: string;
  trim?: boolean;
  lowercase?: boolean;
  format?: FieldFormat;
  min?: LengthConstraint;
  max?: LengthConstraint;
  pattern?: PatternConstraint;
  reserved?: ReservedConstraint;
  nullable?: boolean;
  rules: readonly string[];
};
//#endregion

//#region FIELD_DEF_OUTPUT
// ─────────────────────────────────────────────────────────────
//  FieldDefReturn uses ZodString / ZodNullable<ZodString> (not
//  the widened ZodType<string>) so hovering a field in a ZodObject
//  shows "ZodString" instead of "ZodType<string, unknown, ...>".
//
//  In Zod v4, .trim(), .toLowerCase(), and .superRefine() on a
//  ZodString still return ZodString — no ZodEffects wrapper.
//  Only .transform() and .refine() produce ZodEffects.
// ─────────────────────────────────────────────────────────────

/** @public Schema + UI rules for a field. */
export type FieldDef<TSchema extends z.ZodType> = {
  readonly schema: TSchema;
  readonly rules: readonly string[];
};

/**
 * @public
 * @summary Extracts the TypeScript type inferred from a {@link FieldDef}'s schema.
 * @example
 * ```ts
 * type Username = FieldInfer<typeof usernameField>; // string
 * type Phone    = FieldInfer<typeof phoneField>;    // string | null
 * ```
 */
export type FieldInfer<TField extends FieldDef<z.ZodType>> = z.infer<TField['schema']>;

/**
 * @public
 * @summary Exact return type of {@link defineField}.
 * - `nullable: true`  → `FieldDef<z.ZodNullable<z.ZodString>>`
 * - otherwise         → `FieldDef<z.ZodString>`
 */
export type FieldDefReturn<TNullable extends boolean> = TNullable extends true
  ? FieldDef<z.ZodNullable<z.ZodString>>
  : FieldDef<z.ZodString>;
//#endregion

//#region SHARED_PRESETS
/** @public Shared constraints for name-type fields — VarChar(128). */
export const NAME_BASE = {
  min: { value: 2 },
  max: { value: 128 },
  pattern: {
    pattern: /^[A-Za-zÀ-ÿ\s'-]+$/,
    message: "Solo se permiten letras, espacios, guiones (-) y apóstrofes (')",
  },
  rules: [
    'Debe tener entre 2 y 128 caracteres.',
    'Solo se permiten letras.',
    "Puede incluir espacios, guiones (-) y apóstrofes (').",
  ],
} as const satisfies Partial<FieldDefConfig>;

/** @public Shared length constraints for password fields — VarChar(128). */
export const PASSWORD_LENGTH = {
  min: { value: 8 },
  max: { value: 128 },
} as const satisfies Partial<FieldDefConfig>;
//#endregion

//#region DEFAULT_RESOLVER
/**
 * @internal
 * Resolves the initial default value for a field schema.
 * String fields always default to `''` — the form layer never stores null.
 */
export function resolveFieldDefault(fieldSchema: z.ZodType): unknown {
  type ZodWithDefault = { _def?: { defaultValue?: () => unknown } };
  const defaultFn = (fieldSchema as ZodWithDefault)._def?.defaultValue;
  if (typeof defaultFn === 'function') return defaultFn();
  if (fieldSchema.safeParse('').success) return '';
  const candidates = [false, 0, [], {}] as const;
  for (const candidate of candidates) {
    const result = fieldSchema.safeParse(candidate);
    if (result.success) return result.data;
  }
  return '';
}
//#endregion

//#region APPLY_FORMAT
// ─────────────────────────────────────────────────────────────
//  In Zod v4, z.email(), z.url(), z.uuid(), and z.e164() return
//  SEPARATE types (ZodEmail, ZodURL, ZodUUID, ZodE164) that do NOT
//  extend ZodString. They cannot be used as a ZodString base.
//
//  Solution: validate the format INSIDE superRefine by running the
//  standalone schema against the value. The base remains ZodString
//  throughout, so FieldDefReturn<false> = FieldDef<ZodString> holds.
// ─────────────────────────────────────────────────────────────

/** @internal The standalone Zod v4 format schema for a given FieldFormat. */
type FormatSchema = z.ZodEmail | z.ZodURL | z.ZodUUID | z.ZodE164;

/**
 * @internal
 * Returns the standalone Zod v4 format schema used to validate the value
 * inside superRefine. The schema is never used as the field type — it is
 * only called via .safeParse() to produce error messages.
 */
function getFormatSchema(format: FieldFormat): FormatSchema {
  switch (format) {
    case 'email':
      return z.email();
    case 'url':
      return z.url();
    case 'uuid':
      return z.uuid();
    case 'phone':
      return z.e164();
  }
}
//#endregion

//#region DEFINE_FIELD
/**
 * @public
 * @summary Creates a {@link FieldDef} from a declarative configuration.
 * @remarks
 * Returns `FieldDef<ZodString>` for non-nullable fields and
 * `FieldDef<ZodNullable<ZodString>>` for nullable fields.
 * Concrete Zod types produce clean hover output in contract schemas.
 *
 * Build order:
 *  1. z.string() base
 *  2. .trim() / .toLowerCase()      → still ZodString
 *  3. .superRefine(format + checks) → still ZodString (Zod v4 — no ZodEffects)
 *  4. .nullable()                   → ZodNullable<ZodString> (only when nullable: true)
 */
export function defineField<const TConfig extends FieldDefConfig>(
  config: TConfig,
): FieldDefReturn<TConfig['nullable'] extends true ? true : false> {
  // Base is always ZodString — format validation happens inside superRefine.
  let base: z.ZodString = z.string();
  if (config.trim !== false) base = base.trim() as z.ZodString;
  if (config.lowercase) base = base.toLowerCase() as z.ZodString;

  // Eagerly create the format schema once (outside the refine closure).
  const formatSchema = config.format ? getFormatSchema(config.format) : null;

  const withConstraints: z.ZodString = base.superRefine((value, ctx) => {
    const errors: string[] = [];

    // Format validation — runs the standalone Zod v4 schema against the value.
    if (formatSchema) {
      const result = formatSchema.safeParse(value);
      if (!result.success) {
        errors.push(result.error.issues[0]?.message ?? 'Formato inválido');
      }
    }

    if (config.min && value.length < config.min.value)
      errors.push(config.min.message ?? `Debe tener al menos ${config.min.value} caracteres`);
    if (config.max && value.length > config.max.value)
      errors.push(config.max.message ?? `No puede tener más de ${config.max.value} caracteres`);
    if (config.pattern && !config.pattern.pattern.test(value)) errors.push(config.pattern.message);
    if (config.reserved) {
      const lower = value.toLowerCase();
      if (config.reserved.words.some((w) => lower.includes(w)))
        errors.push(config.reserved.message ?? 'Contiene una palabra reservada');
    }
    if (errors.length > 0)
      ctx.addIssue({ code: 'custom', message: `${config.label} inválido. ${errors.join('. ')}` });
  }) as z.ZodString;
  // Cast to ZodString is safe: in Zod v4, superRefine on ZodString returns ZodString,
  // not ZodEffects (unlike Zod v3).

  if (config.nullable === true) {
    return {
      schema: withConstraints.nullable(),
      rules: config.rules,
    } as FieldDefReturn<TConfig['nullable'] extends true ? true : false>;
  }

  return {
    schema: withConstraints,
    rules: config.rules,
  } as FieldDefReturn<TConfig['nullable'] extends true ? true : false>;
}
//#endregion
