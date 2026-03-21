import { BACKEND_URL } from '@env';
import { createClientApi } from '@app/sdk/ApiClient';
import { contracts } from '@app/contracts';

export const sdk = createClientApi(contracts, { baseURL: BACKEND_URL, credentials: 'include' });
