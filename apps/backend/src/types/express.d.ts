/**
 * @file express.d.ts
 * @author Victor
 * @description Augments Express Request with the authenticated user shape.
 * @remarks Shape matches AuthUserSchema from IAMContract.ts (login/me output).
 *
 * Metrics:
 * - LOC: 20
 * - Experience Level: Junior
 * - Estimated Time: 5m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */

import type { CustomerTier, StaffPost, AuthorityRank, UserRole } from '@app/sdk';

declare global {
  namespace Express {
    interface Request {
      /**
       * @public Set by auth.middleware after JWT verification.
       * Matches the output of AuthUserSchema (IAMContract).
       */
      user?: {
        id: string;
        username: string;
        email: string;
        phone: string | null;
        role: UserRole;
        profile: {
          tier?: CustomerTier;
          post?: StaffPost;
          rank?: AuthorityRank;
        };
      };
    }
  }
}
