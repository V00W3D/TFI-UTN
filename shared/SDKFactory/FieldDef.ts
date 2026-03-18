import { z } from 'zod';
import { ERR } from './ErrorCodes';

//#region CONFIG_TYPES
/**
 * @public
 * @summary Constraint configuration for minimum and maximum string length.
 */
type LengthConstraint = {
  /** @description The boundary value (inclusive). */
  value: number;
  /** @description Custom error message. A sensible default is generated when omitted. */
  message?: string;
};
/**
 * @public
 * @summary Constraint configuration for regex pattern validation.
 */
type PatternConstraint = {
  /** @description The regular expression to test against the trimmed value. */
  pattern: RegExp;
  /**
   * @description Error message shown when the pattern does not match.
   * A generic message including the error code is generated when omitted.
   */
  message?: string;
};
/**
 * @public
 * @summary Constraint configuration for reserved word detection.
 */
type ReservedConstraint = {
  /** @description List of forbidden substrings (matched case-insensitively). */
  words: string[];
  /** @description Custom error message. Defaults to a generic reserved-word message. */
  message?: string;
};
/**
 * @public
 * @summary Full configuration accepted by {@link defineField}.
 * @remarks
 * Every property except `label` and `rules` is optional, enabling surgical per-field composition.
 * Set `nullable: true` to accept both `null` and whitespace-only input as valid empty values.
 */
export type FieldDefConfig = {
  /**
   * @description Human-readable field label used as the prefix in validation error messages.
   * @example `'Nombre'` → error reads `"Nombre inválido: debe tener al menos 2 caracteres."`
   */
  label: string;
  /**
   * @description Strips leading and trailing whitespace before validation.
   * @defaultValue `true`
   */
  trim?: boolean;
  /**
   * @description Lowercases the value before validation (e.g. for emails).
   * @defaultValue `false`
   */
  lowercase?: boolean;
  /** @description Minimum character length constraint. */
  min?: LengthConstraint;
  /** @description Maximum character length constraint. */
  max?: LengthConstraint;
  /**
   * @description Regex pattern that the value must satisfy.
   * @remarks You can use one of the built-in presets from {@link PATTERNS} or supply a custom one.
   */
  pattern?: PatternConstraint;
  /** @description Forbidden substrings that the value must not contain. */
  reserved?: ReservedConstraint;
  /**
   * @description Whether to accept `null` and whitespace-only input as valid empty values.
   * @remarks
   * When `true`, the schema preprocesses the input so that:
   * - `''` (empty string) is coerced to `null` before validation.
   * - Whitespace-only strings (e.g. `'   '`) are trimmed and then coerced to `null`.
   * This avoids browser warnings caused by passing `null` directly to controlled inputs.
   * @defaultValue `false`
   */
  nullable?: boolean;
  /**
   * @description Human-readable rules displayed as hints or help text in the UI.
   * @remarks These are NOT runtime constraints — they are purely informational for the end user.
   */
  rules: readonly string[];
};

/**
 * @internal
 * @summary Zod v4 type aliases for the schemas produced by {@link defineField}.
 * @remarks
 * In Zod v4, `.superRefine()` on a `ZodString` returns `ZodString` (the refinement is embedded
 * in the string schema rather than wrapped in a `ZodPipe`).
 * The nullable variant uses `z.preprocess`, which produces `ZodPipe<ZodTransform, ZodNullable<ZodString>>`.
 * We expose both as clean public-facing types so consumers never need to import Zod internals.
 */
type FieldString = z.ZodString;
type FieldStringNullable = z.ZodType<string | null>;

/**
 * @public
 * @summary The output of {@link defineField}: a validated Zod schema paired with UI hint rules.
 * @remarks
 * Use `z.infer<FieldDef['schema']>` to extract the TypeScript type.
 * @template TSchema - The Zod schema type produced by this field definition.
 */
export type FieldDef<TSchema extends z.ZodTypeAny> = {
  /** @description The Zod schema for this field, ready for use in contracts and form stores. */
  schema: TSchema;
  /** @description Human-readable validation rules for display as hints in the UI. */
  rules: readonly string[];
};
//#endregion

