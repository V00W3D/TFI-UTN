/**
 * @file env.ts
 * @module Frontend
 * @description Archivo env alineado a la arquitectura y trazabilidad QART.
 * Centraliza la configuración de entorno con acceso seguro y sin dependencias críticas top-level.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-05
 */

const getEnvVar = (key: string, defaultValue = ''): string => {
  const metaEnv = (import.meta as any).env;
  if (metaEnv && metaEnv[key]) return String(metaEnv[key]);

  // Fallback for tests or other environments using process.env
  if (typeof process !== 'undefined' && process.env && process.env[key])
    return String(process.env[key]);

  return defaultValue;
};

/** @description Modo de ejecución (dev | prod). */
export const MODE = getEnvVar('VITE_MODE', 'dev') as 'dev' | 'prod';

/** @description Alcance de la aplicación (landing | full). */
export const PUBLIC_APP_SCOPE = getEnvVar('VITE_PUBLIC_APP_SCOPE', 'landing') as 'landing' | 'full';

/** @description Perfil de hosting para resolución de backends. */
export const HOSTING_PROFILE = getEnvVar('VITE_HOSTING_PROFILE', 'standard') as
  | 'standard'
  | 'local_tailscale'
  | 'replit';

/** @description IP de Tailscale para entornos VPN. */
export const TAILSCALE_DEVICE_IP = getEnvVar('VITE_TAILSCALE_DEVICE_IP', '');

const protocol = MODE === 'prod' ? 'https' : 'http';

const resolveBackendHost = (): string => {
  const hostRaw = getEnvVar('VITE_BACKEND_HOST', '').trim();
  if (hostRaw) return hostRaw;

  const hosting = HOSTING_PROFILE;
  const tailscale = TAILSCALE_DEVICE_IP.trim();

  if (hosting === 'local_tailscale' && tailscale) return tailscale;
  if (hosting === 'replit') return 'localhost';
  return '';
};

/** @description Host del backend resuelto según el perfil de hosting. */
export const BACKEND_HOST = resolveBackendHost();

/** @description Puerto del backend resuelto. */
export const BACKEND_PORT = Number(getEnvVar('VITE_BACKEND_PORT', '0'));

const constructedURL =
  BACKEND_HOST && BACKEND_PORT ? `${protocol}://${BACKEND_HOST}:${BACKEND_PORT}` : '';

const rawBackendUrl = getEnvVar('VITE_BACKEND_URL', undefined as any);

/** @description URL base completa para las peticiones al API. */
export const BACKEND_URL: string = rawBackendUrl !== undefined ? rawBackendUrl : constructedURL;
