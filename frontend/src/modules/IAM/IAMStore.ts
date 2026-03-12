import { ZustandFactory } from '@tools/ZustandFactory';
import { RegisterSchema } from '@shared/contracts/RegisterSchema';
import { LoginSchema } from '@shared/contracts/LoginSchema';

export const useRegisterStore = ZustandFactory(RegisterSchema);
export const useLoginStore = ZustandFactory(LoginSchema);
