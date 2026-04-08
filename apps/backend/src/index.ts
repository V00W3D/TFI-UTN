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
