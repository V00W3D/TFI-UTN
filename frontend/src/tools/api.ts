import { BACKEND_URL } from '@env';
import { ApiInstance } from '@shared/apiclient';
import { contracts } from '@shared/contracts';

export const api = ApiInstance(contracts, { baseURL: BACKEND_URL, credentials: 'include' });
