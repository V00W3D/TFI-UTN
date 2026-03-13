import { ZustandFactory } from '@tools/ZustandFactory';
import { RegisterContract } from '@shared/contracts/RegisterContract';
import { LoginContract } from '@shared/contracts/LoginContract';
export const useRegisterStore = ZustandFactory(RegisterContract);
export const useLoginStore = ZustandFactory(LoginContract);
