/**
 * @file ApiServer.ts
 * @module SDK
 * @description Expone la fabrica funcional del servidor tipado que conecta contratos, middleware y handlers.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-10
 * rnf: RNF-02
 *
 * @business
 * inputs: contratos, adapters, routers y handlers
 * outputs: servidor HTTP inicializable y routers tipados
 * rules: req.user proviene del JWT; validar entradas; aplicar roles; no depender de clases
 *
 * @technical
 * dependencies: express types, zod, ./Contracts, ./ErrorCodes
 * flow: registra contratos; resuelve seguridad; valida input; ejecuta handler; serializa respuesta o error
 *
 * @estimation
 * complexity: High
 * fpa: EO
 * story_points: 5
 * estimated_hours: 4
 *
 * @testing
 * cases: TC-IAM-ROLE-01
 *
 * @notes
 * decisions: toda la orquestacion del servidor permanece en factories funcionales para cumplir context.md
 */
/**
 * @file packages/sdk/ApiServer.ts
 * @description Backend server factory — fully decoupled from Express, env vars,
 * auth middleware, and error utilities. The backend injects all of those as adapters.
 *
 * Imports:
 *   ✅ { z } from 'zod'                   — ErrorAdapter param typing
 *   ✅ import type { ... } from 'express' — zero runtime cost
 *   ✅ ./Contracts                         — SDK contract types
 *   ✅ ./ErrorCodes                        — AppError, ERR, httpStatusFrom, PublicErrorEnvelope
 *   ❌ express()  cors()  helmet()         — lives in apps/backend
 *   ❌ authMiddleware / roleMiddleware     — injected as adapters
 *   ❌ ENV vars                            — passed via ServerEnv
 */

import * as z from 'zod';
import type { Router, Request, Response, NextFunction } from 'express';
import type { AnyContract, InferRequest, InferSuccess } from './Contracts';
import { AppError, ERR, httpStatusFrom, type PublicErrorEnvelope } from './ErrorCodes';

//#region ADAPTER_TYPES
/** @public Minimal Express-compatible middleware signature. */
export type Middleware = (req: Request, res: Response, next: NextFunction) => unknown;

/** @public Security middleware factories injected by the backend. */
export type SecurityAdapter = {
  auth: Middleware;
  role: (roles: string[]) => Middleware;
};

/**
 * @public
 * @summary Error formatting function injected by the backend.
 * @remarks
 * Returns {@link PublicErrorEnvelope} — typed so consumers can narrow on the result.
 * The SDK calls this with exactly three shapes:
 *   onError(err)                          — auth middleware failure
 *   onError(err, schema, input)           — handler failure
 *   onError(validationErr, schema, input) — Zod validation failure
 */
export type ErrorAdapter = (
  error: unknown,
  schema?: z.ZodType,
  input?: Record<string, unknown>,
) => PublicErrorEnvelope;

/** @public Server environment values injected by the backend. */
export type ServerEnv = {
  url: string;
  host: string;
  port: number;
  mode: 'dev' | 'prod';
};

/**
 * @public
 * @summary A database (or any async service) adapter passed to `api.init({ db: [...] })`.
 * @remarks
 * The server will call `connect()` on every adapter before listening.
 * If any adapter throws, the server exits with code 1 — never starts without all services.
 *
 * @example
 * ```ts
 * // apps/backend/src/db.ts
 * export const prismaAdapter: DatabaseAdapter = {
 *   name: 'prisma',
 *   url: DATABASE_URL,
 *   connect: () => prisma.$connect(),
 * };
 * ```
 */
export type DatabaseAdapter = {
  /** Display name shown in the startup log (e.g. `'prisma'`, `'redis'`). */
  name: string;
  /** Connection URL shown in the startup log. Omit to hide sensitive values. */
  url?: string;
  /** Called before the HTTP server starts. Must resolve to confirm the service is reachable. */
  connect: () => Promise<void>;
};

/** @public All adapters the backend must provide to {@link createServerApi}. */
export type ServerAdapters = {
  routerFactory: () => Router;
  security: SecurityAdapter;
  onError: ErrorAdapter;
  env: ServerEnv;
};
//#endregion

//#region PUBLIC_TYPES
/** @public The `req`/`res` pair injected into every handler. */
export type RequestContext = Readonly<{ req: Request; res: Response }>;

