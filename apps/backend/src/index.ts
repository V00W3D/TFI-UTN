/**
 * @file index.ts
 * @module Backend
 * @description Archivo index alineado a la arquitectura y trazabilidad QART.
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
 * dependencies: morgan, api, db, IAM, CUSTOMERS
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
/**
 * @file index.ts
 * @author Victor
 * @description Backend entry point — boots the Express server via the SDK.
 * @remarks
 *   Express app setup (middleware, CORS, helmet, etc.) lives in tools/api.ts.
 *   This file only orchestrates startup: api.init({ app, routers, db }).start().
 *
 * Metrics:
 * - LOC: 18
 * - Experience Level: Junior
 * - Estimated Time: 5m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */

import morgan from 'morgan';
import app, { api } from './tools/api';
import { prismaAdapter } from './tools/db';
import { IAMRouter } from './modules/IAM';
import { CUSTOMERSRouter } from './modules/CUSTOMERS';

/**
 * @description Injects request-level logging.
 * Morgan is kept here to separate operational logging from application initialization.
 */
app.use(morgan('dev'));

/**
 * @description Orchestrates backend bootstrap.
 * 1. Initialize SDK with Express app context.
 * 2. Register all module routers (e.g., IAM, CUSTOMERS).
 * 3. Bind the database adapter for automated connection lifecycle.
 */
api
  .init({
    app,
    routers: [IAMRouter, CUSTOMERSRouter],
    db: [prismaAdapter],
  })
  .start();
