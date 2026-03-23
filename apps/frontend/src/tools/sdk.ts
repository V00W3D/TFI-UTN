import { BACKEND_URL } from '@env';
import { createClientApi } from '@app/sdk/ApiClient';
import { contracts } from '@app/contracts';
import { FormFactory } from '@tools/FormFactory';

export const sdk = createClientApi(contracts, { baseURL: BACKEND_URL, credentials: 'include' });
export const form = FormFactory(sdk);
