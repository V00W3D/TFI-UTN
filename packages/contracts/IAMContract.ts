/**
 * @file IAMContract.ts
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
import { z } from 'zod';
import { defineField, defineEndpoint } from '@app/sdk';
import {
  identityField,
  usernameField,
  emailField,
  phoneField,
  userRoleField,
  nameField,
  snameField,
  lnameField,
  sexField,
  passwordField,
  cpasswordField,
  customerTierField,
  staffPostField,
  authorityRankField,
} from '@app/sdk';

// ─────────────────────────────────────────────────────────────
//  SHARED SCHEMAS — reused across IAM and Staff contracts
// ─────────────────────────────────────────────────────────────

/** Login input — shared by /iam/login and /staff/login. */
export const LoginInputSchema = z.object({
  identity: identityField.schema,
  password: defineField({ label: 'Contraseña', min: { value: 1 }, rules: [] }).schema,
});

/**
 * Sub-profile shape returned after login or /me.
 * Only the field matching the user's `role` is populated — the others are absent.
 */
export const ProfileSchema = z.object({
  tier: customerTierField.schema.optional(),
  post: staffPostField.schema.optional(),
  rank: authorityRankField.schema.optional(),
});

/** Full authenticated user shape returned by login and /me. */
export const AuthUserSchema = z.object({
  id: z.uuid(),
  username: usernameField.schema,
  email: emailField.schema,
  phone: phoneField.schema,
  role: userRoleField.schema,
  profile: ProfileSchema,
});

// ─────────────────────────────────────────────────────────────
//  IAM CONTRACTS
// ─────────────────────────────────────────────────────────────

export const LoginContract = defineEndpoint('public', 'POST /iam/login')
  .IO(LoginInputSchema, AuthUserSchema)
  .doc('Customer login', 'Authenticates a user and issues HttpOnly JWT cookies.')
  .build();

export const RegisterInputSchema = z
  .object({
    name: nameField.schema,
    sname: snameField.schema,
    lname: lnameField.schema,
    sex: sexField.schema,
    username: usernameField.schema,
    email: emailField.schema,
    phone: phoneField.schema,
    password: passwordField.schema,
    cpassword: cpasswordField.schema,
  })
  .superRefine(({ password, cpassword }, ctx) => {
    if (password !== cpassword)
      ctx.addIssue({
        code: 'custom',
        path: ['cpassword'],
        message: 'Las contraseñas no coinciden.',
      });
  });

export const RegisterContract = defineEndpoint('public', 'POST /iam/register')
  .IO(RegisterInputSchema, z.void())
  .doc('Customer registration', 'Creates a new customer account. Redirect to login on success.')
  .build();

export const LogoutContract = defineEndpoint('auth', 'POST /iam/logout')
  .IO(z.void(), z.void())
  .doc('Session terminator', 'Clears the CupCake and Cake HttpOnly cookies.')
  .build();

export const MeContract = defineEndpoint('auth', 'GET /iam/me')
  .IO(z.void(), AuthUserSchema)
  .doc('Session reader', 'Returns the currently authenticated user with their sub-profile.')
  .build();

export const IAMContract = [LoginContract, RegisterContract, LogoutContract, MeContract] as const;
