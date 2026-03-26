/**
 * @file MeHandler.ts
 * @author Victor
 * @description Isolated Me Endpoint Controller leveraging the Nest JS Guard payloads.
 *
 * Metrics:
 * - LOC: 25
 * - Experience Level: Junior
 * - Estimated Time: 15m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MeService } from '../services/MeService';
import { AuthGuard } from '../../../middleware/AuthGuard';

@Controller('iam')
export class MeHandler {
  constructor(private readonly meService: MeService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async handle(@Req() req: { user?: { id?: string } }) {
    const user = req.user as { id?: string } | undefined;
    return this.meService.execute(user?.id);
  }
}
