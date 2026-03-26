/**
 * @file IAMController.ts
 * @author Victor
 * @description IAM Controller handling authentication endpoints for QART using NestJS.
 * @param null
 * @returns null
 * @example null
 * @remarks Defines NestJS REST endpoints for login, register, logout, and me.
 *
 * Metrics:
 * - LOC: 60
 * - Experience Level: Junior
 * - Estimated Time: 1h
 * - FPA: 2
 * - Planning Poker: 2
 */
import { Controller, Post, Get, Body, Req, Res } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import { SESSION_SECRET, REFRESH_SECRET, BUN_MODE } from '@env';
import { IAMService } from './IAMService';
import { LoginContract, RegisterContract } from '@app/contracts';
import type { InferRequest } from '@app/sdk';

const COOKIE_BASE = {
  httpOnly: true,
  secure: BUN_MODE === 'prod',
  sameSite: 'strict',
} as const;

const ACCESS_TTL = 1000 * 60 * 60;
const REFRESH_TTL = 1000 * 60 * 60 * 24 * 7;

@Controller('iam')
export class IAMController {
  constructor(private readonly iamService: IAMService) {}

  private issueTokens(res: any, user: object): void {
    res.cookie('CupCake', jwt.sign(user, SESSION_SECRET, { expiresIn: '1h' }), {
      ...COOKIE_BASE,
      maxAge: ACCESS_TTL,
    });
    res.cookie('Cake', jwt.sign(user, REFRESH_SECRET, { expiresIn: '7d' }), {
      ...COOKIE_BASE,
      maxAge: REFRESH_TTL,
    });
  }

  @Post('login')
  async login(
    @Body() body: InferRequest<typeof LoginContract>,
    @Res({ passthrough: true }) res: any,
  ) {
    const user = await this.iamService.login(body);
    this.issueTokens(res, user);
    return user;
  }

  @Post('register')
  async register(@Body() body: InferRequest<typeof RegisterContract>) {
    await this.iamService.register(body);
    return { success: true };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: any) {
    const opts = { httpOnly: true, secure: true, sameSite: 'strict' as const };
    res.clearCookie('CupCake', opts);
    res.clearCookie('Cake', opts);
    return { success: true };
  }

  @Get('me')
  async me(@Req() req: any) {
    const user = req.user as { id?: string } | undefined;
    return this.iamService.getMe(user?.id as string);
  }
}