//#region PATTERNS
/**
 * @public
 * @summary Built-in regex presets for common field types.
 * @remarks
 * Use these as the `pattern` property in {@link FieldDefConfig} or compose your own.
 * All patterns target the *trimmed* value (trim is applied before validation by default).
 */
export const PATTERNS = {
  /**
   * E.164 international phone number — max 15 chars total (to fit VarChar(15) in DB).
   * Matches the format produced by react-phone-number-input (e.g. `+5493811234567`).
   * `+` (1) + country digit (1) + 6–13 more digits = 8–15 chars.
   */
  PHONE_E164: /^\+[1-9]\d{6,13}$/,

  /** RFC 5322-inspired email. Covers the vast majority of real-world addresses. */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,

  /** URL with optional protocol (http / https). Covers most consumer-facing URLs. */
  URL: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/,

  /** URL that explicitly requires https://. Use for security-sensitive inputs. */
  URL_HTTPS: /^https:\/\/([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/,

  /**
   * Username: letters, digits, and underscores only. No spaces.
   * Common convention for login names (e.g. `john_doe`, `user123`).
   */
  USERNAME: /^[a-zA-Z0-9_]+$/,

  /** Password strength: at least one uppercase, lowercase, digit, and special character. */
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,

  /**
   * Human name: letters (including accented), spaces, hyphens, and apostrophes.
   * Covers names like `María José`, `O'Brien`, `Anne-Marie`.
   */
  NAME: /^[A-Za-zÀ-ÿ\s'-]+$/,

  /**
   * Numeric string: digits only. Useful for codes, zip codes, document numbers, etc.
   * Does NOT allow decimals or signs — use NUMBER_DECIMAL for those.
   */
  NUMERIC: /^\d+$/,

  /**
   * Decimal number: optional sign, digits, optional decimal point followed by digits.
   * Accepts `42`, `-3.14`, `+1000.5`.
   */
  NUMBER_DECIMAL: /^[+-]?\d+(\.\d+)?$/,

  /**
   * UUID v4 (lowercase hyphenated). Matches the standard RFC 4122 format.
   * Example: `550e8400-e29b-41d4-a716-446655440000`
   */
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,

  /**
   * Slug: lowercase letters, digits, and hyphens. No leading/trailing hyphens.
   * Common for URL-friendly identifiers (e.g. `my-blog-post`, `product-123`).
   */
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

  /**
   * Date in ISO 8601 format: `YYYY-MM-DD`.
   * Does NOT validate calendar correctness (e.g. `2024-02-31` would pass).
   */
  DATE_ISO: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,

  /**
   * Time in `HH:MM` or `HH:MM:SS` 24-hour format.
   * Example: `14:30`, `09:05:00`.
   */
  TIME_24H: /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,

  /**
   * Hexadecimal color code.
   * Accepts 3-digit (`#FFF`) or 6-digit (`#FFFFFF`) forms, case-insensitive.
   */
  HEX_COLOR: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,

  /**
   * IPv4 address (basic). Validates the octet ranges 0–255.
   * Example: `192.168.1.1`.
   */
  IPV4: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,

  /**
   * Postal / ZIP code: 4–10 alphanumeric characters, optional internal spaces or hyphens.
   * Covers AR (4-digit), US (5+4), UK (multiple formats), etc.
   */
  POSTAL_CODE: /^[A-Z0-9]{1,4}[\s-]?[A-Z0-9]{1,6}$/i,

  /**
   * Argentine CUIL/CUIT. Format: `XX-XXXXXXXX-X` or 11 consecutive digits.
   * Example: `20-12345678-9`, `20123456789`.
   */
  CUIL_CUIT: /^((\d{2}-\d{8}-\d)|\d{11})$/,

  /**
   * Argentine DNI. 7–8 digits, optionally separated by dots every 3 digits.
   * Example: `12345678`, `12.345.678`.
   */
  DNI: /^\d{1,3}(\.?\d{3}){1,2}$/,

  /**
   * Credit card number (Luhn-naive). Accepts 13–19 digits, optional spaces or hyphens.
   * NOTE: this only checks the format, not the Luhn checksum.
   */
  CREDIT_CARD: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{1,7}$/,

  /**
   * No consecutive or leading/trailing whitespace.
   * Useful for display names that allow internal spaces but not padding or double-spaces.
   */
  NO_EXTRA_SPACES: /^(?!\s)(?!.*\s{2}).*(?<!\s)$/,
} as const;
//#endregion

//#region FACTORY
/**
 * @public
 * @summary Creates a field definition (schema + UI rules) from a declarative configuration.
 * @remarks
 * The factory composes a `z.string()` base with any combination of length, pattern, and reserved-word
 * constraints, all collected into a single `superRefine` so only one error object is emitted per field.
 *
 * Error messages are generic and aligned with the project's `ERROR_CODES`:
 * - Length violations → `VALUE_OUT_OF_RANGE` / `VALUE_TOO_LONG`
 * - Pattern violations → `VALUE_INVALID`
 * - Reserved words    → `RESERVED_VALUE`
 *
 * When `nullable: true`, a `z.preprocess` step coerces `''` and whitespace-only input to `null`
 * before validation — eliminating the need to ever pass `null` directly from browser inputs.
 *
 * @param config - The {@link FieldDefConfig} describing this field's constraints and UI rules.
 * @returns A {@link FieldDef} containing the composed Zod schema and the rules array.
 * @example
 * ```ts
 * export const usernameField = defineField({
 *   label: 'Usuario',
 *   min: { value: 4 },
 *   max: { value: 32 },
 *   pattern: { pattern: PATTERNS.USERNAME },
 *   reserved: { words: ['admin', 'root'] },
 *   rules: ['Entre 4 y 32 caracteres.', 'Sin espacios.'],
 * });
 * ```
 */
export function defineField(config: FieldDefConfig & { nullable?: false }): FieldDef<FieldString>;
export function defineField(
  config: FieldDefConfig & { nullable: true },
): FieldDef<FieldStringNullable>;
export function defineField(config: FieldDefConfig): FieldDef<z.ZodTypeAny> {
  let base: z.ZodString = z.string();
  if (config.trim !== false) base = base.trim();
  if (config.lowercase) base = base.toLowerCase();

  const withValidation = base.superRefine((value, ctx) => {
    const errors: string[] = [];

    if (config.min && value.length < config.min.value)
      errors.push(
        config.min.message ??
          `${config.label} inválido: debe tener al menos ${config.min.value} caracteres. [${ERR.VALUE_INVALID().code}]`,
      );

    if (config.max && value.length > config.max.value)
      errors.push(
        config.max.message ??
          `${config.label} inválido: no puede superar los ${config.max.value} caracteres. [${ERR.VALUE_TOO_LONG().code}]`,
      );

    if (config.pattern && !config.pattern.pattern.test(value))
      errors.push(
        config.pattern.message ??
          `${config.label} inválido: el formato no es correcto. [${ERR.VALUE_INVALID().code}]`,
      );

    if (config.reserved) {
      const lower = value.toLowerCase();
      if (config.reserved.words.some((word) => lower.includes(word)))
        errors.push(
          config.reserved.message ??
            `${config.label} inválido: contiene un valor reservado. [${ERR.RESERVED().code}]`,
        );
    }

    if (errors.length)
      ctx.addIssue({
        code: 'custom',
        message: errors.join(' '),
      });
  });

  if (config.nullable) {
    return {
      schema: z.preprocess(
        // Coerce '' and whitespace-only input to null — prevents passing null to browser inputs
        (v) => (typeof v === 'string' && v.trim() === '' ? null : v),
        withValidation.nullable(),
      ),
      rules: config.rules,
    };
  }

  return { schema: withValidation, rules: config.rules };
}
//#endregion

//#region TYPE_HELPERS
/**
 * @public
 * @summary Extracts the TypeScript type inferred from a {@link FieldDef}'s schema.
 * @template TField - A field definition produced by {@link defineField}.
 * @example
 * ```ts
 * type Username = FieldInfer<typeof usernameField>; // string
 * type Phone    = FieldInfer<typeof phoneField>;    // string | null
 * ```
 */
export type FieldInfer<TField extends FieldDef<z.ZodTypeAny>> = z.infer<TField['schema']>;
//#endregion
