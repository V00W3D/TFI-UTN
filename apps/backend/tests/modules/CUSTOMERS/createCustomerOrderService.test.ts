/**
 * @file createCustomerOrderService.test.ts
 * @module Backend/Tests/CUSTOMERS
 * @description Tests unitarios para createCustomerOrderService.ts usando mocks de Prisma.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-08
 *
 * @business
 * inputs: líneas de pedido (plateId, quantity), tipo de fulfillment
 * outputs: datos de la venta creada (id, total, status, channel)
 * rules: validar existencia de platos; calcular subtotales usando Decimal; mapear fulfillment a canal y estado; persistir venta e ítems
 *
 * @technical
 * dependencies: vitest, prisma (mocked), createCustomerOrderService
 * flow: mockea prisma.plate.findMany; mockea prisma.sale.create; ejecuta servicio; verifica lógica de negocio
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-ORDER-01 a TC-ORDER-03
 * ultima prueba exitosa: 2026-04-08 12:35:12
 *
 * @notes
 * decisions: se utiliza Prisma.Decimal real para asegurar precisión en los cálculos del test
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ERROR_CODES } from '@app/sdk';
import { Prisma } from '../../../prisma/generated/client';

// ─────────────────────────────────────────────────────────────
// Mocks
// ─────────────────────────────────────────────────────────────
vi.mock('../../../src/tools/db', () => ({
  prisma: {
    plate: {
      findMany: vi.fn(),
    },
    sale: {
      create: vi.fn(),
    },
  },
}));

import { prisma } from '../../../src/tools/db';
import { createCustomerOrderService } from '../../../src/modules/CUSTOMERS/services/createCustomerOrderService';

const mockPrisma = prisma as unknown as {
  plate: { findMany: ReturnType<typeof vi.fn> };
  sale: { create: ReturnType<typeof vi.fn> };
};

// ─────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────
const mockPlates = [
  {
    id: 'plate-1',
    menuPrice: new Prisma.Decimal(1000),
    costPrice: new Prisma.Decimal(600),
  },
  {
    id: 'plate-2',
    menuPrice: new Prisma.Decimal(2000),
    costPrice: new Prisma.Decimal(1200),
  },
];

const mockSaleResponse = {
  id: 'sale-123',
  status: 'OPEN',
  totalAmount: new Prisma.Decimal(4000),
  channel: 'DELIVERY',
};

// ─────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────
describe('createCustomerOrderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-ORDER-01: crea un pedido correctamente con cálculos precisos', async () => {
    mockPrisma.plate.findMany.mockResolvedValue(mockPlates);
    mockPrisma.sale.create.mockResolvedValue({
      ...mockSaleResponse,
      status: 'OPEN',
      channel: 'DELIVERY',
      totalAmount: new Prisma.Decimal(4000), // 1000*2 + 2000*1
    });

    const result = await createCustomerOrderService(
      {
        lines: [
          { plateId: 'plate-1', quantity: 2 },
          { plateId: 'plate-2', quantity: 1 },
        ],
        fulfillment: 'delivery',
      },
      { customerUserId: 'user-1' },
    );

    expect(result.saleId).toBe('sale-123');
    expect(result.totalAmount).toBe(4000);
    expect(result.status).toBe('OPEN');
    expect(result.channel).toBe('DELIVERY');
    expect(result.lifecycleStatus).toBe('PENDIENTE');

    // Verificar que se buscaron los platos correctos
    expect(mockPrisma.plate.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: { in: ['plate-1', 'plate-2'] },
        }),
      }),
    );
  });

  it('TC-ORDER-02: mapea fulfillment dine_in a canal COUNTER y estado CONFIRMED', async () => {
    mockPrisma.plate.findMany.mockResolvedValue([mockPlates[0]]);
    mockPrisma.sale.create.mockResolvedValue({
      ...mockSaleResponse,
      status: 'CONFIRMED',
      channel: 'COUNTER',
      totalAmount: new Prisma.Decimal(1000),
    });

    const result = await createCustomerOrderService(
      {
        lines: [{ plateId: 'plate-1', quantity: 1 }],
        fulfillment: 'dine_in',
      },
      { customerUserId: 'user-1' },
    );

    expect(result.status).toBe('CONFIRMED');
    expect(result.channel).toBe('COUNTER');
    expect(result.lifecycleStatus).toBe('COMPLETADO');
  });

  it('TC-ORDER-03: falla si algún plato no existe o no está disponible', async () => {
    mockPrisma.plate.findMany.mockResolvedValue([mockPlates[0]]); // Falta plate-2

    await expect(
      createCustomerOrderService(
        {
          lines: [
            { plateId: 'plate-1', quantity: 1 },
            { plateId: 'plate-2', quantity: 1 },
          ],
          fulfillment: 'pickup',
        },
        { customerUserId: 'user-1' },
      ),
    ).rejects.toMatchObject({ code: ERROR_CODES.RESOURCE_NOT_FOUND });
  });

  it('TC-ORDER-04: falla si no se envían líneas de pedido', async () => {
    await expect(
      createCustomerOrderService(
        {
          lines: [],
          fulfillment: 'delivery',
        },
        { customerUserId: 'user-1' },
      ),
    ).rejects.toMatchObject({ code: ERROR_CODES.VALIDATION_ERROR });
  });
});
