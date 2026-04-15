import { memo } from 'react';

import { iamStyles } from '@/styles/modules/iam';

export const CountdownRing = memo(({ progress }: { progress: number }) => {
  const SIZE = 184;
  const SW = 2.5;
  const R = (SIZE - SW) / 2;
  const C = 2 * Math.PI * R;
  const dash = C * Math.max(0, progress);
  const color =
    progress > 0.5
      ? 'var(--color-primary)'
      : progress > 0.25
        ? 'var(--color-warning, hsl(38 80% 48%))'
        : 'var(--color-error)';

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={iamStyles.qrRing}
    >
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={R}
        fill="none"
        stroke="var(--border)"
        strokeWidth={SW}
      />
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={R}
        fill="none"
        stroke={color}
        strokeWidth={SW}
        strokeDasharray={`${dash} ${C}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        className={iamStyles.qrRingProgress}
      />
    </svg>
  );
});
