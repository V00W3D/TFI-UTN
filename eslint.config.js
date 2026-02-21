import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  /* ===============================
     BASE JS RECOMMENDED
  =============================== */
  js.configs.recommended,

  /* ===============================
     TYPESCRIPT BASE (FRONT + BACK)
  =============================== */
  ...tseslint.configs.recommended,

  /* ===============================
     GLOBAL BASE (TS)
  =============================== */
  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },

    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      /* PRETTIER */
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      /* TYPESCRIPT */
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  /* ===============================
     FRONTEND (React)
  =============================== */
  {
    files: ['frontend/**/*.{ts,tsx}'],

    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },

    plugins: {
      react: reactPlugin,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    ...reactPlugin.configs.recommended,
  },

  /* ===============================
     BACKEND (Node)
  =============================== */
  {
    files: ['backend/**/*.ts'],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
