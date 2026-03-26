/**
 * @file LoginService.ts
 * @author Victor
 * @description Highly modular Login logic for IAM Module using argon2 and Prisma.
 * @remarks Extracts token issuance and verification business actions.
 *
 * Metrics:
 * - LOC: 50
 * - Experience Level: Mid
 * - Estimated Time: 30m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 2
 */
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import type { InferRequest, InferSuccess } from '@app/sdk';
import type { LoginContract } from '@app/contracts';
import { PrismaService } from '../../../tools/prisma.service';

const TIMING_SAFE_FAKE_HASH = '$argon2id$v=19$m=65536,t=3,p=4$C29tZXNhbHQ$9KjQ7xL9W8N7Zp7Kz1nG9w';
const INTERNAL_ROLES = new Set(['STAFF', 'AUTHORITY'] as const);

@Injectable()
export class LoginService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    input: InferRequest<typeof LoginContract>,
  ): Promise<InferSuccess<typeof LoginContract>> {
    const found = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: input.identity }, { email: input.identity }, { phone: input.identity }],
      },
      select: { id: true, password: true, role: true },
    });

    const isValid = await argon2.verify(found?.password ?? TIMING_SAFE_FAKE_HASH, input.password);
    if (!found || !isValid) throw new UnauthorizedException('Invalid credentials provided.');

    if (!INTERNAL_ROLES.has(found.role as 'STAFF' | 'AUTHORITY')) {
      throw new ForbiddenException(
        'Non-internal roles cannot authenticate in this system context.',
      );
    }

    const row = await this.prisma.user.findUnique({
      where: { id: found.id },
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

    if (!row) throw new NotFoundException('Identified user lacks a complete database footprint.');

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
    } as unknown as InferSuccess<typeof LoginContract>;
  }
}
