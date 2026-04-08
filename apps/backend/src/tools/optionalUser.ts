/**
 * @file optionalUser.ts
 * @module Backend
 * @description Archivo optionalUser alineado a la arquitectura y trazabilidad QART.
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
import type { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { SESSION_SECRET, REFRESH_SECRET } from '../env';
import type { UserRole, CustomerTier, StaffPost, AuthorityRank } from '@app/sdk';

interface TokenPayload {
  id: string;
  role: UserRole;
  username?: string;
  email?: string;
  phone?: string | null;
  profile?: { tier?: CustomerTier; post?: StaffPost; rank?: AuthorityRank };
}

/**
 * Lee CupCake/Cake sin rotar tokens; útil en rutas públicas para asociar usuario opcional.
 */
export const readOptionalUserId = (req: Request): string | null => {
  const { CupCake: access, Cake: refresh } = req.cookies || {};
  if (!access && !refresh) return null;
  try {
    if (access) {
      const p = jwt.verify(access, SESSION_SECRET) as TokenPayload;
      return p.id;
    }
    const p = jwt.verify(refresh!, REFRESH_SECRET) as TokenPayload;
    return p.id;
  } catch {
    return null;
  }
};
