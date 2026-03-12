import { z } from 'zod';
import { PublicErrorSchema } from './ErrorTools';

/* ============================================================
   CONTRACT STRUCTURE
============================================================ */

export type Contract<I extends z.ZodTypeAny, O extends z.ZodTypeAny> = Readonly<{
  I: I;
  O: O;
}>;

/* ============================================================
   SUCCESS BUILDER
============================================================ */

const buildSuccess = <T extends z.ZodTypeAny>(data: T) =>
  z
    .object({
      ok: z.literal(true),
      data,
    })
    .readonly();

/* ============================================================
   ERROR BUILDER
============================================================ */

const buildError = () =>
  z
    .object({
      ok: z.literal(false),
    })
    .extend(PublicErrorSchema.shape)
    .readonly();

/* ============================================================
   FACTORY
============================================================ */

export function createContract<TInput extends z.ZodTypeAny, TSuccess extends z.ZodTypeAny>(
  input: TInput,
  successSchema: TSuccess,
) {
  const InputSchema = input.readonly();

  const SuccessSchema = buildSuccess(successSchema);
  const ErrorSchema = buildError();

  const OutputSchema = z.discriminatedUnion('ok', [SuccessSchema, ErrorSchema]).readonly();

  return {
    I: InputSchema,
    O: OutputSchema,
  } as const;
}
