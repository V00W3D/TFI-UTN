import { LoginContract } from 'contracts/LoginContract';
import { RegisterContract } from 'contracts/RegisterContract';
import { createApi } from 'sdk';

export const api = createApi([LoginContract, RegisterContract] as const);
