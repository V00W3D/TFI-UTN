/**
 * @file db.test.ts
 * @module Backend/Tests
 * @description Unit tests for db.ts infrastructure.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: none (uses env DATABASE_URL)
 * outputs: prisma singleton and adapter
 * rules: provides a standard prisma connection and adapter for the SDK
 *
 * @technical
 * dependencies: vitest, db.ts, @prisma/client, @prisma/adapter-pg
 * flow: mock dependencies -> import db -> verify singleton instantiation and contract
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-TOOL-DB-01
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi } from 'vitest';

// Pre-mocking dependencies to avoid real connection attempts
vi.mock('../../../prisma/generated/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  })),
}));

vi.mock('@prisma/adapter-pg', () => ({
  PrismaPg: vi.fn(),
}));

vi.mock('../../src/env', () => ({
  DATABASE_URL: 'postgresql://mock:mock@localhost:5432/mock',
}));

// Now import after mocks are set
import { prisma, prismaAdapter } from '../../src/tools/db';

describe('db tool', () => {
  it('TC-TOOL-DB-01: exporta el singleton de prisma y el adapter correcto', () => {
    expect(prisma).toBeDefined();
    expect(prismaAdapter.name).toBe('prisma');
    expect(prismaAdapter.instance).toBe(prisma);
  });

  it('TC-TOOL-DB-02: los metodos del adapter delegan en prisma', async () => {
    await prismaAdapter.connect();
    expect(prisma.$connect).toHaveBeenCalled();

    await prismaAdapter.disconnect();
    expect(prisma.$disconnect).toHaveBeenCalled();
  });
});
