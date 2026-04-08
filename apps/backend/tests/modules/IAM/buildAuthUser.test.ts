/**
 * @file buildAuthUser.test.ts
 * @module Backend/Tests/IAM
 * @description Tests unitarios para buildAuthUser.ts.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-02, RF-07
 * rnf: RNF-02
 *
 * @business
 * inputs: row de Prisma con datos de usuario y perfil según rol
 * outputs: verificación del shape AuthUser con profile discriminado por rol
 * rules: customer → solo tiene tier; staff → solo tiene post; authority → solo tiene rank; emailVerified/phoneVerified como Date se convierten a boolean
 *
 * @technical
 * dependencies: vitest, @app/contracts, buildAuthUser
 * flow: construye rows de Prisma para cada tipo de usuario; ejecuta buildAuthUser; verifica shape y conversiones
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-BUILD-AUTH-01 a TC-BUILD-AUTH-05
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: buildAuthUser es puro y sin dependencias externas, ideal para tests sin mocks
 */
import { describe, expect, it } from 'vitest';
import { buildAuthUser, type AuthUserSource } from '../../../src/modules/IAM/services/buildAuthUser';

// ─────────────────────────────────────────────────────────────
// Fixture base
// ─────────────────────────────────────────────────────────────
const baseRow: AuthUserSource = {
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
  customer: null,
  staff: null,
  authority: null,
};

// ─────────────────────────────────────────────────────────────
// TC-BUILD-AUTH-01 a 05
// ─────────────────────────────────────────────────────────────
describe('buildAuthUser', () => {
  it('TC-BUILD-AUTH-01: customer con tier VIP → profile solo tiene tier', () => {
    const result = buildAuthUser({ ...baseRow, customer: { tier: 'VIP' } });

    expect(result.profile.tier).toBe('VIP');
    expect(result.profile).not.toHaveProperty('post');
    expect(result.profile).not.toHaveProperty('rank');
  });

  it('TC-BUILD-AUTH-02: staff con post COOK → profile solo tiene post', () => {
    const result = buildAuthUser({ ...baseRow, role: 'STAFF', staff: { post: 'COOK' } });

    expect(result.profile.post).toBe('COOK');
    expect(result.profile).not.toHaveProperty('tier');
    expect(result.profile).not.toHaveProperty('rank');
  });

  it('TC-BUILD-AUTH-03: authority con rank OWNER → profile solo tiene rank', () => {
    const result = buildAuthUser({ ...baseRow, role: 'AUTHORITY', authority: { rank: 'OWNER' } });

    expect(result.profile.rank).toBe('OWNER');
    expect(result.profile).not.toHaveProperty('tier');
    expect(result.profile).not.toHaveProperty('post');
  });

  it('TC-BUILD-AUTH-04: emailVerified como Date → se convierte a true', () => {
    const result = buildAuthUser({ ...baseRow, emailVerified: new Date() });
    expect(result.emailVerified).toBe(true);
  });

  it('TC-BUILD-AUTH-04b: emailVerified como null → se convierte a false', () => {
    const result = buildAuthUser({ ...baseRow, emailVerified: null });
    expect(result.emailVerified).toBe(false);
  });

  it('TC-BUILD-AUTH-05: sname null se preserva como null', () => {
    const result = buildAuthUser({ ...baseRow, sname: null });
    expect(result.sname).toBeNull();
  });

  it('mapea todos los campos escalares correctamente', () => {
    const result = buildAuthUser(baseRow);

    expect(result.id).toBe(baseRow.id);
    expect(result.username).toBe(baseRow.username);
    expect(result.name).toBe(baseRow.name);
    expect(result.lname).toBe(baseRow.lname);
    expect(result.email).toBe(baseRow.email);
    expect(result.role).toBe(baseRow.role);
    expect(result.phone).toBeNull();
  });

  it('profile queda vacío cuando customer, staff y authority son null', () => {
    const result = buildAuthUser(baseRow);
    expect(result.profile).toEqual({});
  });
});
