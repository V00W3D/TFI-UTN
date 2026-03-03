import { z } from 'zod';
import { CORE } from './CoreSchema';
import { createContract } from './ContractFactory';
import type { ContractType } from './ContractFactory';

/* ============================================================
   REGISTER CONTRACT
============================================================ */

/**
 * Contrato formal del proceso de registro de usuario.
 *
 * - Input:
 *    Datos completos necesarios para crear un nuevo usuario.
 *
 * - Output:
 *    Información pública generada tras la creación exitosa.
 */
export const RegisterSchema = createContract(
  /* ---------------------------
     INPUT
  ---------------------------- */
  z.object({
    name: CORE.name,
    sname: CORE.name,
    lname: CORE.name,
    sex: CORE.sex,
    username: CORE.username,
    password: CORE.password,
    email: CORE.email,
    phone: CORE.phone,
  }),

  /* ---------------------------
     OUTPUT DATA (SUCCESS PAYLOAD)
  ---------------------------- */
  z.undefined(),
);

/* ============================================================
   TYPES
============================================================ */

/**
 * Tipo de entrada del contrato Register.
 */
export type RegisterInput = ContractType<typeof RegisterSchema.I>;

/**
 * Tipo de salida exitosa del contrato Register.
 */
export type RegisterOutput = ContractType<typeof RegisterSchema.O>;

/**
 * Tipo de error del contrato Register.
 */
export type RegisterError = ContractType<typeof RegisterSchema.E>;
