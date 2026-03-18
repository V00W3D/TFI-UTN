import { BACKEND_URL } from '@env';
import { createSDK } from '@shared/SDK';
import { contracts } from '@shared/contracts';

export const sdk = createSDK(contracts, { baseURL: BACKEND_URL, credentials: 'include' });
