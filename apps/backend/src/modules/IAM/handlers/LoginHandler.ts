/**
 * @file LoginHandler.ts
 * @author Victor
 * @description Isolated Login Endpoint Controller utilizing native Nest abstractions.
 *
 * Metrics:
 * - LOC: 40
 * - Experience Level: Junior
 * - Estimated Time: 30m
 * - FPA: 2
 * - PERT: 1
 * - Planning Poker: 2
 */
import {
  Controller,
  Post,
  Body,
  Res,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { SESSION_SECRET, REFRESH_SECRET, BUN_MODE } from '@env';
import { LoginService } from '../services/LoginService';
import { LoginContract } from '@app/contracts';
import type { InferRequest } from '@app/sdk';

const COOKIE_BASE = {
  httpOnly: true,
  secure: BUN_MODE === 'prod',
  sameSite: 'strict',
} as const;

const ACCESS_TTL = 1000 * 60 * 60;
const REFRESH_TTL = 1000 * 60 * 60 * 24 * 7;

@Controller('iam')
export class LoginHandler {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  async handle(
    @Body() body: InferRequest<typeof LoginContract>,
    @Res({ passthrough: true })
    res: { cookie: (n: string, v: string, o: object) => void },
  ) {
    const user = await this.loginService.execute(body);
    
    // Cookie Issue Logic
    res.cookie(
      'CupCake',
      jwt.sign(user, SESSION_SECRET, { expiresIn: '1h' }),
      { ...COOKIE_BASE, maxAge: ACCESS_TTL },
    );
    res.cookie(
      'Cake',
      jwt.sign(user, REFRESH_SECRET, { expiresIn: '7d' }),
      { ...COOKIE_BASE, maxAge: REFRESH_TTL },
    );
    
    return user;
  }
}
