import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import chalk from 'chalk';
import { Router as ExpressRouter } from 'express';
import type { Router, Request, Response, NextFunction } from 'express';

import { PrismaClient } from '@config/db/prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { BACKEND_URL, BACKEND_HOST, BACKEND_PORT, DATABASE_URL, BUN_MODE } from '@env';
import type { ContractAny, InferRequest, InferSuccess } from '@shared/ContractFactory';
import { ErrorTools } from '@tools/ErrorTools';
import { authMiddleware } from '@middleware/authMiddleware';
import { roleMiddleware } from '@middleware/roleMiddleware';

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: DATABASE_URL }),
});

type Middleware = (req: Request, res: Response, next: NextFunction) => unknown;
type HttpVerb = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type RequestContext = Readonly<{ req: Request; res: Response }>;
export type Handler<C extends ContractAny> = (
  input: InferRequest<C>,
  ctx: RequestContext,
) => Promise<InferSuccess<C>>;
export type ContractHandler<C extends ContractAny> = Handler<C>;
export type CorsConfig = { origins: string[]; credentials?: boolean };
export type ApiConfig = Readonly<{
  cors?: CorsConfig | false;
  helmet?: boolean;
  cookies?: boolean;
  routers: ConductorRouter[];
}>;
export type ConductorRouter = Router & { readonly $entries: ReadonlyArray<RouteEntry> };

type ExecuteFn = (rawInput: unknown, ctx: RequestContext) => Promise<unknown>;
type RouteEntry = Readonly<{ contract: ContractAny; execute: ExecuteFn; roles?: string[] }>;

const C = {
  express: chalk.hex('#61AFEF'),
  prisma: chalk.hex('#7C3AED'),
  success: chalk.hex('#98C379'),
  error: chalk.hex('#E06C75'),
  warn: chalk.hex('#E5C07B'),
  dim: chalk.hex('#5C6370'),
  muted: chalk.hex('#ABB2BF'),
  time: chalk.hex('#56B6C2'),
  GET: chalk.hex('#98C379'),
  POST: chalk.hex('#61AFEF'),
  PUT: chalk.hex('#E5C07B'),
  PATCH: chalk.hex('#C678DD'),
  DELETE: chalk.hex('#E06C75'),
  public: chalk.hex('#98C379'),
  auth: chalk.hex('#E5C07B'),
  role: chalk.hex('#C678DD'),
  internal: chalk.hex('#E06C75'),
};

function clearConsole(): void {
  if (BUN_MODE === 'dev' && process.stdout.isTTY) {
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1Bc');
    console.clear();
  }
}

const DIVIDER = C.dim('─'.repeat(52));

function colorMethod(m: string): string {
  return ((C as Record<string, typeof chalk.green>)[m] ?? chalk.white)(m.padEnd(6));
}

function colorAccess(a: string): string {
  return ((C as Record<string, typeof chalk.green>)[a] ?? chalk.white)(a);
}

function ms(start: number): string {
  return C.time(`⧗ ${Date.now() - start}ms`);
}

function safeJson(val: unknown): string {
  try {
    const s = JSON.stringify(val);
    return s.length > 200 ? s.slice(0, 200) + C.dim('…') : s;
  } catch {
    return String(val);
  }
}

function logStartup(entries: ReadonlyArray<RouteEntry>, start: number, err?: unknown): void {
  clearConsole();
  console.log(`  ${C.express('◆ express')}  ${C.muted(BACKEND_URL)}`);
  console.log(`  ${C.prisma('◆ prisma')}   ${C.dim(DATABASE_URL)}`);
  console.log(`  ${DIVIDER}`);

  if (err) {
    console.log(`  ${C.error('✗')} ${ms(start)}  ${C.error(String(err))}`);
    console.log('');
    return;
  }

  console.log(`  ${C.success('✓')} ${ms(start)}  ${C.muted('ready')}`);
  console.log('');
  console.log(
    `  ${colorMethod('GET')}  ${C.muted('/')}${' '.repeat(26)}${colorAccess('public')}  ${C.dim('health')}`,
  );

  for (const e of entries) {
    const c = e.contract;
    const dep = c.__deprecated ? C.warn(' deprecated') : '';
    console.log(`  ${colorMethod(c.__method)}  ${C.muted(c.__endpoint)}${dep}`);
    console.log(`  ${' '.repeat(8)}${colorAccess(c.__access)}  ${C.dim(c.__summary)}`);
  }

  console.log(`  ${DIVIDER}`);
}

