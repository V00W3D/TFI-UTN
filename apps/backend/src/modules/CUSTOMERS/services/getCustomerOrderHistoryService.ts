import { ERR, type InferSuccess } from '@app/sdk';
import type { GetCustomerOrderHistoryContract } from '@app/contracts';
import { prisma as db } from '../../../tools/db';

const channelToFulfillment: Record<string, 'dine_in' | 'pickup' | 'delivery' | null> = {
  COUNTER: 'dine_in',
  TAKEAWAY: 'pickup',
  DELIVERY: 'delivery',
  ONLINE: 'delivery',
};

const statusToLifecycle: Record<string, 'PENDIENTE' | 'COMPLETADO' | null> = {
  OPEN: 'PENDIENTE',
  CONFIRMED: 'COMPLETADO',
  CANCELLED: 'COMPLETADO',
  REFUNDED: 'COMPLETADO',
};

export const getCustomerOrderHistoryService = async (input: {
  customerUserId: string | null;
}): Promise<InferSuccess<typeof GetCustomerOrderHistoryContract>> => {
  if (!input.customerUserId) {
    return [];
  }

  try {
    const sales = await db.sale.findMany({
      where: { customerUserId: input.customerUserId },
      orderBy: { soldAt: 'desc' },
      include: {
        items: {
          include: {
            plate: { select: { name: true } },
          },
        },
      },
      take: 50,
    });

    return sales.map((sale) => ({
      id: sale.id,
      saleId: sale.id,
      completedAt: sale.soldAt.toISOString(),
      fulfillment: channelToFulfillment[sale.channel] ?? undefined,
      lifecycleStatus: statusToLifecycle[sale.status] ?? undefined,
      lines: sale.items.map((item) => ({
        plateId: item.plateId,
        name: item.plate?.name ?? 'Plato',
        quantity: item.quantity,
        unitPrice: Number(item.unitNetAmount),
      })),
      total: Number(sale.totalAmount),
    }));
  } catch {
    throw ERR.INTERNAL(['DATABASE_ERROR']);
  }
};
