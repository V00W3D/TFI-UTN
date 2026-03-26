/**
 * @file index.ts
 * @author Victor
 * @description Main entry point for the IAM Module, consolidating the NestJS Module definition.
 * @remarks This file follows the 100% granular modular architecture.
 *
 * Metrics:
 * - LOC: 40
 * - Experience Level: Junior
 * - Estimated Time: 10m
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
