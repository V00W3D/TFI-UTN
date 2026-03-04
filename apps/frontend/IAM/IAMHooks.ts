import { CORE_ROUTES } from '@contracts/CoreSchema';
import { RegisterSchema } from '@contracts/RegisterSchema';
import { LoginSchema } from '@contracts/LoginSchema';
import { createHook } from '@utils/HookFactory';

export const RegisterHook = createHook(CORE_ROUTES.IAM.FULL.REGISTER, 'POST', RegisterSchema);
export const LoginHook = createHook(CORE_ROUTES.IAM.FULL.LOGIN, 'POST', LoginSchema);
