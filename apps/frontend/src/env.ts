/**
 * @file env.ts
 * @module Frontend
 * @description Archivo env alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: providers globales, rutas, estilos y variables publicas
 * outputs: bootstrap de la aplicacion y configuracion base de la interfaz
 * rules: centralizar montaje, entorno y navegacion
 *
 * @technical
 * dependencies: zod
 * flow: carga configuracion y providers base; monta rutas y capas compartidas; inicia el frontend o expone su configuracion global.
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
 * decisions: la base del frontend se concentra en archivos raiz pequenos y coordinados
 */
import { z } from 'zod';

const envSchema = z.object({
  VITE_MODE: z.enum(['dev', 'prod']),

  /**
   * landing: una sola superficie (home + menú destacado en la misma página).
   * full: también expone /customer y /iam (desarrollo o instancia completa).
   */
  VITE_PUBLIC_APP_SCOPE: z.enum(['landing', 'full']).default('landing'),

  /**
   * Mismo significado que en el backend: si tu IP Tailscale cambia,
   * definila una vez acá y en VITE_BACKEND_HOST (o solo acá y copiá en build).
   */
  VITE_HOSTING_PROFILE: z.enum(['standard', 'local_tailscale', 'replit']).default('standard'),
  VITE_TAILSCALE_DEVICE_IP: z.string().optional(),

  VITE_BACKEND_HOST: z.string().optional().default(''),
  VITE_BACKEND_PORT: z.string().optional().default(''),

  /**
   * Si está definida (aunque sea cadena vacía), reemplaza host+puerto.
   * Vacío + proxy de Vite → fetch relativo al origen del front.
   */
  VITE_BACKEND_URL: z.string().optional(),
});

const parsed = envSchema.parse(import.meta.env);

const hosting = parsed.VITE_HOSTING_PROFILE;
const tailscale = parsed.VITE_TAILSCALE_DEVICE_IP?.trim();
const hostRaw = parsed.VITE_BACKEND_HOST.trim();

const resolveBackendHost = () => {
  if (hostRaw) return hostRaw;
  if (hosting === 'local_tailscale' && tailscale) return tailscale;
  if (hosting === 'replit') return 'localhost';
  return '';
};

export const MODE = parsed.VITE_MODE;
export const PUBLIC_APP_SCOPE = parsed.VITE_PUBLIC_APP_SCOPE;
export const HOSTING_PROFILE = hosting;
export const TAILSCALE_DEVICE_IP = tailscale ?? '';

const protocol = MODE === 'prod' ? 'https' : 'http';

export const BACKEND_HOST = resolveBackendHost();
export const BACKEND_PORT = parsed.VITE_BACKEND_PORT ? Number(parsed.VITE_BACKEND_PORT) : 0;

const constructedURL =
  BACKEND_HOST && BACKEND_PORT ? `${protocol}://${BACKEND_HOST}:${BACKEND_PORT}` : '';

/** URL del API: explícita desde .env, o armada con host/puerto, o vacía para proxy same-origin. */
export const BACKEND_URL: string =
  parsed.VITE_BACKEND_URL !== undefined ? parsed.VITE_BACKEND_URL : constructedURL;
