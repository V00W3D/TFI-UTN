/* ============================================================
   CORE ROUTES CONFIGURATION
============================================================ */

/**
 * Todas las rutas del sistema centralizadas.
 *
 * Estructura:
 * - Cada dominio tiene su PREFIX
 * - Cada acción define su path relativo
 * - FULL expone la ruta completa lista para usar
 *
 * Esto permite compartir rutas entre frontend y backend
 * sin duplicar strings.
 */

function buildRoutes<TPrefix extends string, TActions extends Record<string, `/${string}`>>(
  prefix: TPrefix,
  actions: TActions,
) {
  const full = Object.fromEntries(
    Object.entries(actions).map(([key, value]) => [key, `${prefix}${value}`]),
  ) as {
    [K in keyof TActions]: `${TPrefix}${TActions[K]}`;
  };

  return Object.freeze({
    PREFIX: prefix,
    ...actions,
    FULL: full,
  });
}

/* ============================================================
   IAM ROUTES
============================================================ */

export const IAM = buildRoutes('/iam', {
  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: '/logout',
  REFRESH: '/refresh',
  VERIFY_EMAIL: '/verify-email',
});

/* ============================================================
   POS ROUTES
============================================================ */

export const POS = buildRoutes('/pos', {
  CREATE_ORDER: '/create-order',
  GET_ORDER: '/get-order',
  CANCEL_ORDER: '/cancel-order',
});

/* ============================================================
   ADMIN ROUTES
============================================================ */

export const ADMIN = buildRoutes('/admin', {
  GET_USERS: '/users',
  UPDATE_USER: '/update-user',
  DELETE_USER: '/delete-user',
});

/* ============================================================
   CORE SYSTEM ROUTES
============================================================ */

export const CORE = buildRoutes('/core', {
  HEALTH: '/health',
  VERSION: '/version',
});

/* ============================================================
   GLOBAL EXPORT
============================================================ */

export const CORE_ROUTES = Object.freeze({
  IAM,
  POS,
  ADMIN,
  CORE,
});
