import { z } from 'zod';
import { CORE } from './CoreSchema';
import { createContract } from './ContractFactory';
import type { ContractType } from './ContractFactory';

/* ============================================================
   LOGIN CONTRACT
============================================================ */

/**
 * Contrato formal del proceso de autenticación.
 *
 * - Input:
 *    Credenciales necesarias para autenticar al usuario.
 *
 * - Output:
 *    Información básica del usuario autenticado.
 */
export const LoginSchema = createContract(
  /* ---------------------------
     INPUT
  ---------------------------- */
  z.object({
    identity: CORE.identity,

    /**
     * En login no necesitamos la validación full de complejidad,
     * solo que exista.
     */
    password: z.string().trim().min(1, 'La contraseña es obligatoria'),
  }),

  /* ---------------------------
     OUTPUT DATA (SUCCESS PAYLOAD)
  ---------------------------- */
  z
    .object({
      /**
       * Identificador único persistido en base de datos.
       */
      id: z.string().uuid(),

      /**
       * Datos normalizados del dominio.
       * Se reutilizan los tipos del CoreSchema.
       */
      username: CORE.username,
      email: CORE.email,
      phone: CORE.phone,

      /**
       * Rol del usuario dentro del sistema.
       * (Idealmente debería ser un enum del dominio)
       */
      role: z.string(),
    })
    .readonly(),
);

/* ============================================================
   TYPES
============================================================ */

/**
 * Tipo inferido de entrada del contrato Login.
 */
export type LoginInput = ContractType<typeof LoginSchema.I>;

/**
 * Tipo inferido de salida exitosa del contrato Login.
 */
export type LoginOutput = ContractType<typeof LoginSchema.O>;

/**
 * Tipo inferido de error del contrato Login.
 */
export type LoginError = ContractType<typeof LoginSchema.E>;