/** @public A handler function bound to a specific contract. */
export type Handler<C extends AnyContract> = (
  input: InferRequest<C>,
  ctx: RequestContext,
) => Promise<InferSuccess<C>>;

/** @internal Erases per-contract generics for runtime use. */
type ExecuteFn = (input: unknown, ctx: RequestContext) => Promise<unknown>;

/** @public A single registered route entry, parameterized by its contract. */
export type RouteEntry<C extends AnyContract = AnyContract> = Readonly<{
  contract: C;
  execute: ExecuteFn;
  roles?: string[];
}>;

/** @public Express Router augmented with `$entries` for startup introspection. */
export type ModuleRouter = Router & { readonly $entries: ReadonlyArray<RouteEntry> };

/**
 * @public
 * @summary Configuration for `api.init()`.
 * @remarks
 * `db` receives an array so you can pass multiple service adapters
 * (e.g. Prisma + Redis). All are connected before the server listens —
 * if any fails the process exits with code 1.
 */
export type ServerConfig = Readonly<{
  /** Express app instance — fully configured by the backend before passing here. */
  app: import('express').Application;
  /** Module routers to mount on the app. */
  routers: ModuleRouter[];
  /**
   * Database / service adapters.
   * All are connected in parallel before `app.listen` is called.
   * A single failure aborts startup.
   */
  db: readonly DatabaseAdapter[];
}>;

/** @internal Role options for protected contracts. */
type RoleOptions = { roles: string[] };

/** @internal Narrows a contract union by `__id`. */
type ContractById<
  TContracts extends readonly AnyContract[],
  TId extends TContracts[number]['__id'],
> = Extract<TContracts[number], { __id: TId }>;

/** @public Server API instance returned by {@link createServerApi}. */
export type ServerApiInstance<TContracts extends readonly AnyContract[]> = {
  /** Creates a route entry with role override. */
  handler<TId extends TContracts[number]['__id']>(
    id: TId,
    options: RoleOptions,
  ): (fn: Handler<ContractById<TContracts, TId>>) => RouteEntry<ContractById<TContracts, TId>>;

  /** Creates a route entry without role override. */
  handler<TId extends TContracts[number]['__id']>(
    id: TId,
  ): (fn: Handler<ContractById<TContracts, TId>>) => RouteEntry<ContractById<TContracts, TId>>;

  /** Builds a {@link ModuleRouter} from a readonly tuple of route entries. */
  router<const TEntries extends readonly RouteEntry[]>(entries: TEntries): ModuleRouter;

  /** Connects all db adapters, mounts routers, and returns `{ start() }`. */
  init(config: ServerConfig): { start: () => void };
};
//#endregion

//#region LOGGING
const ANSI = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
} as const;

const VERB_COLORS: Record<string, string> = {
  GET: ANSI.green,
  POST: ANSI.blue,
  PUT: ANSI.yellow,
  PATCH: ANSI.magenta,
  DELETE: ANSI.red,
};
const ACCESS_COLORS: Record<string, string> = {
  public: ANSI.green,
  auth: ANSI.yellow,
  role: ANSI.magenta,
  internal: ANSI.red,
};

const DIVIDER = `${ANSI.dim}${'─'.repeat(56)}${ANSI.reset}`;

const colorVerb = (v: string) => `${VERB_COLORS[v] ?? ANSI.white}${v.padEnd(6)}${ANSI.reset}`;
const colorAccess = (a: string) => `${ACCESS_COLORS[a] ?? ANSI.white}${a.padEnd(8)}${ANSI.reset}`;
const elapsedMs = (t: number) => `${ANSI.cyan}⧗ ${Date.now() - t}ms${ANSI.reset}`;

const safeJson = (val: unknown): string => {
  try {
    const s = JSON.stringify(val);
    return s.length > 200 ? `${s.slice(0, 200)}${ANSI.dim}…${ANSI.reset}` : s;
  } catch {
    return String(val);
  }
};

