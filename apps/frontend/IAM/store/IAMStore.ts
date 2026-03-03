import { ZustandFactory } from '@utils/ZustandFactory';
import { CORE } from '@contracts/CoreSchema';

export const useRegisterStore = ZustandFactory({
  name: { schema: CORE.name },
  sname: { schema: CORE.name },
  lname: { schema: CORE.name },
  sex: { schema: CORE.sex },

  username: {
    schema: CORE.username,
  },
  password: {
    schema: CORE.password,
  },
  cpassword: {
    schema: CORE.password,
    dependsOn: ['password'],
    validate(value, state) {
      if (value !== state.password) {
        return ['Las contraseñas no coinciden'];
      }

      return true;
    },
  },

  email: {
    schema: CORE.email,
  },
  phone: {
    schema: CORE.phone,
  },
});

export const useLoginStore = ZustandFactory({
  identity: {
    schema: CORE.identity,
  },
  password: {
    schema: CORE.password,
  },
});
