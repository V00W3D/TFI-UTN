/**
 * @file getCustomerOrderHistoryService.test.ts
 * @module CUSTOMERS/Tests
 * @description Unit tests for retrieving a customer's order history.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-20
 * rnf: RNF-03
 *
 * @business
 * inputs: customerUserId (required)
 * outputs: mapped array of past orders and lines
 * rules: 50 recent limits, map status to lifecycle, map channels
 *
 * @technical
 * dependencies: vitest, Prisma, getCustomerOrderHistoryService
 * flow: mock Prisma response -> execute service -> assert data mappings
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-B-CUSTOMER-HISTORY-01
 * ultima prueba exitosa: 2026-04-08 14:00:00
 *
 * @notes
 * decisions: focuses on data hydration transformations decoupled from HTTP transport.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getCustomerOrderHistoryService } from '../../../src/modules/CUSTOMERS/services/getCustomerOrderHistoryService';
import { prisma } from '../../../src/tools/db';
import { ERR } from '@app/sdk';

vi.mock('../../../src/tools/db', () => ({
  prisma: {
    sale: {
      findMany: vi.fn(),
    },
  },
}));

describe('getCustomerOrderHistoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-B-CUSTOMER-HISTORY-01: retorna array vacío si no hay usrId', async () => {
    const res = await getCustomerOrderHistoryService({ customerUserId: null });
    expect(res).toEqual([]);
    expect(prisma.sale.findMany).not.toHaveBeenCalled();
  });

  it('TC-B-CUSTOMER-HISTORY-02: mapea una venta exitosamente', async () => {
    const mockDate = new Date('2026-04-08T12:00:00Z');
    
    vi.mocked(prisma.sale.findMany).mockResolvedValueOnce([
      {
        id: 'sale-1',
        channel: 'TAKEAWAY',
        status: 'CONFIRMED',
        soldAt: mockDate,
        totalAmount: 15.50 as any,
        items: [
          {
            plateId: 'plate-1',
            quantity: 2,
            unitNetAmount: 7.75 as any,
            plate: { name: 'Burger' },
          }
        ]
      } as any
    ]);

    const res = await getCustomerOrderHistoryService({ customerUserId: 'usr-123' });
    
    expect(prisma.sale.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { customerUserId: 'usr-123' },
      take: 50,
      orderBy: { soldAt: 'desc' }
    }));
    
    expect(res).toHaveLength(1);
    expect(res[0]).toEqual({
      id: 'sale-1',
      saleId: 'sale-1',
      completedAt: '2026-04-08T12:00:00.000Z',
      fulfillment: 'pickup',
      lifecycleStatus: 'COMPLETADO',
      lines: [
        {
          plateId: 'plate-1',
          name: 'Burger',
          quantity: 2,
          unitPrice: 7.75,
        }
      ],
      total: 15.5
    });
  });

  it('TC-B-CUSTOMER-HISTORY-03: envuelve rechazos Prisma en AppError DATABASE_ERROR', async () => {
    vi.mocked(prisma.sale.findMany).mockRejectedValueOnce(new Error('DB dead'));
    
    await expect(getCustomerOrderHistoryService({ customerUserId: 'usr-1' }))
      .rejects.toThrowError(ERR.INTERNAL(['DATABASE_ERROR']).message);
  });
});
