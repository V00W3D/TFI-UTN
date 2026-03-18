import { LoginContract } from './LoginContract';
import { RegisterContract } from './RegisterContract';
import { collectContracts } from 'SDKFactory/Contracts';

const IAMContracts = [LoginContract, RegisterContract] as const;

export const contracts = collectContracts(IAMContracts);
