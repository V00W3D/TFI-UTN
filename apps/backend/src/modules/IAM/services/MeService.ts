/**
 * @file MeService.ts
 * @module IAM
 * @description Devuelve la identidad autenticada ya hidratada por middleware.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-05
 * rnf: RNF-02
 *
 * @business
 * inputs: request autenticada
 * outputs: snapshot del usuario autenticado
 * rules: req.user proviene solo del JWT; rechazar requests sin sesion; no exponer password
 *
 * @technical
 * dependencies: express, @app/sdk, @app/contracts
 * flow: valida req.user; extrae perfil; serializa respuesta auth-safe
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-IAM-ME-01
 *
 * @notes
 * decisions: el service se mantiene puro respecto a persistencia para reaprovechar middleware
 */
import type { Request } from 'express';
import { ERR, type InferSuccess } from '@app/sdk';
import type { MeContract } from '@app/contracts';

/**
 * @description Identity Extraction Logic.
 * Returns a sanitized copy of the authenticated session already hydrated by middleware.
 */
export const meService = async (req: Request): Promise<InferSuccess<typeof MeContract>> => {
  if (!req.user) throw ERR.UNAUTHORIZED();

  const user = req.user;

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    sname: user.sname,
    lname: user.lname,
    sex: user.sex,
    email: user.email,
    emailVerified: user.emailVerified,
    phone: user.phone,
    phoneVerified: user.phoneVerified,
    role: user.role,
    profile: {
      ...(user.profile.tier ? { tier: user.profile.tier } : {}),
      ...(user.profile.post ? { post: user.profile.post } : {}),
      ...(user.profile.rank ? { rank: user.profile.rank } : {}),
    },
  };
};
