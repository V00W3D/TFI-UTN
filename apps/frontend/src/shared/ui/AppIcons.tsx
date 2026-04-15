/**
 * @file AppIcons.tsx
 * @module Frontend
 * @description Archivo AppIcons alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: props de presentacion, estado derivado y callbacks
 * outputs: bloques de UI interactivos reutilizables
 * rules: mantener componentes composables y sin logica persistente
 *
 * @technical
 * dependencies: react
 * flow: recibe props o estado derivado; calcula etiquetas, listas o variantes visuales; renderiza la seccion interactiva; delega eventos a callbacks, stores o modales del nivel superior.
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: se prioriza composicion de interfaz y reutilizacion de piezas visuales
 */
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

export const EditIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

export const CopyIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <rect x="9" y="9" width="10" height="10" rx="1.5" />
    <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
  </svg>
);

export const MenuGridIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} strokeWidth={2.5} {...props}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

export const CraftIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} strokeWidth={2.5} {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export const InvoiceIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} strokeWidth={2.5} {...props}>
    <path d="M4 4h16v16H4z" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);

export const SettingsIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} strokeWidth={2.5} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const SearchIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeDefaults} {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
