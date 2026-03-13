import { RegisterContract } from '@shared/contracts/RegisterContract';
import { LoginContract } from '@shared/contracts/LoginContract';
import { createHook } from '@tools/HookFactory';

export const RegisterHook = createHook(RegisterContract);
export const LoginHook = createHook(LoginContract);
