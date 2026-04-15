/**
 * @file theme.ts
 * @module Frontend
 * @description Theme switching via CSS data-theme attribute.
 */
import { documentStyles } from '@/styles/app';

type ThemeMode = 'light' | 'dark';

export const ensureStyleResources = () => {
  document.documentElement.className = documentStyles.html;
  document.body.className = documentStyles.body;
};

export const applyTheme = (mode: ThemeMode) => {
  document.documentElement.dataset.theme = mode;
  document.documentElement.style.colorScheme = mode;
};
