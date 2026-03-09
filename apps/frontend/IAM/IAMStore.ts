import { ZustandFactory } from '@utils/ZustandFactory';
import { CORE } from '@shared/CoreSchema';
import { RegisterSchema } from '@shared/contracts/RegisterSchema';

export const useRegisterStore = ZustandFactory(RegisterSchema);

export const useLoginStore = ZustandFactory({
  identity: {
    schema: CORE.identity,
  },
  password: {
    schema: CORE.password,
  },
});
