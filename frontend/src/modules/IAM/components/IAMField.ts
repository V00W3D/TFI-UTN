import { useLoginStore, useRegisterStore } from '@modules/IAM/IAMStore';
import { FieldFactory } from '@tools/FieldFactory';

const RegisterField = FieldFactory(useRegisterStore);
const LoginField = FieldFactory(useLoginStore);

export const NameField = RegisterField('name');
export const SNameField = RegisterField('sname');
export const LNameField = RegisterField('lname');
export const SexField = RegisterField('sex');
export const IdentityField = LoginField('identity');
export const UsernameField = RegisterField('username');
export const LPasswordField = LoginField('password');
export const PasswordField = RegisterField('password');
export const CPasswordField = RegisterField('cpassword');
export const EmailField = RegisterField('email');
export const PhoneField = RegisterField('phone');
