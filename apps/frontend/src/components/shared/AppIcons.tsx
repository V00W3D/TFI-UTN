import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const strokeDefaults = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const IdentityIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M4 18.5c1.6-2.6 4.4-4 8-4s6.4 1.4 8 4" />
    <circle cx="12" cy="8" r="3.5" />
    <path d="M3 5.5h3.5" />
    <path d="M17.5 5.5H21" />
  </svg>
);

export const ProfileIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 19c1.7-3 4.3-4.5 7-4.5S17.3 16 19 19" />
  </svg>
);

export const UsernameIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M7.5 8.5a4.5 4.5 0 1 1 8.6 1.7c-.8 1.6-2.3 2.2-3.7 2.8-1.2.5-2.1 1.1-2.1 2.5" />
    <path d="M12 18.5h.01" />
  </svg>
);

export const MailIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m5.5 7.5 6.5 5 6.5-5" />
  </svg>
);

export const PhoneIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M7.2 4.8h2.2l1.1 4-1.6 1.6a13 13 0 0 0 4.6 4.6l1.6-1.6 4 1.1v2.2a1.8 1.8 0 0 1-2 1.8A14.6 14.6 0 0 1 5.4 6.8a1.8 1.8 0 0 1 1.8-2Z" />
  </svg>
);

export const LockIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <rect x="5" y="10.5" width="14" height="9" rx="2" />
    <path d="M8.5 10.5V8a3.5 3.5 0 1 1 7 0v2.5" />
    <path d="M12 14.2v2.6" />
  </svg>
);

export const ClearIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M5 7.5h14" />
    <path d="m9 7.5.5-2h5l.5 2" />
    <path d="M8.2 7.5 9 18.5h6l.8-11" />
    <path d="M10 10.5v5" />
    <path d="M14 10.5v5" />
  </svg>
);

export const EyeOpenIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.75" />
  </svg>
);

export const EyeClosedIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="m4 4 16 16" />
    <path d="M10.7 6.2A10.4 10.4 0 0 1 12 6c6 0 9.5 6 9.5 6a15.6 15.6 0 0 1-3.2 3.8" />
    <path d="M6.1 8.1A15.3 15.3 0 0 0 2.5 12s3.5 6 9.5 6c1.4 0 2.7-.3 3.8-.8" />
    <path d="M9.9 9.9A3 3 0 0 0 12 15a3 3 0 0 0 2.1-.9" />
  </svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M19 12H5" />
    <path d="m11 18-6-6 6-6" />
  </svg>
);

export const MaleIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <circle cx="9.5" cy="14.5" r="4.5" />
    <path d="M13 11 19.5 4.5" />
    <path d="M15.5 4.5h4v4" />
  </svg>
);

export const FemaleIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <circle cx="12" cy="9.5" r="4.5" />
    <path d="M12 14v6" />
    <path d="M9.5 17.5h5" />
  </svg>
);

export const NeutralIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <circle cx="12" cy="12" r="6.5" />
    <path d="M8.5 12h7" />
    <path d="M12 8.5v7" />
  </svg>
);

export const InstagramIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
    <path d="M7.2 3h9.6A4.2 4.2 0 0 1 21 7.2v9.6a4.2 4.2 0 0 1-4.2 4.2H7.2A4.2 4.2 0 0 1 3 16.8V7.2A4.2 4.2 0 0 1 7.2 3Zm0 1.8A2.4 2.4 0 0 0 4.8 7.2v9.6a2.4 2.4 0 0 0 2.4 2.4h9.6a2.4 2.4 0 0 0 2.4-2.4V7.2a2.4 2.4 0 0 0-2.4-2.4H7.2Zm9.85 1.35a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z" />
  </svg>
);

export const FacebookIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
    <path d="M13.4 21v-7.3h2.5l.4-2.9h-2.9V8.9c0-.8.2-1.5 1.5-1.5h1.6V4.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v2.9h2.5V21h3.1Z" />
  </svg>
);

export const TikTokIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
    <path d="M14.5 3c.3 1.8 1.4 3.5 3 4.3 1 .5 2 .8 3 .8v3a9 9 0 0 1-3.2-.6v5.1a5.5 5.5 0 1 1-5.5-5.5c.3 0 .5 0 .8.1v3.1a2.4 2.4 0 1 0 1.9 2.3V3h3Z" />
  </svg>
);

export const WhatsAppIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
    <path d="M12 3.2a8.8 8.8 0 0 1 7.6 13.2L21 21l-4.8-1.2A8.8 8.8 0 1 1 12 3.2Zm0 1.8a7 7 0 0 0-6.1 10.5l.2.4-.8 2.8 2.9-.8.4.2A7 7 0 1 0 12 5Zm3.4 9c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1l-.6.7c-.1.2-.3.2-.5.1a5.7 5.7 0 0 1-1.7-1.1 6.2 6.2 0 0 1-1.2-1.5c-.1-.2 0-.4.1-.5l.3-.4.2-.3v-.4l-.6-1.5c-.1-.3-.3-.2-.5-.2h-.4c-.2 0-.4.1-.6.3a2.5 2.5 0 0 0-.8 1.8c0 1.1.8 2.2 1 2.5.1.1 1.7 2.5 4 3.4 2.4.9 2.4.6 2.8.6.4 0 1.3-.5 1.4-1 .2-.5.2-1 .1-1.1 0-.1-.2-.2-.4-.3Z" />
  </svg>
);

export const MapPinIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M12 20s6-5.5 6-10.2A6 6 0 1 0 6 9.8C6 14.5 12 20 12 20Z" />
    <circle cx="12" cy="9.5" r="2.2" />
  </svg>
);

export const ClockIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v5l3.5 2" />
  </svg>
);