const logStartup = (
  entries: ReadonlyArray<RouteEntry>,
  adapters: readonly DatabaseAdapter[],
  env: ServerEnv,
  start: number,
  err?: unknown,
): void => {
  if (env.mode === 'dev' && process.stdout.isTTY) {
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1Bc');
    console.clear();
  }

  // ── Service headers ───────────────────────────────────────
  console.log(`  ${ANSI.blue}◆ express${ANSI.reset}  ${ANSI.white}${env.url}${ANSI.reset}`);
  for (const db of adapters) {
    const urlPart = db.url ? `  ${ANSI.dim}${db.url}${ANSI.reset}` : '';
    console.log(`  ${ANSI.magenta}◆ ${db.name}${ANSI.reset}${urlPart}`);
  }
  console.log(`  ${DIVIDER}`);

  if (err) {
    console.log(
      `  ${ANSI.red}✗${ANSI.reset} ${elapsedMs(start)}  ${ANSI.red}${String(err)}${ANSI.reset}`,
    );
    console.log('');
    return;
  }

  console.log(`  ${ANSI.green}✓${ANSI.reset} ${elapsedMs(start)}  ${ANSI.white}ready${ANSI.reset}`);
  console.log('');

  // ── Route table — one line per route, dynamic path padding ─
  // Calculate the longest path to align the access/summary columns.
  const allPaths = ['/', ...entries.map((e) => e.contract.__path)];
  const pathWidth = Math.max(...allPaths.map((p) => p.length)) + 2;

  console.log(
    `  ${colorVerb('GET')}  ${ANSI.dim}${'/'.padEnd(pathWidth)}${ANSI.reset}  ${colorAccess('public')}  ${ANSI.dim}health${ANSI.reset}`,
  );

  for (const { contract: c } of entries) {
    const dep = c.__deprecated ? ` ${ANSI.yellow}⚠ deprecated${ANSI.reset}` : '';
    const pathStr = `${ANSI.dim}${c.__path.padEnd(pathWidth)}${ANSI.reset}`;
    console.log(
      `  ${colorVerb(c.__verb)}  ${pathStr}  ${colorAccess(c.__access)}  ${ANSI.dim}${c.__doc.summary}${ANSI.reset}${dep}`,
    );
  }

  console.log(`  ${DIVIDER}`);
};

const logRequest = (
  verb: string,
  path: string,
  input: unknown,
  start: number,
  result: unknown,
  ok: boolean,
): void => {
  const icon = ok ? `${ANSI.green}✓${ANSI.reset}` : `${ANSI.red}✗${ANSI.reset}`;
  const body = ok
    ? `${ANSI.dim}${safeJson(result)}${ANSI.reset}`
    : `${ANSI.red}${safeJson(result)}${ANSI.reset}`;
  console.log(
    `  ${icon}  ${colorVerb(verb)}  ${ANSI.dim}${path}${ANSI.reset}  ${elapsedMs(start)}`,
  );
  console.log(`     ${ANSI.dim}↳${ANSI.reset} ${body}`);
  console.log(`     ${ANSI.dim}· input ${safeJson(input)}${ANSI.reset}`);
  console.log(`  ${DIVIDER}`);
};
//#endregion

//#region SECURITY
const resolveSecurityChain = (
  access: AnyContract['__access'],
  security: SecurityAdapter,
  roles?: string[],
): Middleware[] => {
  switch (access) {
    case 'public':
      return [];
    case 'auth':
      return [security.auth];
    case 'internal':
      return [security.auth, security.role(['admin'])];
    case 'role':
      if (!roles?.length) throw ERR.INTERNAL(['roles option required for access: "role"']);
      return [security.auth, security.role(roles)];
  }
};

const runMiddlewareChain = async (
  mws: Middleware[],
  req: Request,
  res: Response,
): Promise<void> => {
  for (const mw of mws) {
    await new Promise<void>((resolve, reject) =>
      mw(req, res, (err?: unknown) => (err ? reject(err) : resolve())),
    );
  }
};

const isBodylessVerb = (verb: string): verb is 'GET' | 'DELETE' =>
  verb === 'GET' || verb === 'DELETE';

const extractRawInput = (verb: string, req: Request): unknown =>
  isBodylessVerb(verb) ? req.query : req.body;
//#endregion

