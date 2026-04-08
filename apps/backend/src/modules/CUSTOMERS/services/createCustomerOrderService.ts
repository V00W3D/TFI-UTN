/**
 * @file createCustomerOrderService.ts
 * @module CUSTOMERS
 * @description Archivo createCustomerOrderService alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: datos del modulo y dependencias compartidas
 * outputs: comportamiento o estructuras del modulo
 * rules: respetar contratos, seguridad y trazabilidad definidas en context.md
 *
 * @technical
 * dependencies: dependencias locales del archivo
 * flow: inicializa, transforma y expone la logica del modulo
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
 * decisions: bloque agregado para cumplir el formato obligatorio de context.md
 */
import { ERR, type InferSuccess } from '@app/sdk';
import { Prisma } from '../../../../prisma/generated/client';
import type { CreateCustomerOrderContract } from '@app/contracts';
import { prisma as db } from '../../../tools/db';

type Fulfillment = 'dine_in' | 'pickup' | 'delivery';

const channelFor = (f: Fulfillment): 'COUNTER' | 'TAKEAWAY' | 'DELIVERY' => {
  if (f === 'dine_in') return 'COUNTER';
  if (f === 'pickup') return 'TAKEAWAY';
  return 'DELIVERY';
};

const noteFor = (f: Fulfillment): string => {
  if (f === 'dine_in') return 'Web — consumo en el local';
  if (f === 'pickup') return 'Web — retiro / para llevar';
  return 'Web — delivery';
};

/**
 * Registra una venta con ítems; precios tomados del menú en DB. Estado OPEN = pendiente de preparación.
 */
export const createCustomerOrderService = async (
  input: {
    lines: { plateId: string; quantity: number }[];
    fulfillment: Fulfillment;
  },
  opts: { customerUserId: string | null },
): Promise<InferSuccess<typeof CreateCustomerOrderContract>> => {
  if (!input.lines.length) throw ERR.VALIDATION(['lines']);

  const ids = [...new Set(input.lines.map((l) => l.plateId))];
  const plates = await db.plate.findMany({
    where: { id: { in: ids }, isAvailable: true, recipe: { isActive: true } },
    select: { id: true, menuPrice: true, costPrice: true },
  });
  if (plates.length !== ids.length) throw ERR.NOT_FOUND(['plateId']);

  const qtyByPlate = new Map<string, number>();
  for (const l of input.lines) {
    qtyByPlate.set(l.plateId, (qtyByPlate.get(l.plateId) ?? 0) + l.quantity);
  }

  let subtotal = new Prisma.Decimal(0);
  const lineCreates: Prisma.SaleItemCreateWithoutSaleInput[] = [];

  for (const [plateId, quantity] of qtyByPlate) {
    const plate = plates.find((p) => p.id === plateId)!;
    const unitMenu = plate.menuPrice;
    const unitCost = plate.costPrice;
    const lineNet = unitMenu.mul(quantity);
    const lineCost = unitCost.mul(quantity);
    subtotal = subtotal.add(lineNet);

    lineCreates.push({
      plate: { connect: { id: plateId } },
      quantity,
      unitCostAmount: unitCost,
      unitNetAmount: unitMenu,
      unitTaxAmount: new Prisma.Decimal(0),
      unitTotalAmount: unitMenu,
      lineCostAmount: lineCost,
      lineNetAmount: lineNet,
      lineTaxAmount: new Prisma.Decimal(0),
      lineTotalAmount: lineNet,
    });
  }

  const channel = channelFor(input.fulfillment);
  const notes = noteFor(input.fulfillment);
  const status = input.fulfillment === 'dine_in' ? 'CONFIRMED' : 'OPEN';

  try {
    const sale = await db.sale.create({
      data: {
        status,
        channel,
        currencyCode: 'ARS',
        subtotalNet: subtotal,
        taxAmount: new Prisma.Decimal(0),
        totalAmount: subtotal,
        notes,
        customerUserId: opts.customerUserId,
        items: { create: lineCreates },
      },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        channel: true,
      },
    });

    const lifecycleStatus: 'PENDIENTE' | 'COMPLETADO' =
      sale.status === 'CONFIRMED' ? 'COMPLETADO' : 'PENDIENTE';

    return {
      saleId: sale.id,
      totalAmount: sale.totalAmount.toNumber(),
      status: sale.status,
      channel: sale.channel,
      fulfillment: input.fulfillment,
      lifecycleStatus,
    };
  } catch (err) {
    console.error('[createCustomerOrderService] DATABASE_ERROR', err);
    throw ERR.INTERNAL(['DATABASE_ERROR']);
  }
};
