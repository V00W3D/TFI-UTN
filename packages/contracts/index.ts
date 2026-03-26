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
