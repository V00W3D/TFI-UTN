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
 * inputs: schemas, contratos, adapters y utilidades tipadas compartidas
 * outputs: infraestructura tipada reutilizable del workspace
 * rules: preservar una unica fuente de verdad y API funcional tipada
 *
 * @technical
 * dependencies: @app/sdk, IAMContract, CUSTOMERContract
 * flow: define artefactos compartidos del workspace; compone tipos, contratos o runtime reutilizable; exporta piezas consumidas por frontend y backend.
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
 * decisions: las piezas compartidas viven en packages para evitar duplicacion
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
