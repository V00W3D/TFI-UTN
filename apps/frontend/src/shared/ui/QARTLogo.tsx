import React from 'react';
import { cn } from '@/styles/utils/cn';
import { logoRootStyles, logoSizes, logoTextStyles, navigationStyles } from '@/styles/modules/navigation';

interface QARTLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | number;
  showText?: boolean;
}

/**
 * @component QARTLogo
 * @description Componente de marca centralizado. Usa SVG para escalabilidad y nitidez.
 */
export const QARTLogo: React.FC<QARTLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const variant = typeof size === 'number' ? 'md' : size;
  const pixelSize = typeof size === 'number' ? size : logoSizes[size];

  return (
    <div className={cn(logoRootStyles({ size: variant }), className)}>
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={navigationStyles.logoSvg}
      >
        <rect width="40" height="40" rx="4" fill="var(--qart-accent)" />
        <rect x="15" y="10" width="10" height="20" fill="var(--qart-surface)" />
      </svg>

      {showText && (
        <span className={logoTextStyles({ size: variant })}>
          QART<span className={navigationStyles.logoDot}>.</span>
        </span>
      )}
    </div>
  );
};

export default QARTLogo;
