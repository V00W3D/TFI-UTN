/**
 * @file IAMModule.ts
 * @author Victor
 * @description Automatically enforced JSDoc header according to context.md guidelines.
 * @param null
 * @returns null
 * @example null
 * @remarks This file is part of the QART monorepo architecture.
 *
 * Metrics:
 * - LOC: 50
 * - Experience Level: Junior
 * - Estimated Time: 30m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */
import { Module } from '@nestjs/common';
import { IAMController } from './IAMController';
import { IAMService } from './IAMService';
import { PrismaService } from '../../tools/prisma.service';

@Module({
  controllers: [IAMController],
  providers: [IAMService, PrismaService],
})
export class IAMModule {}
