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
      comment: input.comment,
      recommends: input.recommends,
    });
  },
);
