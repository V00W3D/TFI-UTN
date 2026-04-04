import { api } from '../../../tools/api';
import { readOptionalUserId } from '../../../tools/optionalUser';
import { getCustomerOrderHistoryService } from '../services/getCustomerOrderHistoryService';

/**
 * @description GET /customers/history — público; si hay sesión, retorna pedidos asociados.
 */
export const GetCustomerOrderHistoryHandler = api.handler('GET /customers/history')(async (
  _input,
  { req },
) => {
  const customerUserId = readOptionalUserId(req);
  return getCustomerOrderHistoryService({ customerUserId });
});
