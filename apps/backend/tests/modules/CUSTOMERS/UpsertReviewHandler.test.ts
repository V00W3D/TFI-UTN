/**
 * @file UpsertReviewHandler.test.ts
 * @module CUSTOMERS/Tests
 * @description Unit tests for UpsertReviewHandler.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: review payload (plateId, rating, optional comment/recommends)
 * outputs: upserted review record
 * rules: requires CUSTOMER role (enforced by api wrapper); delegates to service
 *
 * @technical
 * dependencies: vitest, UpsertReviewHandler, upsertReviewService
 * flow: mock service -> mock request with user -> call handler -> assert service call mapping
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-H-UPSERT-REVIEW-01
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { UpsertReviewHandler } from '../../../src/modules/CUSTOMERS/handlers/UpsertReviewHandler';
import { upsertReviewService } from '../../../src/modules/CUSTOMERS/services/upsertReviewService';

vi.mock('../../../src/tools/api', () => ({
  api: {
    // 2-curry: handler(id)(fn) => fn
    handler: (_id: string) => (fn: any) => fn,
  },
}));

vi.mock('../../../src/modules/CUSTOMERS/services/upsertReviewService', () => ({
  upsertReviewService: vi.fn(),
}));

describe('UpsertReviewHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-H-UPSERT-REVIEW-01: mapea el input y el userId al servicio correctamente', async () => {
    const mockUser = { id: 'usr-456' };
    const mockCtx = { req: { user: mockUser } } as any;
    const input = {
      plateId: 'plate-123',
      rating: 5,
      comment: 'Excellent!',
      recommends: true,
    };
    const mockResponse = { id: 'rev-1', ...input, userId: mockUser.id };

    vi.mocked(upsertReviewService).mockResolvedValueOnce(mockResponse as any);

    const result = await (UpsertReviewHandler as any)(input, mockCtx);

    expect(upsertReviewService).toHaveBeenCalledWith({
      userId: 'usr-456',
      plateId: 'plate-123',
      rating: 5,
      comment: 'Excellent!',
      recommends: true,
    });
    expect(result).toEqual(mockResponse);
  });

  it('TC-H-UPSERT-REVIEW-02: funciona sin campos opcionales', async () => {
    const mockUser = { id: 'usr-456' };
    const mockCtx = { req: { user: mockUser } } as any;
    const input = {
      plateId: 'plate-123',
      rating: 4,
    };

    await (UpsertReviewHandler as any)(input, mockCtx);

    expect(upsertReviewService).toHaveBeenCalledWith({
      userId: 'usr-456',
      plateId: 'plate-123',
      rating: 4,
    });
  });
});
