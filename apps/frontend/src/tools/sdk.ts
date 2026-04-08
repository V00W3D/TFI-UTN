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
import { BACKEND_URL } from '../env';
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
