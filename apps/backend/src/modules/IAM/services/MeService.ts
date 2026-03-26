/**
 * @file MeService.ts
 * @author Victor
 * @description Specific service fetching user profile strictly from DB based on ID.
 *
 * Metrics:
 * - LOC: 40
 * - Experience Level: Junior
 * - Estimated Time: 15m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import type { InferSuccess } from '@app/sdk';
import type { MeContract } from '@app/contracts';
import { PrismaService } from '../../../tools/prisma.service';

@Injectable()
export class MeService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    userId: string | undefined,
  ): Promise<InferSuccess<typeof MeContract>> {
    if (!userId) throw new UnauthorizedException('Missing strict user context identity.');

    const row = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        customer: { select: { tier: true } },
        staff: { select: { post: true } },
        authority: { select: { rank: true } },
      },
    });

    if (!row) throw new NotFoundException('User identity not found in database.');

    return {
      id: row.id,
      username: row.username,
      email: row.email,
      phone: row.phone,
      role: row.role,
      profile: {
        ...(row.customer && { tier: row.customer.tier }),
        ...(row.staff && { post: row.staff.post }),
        ...(row.authority && { rank: row.authority.rank }),
      },
    } as unknown as InferSuccess<typeof MeContract>;
  }
}
