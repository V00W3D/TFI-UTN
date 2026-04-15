import type { MouseEvent } from 'react';
import type { AppUser } from '@/shared/store/appStore';
import { cn } from '@/styles/utils/cn';
import { profileCardStyles, profileCardTokens } from '@/styles/modules/profileCard';
import { CopyIcon, LogoutIcon } from '@/shared/ui/ProfileCard/components/ProfileIcons';

interface ProfileLiteProps {
  user: AppUser;
  onCopyId: (e: MouseEvent<HTMLButtonElement>) => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export const ProfileLite = ({ user, onCopyId, onLogout, isLoggingOut }: ProfileLiteProps) => {
  return (
    <div className={profileCardStyles({ variant: 'lite' })}>
      <div className={profileCardTokens.liteAvatar}>{user.username.charAt(0).toUpperCase()}</div>
      <div className={profileCardTokens.liteInfo}>
        <span className={profileCardTokens.liteName}>{user.username}</span>
        <div className={profileCardTokens.liteMeta}>
          <span>ID: {user.id.slice(0, 6)}</span>
          <button
            type="button"
            onClick={onCopyId}
            className={profileCardTokens.liteMetaAction}
          >
            <CopyIcon />
          </button>
        </div>
      </div>
      <button
        type="button"
        className={cn(profileCardTokens.liteAction, profileCardTokens.liteDivider)}
        onClick={onLogout}
        disabled={isLoggingOut}
        title="Cerrar sesión"
      >
        <LogoutIcon />
      </button>
    </div>
  );
};
