import { LoginContract } from './LoginContract';
import { RegisterContract } from './RegisterContract';
import { defineContracts } from '../ContractFactory';

export const contracts = defineContracts(LoginContract, RegisterContract);
