/**
 * @file IAMContract.test.ts
 * @module Contracts/Tests
 * @description Tests unitarios expandidos para IAMContract.ts.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-01, RF-02, RF-03, RF-05, RF-06
 * rnf: RNF-02
 *
 * @business
 * inputs: payloads de autenticación, registro, actualización y tokens
 * outputs: verificación de parseo, validación y shape de los contratos IAM
 * rules: passwords deben coincidir en RegisterInputSchema; VerifyUpdateInputSchema exige newPassword en PASSWORD_CHANGE; token debe ser de 6 dígitos
 *
 * @technical
 * dependencies: vitest, @app/contracts (IAMContract)
 * flow: parsea inputs válidos e inválidos; verifica casos de borde en superRefine; aserta shapes de AuthUser
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-IAM-01 a TC-IAM-06
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: se prueban todos los schemas que tienen superRefine para garantizar la lógica cross-field
 */
import { describe, expect, it } from 'vitest';
import {
  LoginInputSchema,
  RegisterInputSchema,
  AuthUserSchema,
  UpdateMeInputSchema,
  RequestTokenInputSchema,
  VerifyUpdateInputSchema,
} from '../IAMContract';

// ─────────────────────────────────────────────────────────────
// TC-IAM-01 — LoginInputSchema
// ─────────────────────────────────────────────────────────────
describe('LoginInputSchema', () => {
  it('acepta identity como username válido', () => {
    const result = LoginInputSchema.safeParse({ identity: 'victor_123', password: 'Secreta123!' });
    expect(result.success).toBe(true);
  });

  it('acepta identity como email', () => {
    const result = LoginInputSchema.safeParse({
      identity: 'victor@example.com',
      password: 'Secreta123!',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza identity vacía', () => {
    const result = LoginInputSchema.safeParse({ identity: '', password: 'Secreta123!' });
    expect(result.success).toBe(false);
  });

  it('rechaza password vacía', () => {
    const result = LoginInputSchema.safeParse({ identity: 'victor_123', password: '' });
    expect(result.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-IAM-02 — RegisterInputSchema
// ─────────────────────────────────────────────────────────────
describe('RegisterInputSchema', () => {
  const validRegister = {
    name: 'Victor',
    lname: 'Perez',
    sex: 'MALE',
    username: 'victor_test',
    email: 'victor@example.com',
    password: 'Password123!',
    cpassword: 'Password123!',
  };

  it('acepta registro completo válido', () => {
    expect(RegisterInputSchema.safeParse(validRegister).success).toBe(true);
  });

  it('acepta sin sname (segundo nombre es opcional)', () => {
    expect(RegisterInputSchema.safeParse({ ...validRegister, sname: undefined }).success).toBe(
      true,
    );
  });

  it('acepta sin phone (es opcional)', () => {
    expect(RegisterInputSchema.safeParse({ ...validRegister, phone: undefined }).success).toBe(
      true,
    );
  });

  it('rechaza cuando password y cpassword no coinciden', () => {
    const result = RegisterInputSchema.safeParse({
      ...validRegister,
      cpassword: 'OtraPassword123!',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza username con palabra reservada', () => {
    const result = RegisterInputSchema.safeParse({ ...validRegister, username: 'super_admin' });
    expect(result.success).toBe(false);
  });

  it('rechaza email inválido', () => {
    const result = RegisterInputSchema.safeParse({ ...validRegister, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rechaza password débil', () => {
    const result = RegisterInputSchema.safeParse({
      ...validRegister,
      password: 'weak',
      cpassword: 'weak',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza sex con valor no registrado', () => {
    const result = RegisterInputSchema.safeParse({ ...validRegister, sex: 'ALIEN' });
    expect(result.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-IAM-03 — AuthUserSchema
// ─────────────────────────────────────────────────────────────
describe('AuthUserSchema', () => {
  const baseUser = {
    id: '11111111-1111-4111-8111-111111111111',
    username: 'victor_q',
    name: 'Victor',
    sname: null,
    lname: 'Perez',
    sex: 'MALE',
    email: 'victor@example.com',
    emailVerified: true,
    phone: null,
    phoneVerified: false,
    role: 'CUSTOMER',
    profile: {},
  };

  it('parsea usuario customer con profile vacío', () => {
    expect(AuthUserSchema.safeParse(baseUser).success).toBe(true);
  });

  it('parsea usuario con tier en profile', () => {
    const result = AuthUserSchema.safeParse({ ...baseUser, profile: { tier: 'VIP' } });
    expect(result.success).toBe(true);
  });

  it('parsea usuario staff con post en profile', () => {
    const result = AuthUserSchema.safeParse({
      ...baseUser,
      role: 'STAFF',
      profile: { post: 'COOK' },
    });
    expect(result.success).toBe(true);
  });

  it('parsea usuario authority con rank en profile', () => {
    const result = AuthUserSchema.safeParse({
      ...baseUser,
      role: 'AUTHORITY',
      profile: { rank: 'MANAGER' },
    });
    expect(result.success).toBe(true);
  });

  it('rechaza id que no es UUID', () => {
    const result = AuthUserSchema.safeParse({ ...baseUser, id: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });

  it('rechaza role desconocido', () => {
    const result = AuthUserSchema.safeParse({ ...baseUser, role: 'SUPERUSER' });
    expect(result.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-IAM-04 — UpdateMeInputSchema
// ─────────────────────────────────────────────────────────────
describe('UpdateMeInputSchema', () => {
  it('acepta objeto vacío (todos los campos son opcionales)', () => {
    expect(UpdateMeInputSchema.safeParse({}).success).toBe(true);
  });

  it('acepta actualización parcial con solo username', () => {
    expect(UpdateMeInputSchema.safeParse({ username: 'nuevo_user' }).success).toBe(true);
  });

  it('rechaza username con caracteres inválidos', () => {
    expect(UpdateMeInputSchema.safeParse({ username: 'user name' }).success).toBe(false);
  });

  it('acepta actualización de nombre y apellido', () => {
    expect(UpdateMeInputSchema.safeParse({ name: 'Juan', lname: 'García' }).success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-IAM-05 — RequestTokenInputSchema
// ─────────────────────────────────────────────────────────────
describe('RequestTokenInputSchema', () => {
  it('acepta EMAIL_CHANGE', () => {
    expect(RequestTokenInputSchema.safeParse({ type: 'EMAIL_CHANGE' }).success).toBe(true);
  });

  it('acepta PHONE_CHANGE con targetVal', () => {
    const result = RequestTokenInputSchema.safeParse({
      type: 'PHONE_CHANGE',
      targetVal: '+5493811234567',
    });
    expect(result.success).toBe(true);
  });

  it('acepta PASSWORD_CHANGE', () => {
    expect(RequestTokenInputSchema.safeParse({ type: 'PASSWORD_CHANGE' }).success).toBe(true);
  });

  it('rechaza tipo no registrado', () => {
    expect(RequestTokenInputSchema.safeParse({ type: 'HACK_CHANGE' }).success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-IAM-06 — VerifyUpdateInputSchema
// ─────────────────────────────────────────────────────────────
describe('VerifyUpdateInputSchema', () => {
  it('acepta EMAIL_CHANGE con token de 6 dígitos', () => {
    const result = VerifyUpdateInputSchema.safeParse({ type: 'EMAIL_CHANGE', token: '123456' });
    expect(result.success).toBe(true);
  });

  it('rechaza token que no tenga 6 caracteres', () => {
    const result = VerifyUpdateInputSchema.safeParse({ type: 'EMAIL_CHANGE', token: '123' });
    expect(result.success).toBe(false);
  });

  it('rechaza token vacío', () => {
    const result = VerifyUpdateInputSchema.safeParse({ type: 'EMAIL_CHANGE', token: '' });
    expect(result.success).toBe(false);
  });

  it('rechaza PASSWORD_CHANGE si newPassword y cpassword no coinciden', () => {
    const result = VerifyUpdateInputSchema.safeParse({
      type: 'PASSWORD_CHANGE',
      token: '654321',
      newPassword: 'Password123!',
      cpassword: 'OtraPassword123!',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza PASSWORD_CHANGE si newPassword está vacía', () => {
    const result = VerifyUpdateInputSchema.safeParse({
      type: 'PASSWORD_CHANGE',
      token: '654321',
      cpassword: 'Password123!',
    });
    expect(result.success).toBe(false);
  });

  it('acepta PASSWORD_CHANGE con passwords coincidentes', () => {
    const result = VerifyUpdateInputSchema.safeParse({
      type: 'PASSWORD_CHANGE',
      token: '654321',
      newPassword: 'Password123!',
      cpassword: 'Password123!',
    });
    expect(result.success).toBe(true);
  });
});
