/**
 * @file LogoutHandler.ts
 * @author Victor
 * @description Isolated Logout Endpoint Controller wiping cookies manually.
 *
 * Metrics:
 * - LOC: 25
 * - Experience Level: Junior
 * - Estimated Time: 10m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */
import { Controller, Post, Res } from '@nestjs/common';

@Controller('iam')
export class LogoutHandler {
  @Post('logout')
  async handle(
    @Res({ passthrough: true })
    res: {
      clearCookie: (n: string, o: object) => void;
    },
  ) {
    const opts = { httpOnly: true, secure: true, sameSite: 'strict' as const };
    res.clearCookie('CupCake', opts);
    res.clearCookie('Cake', opts);
    return { success: true };
  }
}
