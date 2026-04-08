/**
 * @file plateCatalogMap.test.ts
 * @module Backend/Tests/CUSTOMERS
 * @description Tests unitarios para las funciones puras de mapeo en plateCatalogMap.ts.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18, RF-19
 * rnf: RNF-03
 *
 * @business
 * inputs: rows de Prisma de reviews, usuarios y tags
 * outputs: verificación de mapeo correcto a DTOs del contrato CUSTOMER
 * rules: displayName prioriza name+lname sobre username; createdAt Date → ISO string; tags preservan id, name, description
 *
 * @technical
 * dependencies: vitest, plateCatalogMap
 * flow: construye fixtures de review y user; ejecuta funciones de mapeo; verifica shape resultante
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-CATALOG-MAP-01 a TC-CATALOG-MAP-05
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: solo se prueban las funciones puras de mapeo sin Prisma; mapPlateRecordToDto requeriría fixtures muy grandes
 */
import { describe, expect, it } from 'vitest';
import {
  reviewerFromUser,
  mapReviewWithUser,
} from '../../../src/modules/CUSTOMERS/services/plateCatalogMap';
import type { ReviewUserSelect } from '../../../src/modules/CUSTOMERS/services/plateCatalogMap';

// ─────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────
const buildUser = (overrides: Partial<ReviewUserSelect> = {}): ReviewUserSelect => ({
  id: 'user-1',
  name: 'Victor',
  sname: null,
  lname: 'Perez',
  username: 'victor_q',
  ...overrides,
});

// ─────────────────────────────────────────────────────────────
// TC-CATALOG-MAP-01 — reviewerFromUser
// ─────────────────────────────────────────────────────────────
describe('reviewerFromUser', () => {
  it('TC-CATALOG-MAP-01a: arma displayName con name + lname', () => {
    const reviewer = reviewerFromUser(buildUser());
    expect(reviewer.displayName).toBe('Victor Perez');
  });

  it('TC-CATALOG-MAP-01b: incluye sname cuando existe', () => {
    const reviewer = reviewerFromUser(buildUser({ sname: 'Andrés' }));
    expect(reviewer.displayName).toBe('Victor Andrés Perez');
  });

  it('TC-CATALOG-MAP-01c: usa username como fallback cuando name y lname están vacíos', () => {
    const reviewer = reviewerFromUser(buildUser({ name: '', lname: '' }));
    expect(reviewer.displayName).toBe('victor_q');
  });

  it('TC-CATALOG-MAP-01d: genera avatarUrl con el username como seed', () => {
    const reviewer = reviewerFromUser(buildUser());
    expect(reviewer.avatarUrl).toContain('victor_q');
    expect(reviewer.avatarUrl).toContain('dicebear.com');
  });

  it('TC-CATALOG-MAP-01e: preserva el id del usuario', () => {
    const reviewer = reviewerFromUser(buildUser({ id: 'user-abc' }));
    expect(reviewer.id).toBe('user-abc');
  });
});

// ─────────────────────────────────────────────────────────────
// TC-CATALOG-MAP-02 — mapReviewWithUser
// ─────────────────────────────────────────────────────────────
describe('mapReviewWithUser', () => {
  const baseDate = new Date('2025-06-15T10:30:00.000Z');
  const baseReview = {
    id: 'review-1',
    rating: 5,
    comment: 'Excelente plato',
    recommends: true,
    createdAt: baseDate,
    user: buildUser(),
  };

  it('TC-CATALOG-MAP-02a: convierte createdAt Date a ISO string', () => {
    const mapped = mapReviewWithUser(baseReview);
    expect(mapped.createdAt).toBe(baseDate.toISOString());
    expect(typeof mapped.createdAt).toBe('string');
  });

  it('TC-CATALOG-MAP-02b: preserva rating, comment y recommends', () => {
    const mapped = mapReviewWithUser(baseReview);
    expect(mapped.rating).toBe(5);
    expect(mapped.comment).toBe('Excelente plato');
    expect(mapped.recommends).toBe(true);
  });

  it('TC-CATALOG-MAP-02c: comment null se preserva como null', () => {
    const mapped = mapReviewWithUser({ ...baseReview, comment: null });
    expect(mapped.comment).toBeNull();
  });

  it('TC-CATALOG-MAP-02d: recommends null se preserva como null', () => {
    const mapped = mapReviewWithUser({ ...baseReview, recommends: null });
    expect(mapped.recommends).toBeNull();
  });

  it('TC-CATALOG-MAP-02e: reviewer tiene el displayName correcto', () => {
    const mapped = mapReviewWithUser(baseReview);
    expect(mapped.reviewer.displayName).toBe('Victor Perez');
  });
});
