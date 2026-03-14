import type { Contract, InferRequest, InferResponse } from './ContractFactory';

/* ============================================================
UTILS
============================================================ */

/** Extracts success payload from contract response */
type ExtractSuccess<T> = T extends { ok: true; data: infer D } ? D : never;

/** Extracts error payload from contract response */
type ExtractError<T> = T extends { ok: false; error: infer E } ? E : never;

/* ============================================================
RESULT TYPE
============================================================ */

export type ApiResult<TContract extends Contract<any, any, any, any>> = {
  status: number;
  headers: Headers;
} & InferResponse<TContract>;

/* ============================================================
CLIENT CONFIG
============================================================ */

type ClientOptions = {
  baseURL: string;
  credentials?: RequestCredentials;
};

/* ============================================================
FETCH CORE
============================================================ */

const callContract = async <T extends Contract<any, any, any, any>>(
  config: ClientOptions,
  contract: T,
  input: InferRequest<T>,
): Promise<ApiResult<T>> => {
  const res = await fetch(`${config.baseURL}${contract.endpoint}`, {
    method: contract.method,
    credentials: config.credentials ?? 'same-origin',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const json = await res.json();

  const parsed = contract.O.parse(json);

  return {
    ...parsed,
    status: res.status,
    headers: res.headers,
  };
};

/* ============================================================
ENDPOINT BUILDER
============================================================ */

const createEndpoint = <T extends Contract<any, any, any, any>>(
  config: ClientOptions,
  contract: T,
) => {
  return (input: InferRequest<T>) => callContract(config, contract, input);
};

/* ============================================================
SDK GENERATOR
============================================================ */

export const createApi = <const T extends readonly Contract<any, any, any, any>[]>(
  contracts: T,
  options: ClientOptions,
) => {
  const api: any = {};

  for (const contract of contracts) {
    const group = contract.module;
    const method = contract.action;

    if (!api[group]) api[group] = {};

    api[group][method] = createEndpoint(options, contract);
  }

  return api as {
    [C in T[number] as C['module']]: {
      [K in Extract<T[number], { module: C['module'] }>['action']]: (
        input: InferRequest<Extract<T[number], { module: C['module']; action: K }>>,
      ) => Promise<ApiResult<Extract<T[number], { module: C['module']; action: K }>>>;
    };
  };
};
