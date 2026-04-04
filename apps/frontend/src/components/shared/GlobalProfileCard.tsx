import { useAppStore } from '../../appStore';
import { MailIcon, PhoneIcon, UsernameIcon } from './AppIcons';
import type { AuthUserSchema } from '@app/contracts';
import { z } from 'zod';

type UserData = z.infer<typeof AuthUserSchema>;

export const GlobalProfileCard = ({ profile }: { profile?: UserData; isOwner?: boolean }) => {
  const { user: appUser } = useAppStore();
  const user = profile || appUser;

  if (!user) return null;

  return (
    <div className="border-[3px] border-qart-border bg-qart-surface p-6 shadow-[6px_6px_0_var(--qart-primary)] w-full font-sans flex flex-col gap-4 relative overflow-hidden group">
      {/* Decorative architectural line */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-qart-accent" />

      <div className="flex gap-1.5 absolute top-4 right-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-qart-primary text-white px-3 py-1 border border-white/20 shadow-sharp">
          {user.role}
        </span>
      </div>

      <div className="flex gap-5 items-center border-b-2 border-qart-border pb-6 mt-4">
        <div className="w-20 h-20 bg-qart-primary flex items-center justify-center text-white text-3xl font-black shrink-0 border-2 border-qart-border shadow-sharp transition-transform group-hover:scale-105">
          {user.name?.charAt(0) || user.username?.charAt(0) || '?'}
        </div>
        <div className="flex flex-col overflow-hidden">
          <h3 className="font-black text-2xl tracking-tighter uppercase leading-[0.9] mb-1">
            {user.name} {user.sname ? `${user.sname} ` : ''}
            {user.lname}
          </h3>
          <p className="text-[0.65rem] font-black text-qart-text-muted flex items-center gap-2 uppercase tracking-widest bg-qart-bg-warm px-2 py-1 border border-qart-border-subtle w-fit">
            <UsernameIcon className="w-3.5 h-3.5" /> @{user.username}
          </p>
        </div>
      </div>

      <div className="space-y-4 py-2">
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="w-10 h-10 bg-qart-bg-warm border-2 border-qart-border flex items-center justify-center">
            <MailIcon className="w-5 h-5 text-qart-primary shrink-0" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[9px] font-black uppercase text-qart-text-muted tracking-widest mb-0.5">
              Electrónico
            </span>
            <span className="truncate text-sm font-black tracking-tight">{user.email}</span>
          </div>
          {user.emailVerified && (
            <div className="ml-auto w-6 h-6 bg-qart-success border-2 border-qart-border flex items-center justify-center shadow-[2px_2px_0_var(--qart-border)]">
              <span className="text-white text-[10px] font-black">✓</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="w-10 h-10 bg-qart-bg-warm border-2 border-qart-border flex items-center justify-center">
            <PhoneIcon className="w-5 h-5 text-qart-primary shrink-0" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase text-qart-text-muted tracking-widest mb-0.5">
              Contacto
            </span>
            <span className="text-sm font-black tracking-tight">
              {user.phone || 'NO REGISTRADO'}
            </span>
          </div>
          {user.phoneVerified && user.phone && (
            <div className="ml-auto w-6 h-6 bg-qart-success border-2 border-qart-border flex items-center justify-center shadow-[2px_2px_0_var(--qart-border)]">
              <span className="text-white text-[10px] font-black">✓</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 pt-4 border-t border-qart-border-subtle">
        <div className="flex items-center justify-between opacity-50 px-2">
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1 h-3 bg-qart-primary" />
            ))}
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.3em]">
            ID: {user.id.split('-')[0]}
          </span>
        </div>
      </div>
    </div>
  );
};
