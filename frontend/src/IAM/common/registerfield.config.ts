import type { ValidationState } from '../common/AuthFieldBuilder';
import type { RegisterState } from '@IAM/store/IAMStore';

/* =========================================================
   BASE TYPES
========================================================= */

type Store = RegisterState;

export type FieldConfig = TextConfig | RadioConfig;

interface BaseConfig {
  label: string;
  name: string;
  type: 'text' | 'email' | 'password' | 'phone' | 'radio';
  autoComplete?: string;
  maxLength?: number;
  inputIcon?: string;
  placeholder?: string;
  hint?: string;
  rules?: string[];
  showHelpToggle?: boolean;
  visionToggler?: boolean;
}

interface TextConfig extends BaseConfig {
  type: 'text' | 'email' | 'password' | 'phone';
}

interface RadioConfig extends BaseConfig {
  type: 'radio';
  radioOptions: {
    value: Store['sex'];
    label: string;
    icon?: string;
  }[];
}

/* =========================================================
   CONFIG HELPERS
========================================================= */

const textField = (
  config: Omit<TextConfig, 'type'> & { type?: TextConfig['type'] },
): TextConfig => ({
  type: 'text',
  showHelpToggle: true,
  ...config,
});

const passwordField = (config: Omit<TextConfig, 'type'>): TextConfig => ({
  ...textField(config),
  type: 'password',
  visionToggler: true,
});

const radioField = (config: Omit<RadioConfig, 'type'>): RadioConfig => ({
  type: 'radio',
  ...config,
});

/* =========================================================
   STATIC CONFIG
========================================================= */

const NAME_MIN = 2;
const NAME_MAX = 50;

export const REGISTER_CONFIG = {
  firstName: textField({
    label: 'Primer nombre',
    name: 'firstName',
    autoComplete: 'given-name',
    maxLength: NAME_MAX,
    inputIcon: '/first-name.png',
    hint: `${NAME_MIN}-${NAME_MAX} caracteres`,
    rules: [
      `Debe tener entre ${NAME_MIN} y ${NAME_MAX} caracteres`,
      'Solo letras, espacios, guiones y apóstrofes',
    ],
  }),

  middleName: textField({
    label: 'Segundo nombre',
    name: 'middleName',
    autoComplete: 'additional-name',
    maxLength: NAME_MAX,
    inputIcon: '/second-name.png',
    hint: `(OPCIONAL) ${NAME_MIN}-${NAME_MAX} caracteres`,
    rules: [
      `Debe tener entre ${NAME_MIN} y ${NAME_MAX} caracteres`,
      'Solo letras, espacios, guiones y apóstrofes',
    ],
  }),

  lastName: textField({
    label: 'Apellido',
    name: 'lastName',
    autoComplete: 'family-name',
    maxLength: NAME_MAX,
    inputIcon: '/last-name.png',
    hint: `${NAME_MIN}-${NAME_MAX} caracteres`,
    rules: [
      `Debe tener entre ${NAME_MIN} y ${NAME_MAX} caracteres`,
      'Solo letras, espacios, guiones y apóstrofes',
    ],
  }),

  username: textField({
    label: 'Usuario',
    name: 'username',
    autoComplete: 'username',
    maxLength: 20,
    inputIcon: '/user-icon.png',
    placeholder: 'ju4n_',
    hint: '4–20 caracteres',
    rules: [
      'Debe tener entre 4 y 20 caracteres',
      'Solo letras, números y guiones bajos (_)',
      'Se almacenará en minúsculas',
    ],
  }),

  email: textField({
    type: 'email',
    label: 'Correo electrónico',
    name: 'email',
    autoComplete: 'email',
    maxLength: 254,
    inputIcon: '/email-icon.png',
    placeholder: 'ejemplo@correo.com',
    hint: 'Correo válido requerido',
    rules: ['Debe ser un correo válido', 'Debe incluir @ y dominio'],
  }),

  password: passwordField({
    label: 'Contraseña',
    name: 'password',
    autoComplete: 'new-password',
    maxLength: 72,
    inputIcon: '/lock-icon.png',
    hint: '8–72 caracteres',
    rules: ['8–72 caracteres', 'Mayúscula', 'Minúscula', 'Número', 'Símbolo'],
  }),

  confirmPassword: passwordField({
    label: 'Confirmar contraseña',
    name: 'confirmPassword',
    autoComplete: 'new-password',
    maxLength: 72,
    inputIcon: '/key-icon.png',
    hint: 'Debe coincidir con la contraseña',
    rules: ['Debe coincidir exactamente'],
  }),

  phone: textField({
    type: 'phone',
    label: 'Teléfono',
    name: 'phone',
    inputIcon: '/phone-icon.png',
    hint: '(OPCIONAL) Incluye código país',
    rules: ['Número válido', 'Incluir código país'],
  }),

  sex: radioField({
    label: 'Sexo',
    name: 'sex',
    hint: 'Seleccioná cómo te identificás',
    radioOptions: [
      { value: 'male', label: 'Masculino', icon: '/masculine-icon.png' },
      { value: 'female', label: 'Femenino', icon: '/femenine-icon.png' },
      { value: 'other', label: 'Otro', icon: '/other-gender.png' },
    ],
  }),
} as const;

export type RegisterFieldType = keyof typeof REGISTER_CONFIG;

/* =========================================================
   FIELD BINDING TYPES (TIPADO FUERTE SIN ANY)
========================================================= */

export type FieldBinding<K extends RegisterFieldType> = {
  value: Store[K];
  validate: ValidationState;
  setter: (v: Store[K]) => void;
};
/* =========================================================
   AUTO BINDING FACTORY (100% TYPE SAFE)
========================================================= */

export const createRegisterBindings = (store: Store) => {
  return {
    firstName: {
      value: store.firstName,
      validate: store.vFirstName,
      setter: store.setFirstName,
    },
    middleName: {
      value: store.middleName,
      validate: store.vMiddleName,
      setter: store.setMiddleName,
    },
    lastName: {
      value: store.lastName,
      validate: store.vLastName,
      setter: store.setLastName,
    },
    username: {
      value: store.username,
      validate: store.vUsername,
      setter: store.setUsername,
    },
    email: {
      value: store.email,
      validate: store.vEmail,
      setter: store.setEmail,
    },
    password: {
      value: store.password,
      validate: store.vPassword,
      setter: store.setPassword,
    },
    confirmPassword: {
      value: store.confirmPassword,
      validate: store.vConfirmPassword,
      setter: store.setConfirmPassword,
    },
    phone: {
      value: store.phone,
      validate: store.vPhone,
      setter: store.setPhone,
    },
    sex: {
      value: store.sex,
      validate: store.vSex,
      setter: store.setSex,
    },
  };
};
