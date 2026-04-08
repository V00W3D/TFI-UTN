/**
 * @file addressService.ts
 * @module CUSTOMERS
 * @description Gestiona altas, consulta y actualizacion de direcciones del cliente autenticado.
 *
 * @tfi
 * section: IEEE 830 11 / 12.1
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: userId autenticado y payloads de direccion
 * outputs: direcciones normalizadas para contratos customer
 * rules: una direccion default por usuario; trim de texto; no editar direcciones ajenas
 *
 * @technical
 * dependencies: @app/sdk, @app/contracts, prisma
 * flow: busca direcciones; crea registros; recalcula default; actualiza datos y mapea respuesta
 *
 * @estimation
 * complexity: Medium
 * fpa: EI
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-CUSTOMER-ADDRESS-01
 *
 * @notes
 * decisions: los services se expresan como arrow functions para respetar context.md
 */
import { ERR, type InferRequest, type InferSuccess } from '@app/sdk';
import type {
  CreateAddressContract,
  GetAddressesContract,
  UpdateAddressContract,
} from '@app/contracts';
import { prisma } from '../../../tools/db';

const mapAddress = (
  address: Awaited<ReturnType<typeof prisma.address.findFirstOrThrow>>,
): InferSuccess<typeof CreateAddressContract> => ({
  id: address.id,
  street: address.street,
  number: address.number,
  floorApt: address.floorApt ?? null,
  notes: address.notes ?? null,
  isDefault: address.isDefault,
});

export const getAddressesService = async (
  userId: string,
): Promise<InferSuccess<typeof GetAddressesContract>> => {
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  });

  return addresses.map((address) => ({
    id: address.id,
    street: address.street,
    number: address.number,
    floorApt: address.floorApt ?? null,
    notes: address.notes ?? null,
    isDefault: address.isDefault,
  }));
};

export const createAddressService = async (
  userId: string,
  input: InferRequest<typeof CreateAddressContract>,
): Promise<InferSuccess<typeof CreateAddressContract>> => {
  const totalAddresses = await prisma.address.count({ where: { userId } });
  const shouldBeDefault = input.isDefault ?? totalAddresses === 0;

  const created = await prisma.$transaction(async (tx) => {
    if (shouldBeDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return tx.address.create({
      data: {
        userId,
        street: input.street.trim(),
        number: input.number.trim(),
        floorApt: input.floorApt?.trim() || null,
        notes: input.notes?.trim() || null,
        isDefault: shouldBeDefault,
      },
    });
  });

  return mapAddress(created);
};

export const updateAddressService = async (
  userId: string,
  input: InferRequest<typeof UpdateAddressContract>,
): Promise<InferSuccess<typeof UpdateAddressContract>> => {
  const existing = await prisma.address.findFirst({
    where: {
      id: input.id,
      userId,
    },
  });

  if (!existing) throw ERR.NOT_FOUND(['id']);

  const shouldBeDefault = input.isDefault ?? existing.isDefault;

  const updated = await prisma.$transaction(async (tx) => {
    if (shouldBeDefault) {
      await tx.address.updateMany({
        where: {
          userId,
          id: { not: input.id },
        },
        data: { isDefault: false },
      });
    }

    return tx.address.update({
      where: { id: input.id },
      data: {
        street: input.street?.trim(),
        number: input.number?.trim(),
        floorApt: input.floorApt?.trim() || null,
        notes: input.notes?.trim() || null,
        isDefault: shouldBeDefault,
      },
    });
  });

  return mapAddress(updated);
};
