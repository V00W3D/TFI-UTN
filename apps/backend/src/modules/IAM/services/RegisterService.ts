/**
 * @file RegisterService.ts
 * @author Victor
 * @description Granular Register service handling transactional user creation.
 *
 * Metrics:
 * - LOC: 40
 * - Experience Level: Junior
 * - Estimated Time: 30m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 2
 */
import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import type { InferRequest } from '@app/sdk';
import type { RegisterContract } from '@app/contracts';
import { PrismaService } from '../../../tools/prisma.service';
import type { Prisma } from '../../../../prisma/generated/client';

@Injectable()
export class RegisterService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    input: InferRequest<typeof RegisterContract>,
  ): Promise<void> {
    const { username, name, lname, sname, sex, email, phone, password } = input;
    const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const user = await tx.user.create({
        data: {
          name: name,
          sname: sname,
          lname: lname,
          sex: sex as never,
          username: username,
          email: email,
          phone: phone,
          password: hashedPassword,
        },
        select: { id: true },
      });

      // Default profile linking
      await tx.customerProfile.create({ data: { userId: user.id } });
    });
  }
}
