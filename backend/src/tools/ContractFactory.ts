import { z } from 'zod';
import { PublicErrorSchema } from './ErrorTools';

/* ============================================================
   CONTRACT STRUCTURE
============================================================ */

export type Contract<TInput extends z.ZodTypeAny, TOutput extends z.ZodTypeAny> = Readonly<{
  I: TInput;
  O: TOutput;
}>;

/* ============================================================
   SUCCESS BUILDER
============================================================ */

const buildSuccess = <TData extends z.ZodTypeAny>(data: TData) =>
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
  } satisfies Contract<typeof InputSchema, typeof OutputSchema>;
}
