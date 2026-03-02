import { create } from 'zustand';

import {
  UsernameValidator,
  EmailValidator,
  PasswordValidator,
  ConfirmPasswordValidator,
  NameValidator,
  PhoneValidator,
  SexValidator,
} from '@IAM/validators';

export type SexType = 'male' | 'female' | 'other';

/* ======================================================
   VALIDATION TYPE
====================================================== */

type ValidationResult = true | string[];

/* Helper */
const isValid = (v: ValidationResult) => v === true;

/* ======================================================
   STATE
====================================================== */

export interface RegisterState {
  /* ===== VALUES ===== */
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  sex: SexType | '';

  /* ===== VALID FLAGS ===== */
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

  /* ===== SETTERS ===== */
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

/* ======================================================
   STORE
====================================================== */

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

  setFirstName: (value) => {
    const result = NameValidator(value);
    set({ firstName: value, vFirstName: result });
    get().validateForm();
  },

  setMiddleName: (value) => {
    const result = value.length === 0 ? true : NameValidator(value);
    set({ middleName: value, vMiddleName: result });
    get().validateForm();
  },

  setLastName: (value) => {
    const result = NameValidator(value);
    set({ lastName: value, vLastName: result });
    get().validateForm();
  },

  setUsername: (value) => {
    const lower = value.toLowerCase();
    const result = UsernameValidator(lower);
    set({ username: lower, vUsername: result });
    get().validateForm();
  },

  setEmail: (value) => {
    const result = EmailValidator(value);
    set({ email: value, vEmail: result });
    get().validateForm();
  },

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

  setSex: (value) => {
    const result = SexValidator(value);
    set({ sex: value, vSex: result });
    get().validateForm();
  },

  /* ======================================================
     GLOBAL FORM VALIDATION
  ====================================================== */

  validateForm: () => {
    const s = get();

    const isFormValid =
      isValid(s.vFirstName) &&
      isValid(s.vMiddleName) &&
      isValid(s.vLastName) &&
      isValid(s.vUsername) &&
      isValid(s.vEmail) &&
      isValid(s.vPhone) &&
      isValid(s.vPassword) &&
      isValid(s.vConfirmPassword) &&
      isValid(s.vSex);

    set({ isFormValid });
  },
}));
