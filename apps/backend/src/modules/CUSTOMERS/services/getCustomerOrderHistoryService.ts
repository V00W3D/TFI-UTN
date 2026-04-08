/**
 * @file getCustomerOrderHistoryService.ts
 * @module CUSTOMERS
 * @description Archivo getCustomerOrderHistoryService alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-20
 * rnf: RNF-03
 *
 * @business
 * inputs: payloads tipados, ids autenticados, helpers compartidos y acceso a Prisma cuando aplica
 * outputs: datos de dominio listos para contrato, mutaciones persistidas o payloads auxiliares
 * rules: normalizar datos, validar reglas de dominio y preservar consistencia transaccional
 *
 * @technical
 * dependencies: @app/sdk, @app/contracts, db
 * flow: normaliza los datos recibidos; consulta o muta dependencias de dominio e infraestructura; arma la respuesta del caso de uso; devuelve un resultado consumible por handlers u otros servicios.
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: la logica de negocio se concentra en funciones async reutilizables y desacopladas del transporte
 */
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
