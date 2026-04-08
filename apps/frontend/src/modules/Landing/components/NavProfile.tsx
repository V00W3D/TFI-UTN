/**
 * @file NavProfile.tsx
 * @module Landing
 * @description Archivo NavProfile alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-05
 * rnf: RNF-03
 *
 * @business
 * inputs: props de presentacion, estado derivado y callbacks
 * outputs: bloques de UI interactivos reutilizables
 * rules: mantener componentes composables y sin logica persistente
 *
 * @technical
 * dependencies: react, react-router-dom, appStore, sdk
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';
import { sdk } from '../../../tools/sdk';

const CopyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="square"
  >
    <rect x="9" y="9" width="13" height="13" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="square"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="square"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const NavProfile = () => {
  const { user, setUser } = useAppStore();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Failed to copy
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

  return (
    <div className="flex items-center gap-2 border-[3px] border-qart-border bg-qart-surface p-1.5 shadow-sharp(--qart-border)">
      {/* Profile Pic Placeholder */}
      <div className="w-9 h-9 border-2 border-qart-border bg-qart-accent flex items-center justify-center shrink-0">
        <span className="text-qart-text-on-accent font-black text-lg leading-none uppercase">
          {user.username.charAt(0)}
        </span>
      </div>

      {/* User details */}
      <div className="flex flex-col px-1 justify-center min-w-32">
        <span className="font-black text-xs uppercase tracking-widest text-qart-primary leading-tight truncate max-w-32">
          {user.username}
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[0.6rem] font-bold text-qart-text-muted uppercase tracking-wider">
            ID: {user.id.slice(0, 6)}...
          </span>
          <button
            type="button"
            onClick={handleCopyId}
            className="text-qart-text-muted hover:text-qart-accent transition-colors cursor-pointer"
            title="Copiar ID"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>
      </div>

      {/* Logout button */}
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`w-9 h-9 flex items-center justify-center border-l-2 border-qart-border transition-colors shrink-0 ${isLoggingOut ? 'text-qart-text-muted cursor-not-allowed opacity-50' : 'text-qart-text hover:text-qart-error hover:bg-qart-error-bg cursor-pointer'}`}
        title="Cerrar sesión"
      >
        <LogoutIcon />
      </button>
    </div>
  );
};

export default NavProfile;
