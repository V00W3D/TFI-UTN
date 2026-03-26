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
import { PrismaService } from '../../tools/prisma.service';

import { LoginHandler } from './handlers/LoginHandler';
import { RegisterHandler } from './handlers/RegisterHandler';
import { LogoutHandler } from './handlers/LogoutHandler';
import { MeHandler } from './handlers/MeHandler';

import { LoginService } from './services/LoginService';
import { RegisterService } from './services/RegisterService';
import { MeService } from './services/MeService';

@Module({
  controllers: [LoginHandler, RegisterHandler, LogoutHandler, MeHandler],
  providers: [PrismaService, LoginService, RegisterService, MeService],
  exports: [LoginService, MeService],
})
export class IAMModule {}
