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

/**
 * @description Injects request-level logging.
 * Morgan is kept here to separate operational logging from application initialization.
 */
app.use(morgan('dev'));

/**
 * @description Orchestrates backend bootstrap.
 * 1. Initialize SDK with Express app context.
 * 2. Register all module routers (e.g., IAM).
 * 3. Bind the database adapter for automated connection lifecycle.
 */
api
  .init({
    app,
    routers: [IAMRouter],
    db: [prismaAdapter],
  })
  .start();
