import { BACKEND_URL } from '@env';
import { defineContracts, createClient } from '@shared/apiclient';
import { LoginContract } from '@shared/contracts/LoginContract';
import { RegisterContract } from '@shared/contracts/RegisterContract';

const contracts = defineContracts([LoginContract, RegisterContract] as const);
export const api = createClient({ baseURL: BACKEND_URL, credentials: 'include' }, contracts);
