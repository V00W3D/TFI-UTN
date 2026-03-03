import { create } from 'zustand';

import {
  UsernameValidator,
  EmailValidator,
  PasswordValidator,
  ConfirmPasswordValidator,
  NameValidator,
  PhoneValidator,
  SexValidator,
  IdentityValidator,
} from '@IAM/validators';

export type SexType = 'male' | 'female' | 'other';

/* ======================================================
   VALIDATION TYPE
====================================================== */

type ValidationResult = true | string[];

const isValid = (v: ValidationResult) => v === true;

/* ======================================================
   SHARED HELPERS (DRY CORE)
====================================================== */

const computeIsFormValid = (validations: ValidationResult[]) => validations.every(isValid);

const createValidatedSetter =
  <T>(
    set: any,
    get: any,
    key: string,
    validator: (value: T) => ValidationResult,
    after?: (value: T) => void,
  ) =>
  (value: T) => {
    const result = validator(value);
    set({ [key]: value, [`v${capitalize(key)}`]: result });
    after?.(value);
  };

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

/* ======================================================
   REGISTER STATE
====================================================== */

export interface RegisterState {
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  sex: SexType | '';

  vFirstName: ValidationResult;
  vMiddleName: ValidationResult;
  vLastName: ValidationResult;
  vUsername: ValidationResult;
  vEmail: ValidationResult;
  vPhone: ValidationResult;
  vPassword: ValidationResult;
  vConfirmPassword: ValidationResult;
  vSex: ValidationResult;

  isFormValid: boolean;

  setFirstName: (value: string) => void;
  setMiddleName: (value: string) => void;
  setLastName: (value: string) => void;
  setUsername: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  setSex: (value: SexType) => void;

  validateForm: () => void;
}

export const useRegisterStore = create<RegisterState>((set, get) => ({
  /* ===== VALUES ===== */
  firstName: '',
  middleName: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  sex: '',

  /* ===== VALID FLAGS ===== */
  vFirstName: [],
  vMiddleName: true,
  vLastName: [],
  vUsername: [],
  vEmail: [],
  vPhone: true,
  vPassword: [],
  vConfirmPassword: [],
  vSex: [],

  isFormValid: false,

  /* ======================================================
     SETTERS
  ====================================================== */

  setFirstName: createValidatedSetter(set, get, 'firstName', NameValidator, () =>
    get().validateForm(),
  ),

  setMiddleName: (value) => {
    const result = value.length === 0 ? true : NameValidator(value);
    set({ middleName: value, vMiddleName: result });
    get().validateForm();
  },

  setLastName: createValidatedSetter(set, get, 'lastName', NameValidator, () =>
    get().validateForm(),
  ),

  setUsername: (value) => {
    const lower = value.toLowerCase();
    const result = UsernameValidator(lower);
    set({ username: lower, vUsername: result });
    get().validateForm();
  },

  setEmail: createValidatedSetter(set, get, 'email', EmailValidator, () => get().validateForm()),

  setPhone: (value) => {
    const result = value.length === 0 ? true : PhoneValidator(value);
    set({ phone: value, vPhone: result });
    get().validateForm();
  },

  setPassword: (value) => {
    const passwordResult = PasswordValidator(value);
    const confirmResult = ConfirmPasswordValidator(value, get().confirmPassword);

    set({
      password: value,
      vPassword: passwordResult,
      vConfirmPassword: confirmResult,
    });

    get().validateForm();
  },

  setConfirmPassword: (value) => {
    const result = ConfirmPasswordValidator(get().password, value);
    set({ confirmPassword: value, vConfirmPassword: result });
    get().validateForm();
  },

  setSex: createValidatedSetter(set, get, 'sex', SexValidator, () => get().validateForm()),

  validateForm: () => {
    const s = get();
    const isFormValid = computeIsFormValid([
      s.vFirstName,
      s.vMiddleName,
      s.vLastName,
      s.vUsername,
      s.vEmail,
      s.vPhone,
      s.vPassword,
      s.vConfirmPassword,
      s.vSex,
    ]);
    set({ isFormValid });
  },
}));

/* ======================================================
   LOGIN STATE
====================================================== */

export interface LoginState {
  identity: string;
  password: string;

  vIdentity: ValidationResult;
  vPassword: ValidationResult;

  isFormValid: boolean;

  setIdentity: (value: string) => void;
  setPassword: (value: string) => void;

  validateForm: () => void;
}

export const useLoginStore = create<LoginState>((set, get) => ({
  identity: '',
  password: '',

  vIdentity: [],
  vPassword: [],

  isFormValid: false,

  setIdentity: (value) => {
    const result = IdentityValidator(value);
    set({ identity: value, vIdentity: result });
    get().validateForm();
  },

  setPassword: (value) => {
    const result = PasswordValidator(value);
    set({ password: value, vPassword: result });
    get().validateForm();
  },

  validateForm: () => {
    const s = get();
    const isFormValid = computeIsFormValid([s.vIdentity, s.vPassword]);
    set({ isFormValid });
  },
}));
