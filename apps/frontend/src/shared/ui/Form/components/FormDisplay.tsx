import { memo } from 'react';
import type { ReactNode } from 'react';
import { calculateStrength, STRENGTH_LABELS } from '@/shared/ui/Form/utils';
import { buttonStyles } from '@/styles/components/button';
import { formStrengthFillStyles, formStyles } from '@/styles/modules/form';
import { cn } from '@/styles/utils/cn';

export const SlotButton = memo(
  ({
    onClick,
    icon,
    description,
  }: {
    onClick: () => void;
    icon: ReactNode;
    description: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={buttonStyles({ variant: 'ghost', size: 'icon' })}
      aria-label={description}
    >
      <span className={formStyles.slotButtonIcon} aria-hidden="true">
        {icon}
      </span>
    </button>
  ),
);

export const StrengthIndicator = memo(({ value }: { value: string }) => {
  const level = calculateStrength(value);
  if (!level) return null;
  const strengthKey = level as keyof typeof formStrengthFillStyles;
  return (
    <div className={formStyles.strength}>
      <div className={formStyles.strengthTrack}>
        <div className={cn(formStyles.strengthFill, formStrengthFillStyles[strengthKey])} />
      </div>
      <span className={formStyles.strengthLabel}>
        {'Fortaleza: '}
        <span className={formStyles.strengthLabelValue}>{STRENGTH_LABELS[level]}</span>
      </span>
    </div>
  );
});

export const RulesList = memo(({ rules }: { rules: readonly string[] }) => (
  <div className={formStyles.rulesList}>
    <ul className={formStyles.rulesListItems}>
      {rules.map((rule, i) => (
        <li key={i} className={formStyles.rulesListItem}>
          <span className={formStyles.rulesListDot} />
          <span className={formStyles.rulesText}>{rule}</span>
        </li>
      ))}
    </ul>
  </div>
));

export const ErrorMessages = memo(({ errors }: { errors: string[] }) => (
  <div className={formStyles.errorList}>
    {errors.map((msg, i) => (
      <span key={i} className={formStyles.errorText}>
        {msg}
      </span>
    ))}
  </div>
));
