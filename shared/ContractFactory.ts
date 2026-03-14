import { z } from 'zod';
import { createPublicErrorSchema } from '@tools/ErrorTools';

/* #region CONFIG */
/** Central API structure. Modify here to add/remove modules or actions. Types are inferred automatically for autocompletion. */
export const API_STRUCTURE = {
  IAM: ['login', 'register', 'logout'],
  POS: ['open', 'close', 'charge'],
  CUSTOMER: ['create', 'update', 'delete'],
  ADMIN: ['createUser', 'deleteUser'],
  KITCHEN: ['startOrder', 'finishOrder'],
} as const;
/* #endregion */

/* #region TYPES */
/** Full API structure type */
type ApiStructure = typeof API_STRUCTURE;
/** Available modules */
type Module = keyof ApiStructure;
/** Available actions per module */
type Action<M extends Module> = ApiStructure[M][number];
/** Allowed HTTP methods */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
/** Endpoint access level */
type AccessLevel = 'public' | 'auth' | 'role' | 'internal';
/* #endregion */

/* #region UTILS */
/** Converts a Zod schema to readonly */
const ro = <T extends z.ZodType>(s: T): z.ZodReadonly<T> => s.readonly();
/** Success response schema wrapper */
const success = <T extends z.ZodType>(d: T) => z.object({ ok: z.literal(true), data: d });
/** Error response schema wrapper */
const error = <T extends z.ZodType>() => {
  const E = createPublicErrorSchema<T>();
  return z.object({ ok: z.literal(false) }).extend(E.shape);
};
/** Runtime registry to avoid duplicate endpoints during server boot */
const endpointRegistry = new Set<string>();
/* #endregion */

/* #region CONTRACT */
/** Mutable contract used internally before freezing */
type MutableContract<
  I extends z.ZodType,
  O extends z.ZodType,
  M extends Module,
  A extends Action<M>,
> = {
  access: AccessLevel;
  method: HttpMethod;
  module: M;
  action: A;
  endpoint: `/${M}/${A}`;
  summary: string;
  description: string;
  deprecated: boolean;
  I: I;
  O: O;
};
/** Public readonly contract type */
export type Contract<
  I extends z.ZodType,
  O extends z.ZodType,
  M extends Module,
  A extends Action<M>,
> = Readonly<MutableContract<I, O, M, A>>;
/* #endregion */

/* #region BUILDER_STATE */
/** Internal builder state */
type BuilderState<M extends Module, A extends Action<M>> = {
  access: AccessLevel;
  method: HttpMethod;
  module: M;
  action: A;
  summary: string;
  description: string;
  deprecated: boolean;
};
/* #endregion */

/* #region BUILDER */
/** Internal builder responsible for constructing typed contracts */
const createBuilder = <M extends Module, A extends Action<M>>(
  access: AccessLevel,
  method: HttpMethod,
  module: M,
  action: A,
) => {
  const state: BuilderState<M, A> = {
    access,
    method,
    module,
    action,
    summary: '',
    description: '',
    deprecated: false,
  };
  const endpoint: `/${M}/${A}` = `/${module}/${action}`;
  if (endpointRegistry.has(endpoint)) throw new Error(`Duplicate endpoint detected: ${endpoint}`);
  endpointRegistry.add(endpoint);
  return {
    IO: <I extends z.ZodType, O extends z.ZodType>(input: I, output: O) => {
      const Iro = ro(input);
      const Oro = ro(z.discriminatedUnion('ok', [success(output), error<I>()]));
      const contract: MutableContract<typeof Iro, typeof Oro, M, A> = {
        access: state.access,
        method: state.method,
        module: state.module,
        action: state.action,
        endpoint,
        summary: state.summary,
        description: state.description,
        deprecated: state.deprecated,
        I: Iro,
        O: Oro,
      };
      const api = {
        /** Adds documentation metadata used by TypeDoc or OpenAPI generators */ doc: (
          title: string,
          description: string = '',
        ) => {
          contract.summary = title;
          contract.description = description;
          return api;
        },
        /** Marks endpoint as deprecated */ deprecated: () => {
          contract.deprecated = true;
          return api;
        },
        /** Finalizes and freezes the contract */ build: (): Contract<
          typeof Iro,
          typeof Oro,
          M,
          A
        > => Object.freeze(contract),
      };
      return api;
    },
  };
};
/* #endregion */

/* #region PUBLIC_API */
/** Entry point for building API contracts */
export const Contract = {
  follow: <M extends Module, A extends Action<M>>(
    access: AccessLevel,
    method: HttpMethod,
    module: M,
    action: A,
  ) => createBuilder(access, method, module, action),
};
/* #endregion */

/* #region HELPERS */
/** Infers request type from a contract */
export type InferRequest<T extends Contract<z.ZodType, z.ZodType, Module, any>> = z.input<T['I']>;
/** Infers response type from a contract */
export type InferResponse<T extends Contract<z.ZodType, z.ZodType, Module, any>> = z.output<T['O']>;
/* #endregion */
