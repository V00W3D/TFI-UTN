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
  name: nameField.schema,
  sname: snameField.schema.nullable(),
  lname: lnameField.schema,
  sex: sexField.schema,
  email: emailField.schema,
  emailVerified: z.boolean(),
  phone: phoneField.schema.nullable(),
  phoneVerified: z.boolean(),
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
    sname: snameField.schema.optional(),
    lname: lnameField.schema,
    sex: sexField.schema,
    username: usernameField.schema,
    email: emailField.schema,
    phone: phoneField.schema.optional(),
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

export const UpdateMeInputSchema = z.object({
  username: usernameField.schema.optional(),
  name: nameField.schema.optional(),
  sname: snameField.schema.optional(),
  lname: lnameField.schema.optional(),
  sex: sexField.schema.optional(),
});

export const UpdateMeContract = defineEndpoint('auth', 'PATCH /iam/me')
  .IO(UpdateMeInputSchema, AuthUserSchema)
  .doc('Update profile', 'Updates non-sensitive profile information.')
  .build();

export const RequestTokenInputSchema = z.object({
  type: z.enum(['EMAIL_CHANGE', 'PHONE_CHANGE', 'PASSWORD_CHANGE']),
  targetVal: z.string().optional().describe('Email/Phone nuevo, si aplica.'),
});

export const RequestTokenContract = defineEndpoint('auth', 'POST /iam/request-token')
  .IO(RequestTokenInputSchema, z.void())
  .doc('Request token', 'Generates and sends a 6-digit PIN for sensitive updates.')
  .build();

export const VerifyUpdateInputSchema = z
  .object({
    type: z.enum(['EMAIL_CHANGE', 'PHONE_CHANGE', 'PASSWORD_CHANGE']),
    token: z.string().length(6),
    newPassword: passwordField.schema.optional(),
    cpassword: cpasswordField.schema.optional(),
  })
  .superRefine(({ type, newPassword, cpassword }, ctx) => {
    if (type === 'PASSWORD_CHANGE') {
      if (!newPassword || newPassword !== cpassword) {
        ctx.addIssue({
          code: 'custom',
          path: ['cpassword'],
          message: 'Las contraseñas no coinciden o están vacías.',
        });
      }
    }
  });

export const VerifyUpdateContract = defineEndpoint('auth', 'POST /iam/verify-update')
  .IO(VerifyUpdateInputSchema, AuthUserSchema)
  .doc('Verify update', 'Validates PIN and applies sensitive changes.')
  .build();

export const IAMContract = [
  LoginContract,
  RegisterContract,
  LogoutContract,
  MeContract,
  UpdateMeContract,
  RequestTokenContract,
  VerifyUpdateContract,
] as const;
