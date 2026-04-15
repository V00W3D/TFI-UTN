import type { FieldAddon } from '@/shared/ui/Form/types';

export const STRENGTH_LABELS = ['', 'muy débil', 'débil', 'decente', 'segura', 'muy segura'] as const;

export const calculateStrength = (value: string): number =>
  (value.length >= 8 ? 1 : 0) +
  (/[A-Z]/.test(value) ? 1 : 0) +
  (/[a-z]/.test(value) ? 1 : 0) +
  (/[0-9]/.test(value) ? 1 : 0) +
  (/[^A-Za-z0-9]/.test(value) ? 1 : 0);

export const extractAddons = (addons: FieldAddon[]) => ({
  iconAddon: addons.find((a): a is Extract<FieldAddon, { type: 'icon' }> => a.type === 'icon'),
  hintAddon: addons.find((a): a is Extract<FieldAddon, { type: 'hint' }> => a.type === 'hint'),
  rulesAddon: addons.find((a): a is Extract<FieldAddon, { type: 'rules' }> => a.type === 'rules'),
  hasPasswordToggle: addons.some((a) => a.type === 'passwordToggle'),
  hasStrength: addons.some((a) => a.type === 'strength'),
});
