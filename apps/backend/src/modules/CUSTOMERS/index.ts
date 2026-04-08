/**
 * @file index.ts
 * @module CUSTOMERS
 * @description Archivo index alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
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
import { api } from '../../tools/api';
import { GetPlatesHandler } from './handlers/GetPlatesHandler';
import { GetFeaturedPlatesHandler } from './handlers/GetFeaturedPlatesHandler';
import { SearchPlatesHandler } from './handlers/SearchPlatesHandler';
import { UpsertReviewHandler } from './handlers/UpsertReviewHandler';
import { CreateCustomerOrderHandler } from './handlers/CreateCustomerOrderHandler';
import { GetCustomerOrderHistoryHandler } from './handlers/GetCustomerOrderHistoryHandler';
import { GetAddressesHandler } from './handlers/GetAddressesHandler';
import { CreateAddressHandler } from './handlers/CreateAddressHandler';
import { UpdateAddressHandler } from './handlers/UpdateAddressHandler';

/**
 * @description CUSTOMERS Module Router.
 * Aggregates all customer-facing platform handlers (Catalog, Nutrition, Diets).
 */
export const CUSTOMERSRouter = api.router([
  GetFeaturedPlatesHandler,
  SearchPlatesHandler,
  GetPlatesHandler,
  CreateCustomerOrderHandler,
  GetCustomerOrderHistoryHandler,
  UpsertReviewHandler,
  GetAddressesHandler,
  CreateAddressHandler,
  UpdateAddressHandler,
]);
