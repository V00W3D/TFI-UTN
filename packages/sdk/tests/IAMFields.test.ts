/**
 * @file IAMFields.test.ts
 * @module SDK/Tests
 * @description Tests unitarios completos para IAMFields.ts.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-01, RF-02
 * rnf: RNF-02
 *
 * @business
 * inputs: valores de campos IAM para validación
 * outputs: verificación de aceptación/rechazo según reglas de dominio
 * rules: username sin reserved words; password con fuerza completa; email normalizado; phone E.164; identity flexible
 *
 * @technical
 * dependencies: vitest, @app/sdk (IAMFields)
 * flow: parsea valores válidos e inválidos contra cada schema de campo; aserta comportamiento esperado
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1.5
 *
 * @testing
 * cases: TC-IAM-FIELDS-01, TC-IAM-FIELDS-02, TC-IAM-FIELDS-03
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: se cubre sistemáticamente cada campo para evitar regresiones en validaciones de formulario
 */
import { describe, expect, it } from 'vitest';
import {
  usernameField,
  passwordField,
  cpasswordField,
  nameField,
  snameField,
  lnameField,
  emailField,
  phoneField,
  identityField,
  sexField,
  userRoleField,
  customerTierField,
  staffPostField,
  authorityRankField,
  SEX_VALUES,
  USER_ROLE_VALUES,
  CUSTOMER_TIER_VALUES,
  STAFF_POST_VALUES,
  AUTHORITY_RANK_VALUES,
} from '../IAMFields';

