import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@/shared/ui/AppIcons';
import { iamStyles } from '@/styles/modules/iam';
import { cn } from '@/styles/utils/cn';

interface AuthHeroProps {
  badge: string;
  kicker: string;
  title: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * @component AuthHero
 * @description Panel lateral informativo para los flujos de autenticación.
 */
export const AuthHero: React.FC<AuthHeroProps> = ({
  badge,
  kicker,
  title,
  className = '',
  children,
}) => {
  return (
    <div className={cn(iamStyles.hero, className)}>
      <div className={iamStyles.heroAccentLine} />
      <div className={iamStyles.heroPattern} />

      <div>
        <Link to="/" className={iamStyles.backButton}>
          <ArrowLeftIcon
            className={iamStyles.backIconFixed}
            width={12}
            height={12}
          />
          <span>VOLVER AL INICIO</span>
        </Link>
      </div>

      <div className={iamStyles.badge}>{badge}</div>

      <div className={iamStyles.heroCopy}>
        <p className={iamStyles.kicker}>{kicker}</p>
        <h1 className={iamStyles.title}>{title}</h1>
      </div>

      {children && <div className={iamStyles.heroExtra}>{children}</div>}
    </div>
  );
};

export default AuthHero;
