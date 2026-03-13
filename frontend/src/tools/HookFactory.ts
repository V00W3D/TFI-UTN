import { useState, useCallback } from 'react';
import axios from 'axios';
import { z } from 'zod';
import type { Contract } from '@shared/CoreSchema';
import { BACKEND_URL } from '@env';

/* ================= AXIOS ================= */

export const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

/* ================= TYPE HELPERS ================= */

type OutputOf<T extends z.ZodTypeAny> = z.infer<T>;

type SuccessOf<T extends z.ZodTypeAny> =
  Extract<OutputOf<T>, { ok: true }> extends { data: infer D } ? D : never;

type ErrorOf<T extends z.ZodTypeAny> = Extract<OutputOf<T>, { ok: false }>;

/* ================= FACTORY ================= */

export function createHook<TInput extends z.ZodTypeAny, TSuccess extends z.ZodTypeAny>(
  contract: Contract<TInput, TSuccess>,
) {
  type Input = z.infer<TInput>;
  type Output = z.infer<typeof contract.O>;
  type Success = SuccessOf<typeof contract.O>;
  type ErrorType = ErrorOf<typeof contract.O>;

  return function useApiHook() {
    const [data, setData] = useState<Success | null>(null);
    const [error, setError] = useState<ErrorType | null>(null);
    const [loading, setLoading] = useState(false);

    const execute = useCallback(
      async (opts?: { body?: Input; params?: any; headers?: Record<string, string> }) => {
        setLoading(true);
        setError(null);

        try {
          const body = opts?.body ? contract.I.parse(opts.body) : undefined;

          const res = await api.request({
            url: contract.path,
            method: contract.method,
            data: body,
            params: opts?.params,
            headers: opts?.headers,
          });

          const parsed = contract.O.parse(res.data) as Output;

          if (parsed.ok) {
            setData(parsed.data);
            return parsed.data;
          }

          setError(parsed);
          throw parsed;
        } catch (err) {
          if (err && typeof err === 'object' && 'ok' in err) {
            const typed = err as ErrorType;
            setError(typed);
            throw typed;
          }

          const fallback = {
            ok: false,
            error: { code: 'INTERNAL_ERROR' },
          } as unknown as ErrorType;

          setError(fallback);
          throw fallback;
        } finally {
          setLoading(false);
        }
      },

      [contract],
    );

    const hook = execute as typeof execute & {
      data: Success | null;
      error: ErrorType | null;
      loading: boolean;
    };

    hook.data = data;
    hook.error = error;
    hook.loading = loading;

    return hook;
  };
}
