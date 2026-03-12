import { CORE_ROUTES } from '@shared/CoreSchema';
import { RegisterSchema } from '@shared/contracts/RegisterSchema';
import { LoginSchema } from '@shared/contracts/LoginSchema.ts';
import { createHook } from '@tools/HookFactory';

export const RegisterHook = createHook(CORE_ROUTES.IAM.FULL.REGISTER, 'POST', RegisterSchema);
export const LoginHook = createHook(CORE_ROUTES.IAM.FULL.LOGIN, 'POST', LoginSchema);
