import { z } from 'zod';

/* ============================================================
   1. CONTRACT BASE DEFINITIONS
============================================================ */

/**
 * Esquema base de error global del sistema.
 *
 * {
 *   ok: false;
 *   message: string;
 * }
 */
const zContractError = z.object({
  ok: z.literal(false),
  message: z.string(),
});

/* ============================================================
   2. CONTRACT STRUCTURAL TYPE
============================================================ */

/**
 * Tipo estructural de un contrato completo.
 *
 * I → Schema de entrada
 * O → Schema de salida exitosa
 * E → Schema de error
 */
export type Contract<TInput extends z.ZodTypeAny, TOutput extends z.ZodTypeAny> = {
  I: TInput;

  O: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    message: z.ZodString;
    data: TOutput;
  }>;

  E: typeof zContractError;
};

/* ============================================================
   3. INTERNAL BUILDER
============================================================ */

function buildZodContract<TInput extends z.ZodTypeAny, TOutput extends z.ZodTypeAny>(
  inputSchema: TInput,
  outputSchema: TOutput,
): Contract<TInput, TOutput> {
  return {
    I: inputSchema,

    O: z.object({
      ok: z.literal(true),
      message: z.string(),
      data: outputSchema,
    }),

    E: zContractError,
  };
}

/* ============================================================
   4. PUBLIC FACTORY
============================================================ */

export function createContract<TInput extends z.ZodTypeAny, TOutput extends z.ZodTypeAny>(
  input: TInput,
  output: TOutput,
): Contract<TInput, TOutput> {
  return buildZodContract(input, output);
}

/* ============================================================
   5. TYPE EXTRACTION UTILITIES
============================================================ */

/**
 * Extrae tipo inferido desde cualquier schema Zod
 */
export type ContractType<T extends z.ZodTypeAny> = z.infer<T>;

/**
 * Extrae tipo de entrada desde contrato
 */
export type ContractInput<T> = T extends Contract<infer I, any> ? z.infer<I> : never;

/**
 * Extrae tipo de salida exitosa desde contrato
 */
export type ContractOutput<T> = T extends Contract<any, any> ? z.infer<T['O']> : never;

/**
 * Extrae tipo de error desde contrato
 */
export type ContractError<T> = T extends Contract<any, any> ? z.infer<T['E']> : never;