//#region INTERNAL_BUILDERS
const buildRouterInternal = (
  entries: readonly RouteEntry[],
  adapters: ServerAdapters,
): ModuleRouter => {
  const router = adapters.routerFactory() as ModuleRouter;

  for (const { contract, execute, roles } of entries) {
    const verb = contract.__verb.toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete';
    const chain = resolveSecurityChain(contract.__access, adapters.security, roles);

    router[verb](contract.__path, async (req: Request, res: Response) => {
      const start = Date.now();
      const raw = extractRawInput(contract.__verb, req);

      // ── Auth / role middleware ─────────────────────────────
      try {
        await runMiddlewareChain(chain, req, res);
      } catch (err) {
        const appErr = AppError.is(err) ? err : ERR.UNAUTHORIZED();
        const body = adapters.onError(appErr);
        logRequest(contract.__verb, contract.__path, raw, start, body, false);
        return res.status(httpStatusFrom(appErr)).json(body);
      }

      // ── Input validation ───────────────────────────────────
      const parsed = contract.__requestSchema.safeParse(raw);
      if (!parsed.success) {
        const body = adapters.onError(
          parsed.error,
          contract.__requestSchema,
          raw as Record<string, unknown>,
        );
        logRequest(contract.__verb, contract.__path, raw, start, body, false);
        return res.status(400).json(body);
      }

      // ── Handler execution ──────────────────────────────────
      try {
        const data = await execute(parsed.data, { req, res });
        if (adapters.env.mode !== 'prod') contract.__responseSchema.parse(data);
        logRequest(contract.__verb, contract.__path, parsed.data, start, data, true);
        return res.json({ data });
      } catch (err) {
        const body = adapters.onError(
          err,
          contract.__requestSchema,
          raw as Record<string, unknown>,
        );
        logRequest(contract.__verb, contract.__path, parsed.data, start, body, false);
        return res.status(httpStatusFrom(err)).json(body);
      }
    });
  }

  Object.defineProperty(router, '$entries', {
    value: Object.freeze([...entries]),
    writable: false,
    enumerable: false,
  });

  return router;
};
//#endregion

//#region CREATE_SERVER_API
/**
 * @public
 * @summary Creates a fully-typed server API instance bound to a set of contracts.
 * @remarks
 * Call once in `apps/backend/src/api.ts`. All Express wiring stays in the backend.
 *
 * @example
 * ```ts
 * // apps/backend/src/api.ts
 * export const api = createServerApi(contracts, {
 *   routerFactory: () => Router(),
 *   security: { auth: authMiddleware, role: roleMiddleware },
 *   onError: ErrorTools.catch,
 *   env: { url: BACKEND_URL, host: BACKEND_HOST, port: BACKEND_PORT, mode: BUN_MODE },
 * });
 *
 * // apps/backend/src/main.ts
 * import { prismaAdapter } from './db';
 * api.init({ app, routers: [IAMRouter, StaffRouter], db: [prismaAdapter] }).start();
 * ```
 */
export const createServerApi = <const TContracts extends readonly AnyContract[]>(
  contracts: TContracts,
  adapters: ServerAdapters,
): ServerApiInstance<TContracts> => {
  const contractMap = new Map<string, AnyContract>(contracts.map((c) => [c.__id, c]));

  const handler = <TId extends TContracts[number]['__id']>(
    id: TId,
    options?: RoleOptions,
  ): ((
    fn: Handler<ContractById<TContracts, TId>>,
  ) => RouteEntry<ContractById<TContracts, TId>>) => {
    const contract = contractMap.get(id);
    if (!contract) throw ERR.INTERNAL([`[createServerApi] No contract found for id "${id}"`]);
    return (fn) =>
      ({
        contract: contract as ContractById<TContracts, TId>,
        execute: fn as ExecuteFn,
        ...(options?.roles && { roles: options.roles }),
      }) satisfies RouteEntry<ContractById<TContracts, TId>>;
  };

  return {
    handler,

    router<const TEntries extends readonly RouteEntry[]>(entries: TEntries): ModuleRouter {
      return buildRouterInternal(entries, adapters);
    },

    init({ app, routers, db }) {
      // Collect all route entries for the startup log.
      const allEntries: RouteEntry[] = [];
      for (const r of routers) {
        app.use(r);
        allEntries.push(...r.$entries);
      }
      const frozenEntries = Object.freeze(allEntries);

      return {
        async start() {
          const start = Date.now();

          // ── Connect all db adapters — server does NOT start if any fails ──
          try {
            await Promise.all(db.map((d) => d.connect()));
          } catch (err) {
            logStartup(frozenEntries, db, adapters.env, start, err);
            process.exit(1);
          }

          // ── Start HTTP server ────────────────────────────────────────────
          app
            .listen(adapters.env.port, adapters.env.host, () =>
              logStartup(frozenEntries, db, adapters.env, start),
            )
            .on('error', (err) => {
              logStartup(frozenEntries, db, adapters.env, start, err);
              process.exit(1);
            });
        },
      };
    },
  };
};
//#endregion
