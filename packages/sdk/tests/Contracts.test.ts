/**
 * @file Contracts.test.ts
 * @module SDK/Tests
 * @description Tests unitarios completos para Contracts.ts.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: builders de contratos, colectores y helpers de narrowing
 * outputs: verificación de shape inmutable e inferencia tipada de contratos
 * rules: los contratos son inmutables; literales de id/verb/path se preservan; collectContracts soporta 3 overloads
 *
 * @technical
 * dependencies: vitest, zod, @app/sdk (Contracts)
 * flow: define schemas Zod mínimos; construye contratos via defineEndpoint; valida shape y comportamiento
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-CONTRACT-01, TC-CONTRACT-02, TC-CONTRACT-03
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: contracts se verifican en runtime, no solo en tipos, para garantizar que el builder produce el shape correcto
 */
import { describe, expect, it } from 'vitest';
import * as z from 'zod';
import {
  defineEndpoint,
  collectContracts,
  isContract,
  isSuccessResponse,
  isFailureResponse,
  getFullResponseSchema,
} from '../Contracts';

// ─────────────────────────────────────────────────────────────
// Fixtures reutilizables
// ─────────────────────────────────────────────────────────────
const dummyInput = z.object({ name: z.string() });
const dummyOutput = z.object({ id: z.string() });

const TestContract = defineEndpoint('public', 'POST /test/create')
  .IO(dummyInput, dummyOutput)
  .doc('Test summary', 'Test description')
  .build();

const TestContract2 = defineEndpoint('auth', 'GET /test/read')
  .IO(z.void(), dummyOutput)
  .doc('Test reader', 'Reads test data.')
  .build();

const TestContract3 = defineEndpoint('role', 'DELETE /test/remove')
  .IO(z.void(), z.void())
  .doc('Test remover', 'Removes test data.')
  .build();

// ─────────────────────────────────────────────────────────────
// TC-CONTRACT-01 — defineEndpoint builder
// ─────────────────────────────────────────────────────────────
describe('defineEndpoint', () => {
  it('produce __id correcto (verb + path)', () => {
    expect(TestContract.__id).toBe('POST /test/create');
  });

  it('produce __verb y __path separados', () => {
    expect(TestContract.__verb).toBe('POST');
    expect(TestContract.__path).toBe('/test/create');
  });

  it('preserva __access literal', () => {
    expect(TestContract.__access).toBe('public');
    expect(TestContract2.__access).toBe('auth');
    expect(TestContract3.__access).toBe('role');
  });

  it('preserva summary y description en __doc', () => {
    expect(TestContract.__doc.summary).toBe('Test summary');
    expect(TestContract.__doc.description).toBe('Test description');
  });

  it('el contrato es inmutable (Object.isFrozen)', () => {
    expect(Object.isFrozen(TestContract)).toBe(true);
  });

  it('__deprecated es false por defecto', () => {
    expect(TestContract.__deprecated).toBe(false);
  });

  it('deprecated() produce __deprecated: true', () => {
    const deprecated = defineEndpoint('public', 'GET /test/old')
      .IO(z.void(), z.void())
      .doc('Old endpoint', 'Will be removed.')
      .deprecated()
      .build();

    expect(deprecated.__deprecated).toBe(true);
  });

  it('getFullResponseSchema devuelve un ZodType válido', () => {
    const schema = getFullResponseSchema(TestContract);
    expect(schema).toBeDefined();
    // Debe parsear correctamente un success response
    const success = schema.safeParse({ data: { id: 'abc-123' } });
    expect(success.success).toBe(true);
  });

  it('getFullResponseSchema acepta error envelope', () => {
    const schema = getFullResponseSchema(TestContract);
    const error = schema.safeParse({ error: { code: 'UNAUTHORIZED' } });
    expect(error.success).toBe(true);
  });

  it('__requestSchema valida el input correctamente', () => {
    const valid = TestContract.__requestSchema.safeParse({ name: 'Victor' });
    const invalid = TestContract.__requestSchema.safeParse({ name: 42 });
    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-CONTRACT-02 — collectContracts (tres overloads)
// ─────────────────────────────────────────────────────────────
describe('collectContracts', () => {
  it('overload 1: acepta un único tuple const', () => {
    const tuple = [TestContract, TestContract2] as const;
    const collected = collectContracts(tuple);

    expect(collected).toHaveLength(2);
    expect(Object.isFrozen(collected)).toBe(true);
  });

  it('overload 2: acepta contratos individuales como spread', () => {
    const collected = collectContracts(TestContract, TestContract2, TestContract3);

    expect(collected).toHaveLength(3);
    expect(Object.isFrozen(collected)).toBe(true);
  });

  it('overload 3: acepta múltiples arrays de módulos y los aplana', () => {
    const moduleA = [TestContract] as const;
    const moduleB = [TestContract2, TestContract3] as const;
    const collected = collectContracts(moduleA, moduleB);

    expect(collected).toHaveLength(3);
    expect(Object.isFrozen(collected)).toBe(true);
  });

  it('el resultado es un array con los contratos en orden', () => {
    const collected = collectContracts(TestContract, TestContract2);
    expect(collected[0]?.__id).toBe('POST /test/create');
    expect(collected[1]?.__id).toBe('GET /test/read');
  });
});

// ─────────────────────────────────────────────────────────────
// TC-CONTRACT-03 — isContract runtime guard
// ─────────────────────────────────────────────────────────────
describe('isContract', () => {
  it('devuelve true para un contrato válido', () => {
    expect(isContract(TestContract)).toBe(true);
  });

  it('devuelve false para un objeto parcial sin __id', () => {
    expect(isContract({ __verb: 'GET', __path: '/x/y' })).toBe(false);
  });

  it('devuelve false para null y primitivos', () => {
    expect(isContract(null)).toBe(false);
    expect(isContract('string')).toBe(false);
    expect(isContract(42)).toBe(false);
  });

  it('devuelve false para objeto vacío', () => {
    expect(isContract({})).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-CONTRACT-04 — isSuccessResponse / isFailureResponse
// ─────────────────────────────────────────────────────────────
describe('isSuccessResponse / isFailureResponse', () => {
  it('isSuccessResponse devuelve true cuando hay clave data', () => {
    expect(isSuccessResponse({ data: { id: '1' } })).toBe(true);
  });

  it('isSuccessResponse devuelve false cuando hay clave error', () => {
    expect(isSuccessResponse({ error: { code: 'UNAUTHORIZED' } })).toBe(false);
  });

  it('isFailureResponse devuelve true cuando hay clave error', () => {
    expect(isFailureResponse({ error: { code: 'RESOURCE_NOT_FOUND' } })).toBe(true);
  });

  it('isFailureResponse devuelve false cuando hay clave data', () => {
    expect(isFailureResponse({ data: {} })).toBe(false);
  });
});
