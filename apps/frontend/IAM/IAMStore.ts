import { ZustandFactory } from '@utils/ZustandFactory';
import { CORE } from '@contracts/CoreSchema';
import { RegisterSchema } from '@contracts/RegisterSchema';

export const useRegisterStore = ZustandFactory(RegisterSchema);

export const useLoginStore = ZustandFactory({
  identity: {
    schema: CORE.identity,
  },
  password: {
    schema: CORE.password,
  },
});
