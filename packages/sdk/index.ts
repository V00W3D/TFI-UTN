/**
 * @file index.ts
 * @module SDK
 * @description Archivo index alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: datos del modulo y dependencias compartidas
 * outputs: comportamiento o estructuras del modulo
 * rules: respetar contratos, seguridad y trazabilidad definidas en context.md
 *
 * @technical
 * dependencies: dependencias locales del archivo
 * flow: inicializa, transforma y expone la logica del modulo
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
 * decisions: bloque agregado para cumplir el formato obligatorio de context.md
 */
/**
 * @file packages/sdk/index.ts
 * @description Main entry point for @app/sdk.
 *
 * Import paths:
 *   Backend:  import { createServerApi } from '@app/sdk/ApiServer'
 *   Frontend: import { createClientApi } from '@app/sdk/ApiClient'
 *   Shared:   import { ... } from '@app/sdk'
 *
 * ApiServer and ApiClient are intentionally NOT re-exported from this index:
 *   - Prevents accidental cross-environment imports (express in frontend bundle)
 *   - Preserves tree-shaking — bundlers only pull what's actually imported
 */

// ─────────────────────────────────────────────────────────────
//  Shared primitives — safe in any environment (browser + Node)
// ─────────────────────────────────────────────────────────────
export * from './ErrorCodes';
export * from './Contracts';
export * from './FieldDef';
export * from './IAMFields';
export * from './CUSTOMERFields';
export * from './FormStore';
export * from './plateNutrition';
export * from './platePricing';

// ─────────────────────────────────────────────────────────────
//  Type-only re-exports from environment-specific files.
//  These carry zero runtime cost — no code is included.
//  For the actual runtime factories, import by path:
//    Backend:  import { createServerApi } from '@app/sdk/ApiServer'
//    Frontend: import { createClientApi } from '@app/sdk/ApiClient'
// ─────────────────────────────────────────────────────────────
export type {
  // ApiServer types
  ServerApiInstance,
  ServerConfig,
  ServerAdapters,
  ServerEnv,
  SecurityAdapter,
  ErrorAdapter,
  RouteEntry,
  ModuleRouter,
  RequestContext,
  Handler,
  Middleware,
} from './ApiServer';

export type {
  // ApiClient types
  ClientApiInstance,
  ClientConfig,
  CallableEndpoint,
  RequestState,
  RequestShapeOf,
} from './ApiClient';
