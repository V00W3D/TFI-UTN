import { z } from 'zod';

/* ============================================================
   1. CONTRACT BASE DEFINITIONS
============================================================ */

/**
 * Esquema base de error global del sistema.
 *
 * Todas las respuestas de error deben respetar estrictamente:
 *
 * {
 *   ok: false;
 *   message: string;
 * }
 *
 * Este formato es inmutable y no admite `data`.
 */
const zContractError = z
  .object({
    ok: z.literal(false),
    message: z.string(),
  })
  .readonly();

/* ============================================================
   2. ZOD CONTRACT SCHEMA BUILDER
============================================================ */

/**
 * Construye los tres schemas fundamentales de un contrato:
 *
 *  - Input
 *  - Output (success)
 *  - Error (global estándar)
 *
 * Este método es el único punto donde se generan estructuras Zod.
 * Su responsabilidad es exclusivamente estructural.
 *
 * @param inputSchema  Schema Zod que valida la entrada.
 * @param outputSchema Schema Zod que define el payload de éxito.
 *
 * @returns Objeto con los schemas I, O y E.
 */
function buildZodContract<TInput extends z.ZodTypeAny, TOutput extends z.ZodTypeAny>(
  inputSchema: TInput,
  outputSchema: TOutput,
) {
  const zContractInput = inputSchema;

  const zContractOutput = z
    .object({
      ok: z.literal(true),
      message: z.string(),
      data: outputSchema,
    })
    .readonly();

  return {
    I: zContractInput,
    O: zContractOutput,
    E: zContractError,
  } as const;
}

/* ============================================================
   3. PUBLIC CONTRACT FACTORY
============================================================ */

/**
 * Tipo estructural que representa un contrato completo.
 *
 * I → Schema de entrada
 * O → Schema de salida exitosa
 * E → Schema de error global
 */
export type Contract<TInput extends z.ZodTypeAny, TOutput extends z.ZodTypeAny> = {
  readonly I: TInput;
  readonly O: z.ZodReadonly<
    z.ZodObject<{
      ok: z.ZodLiteral<true>;
      message: z.ZodString;
      data: TOutput;
    }>
  >;
  readonly E: typeof zContractError;
};

/**
 * Creador universal de contratos tipados.
 *
 * Centraliza la definición estructural de:
 *
 *  - Input
 *  - Output
 *  - Error
 *
 * Permite mantener consistencia absoluta en toda la API.
 *
 * @example
 *
 * const LoginSchema = createContract(
 *   z.object({ identity: z.string() }),
 *   z.object({ id: z.string() })
 * );
 *
 * LoginSchema.I // Schema de entrada
 * LoginSchema.O // Schema de éxito
 * LoginSchema.E // Schema de error
 */
export function createContract<TInput extends z.ZodTypeAny, TOutput extends z.ZodTypeAny>(
  input: TInput,
  output: TOutput,
): Contract<TInput, TOutput> {
  return buildZodContract(input, output);
}

/* ============================================================
   4. TYPE EXTRACTION UTILITIES
============================================================ */

/**
 * Extrae el tipo TypeScript inferido desde cualquier schema Zod.
 *
 * @example
 * type LoginInput = ContractType<typeof LoginSchema.I>;
 */
export type ContractType<T extends z.ZodTypeAny> = z.infer<T>;

/**
 * Extrae el tipo de entrada desde un contrato.
 *
 * @example
 * type LoginInput = ContractInput<typeof LoginSchema>;
 */
export type ContractInput<T> = T extends Contract<infer I, any> ? z.infer<I> : never;

/**
 * Extrae el tipo de salida exitosa desde un contrato.
 *
 * @example
 * type LoginOutput = ContractOutput<typeof LoginSchema>;
 */
export type ContractOutput<T> =
  T extends Contract<any, infer O>
    ? {
        readonly ok: true;
        readonly message: string;
        readonly data: z.infer<O>;
      }
    : never;

/**
 * Extrae el tipo de error desde un contrato.
 *
 * @example
 * type LoginError = ContractError<typeof LoginSchema>;
 */
export type ContractError<T> =
  T extends Contract<any, any>
    ? {
        readonly ok: false;
        readonly message: string;
      }
    : never;
