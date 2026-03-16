import type { Contract, InferRequest, InferResponse } from './ContractFactory';

type CredentialsMode = 'include';

export type ClientOptions = {
  baseURL: string;
  credentials: CredentialsMode;
};

type ContractsArray = readonly Contract<any, any>[];

type Modules<T extends ContractsArray> = T[number]['module'];

type Actions<T extends ContractsArray, M extends Modules<T>> = Extract<
  T[number],
  { module: M }
>['action'];

type ContractOf<T extends ContractsArray, M extends Modules<T>, A extends Actions<T, M>> = Extract<
  T[number],
  { module: M; action: A }
>;

type ApiResult<C extends Contract<any, any>> = {
  status: number;
  body: InferResponse<C>;
};

type Endpoint<C extends Contract<any, any>> = {
  call(input: InferRequest<C>): Promise<ApiResult<C>>;
};

export type ApiClient<T extends ContractsArray> = {
  [M in Modules<T>]: {
    [A in Actions<T, M>]: Endpoint<ContractOf<T, M, A>>;
  };
};

function encodeQuery(input: Record<string, string | number | boolean>): string {
  const params = new URLSearchParams();

  for (const key in input) {
    const value = input[key];
    params.append(key, String(value));
  }

  return params.toString();
}

async function callEndpoint<C extends Contract<any, any>>(
  options: ClientOptions,
  contract: C,
  input: InferRequest<C>,
): Promise<ApiResult<C>> {
  const method = contract.method;

  let url = `${options.baseURL}${contract.endpoint}`;

  const init: RequestInit = {
    method,
    credentials: options.credentials,
    headers: {
      'content-type': 'application/json',
    },
  };

  if (method === 'GET' || method === 'DELETE') {
    const query = encodeQuery(input as Record<string, string | number | boolean>);
    if (query) url += `?${query}`;
  } else {
    init.body = JSON.stringify(input);
  }

  const res = await fetch(url, init);

  const json = await res.json();

  return {
    status: res.status,
    body: json,
  };
}

function createEndpoint<C extends Contract<any, any>>(
  options: ClientOptions,
  contract: C,
): Endpoint<C> {
  return {
    call(input: InferRequest<C>) {
      return callEndpoint(options, contract, input);
    },
  };
}

export function createClient<const T extends ContractsArray>(
  options: ClientOptions,
  contracts: T,
): ApiClient<T> {
  const api: Record<string, Record<string, object>> = {};

  for (const contract of contracts) {
    const moduleName = contract.module;
    const actionName = contract.action;

    if (!api[moduleName]) {
      api[moduleName] = {};
    }

    api[moduleName][actionName] = createEndpoint(options, contract);
  }

  return api as ApiClient<T>;
}

export const defineContracts = <const T extends ContractsArray>(contracts: T) => contracts;
