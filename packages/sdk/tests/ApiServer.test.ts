/**
 * @file ApiServer.test.ts
 * @module SDK/Tests
 * @description Unit tests for ApiServer backend factory, security middleware, and error adapter integration.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-10
 * rnf: RNF-02
 *
 * @business
 * inputs: server contracts, express handlers, middleware adapters
 * outputs: fully bound Express router and Server API instance
 * rules: auth and role adapters run before validation; Zod handles invalid payloads before handlers; handlers return successes or throw AppErrors
 *
 * @technical
 * dependencies: vitest, ApiServer, Contracts, Zod
 * flow: mock express req/res/next; build contracts; createServerApi; bind handler; execute bound route; verify adapter execution order and response format
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-API-SERVER-01 to TC-API-SERVER-03
 * ultima prueba exitosa: 2026-04-08 13:25:00
 *
 * @notes
 * decisions: Express is not started, we directly execute the route functions stored on the mock router to avoid port binding.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as z from 'zod';
import { defineEndpoint, collectContracts } from '../Contracts';
import { createServerApi } from '../ApiServer';
import { ERR } from '../ErrorCodes';
import type { Request, Response, NextFunction } from 'express';

const mockInput = z.object({ value: z.number() });
const mockOutput = z.object({ doubled: z.number() });

const testContract = defineEndpoint('role', 'POST /calc/double')
  .IO(mockInput, mockOutput)
  .doc('Double', 'Doubles a number.')
  .build();

const contracts = collectContracts(testContract);

describe('ApiServer', () => {
  let mockRouterDef: any;
  let mockAdapters: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRouterDef = {
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };
    mockAdapters = {
      routerFactory: () => mockRouterDef,
      security: {
        auth: vi.fn((req, res, next) => next()),
        role: vi.fn(() => (req: Request, res: Response, next: NextFunction) => next()),
      },
      onError: vi.fn((err) => ({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          params: ['value'],
          meta: { received: typeof err },
        },
      })),
      env: { url: 'http://loc', host: 'localhost', port: 3000, mode: 'dev' as const },
    };
  });

  it('TC-API-SERVER-01: registra el handler en el método correcto (POST)', () => {
    const api = createServerApi(contracts, mockAdapters);
    
    // El id del contrato es "POST /calc/double"
    const handlerDef = api.handler('POST /calc/double', { roles: ['ADMIN'] })(async (input) => {
      return { doubled: input.value * 2 };
    });

    const router = api.router([handlerDef]);

    expect(mockRouterDef.post).toHaveBeenCalledWith('/calc/double', expect.any(Function));
    expect((router as any).$entries.length).toBe(1);
    expect((router as any).$entries[0].roles).toEqual(['ADMIN']);
  });

  it('TC-API-SERVER-02: rechaza con 400 si la validación falla antes de ejecutar el handler', async () => {
    const api = createServerApi(contracts, mockAdapters);
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    
    const mockReq = { body: { value: 'not-a-number' } } as unknown as Request; // payload inválido

    let handlerCalled = false;
    const handlerDef = api.handler('POST /calc/double', { roles: ['ADMIN'] })(async () => {
      handlerCalled = true;
      return { doubled: 0 };
    });

    api.router([handlerDef]);

    // Extraemos la función middleware montada en el router simulado y la ejecutamos
    const routeFn = mockRouterDef.post.mock.calls[0][1];
    await routeFn(mockReq, mockRes);

    expect(handlerCalled).toBe(false); // No llegó al handler
    expect(mockAdapters.onError).toHaveBeenCalled(); // Zod error pasado a onError
    expect(mockRes.status).toHaveBeenCalledWith(400); // 400 Bad Request
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(Object) }));
  });

  it('TC-API-SERVER-03: ejecuta la cadena de seguridad y luego el handler en flujo exitoso', async () => {
    const api = createServerApi(contracts, mockAdapters);
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const mockReq = { body: { value: 10 } } as unknown as Request;
    
    const handlerDef = api.handler('POST /calc/double', { roles: ['USER'] })(async (input) => {
      return { doubled: input.value * 2 };
    });

    api.router([handlerDef]);

    const routeFn = mockRouterDef.post.mock.calls[0][1];
    await routeFn(mockReq, mockRes);

    expect(mockAdapters.security.auth).toHaveBeenCalled();
    expect(mockAdapters.security.role).toHaveBeenCalledWith(['USER']);
    expect(mockRes.json).toHaveBeenCalledWith({ data: { doubled: 20 } });
  });
});
