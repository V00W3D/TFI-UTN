/**
 * @file RegisterHandler.ts
 * @author Victor
 * @description Isolated Register Endpoint Controller.
 *
 * Metrics:
 * - LOC: 25
 * - Experience Level: Junior
 * - Estimated Time: 15m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */
import { Controller, Post, Body } from '@nestjs/common';
import { RegisterService } from '../services/RegisterService';
import { RegisterContract } from '@app/contracts';
import type { InferRequest } from '@app/sdk';

@Controller('iam')
export class RegisterHandler {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register')
  async handle(@Body() body: InferRequest<typeof RegisterContract>) {
    await this.registerService.execute(body);
    return { success: true };
  }
}
