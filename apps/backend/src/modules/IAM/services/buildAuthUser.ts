/**
 * @file buildAuthUser.ts
 * @module IAM
 * @description Archivo buildAuthUser alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-18
 * rnf: RNF-02
 *
 * @business
 * inputs: payloads tipados, ids autenticados, helpers compartidos y acceso a Prisma cuando aplica
 * outputs: datos de dominio listos para contrato, mutaciones persistidas o payloads auxiliares
 * rules: normalizar datos, validar reglas de dominio y preservar consistencia transaccional
 *
 * @technical
 * dependencies: @app/sdk, @app/contracts
 * flow: normaliza los datos recibidos; consulta o muta dependencias de dominio e infraestructura; arma la respuesta del caso de uso; devuelve un resultado consumible por handlers u otros servicios.
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
 * decisions: la logica de negocio se concentra en funciones async reutilizables y desacopladas del transporte
 */
import type { InferSuccess } from '@app/sdk';
import type { LoginContract } from '@app/contracts';

type AuthProfile = InferSuccess<typeof LoginContract>['profile'];

export interface AuthUserSource {
  id: string;
  username: string;
  name: string;
  sname: string | null;
  lname: string;
  sex: InferSuccess<typeof LoginContract>['sex'];
  email: string;
  emailVerified?: Date | string | boolean | null;
  phone: string | null;
  phoneVerified?: Date | string | boolean | null;
  role: InferSuccess<typeof LoginContract>['role'];
  customer: { tier: AuthProfile['tier'] } | null;
  staff: { post: AuthProfile['post'] } | null;
  authority: { rank: AuthProfile['rank'] } | null;
}

export const buildAuthUser = (row: AuthUserSource): InferSuccess<typeof LoginContract> => ({
  id: row.id,
  username: row.username,
  name: row.name,
  sname: row.sname ?? null,
  lname: row.lname,
  sex: row.sex,
  email: row.email,
  emailVerified: !!row.emailVerified,
  phone: row.phone ?? null,
  phoneVerified: !!row.phoneVerified,
  role: row.role,
  profile: {
    ...(row.customer?.tier ? { tier: row.customer.tier } : {}),
    ...(row.staff?.post ? { post: row.staff.post } : {}),
    ...(row.authority?.rank ? { rank: row.authority.rank } : {}),
  },
});
