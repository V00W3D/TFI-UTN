import { BACKEND_URL } from '../env';
import { createClientApi } from '@app/sdk/ApiClient';
import { contracts } from '@app/contracts';
import { FormFactory } from './FormFactory';

/**
 * @file sdk.ts
 * @author Victor
 * @description Centralized SDK instance for the frontend.
 * Provides typesafe API methods and form generation tools.
 */
export const sdk = createClientApi(contracts, { baseURL: BACKEND_URL, credentials: 'include' });

/** @description Automatic form generator bound to the centralized SDK. */
export const form = FormFactory(sdk);
