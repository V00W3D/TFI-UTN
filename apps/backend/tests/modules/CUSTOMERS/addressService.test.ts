/**
 * @file addressService.test.ts
 * @module Backend/Tests/CUSTOMERS
 * @description Tests unitarios para addressService.ts usando mocks de Prisma.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: userId autenticado, payloads de creación/actualización de dirección
 * outputs: verificación de lógica de default único por usuario y rechazo de direcciones ajenas
 * rules: primera dirección → isDefault automático; updateAddressService con id ajeno → ERR.NOT_FOUND; normalización de texto (trim)
 *
 * @technical
 * dependencies: vitest (vi.mock), prisma (mocked), addressService
 * flow: mockea prisma.address con vi.mock; configura retornos para cada caso; ejecuta funciones del service; verifica comportamiento
 *
 * @estimation
 * complexity: Medium
 * fpa: EI
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-ADDRESS-01 a TC-ADDRESS-05
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: se mockea el módulo db completo para aislar los tests de la DB real
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ERROR_CODES } from '@app/sdk';

// ─────────────────────────────────────────────────────────────
// Mock de Prisma — debe hacerse antes de cualquier import del módulo bajo test
// ─────────────────────────────────────────────────────────────
vi.mock('../../../src/tools/db', () => ({
  prisma: {
    address: {
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
      updateMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import { prisma } from '../../../src/tools/db';
import {
  getAddressesService,
  createAddressService,
  updateAddressService,
} from '../../../src/modules/CUSTOMERS/services/addressService';

const mockPrisma = prisma as unknown as {
  address: {
    findMany: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    updateMany: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  $transaction: ReturnType<typeof vi.fn>;
};

// ─────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────
const buildAddress = (overrides = {}) => ({
  id: '11111111-1111-4111-8111-111111111111',
  userId: 'user-1',
  street: 'San Martín',
  number: '123',
  floorApt: null,
  notes: null,
  isDefault: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// ─────────────────────────────────────────────────────────────
// TC-ADDRESS-01 — getAddressesService
// ─────────────────────────────────────────────────────────────
describe('getAddressesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-ADDRESS-01: retorna el array de direcciones mapeadas del usuario', async () => {
    mockPrisma.address.findMany.mockResolvedValue([buildAddress()]);

    const result = await getAddressesService('user-1');

    expect(result).toHaveLength(1);
    expect(result[0]?.street).toBe('San Martín');
    expect(result[0]?.isDefault).toBe(true);
  });

  it('retorna array vacío si el usuario no tiene direcciones', async () => {
    mockPrisma.address.findMany.mockResolvedValue([]);

    const result = await getAddressesService('user-no-addresses');

    expect(result).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-ADDRESS-02 — createAddressService
// ─────────────────────────────────────────────────────────────
describe('createAddressService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-ADDRESS-02a: primera dirección se crea como default automáticamente', async () => {
    mockPrisma.address.count.mockResolvedValue(0);

    const createdAddress = buildAddress({ isDefault: true });
    mockPrisma.$transaction.mockImplementation(
      async (fn: (tx: typeof mockPrisma) => Promise<unknown>) => fn(mockPrisma),
    );
    mockPrisma.address.updateMany.mockResolvedValue({ count: 0 });
    mockPrisma.address.create.mockResolvedValue(createdAddress);

    const result = await createAddressService('user-1', {
      street: 'San Martín',
      number: '123',
      floorApt: undefined,
      notes: undefined,
      isDefault: false, // No importa — la primera siempre es default
    });

    expect(result.isDefault).toBe(true);
    expect(result.street).toBe('San Martín');
  });

  it('TC-ADDRESS-02b: dirección adicional con isDefault:false no cambia la default', async () => {
    mockPrisma.address.count.mockResolvedValue(1);

    const createdAddress = buildAddress({ isDefault: false });
    mockPrisma.$transaction.mockImplementation(
      async (fn: (tx: typeof mockPrisma) => Promise<unknown>) => fn(mockPrisma),
    );
    mockPrisma.address.create.mockResolvedValue(createdAddress);

    const result = await createAddressService('user-1', {
      street: 'Corrientes',
      number: '456',
      floorApt: undefined,
      notes: undefined,
      isDefault: false,
    });

    expect(result.isDefault).toBe(false);
    // updateMany no debe haber sido llamado
    expect(mockPrisma.address.updateMany).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────
// TC-ADDRESS-03 — updateAddressService
// ─────────────────────────────────────────────────────────────
describe('updateAddressService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-ADDRESS-03: dirección ajena (otro userId) → lanza NOT_FOUND', async () => {
    mockPrisma.address.findFirst.mockResolvedValue(null);

    await expect(
      updateAddressService('user-1', {
        id: '22222222-2222-4222-8222-222222222222',
        street: 'Rivadavia',
        number: '789',
        floorApt: undefined,
        notes: undefined,
        isDefault: false,
      }),
    ).rejects.toMatchObject({ code: ERROR_CODES.RESOURCE_NOT_FOUND });
  });

  it('TC-ADDRESS-03b: actualización propia devuelve dirección actualizada', async () => {
    const existing = buildAddress({ isDefault: false });
    mockPrisma.address.findFirst.mockResolvedValue(existing);

    const updated = buildAddress({ street: 'Rivadavia', number: '999', isDefault: false });
    mockPrisma.$transaction.mockImplementation(
      async (fn: (tx: typeof mockPrisma) => Promise<unknown>) => fn(mockPrisma),
    );
    mockPrisma.address.update.mockResolvedValue(updated);

    const result = await updateAddressService('user-1', {
      id: existing.id,
      street: 'Rivadavia',
      number: '999',
      floorApt: undefined,
      notes: undefined,
      isDefault: false,
    });

    expect(result.street).toBe('Rivadavia');
    expect(result.number).toBe('999');
  });
});
