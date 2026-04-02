import { api } from '../../../tools/api';
import { readOptionalUserId } from '../../../tools/optionalUser';
import { createCustomerOrderService } from '../services/createCustomerOrderService';

/**
 * @description POST /customers/orders — público; asocia usuario si hay cookies de sesión.
 */
export const CreateCustomerOrderHandler = api.handler('POST /customers/orders')(
  async (input, { req }) => {
    const customerUserId = readOptionalUserId(req);
    return createCustomerOrderService(input, { customerUserId });
  },
);
