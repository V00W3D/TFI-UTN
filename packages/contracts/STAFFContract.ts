import { defineEndpoint } from '@app/sdk';
import { LoginInputSchema, AuthUserSchema } from './IAMContract';

// ─────────────────────────────────────────────────────────────
//  STAFF CONTRACTS
//
//  /staff/login is the entry point for the internal panel.
//  It reuses LoginInputSchema and AuthUserSchema from IAMContract —
//  the shapes are identical, but the service validates that the
//  authenticated user has role STAFF or AUTHORITY (not CUSTOMER).
//
//  Logout and /me are shared with the IAM module — same cookies,
//  same JWT, no reason to duplicate those endpoints.
// ─────────────────────────────────────────────────────────────

export const StaffLoginContract = defineEndpoint('public', 'POST /staff/login')
  .IO(LoginInputSchema, AuthUserSchema)
  .doc('Staff login', 'Authenticates staff or authority users for the internal panel.')
  .build();

export const STAFFContract = [StaffLoginContract] as const;
