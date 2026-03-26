/**
 * @file sdk.ts
 * @author Victor
 * @description Automatically enforced JSDoc header according to context.md guidelines.
 * @param null
 * @returns null
 * @example null
 * @remarks This file is part of the QART monorepo architecture.
 *
 * Metrics:
 * - LOC: 50
 * - Experience Level: Junior
 * - Estimated Time: 30m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */
import { BACKEND_URL } from '@env';
import { createClientApi } from '@app/sdk/ApiClient';
import { contracts } from '@app/contracts';
import { FormFactory } from '@tools/FormFactory';

export const sdk = createClientApi(contracts, { baseURL: BACKEND_URL, credentials: 'include' });
export const form = FormFactory(sdk);
