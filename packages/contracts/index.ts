/**
 * @file index.ts
 * @module Contracts
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
 * @file packages/contracts/index.ts
 * @description Application contracts — the single source of truth for the API shape.
 *
 * Rules:
 *  1. Never annotate `contracts` with a type — let TypeScript infer the exact tuple.
 *  2. Never import contracts from @app/sdk — contracts only depend on Contracts.ts.
 *  3. Add new contracts here and to the collectContracts call.
 */

import { collectContracts } from '@app/sdk';
import { IAMContract } from './IAMContract';
import { CUSTOMERContract } from './CUSTOMERContract';
// ─────────────────────────────────────────────────────────────
//  NO type annotation — TypeScript must infer the exact tuple.
//  A type annotation would widen to AnyContract[] and destroy
//  all literal type information downstream.
// ─────────────────────────────────────────────────────────────
export const contracts = collectContracts(IAMContract, CUSTOMERContract);

/** @public Explicit type export — safe for type-only imports. */
export type AppContracts = typeof contracts;
export * from './IAMContract';
export * from './CUSTOMERContract';