function logReq(
  method: string,
  path: string,
  input: unknown,
  start: number,
  result: unknown,
  ok: boolean,
): void {
  const icon = ok ? C.success('✓') : C.error('✗');
  const m = colorMethod(method);
  const p = C.muted(path);
  const timing = ms(start);

  console.log(`  ${icon}  ${m}  ${p}  ${timing}`);
  if (!ok) {
    console.log(`     ${C.dim('↳')} ${C.error(safeJson(result))}`);
  } else {
    console.log(`     ${C.dim('↳')} ${C.dim(safeJson(result))}`);
  }
  console.log(`     ${C.dim('·')} ${C.dim('input')} ${C.dim(safeJson(input))}`);
  console.log(`  ${DIVIDER}`);
}

function resolveSecurity(access: ContractAny['__access'], roles?: string[]): Middleware[] {
  switch (access) {
    case 'public':
      return [];
    case 'auth':
      return [authMiddleware];
    case 'internal':
      return [authMiddleware, roleMiddleware(['admin'])];
    case 'role':
      if (!roles?.length)
        throw new Error('Contract with access "role" requires a non-empty roles[] option');
      return [authMiddleware, roleMiddleware(roles)];
  }
}

async function runMiddlewares(mws: Middleware[], req: Request, res: Response): Promise<void> {
  for (const mw of mws) {
    await new Promise<void>((resolve, reject) =>
      mw(req, res, (err?: unknown) => (err ? reject(err) : resolve())),
    );
  }
}

function isQueryMethod(m: string): m is 'GET' | 'DELETE' {
  return m === 'GET' || m === 'DELETE';
}
function extractRawInput(method: string, req: Request): unknown {
  return isQueryMethod(method) ? req.query : req.body;
}
function httpStatus(error: unknown): number {
  return typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as Record<string, unknown>).status === 'number'
    ? (error as { status: number }).status
    : 400;
}

export function createHandler<C extends ContractAny>(
  contract: C,
  options?: { roles?: string[] },
): (fn: Handler<C>) => RouteEntry {
  return (fn: Handler<C>): RouteEntry => ({
    contract,
    execute: (rawInput, ctx) => fn(rawInput as InferRequest<C>, ctx),
    ...(options?.roles !== undefined ? { roles: options.roles } : {}),
  });
}

export function createRouter(entries: RouteEntry[]): ConductorRouter {
  const router = ExpressRouter() as ConductorRouter;

  for (const { contract, execute, roles } of entries) {
    const verb = contract.__method.toLowerCase() as HttpVerb;
    const security = resolveSecurity(contract.__access, roles);

    router[verb](contract.__endpoint, async (req: Request, res: Response) => {
      const start = Date.now();
      const rawInput = extractRawInput(contract.__method, req);

      try {
        await runMiddlewares(security, req, res);
      } catch (err) {
        const e = ErrorTools.catch(err);
        logReq(contract.__method, contract.__endpoint, rawInput, start, e, false);
        return res.status(httpStatus(err)).json(e);
      }

      const parsed = contract.__requestSchema.safeParse(rawInput);

      if (!parsed.success) {
        const e = ErrorTools.catch(
          parsed.error,
          contract.__requestSchema,
          rawInput as Record<string, unknown>,
        );
        logReq(contract.__method, contract.__endpoint, rawInput, start, e, false);
        return res.status(400).json(e);
      }

      try {
        const data = await execute(parsed.data, { req, res });
        if (BUN_MODE !== 'prod') contract.__outputSchema.parse(data);
        logReq(contract.__method, contract.__endpoint, parsed.data, start, data, true);
        return res.json({ data });
      } catch (err) {
        const e = ErrorTools.catch(
          err,
          contract.__requestSchema,
          rawInput as Record<string, unknown>,
        );
        logReq(contract.__method, contract.__endpoint, parsed.data, start, e, false);
        return res.status(httpStatus(err)).json(e);
      }
    });
  }

  Object.defineProperty(router, '$entries', {
    value: Object.freeze(entries),
    writable: false,
    enumerable: false,
  });
  return router;
}

export function InitializeApi(config: ApiConfig): { start: () => void } {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  if (config.cookies !== false) app.use(cookieParser());
  if (config.cors !== false && config.cors) {
    app.use(cors({ origin: config.cors.origins, credentials: config.cors.credentials ?? true }));
  }
  if (config.helmet !== false) app.use(helmet());

  app.get('/', (_req: Request, res: Response) => {
    const start = Date.now();
    const data = { status: 'ok' };
    logReq('GET', '/', {}, start, data, true);
    res.json(data);
  });

  const allEntries: RouteEntry[] = [];
  for (const router of config.routers) {
    app.use(router);
    allEntries.push(...router.$entries);
  }

  const entries = Object.freeze(allEntries);

  return {
    start() {
      const start = Date.now();
      app
        .listen(BACKEND_PORT, BACKEND_HOST, () => logStartup(entries, start))
        .on('error', (err) => {
          logStartup(entries, start, err);
          process.exit(1);
        });
    },
  };
}
