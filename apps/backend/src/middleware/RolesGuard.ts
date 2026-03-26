/**
 * @file RolesGuard.ts
 * @author Victor
 * @description NestJS Guard that checks if an authenticated user possesses the correct roles. Needs to run after AuthGuard.
 * @remarks Connects to NestJS Reflector to evaluate custom @Roles() decorators. Throws ForbiddenException if criteria is not met.
 *
 * Metrics:
 * - LOC: 30
 * - Experience Level: Junior
 * - Estimated Time: 15m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */

import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserPayload } from './AuthGuard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    // If no roles are required on the route, allow access naturally
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserPayload | undefined;

    if (!user) {
      throw new UnauthorizedException('User is not authenticated.');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have the required permissions.');
    }

    return true;
  }
}

/**
 * @public Route Decorator utility to define acceptable roles metadata for RolesGuard.
 */
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
