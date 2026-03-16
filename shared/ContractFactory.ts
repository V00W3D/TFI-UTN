import { z } from 'zod';
import { createPublicErrorSchema } from '@tools/ErrorTools';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type AccessLevel = 'public' | 'auth' | 'role' | 'internal';
type Endpoint = `/${string}/${string}`;

type HttpStatus = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 422 | 500;

const success = <T extends z.ZodType>(data: T) => z.object({ data });

const error = <T extends z.ZodType>() => {
  const E = createPublicErrorSchema<T>();
  return z.object({ error: E });
};

declare global {
  var __contract_endpoint_registry__: Set<string> | undefined;
}

const endpointRegistry =
  globalThis.__contract_endpoint_registry__ ??
  (globalThis.__contract_endpoint_registry__ = new Set<string>());

export type Contract<I extends z.ZodType, O extends z.ZodType> = Readonly<{
  access: AccessLevel;
  method: HttpMethod;
  endpoint: Endpoint;
  module: string;
  action: string;
  summary: string;
  description: string;
  deprecated: boolean;
  __request: z.input<I>;
  __response: z.output<O>;
}>;

const createBuilder = (access: AccessLevel, method: HttpMethod, endpoint: Endpoint) => {
  if (endpointRegistry.has(endpoint)) {
    throw new Error(`Duplicate endpoint detected: ${endpoint}`);
  }

  endpointRegistry.add(endpoint);

  const [, module, action] = endpoint.split('/');

  return {
    IO: <I extends z.ZodType, O extends z.ZodType>(input: I, output: O) => {
      const responseSchema = z.union([success(output), error<I>()]);

      const contract = {
        access,
        method,
        endpoint,
        module,
        action,
        summary: '',
        description: '',
        deprecated: false,
        __request: undefined!,
        __response: undefined!,
      };

      const api = {
        doc: (title: string, description: string = '') => {
          contract.summary = title;
          contract.description = description;
          return api;
        },

        deprecated: () => {
          contract.deprecated = true;
          return api;
        },

        build: (): Contract<I, typeof responseSchema> => Object.freeze(contract),
      };

      return api;
    },
  };
};

export const Contract = {
  follow: (access: AccessLevel, method: HttpMethod, endpoint: Endpoint) =>
    createBuilder(access, method, endpoint),
};

export type InferRequest<T extends Contract<z.ZodType, z.ZodType>> = T['__request'];

export type InferResponse<T extends Contract<z.ZodType, z.ZodType>> = T['__response'];

type HandlerResult<R> = {
  status: HttpStatus;
  body: R;
};

export const createHandler = <C extends Contract<z.ZodType, z.ZodType>>(
  contract: C,
  handler: (input: InferRequest<C>) => Promise<HandlerResult<InferResponse<C>>>,
) => {
  return async (
    req: { body: InferRequest<C> },
    res: { status: (s: number) => { json: (b: InferResponse<C>) => number } },
  ) => {
    const result = await handler(req.body);
    return res.status(result.status).json(result.body);
  };
};