// ─────────────────────────────────────────────────────────────
// TC-IAM-FIELDS-01 — usernameField
// ─────────────────────────────────────────────────────────────
describe('usernameField', () => {
  it('acepta username alfanumérico con guion bajo', () => {
    expect(usernameField.schema.safeParse('victor_123').success).toBe(true);
  });

  it('rechaza username con menos de 4 caracteres', () => {
    expect(usernameField.schema.safeParse('ab').success).toBe(false);
  });

  it('rechaza username con más de 32 caracteres', () => {
    expect(usernameField.schema.safeParse('a'.repeat(33)).success).toBe(false);
  });

  it('rechaza username con espacios', () => {
    expect(usernameField.schema.safeParse('victor login').success).toBe(false);
  });

  it('rechaza username con palabras reservadas (admin)', () => {
    expect(usernameField.schema.safeParse('super_admin').success).toBe(false);
  });

  it('rechaza username con "root"', () => {
    expect(usernameField.schema.safeParse('root_user').success).toBe(false);
  });

  it('rechaza username con caracteres especiales', () => {
    expect(usernameField.schema.safeParse('victor@qart').success).toBe(false);
  });

  it('tiene reglas de UI definidas', () => {
    expect(usernameField.rules.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-IAM-FIELDS-02 — passwordField y cpasswordField
// ─────────────────────────────────────────────────────────────
describe('passwordField', () => {
  it('acepta contraseña con fuerza completa', () => {
    expect(passwordField.schema.safeParse('Segura123!').success).toBe(true);
  });

  it('rechaza contraseña sin mayúscula', () => {
    expect(passwordField.schema.safeParse('segura123!').success).toBe(false);
  });

  it('rechaza contraseña sin minúscula', () => {
    expect(passwordField.schema.safeParse('SEGURA123!').success).toBe(false);
  });

  it('rechaza contraseña sin número', () => {
    expect(passwordField.schema.safeParse('Seguraaaa!').success).toBe(false);
  });

  it('rechaza contraseña sin símbolo especial', () => {
    expect(passwordField.schema.safeParse('Segura1234').success).toBe(false);
  });

  it('rechaza contraseña de menos de 8 caracteres', () => {
    expect(passwordField.schema.safeParse('Se1!').success).toBe(false);
  });
});

describe('cpasswordField', () => {
  it('acepta cualquier string de 8+ caracteres (confirmación, no verifica fuerza)', () => {
    expect(cpasswordField.schema.safeParse('cualquierstring8').success).toBe(true);
  });

  it('rechaza strings cortos', () => {
    expect(cpasswordField.schema.safeParse('short').success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-IAM-FIELDS-03 — nameField, snameField, lnameField
// ─────────────────────────────────────────────────────────────
describe('nameField / snameField / lnameField', () => {
  it('nameField acepta nombre con letras y acentos', () => {
    expect(nameField.schema.safeParse('Víctor').success).toBe(true);
  });

  it('nameField rechaza nombre con números', () => {
    expect(nameField.schema.safeParse('Victor1').success).toBe(false);
  });

  it('nameField rechaza nombre de 1 caracter', () => {
    expect(nameField.schema.safeParse('V').success).toBe(false);
  });

  it('snameField acepta null (es nullable)', () => {
    expect(snameField.schema.safeParse(null).success).toBe(true);
  });

  it('snameField acepta string válido', () => {
    expect(snameField.schema.safeParse('Andrés').success).toBe(true);
  });

  it('lnameField acepta apellido con guion', () => {
    expect(lnameField.schema.safeParse('García-López').success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-IAM-FIELDS-04 — emailField
// ─────────────────────────────────────────────────────────────
describe('emailField', () => {
  it('acepta email válido', () => {
    expect(emailField.schema.safeParse('victor@example.com').success).toBe(true);
  });

  it('normaliza a minúsculas automáticamente', () => {
    const result = emailField.schema.safeParse('VICTOR@EXAMPLE.COM');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe('victor@example.com');
  });

  it('rechaza email sin @', () => {
    expect(emailField.schema.safeParse('notanemail').success).toBe(false);
  });

  it('rechaza email con dominio incompleto', () => {
    expect(emailField.schema.safeParse('user@').success).toBe(false);
  });

  it('rechaza email que supera 128 caracteres', () => {
    const longEmail = `${'a'.repeat(120)}@example.com`;
    expect(emailField.schema.safeParse(longEmail).success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-IAM-FIELDS-05 — phoneField
// ─────────────────────────────────────────────────────────────
describe('phoneField', () => {
  it('acepta número E.164 argentino válido', () => {
    expect(phoneField.schema.safeParse('+5493811234567').success).toBe(true);
  });

  it('acepta null (es nullable)', () => {
    expect(phoneField.schema.safeParse(null).success).toBe(true);
  });

  it('rechaza número sin código de país', () => {
    expect(phoneField.schema.safeParse('3811234567').success).toBe(false);
  });

  it('rechaza número con caracteres no numéricos', () => {
    expect(phoneField.schema.safeParse('+549-381-1234567').success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-IAM-FIELDS-06 — identityField (username OR email OR phone)
// ─────────────────────────────────────────────────────────────
describe('identityField', () => {
  it('acepta username válido como identity', () => {
    expect(identityField.schema.safeParse('victor_123').success).toBe(true);
  });

  it('acepta email válido como identity', () => {
    expect(identityField.schema.safeParse('victor@example.com').success).toBe(true);
  });

  it('acepta teléfono E.164 como identity', () => {
    expect(identityField.schema.safeParse('+5493811234567').success).toBe(true);
  });

  it('rechaza string vacío', () => {
    expect(identityField.schema.safeParse('').success).toBe(false);
  });

  it('rechaza un string que no sea ninguno de los tres formatos', () => {
    expect(identityField.schema.safeParse('12').success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-IAM-FIELDS-07 — Enum fields
// ─────────────────────────────────────────────────────────────
describe('campos de enums', () => {
  it('sexField acepta todos los valores del enum Sex', () => {
    for (const v of SEX_VALUES) {
      expect(sexField.schema.safeParse(v).success).toBe(true);
    }
  });

  it('sexField rechaza valor no registrado', () => {
    expect(sexField.schema.safeParse('UNKNOWN').success).toBe(false);
  });

  it('userRoleField acepta todos los valores del enum UserRole', () => {
    for (const v of USER_ROLE_VALUES) {
      expect(userRoleField.schema.safeParse(v).success).toBe(true);
    }
  });

  it('customerTierField acepta todos los tiers', () => {
    for (const v of CUSTOMER_TIER_VALUES) {
      expect(customerTierField.schema.safeParse(v).success).toBe(true);
    }
  });

  it('staffPostField acepta todos los posts', () => {
    for (const v of STAFF_POST_VALUES) {
      expect(staffPostField.schema.safeParse(v).success).toBe(true);
    }
  });

  it('authorityRankField acepta todos los ranks', () => {
    for (const v of AUTHORITY_RANK_VALUES) {
      expect(authorityRankField.schema.safeParse(v).success).toBe(true);
    }
  });

  it('customerTierField rechaza valor no registrado', () => {
    expect(customerTierField.schema.safeParse('GOLD').success).toBe(false);
  });
});
