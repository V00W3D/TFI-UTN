/**
 * @file issueAuthCookies.ts
 * @module IAM
 * @description Archivo issueAuthCookies alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-18
 * rnf: RNF-02
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
import * as jwt from 'jsonwebtoken';
import type { Response } from 'express';
import type { InferSuccess } from '@app/sdk';
import type { LoginContract } from '@app/contracts';
import { BUN_MODE, REFRESH_SECRET, SESSION_SECRET } from '../../../env';

const COOKIE_BASE = { httpOnly: true, secure: BUN_MODE === 'prod', sameSite: 'strict' as const };

export const issueAuthCookies = (res: Response, user: InferSuccess<typeof LoginContract>) => {
  const tokenPayload = {
    id: user.id,
    username: user.username,
    name: user.name,
    sname: user.sname ?? null,
    lname: user.lname,
    sex: user.sex,
    email: user.email,
    emailVerified: user.emailVerified,
    phone: user.phone ?? null,
    phoneVerified: user.phoneVerified,
    role: user.role,
    profile: { ...user.profile },
  };

  res.cookie('CupCake', jwt.sign(tokenPayload, SESSION_SECRET, { expiresIn: '1h' }), {
    ...COOKIE_BASE,
    maxAge: 3600000,
  });

  res.cookie('Cake', jwt.sign(tokenPayload, REFRESH_SECRET, { expiresIn: '7d' }), {
    ...COOKIE_BASE,
    maxAge: 604800000,
  });
};
