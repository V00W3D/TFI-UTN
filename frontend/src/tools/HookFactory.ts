import { useState, useCallback } from 'react';
import axios, { type Method, type AxiosError } from 'axios';
import type { Contract } from '@shared/ContractFactory';
import { z } from 'zod';
import { BACKEND_URL } from '@env';

/* ============================================================
   AXIOS INSTANCE
============================================================ */

export const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});
/* ============================================================
   HOOK FACTORY
============================================================ */

export function createHook<TInput extends z.ZodTypeAny, TOutput extends z.ZodTypeAny>(
  endpoint: string,
  method: Method,
  contract: Contract<TInput, TOutput>,
) {
  type Input = z.infer<TInput>;
  type Output = z.infer<Contract<TInput, TOutput>['O']>;
  type ErrorType = z.infer<Contract<TInput, TOutput>['E']>;

  return function useApiHook() {
    const [response, setResponse] = useState<Output | null>(null);
    const [error, setError] = useState<ErrorType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const execute = useCallback(
      async (options?: {
        body?: Input;
        params?: Record<string, any>;
        headers?: Record<string, string>;
      }) => {
        setIsLoading(true);
        setIsSuccess(false);
        setIsError(false);
        setError(null);

        try {
          const axiosResponse = await api.request({
            url: endpoint,
            method,
            data: options?.body,
            params: options?.params,
            headers: options?.headers,
          });

          const parsed = contract.O.safeParse(axiosResponse.data);

          if (!parsed.success) {
            throw new Error('Invalid server response shape');
          }

          setResponse(parsed.data);
          setIsSuccess(true);

          return parsed.data;
        } catch (err) {
          let formattedError: ErrorType | null = null;

          if (axios.isAxiosError(err)) {
            const axiosError = err as AxiosError;

            if (axiosError.response?.data) {
              const parsedError = contract.E.safeParse(axiosError.response.data);

              if (parsedError.success) {
                formattedError = parsedError.data;
              }
            }
          }

          if (!formattedError) {
            formattedError = {
              ok: false,
              message: 'Unexpected error',
            } as ErrorType;
          }

          setError(formattedError);
          setIsError(true);

          throw formattedError;
        } finally {
          setIsLoading(false);
        }
      },
      [endpoint, method, contract],
    );

    return {
      execute,
      response,
      error,
      isLoading,
      isSuccess,
      isError,
    };
  };
}
