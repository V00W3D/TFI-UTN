/**
 * @file index.tsx
 * @module ProfileCard
 * @description Componente unificado para perfiles de usuario con variantes Lite y Default.
 */
import { useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileDefault } from '@/shared/ui/ProfileCard/components/ProfileDefault';
import { ProfileLite } from '@/shared/ui/ProfileCard/components/ProfileLite';
import { useAppStore } from '@/shared/store/appStore';
import type { AppUser } from '@/shared/store/appStore';
import { sdk } from '@/shared/utils/sdk';

interface ProfileCardProps {
  variant: 'lite' | 'default';
  profile?: AppUser | null;
}

export const ProfileCard = ({ variant, profile }: ProfileCardProps) => {
  const { user: appUser, setUser } = useAppStore();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = profile || appUser;
  if (!user) return null;

  const handleCopyId = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // suppress clipboard errors in unsupported environments
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await sdk.iam.logout();
    } finally {
      setUser(null);
      navigate('/iam/login');
    }
  };

  if (variant === 'lite') {
    return (
      <ProfileLite
        user={user}
        onCopyId={handleCopyId}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    );
  }

  return <ProfileDefault user={user} onCopyId={handleCopyId} copied={copied} />;
};

export default ProfileCard;
