/**
 * @file env.ts
 * @module Backend
 * @description Archivo env alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: configuracion, modulos compartidos o datos semilla del backend
 * outputs: constantes, bootstrap, helpers de catalogo o datos iniciales
 * rules: mantener coherencia con entorno, contratos y datos base
 *
 * @technical
 * dependencies: zod, dotenv
 * flow: carga configuracion o datos base; coordina dependencias de infraestructura; expone constantes, helpers o bootstrap segun su responsabilidad.
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
 * decisions: los archivos raiz concentran bootstrap y soporte comun del backend
 */
import * as z from 'zod';
import { config } from 'dotenv';

config();

const envSchema = z.object({
  BUN_MODE: z.enum(['dev', 'prod']),

  /**
   * standard: usás BACKEND_HOST / FRONTEND_HOST tal cual.
   * local_tailscale: si falta BACKEND_HOST, se usa TAILSCALE_DEVICE_IP (VPN).
   * replit: conviene BACKEND_HOST=0.0.0.0 y CORS vía REPLIT_DEV_DOMAIN + *.replit.dev.
   */
  HOSTING_PROFILE: z.enum(['standard', 'local_tailscale', 'replit']).default('standard'),
  TAILSCALE_DEVICE_IP: z.string().optional(),

  BACKEND_HOST: z.string().optional(),
  BACKEND_PORT: z.string(),

  FRONTEND_HOST: z.string().optional(),
  FRONTEND_PORT: z.string().optional(),

  /** Orígenes extra para CORS (URLs completas separadas por coma, ej. http://192.168.0.5:5173) */
  CORS_EXTRA_ORIGINS: z.string().optional().default(''),

  /** Dominio publicado por Replit (sin esquema); se inyecta en runtime en muchos proyectos. */
  REPLIT_DEV_DOMAIN: z.string().optional(),

  DATABASE_URL: z.url(),
  SESSION_SECRET: z.string(),
  REFRESH_SECRET: z.string(),
});

const parsed = envSchema.parse(process.env);

const hosting = parsed.HOSTING_PROFILE;
const tailscale = parsed.TAILSCALE_DEVICE_IP?.trim();
const backendHostRaw = parsed.BACKEND_HOST?.trim();
const frontendHostRaw = parsed.FRONTEND_HOST?.trim();

const resolveBackendHost = () => {
  if (backendHostRaw) return backendHostRaw;
  if (hosting === 'local_tailscale' && tailscale) return tailscale;
  if (hosting === 'replit') return '0.0.0.0';
  throw new Error(
    'Definí BACKEND_HOST o, con HOSTING_PROFILE=local_tailscale, TAILSCALE_DEVICE_IP.',
  );
};

const resolveFrontendHostForCors = () => {
  if (frontendHostRaw) return frontendHostRaw;
  if (hosting === 'local_tailscale' && tailscale) return tailscale;
  return 'localhost';
};

/** @description Perfil de despliegue (Tailscale, Replit, etc.). */
export const HOSTING_PROFILE = hosting;
/** @description IP opcional del nodo Tailscale cuando no querés repetirla en BACKEND_HOST. */
export const TAILSCALE_DEVICE_IP = tailscale ?? '';

export const BUN_MODE = parsed.BUN_MODE;
const protocol = BUN_MODE === 'prod' ? 'https' : 'http';

export const BACKEND_HOST = resolveBackendHost();
export const BACKEND_PORT = Number(parsed.BACKEND_PORT);
export const BACKEND_URL = `${protocol}://${BACKEND_HOST}:${BACKEND_PORT}`;

export const FRONTEND_HOST = resolveFrontendHostForCors();
export const FRONTEND_PORT = parsed.FRONTEND_PORT?.trim() || '5173';

export const CORS_EXTRA_ORIGINS = parsed.CORS_EXTRA_ORIGINS;
export const REPLIT_DEV_DOMAIN = parsed.REPLIT_DEV_DOMAIN?.trim();

export const DATABASE_URL = parsed.DATABASE_URL;
export const SESSION_SECRET = parsed.SESSION_SECRET;
export const REFRESH_SECRET = parsed.REFRESH_SECRET;
