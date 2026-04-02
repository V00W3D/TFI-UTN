import { api } from '../../../tools/api';
import { upsertReviewService } from '../services/upsertReviewService';

/**
 * @description POST /customers/reviews — solo CUSTOMER autenticado.
 */
export const UpsertReviewHandler = api.handler('POST /customers/reviews', { roles: ['CUSTOMER'] })(
  async (input, { req }) => {
    return upsertReviewService({
      userId: req.user!.id,
      plateId: input.plateId,
      rating: input.rating,
      ...(input.comment !== undefined ? { comment: input.comment } : {}),
      ...(input.recommends !== undefined ? { recommends: input.recommends } : {}),
    });
  },
);
