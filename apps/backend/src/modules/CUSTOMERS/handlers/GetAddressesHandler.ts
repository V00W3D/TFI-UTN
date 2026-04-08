/**
 * @file GetAddressesHandler.ts
 * @module CUSTOMERS
 * @description Archivo GetAddressesHandler alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
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
import { ERR } from '@app/sdk';
import { api } from '../../../tools/api';
import { getAddressesService } from '../services/addressService';

export const GetAddressesHandler = api.handler('GET /customers/addresses')(async (
  _input,
  { req },
) => {
  if (!req.user) throw ERR.UNAUTHORIZED();
  return getAddressesService(req.user.id);
});
