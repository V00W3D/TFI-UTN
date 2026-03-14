import { useState, useCallback } from 'react';
import axios from 'axios';
import { z } from 'zod';
import type { Contract } from '@shared/CoreSchema';
import { BACKEND_URL } from '@env';

/* ============================================================
AXIOS
============================================================ */

export const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

/* ============================================================
TYPE HELPERS
============================================================ */

type SuccessOf<T> = Extract<T, { ok: true }> extends { data: infer D } ? D : never;

type ErrorOf<T> = Extract<T, { ok: false }>;

type RequestOptions<I> = {
  body?: I;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
};

/* ============================================================
HOOK FACTORY
============================================================ */

export function createHook<TContract extends Contract<z.ZodTypeAny, z.ZodTypeAny>>(
  contract: TContract,
) {
  type Input = z.input<TContract['I']>;

  type Output = z.output<TContract['O']>;

  type Success = SuccessOf<Output>;

  type ErrorType = ErrorOf<Output>;

  return function useApiHook() {
    const [data, setData] = useState<Success | null>(null);

    const [error, setError] = useState<ErrorType | null>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const execute = useCallback(
      async (opts?: RequestOptions<Input>): Promise<Success> => {
        setLoading(true);
        setError(null);

        try {
          const body = opts?.body !== undefined ? contract.I.parse(opts.body) : undefined;

          const res = await api.request({
            method: contract.method,
            url: contract.path,
            data: body,
            params: opts?.params,
            headers: opts?.headers,
            timeout: contract.timeout,
          });

          const parsed = contract.O.parse(res.data);

          if (parsed.ok) {
            setData(parsed.data);

            return parsed.data;
          }

          setError(parsed);

          throw parsed;
        } catch (error) {
          if (typeof error === 'object' && error !== null && 'ok' in error) {
            const typed = error as ErrorType;

            setError(typed);

            throw typed;
          }

          const fallback: ErrorType = {
            ok: false,
            error: {
              code: 'INTERNAL_ERROR',
            },
          };

          setError(fallback);

          throw fallback;
        } finally {
          setLoading(false);
        }
      },
      [contract],
    );

    return Object.assign(execute, {
      data,
      error,
      loading,
    });
  };
}
