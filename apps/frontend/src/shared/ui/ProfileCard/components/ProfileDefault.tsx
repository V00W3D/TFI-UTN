import type { MouseEvent } from 'react';
import type { AppUser } from '@/shared/store/appStore';
import { UsernameIcon, MailIcon, PhoneIcon } from '@/shared/ui/AppIcons';
import { CopyIcon } from '@/shared/ui/ProfileCard/components/ProfileIcons';
import { formatEnumLabel } from '@/shared/utils/enumLabels';
import { cn } from '@/styles/utils/cn';
import { profileCardStyles, profileCardTokens } from '@/styles/modules/profileCard';

interface ProfileDefaultProps {
  user: AppUser;
  onCopyId: (e: MouseEvent<HTMLButtonElement>) => void;
  copied: boolean;
}

export const ProfileDefault = ({ user, onCopyId, copied }: ProfileDefaultProps) => {
  const tierLabel =
    user.profile.tier === 'PREMIUM' ? 'Premium' : user.profile.tier === 'VIP' ? 'VIP' : 'Regular';

  return (
    <div className={profileCardStyles({ variant: 'default' })}>
      <div className={profileCardTokens.defaultLine} />

      <div className={profileCardTokens.defaultHeader}>
        <div className={profileCardTokens.defaultAvatar}>
          {user.name?.charAt(0) || user.username?.charAt(0) || '?'}
        </div>
        <div className={profileCardTokens.defaultIdentity}>
          <div className={profileCardTokens.defaultBadgeRow}>
            <span className={profileCardTokens.badgePrimary}>{formatEnumLabel(user.role)}</span>
            <span className={profileCardTokens.badgeAccent}>{tierLabel}</span>
          </div>
          <h3 className={profileCardTokens.defaultTitle}>
            {user.name} {user.lname}
          </h3>
          <p className={profileCardTokens.usernameBadge}>
            <UsernameIcon width={14} height={14} /> @{user.username}
          </p>
        </div>
      </div>

      <div className={profileCardTokens.infoGrid}>
        <div className={profileCardTokens.infoRow}>
          <div className={profileCardTokens.infoIconBox}>
            <MailIcon width={16} height={16} className={profileCardTokens.infoIcon} />
          </div>
          <div className={profileCardTokens.infoText}>
            <span className={profileCardTokens.infoLabel}>Email</span>
            <span className={profileCardTokens.infoValue}>{user.email}</span>
          </div>
        </div>

        <div className={profileCardTokens.infoRow}>
          <div className={profileCardTokens.infoIconBox}>
            <PhoneIcon width={16} height={16} className={profileCardTokens.infoIcon} />
          </div>
          <div className={profileCardTokens.infoText}>
            <span className={profileCardTokens.infoLabel}>Teléfono</span>
            <span className={profileCardTokens.infoValue}>{user.phone || 'No registrado'}</span>
          </div>
        </div>
      </div>

      <div className={profileCardTokens.footer}>
        <span className={profileCardTokens.footerId}>ID: {user.id}</span>
        <button
          type="button"
          onClick={onCopyId}
          className={cn(profileCardTokens.footerAction, copied && profileCardTokens.footerActionActive)}
        >
          <CopyIcon /> {copied ? 'COPIADO' : 'COPIAR'}
        </button>
      </div>
    </div>
  );
};
