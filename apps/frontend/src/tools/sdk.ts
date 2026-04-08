/**
 * @file sdk.ts
 * @module Frontend
 * @description Archivo sdk alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: contratos, SDK cliente, eventos de formulario y configuracion del frontend
 * outputs: helpers reutilizables de integracion, formularios y acceso a API
 * rules: centralizar integraciones compartidas y sostener tipado fuerte
 *
 * @technical
 * dependencies: env, @app/sdk/ApiClient, @app/contracts, FormFactory
 * flow: recibe contratos, estado o configuracion; construye helpers reutilizables para integrar UI, formularios y API; exporta piezas compartidas por el frontend.
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
 * decisions: las integraciones transversales se encapsulan en herramientas reutilizables
 */
import { BACKEND_URL } from '../qartEnv';
import { createClientApi } from '@app/sdk/ApiClient';
import { contracts } from '@app/contracts';
import { FormFactory } from './FormFactory';

/**
 * @file sdk.ts
 * @author Victor
 * @description Centralized SDK instance for the frontend.
 * Provides typesafe API methods and form generation tools.
 */
export const sdk = createClientApi(contracts, { baseURL: BACKEND_URL, credentials: 'include' });

/** @description Automatic form generator bound to the centralized SDK. */
export const form = FormFactory(sdk);
