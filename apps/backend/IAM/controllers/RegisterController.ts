import type { Request, Response } from 'express';
import { RegisterSchema } from '@contracts/RegisterSchema';
import { RegisterService } from '../services/RegisterService';

/* ============================================================
   REGISTER CONTROLLER (FULLY CONTRACT-BOUND)
============================================================ */

/**
 * Controlador estrictamente alineado al contrato RegisterSchema.
 *
 * - Toda respuesta pasa por validación Zod (Output o Error).
 * - Si el contrato cambia, este archivo rompe en compile time.
 * - No se devuelve ningún objeto fuera del contrato.
 */
export const RegisterController = async (req: Request, res: Response): Promise<void> => {
  try {
    /* ---------------------------
       INPUT VALIDATION
    ---------------------------- */

    const parsed = await RegisterSchema.I.safeParseAsync(req.body);

    if (!parsed.success) {
      const errorResponse = RegisterSchema.E.parse({
        ok: false,
        message: 'Credenciales inválidas',
      });

      res.status(400).json(errorResponse);
      return;
    }

    /* ---------------------------
       SERVICE EXECUTION
    ---------------------------- */

    await RegisterService(parsed.data);

    /* ---------------------------
       SUCCESS RESPONSE (CONTRACT O)
    ---------------------------- */

    const successResponse = RegisterSchema.O.parse({
      ok: true,
      message: 'Usuario registrado correctamente',
      data: undefined, // porque el contrato define z.undefined()
    });

    res.status(201).json(successResponse);
    return;
  } catch (err: any) {
    console.error(err);

    /* ---------------------------
       DOMAIN CONFLICT
    ---------------------------- */

    if (err?.message?.includes('uso')) {
      const conflictResponse = RegisterSchema.E.parse({
        ok: false,
        message: err.message,
      });

      res.status(409).json(conflictResponse);
      return;
    }

    /* ---------------------------
       INTERNAL ERROR
    ---------------------------- */

    const internalErrorResponse = RegisterSchema.E.parse({
      ok: false,
      message: 'Error interno',
    });

    res.status(500).json(internalErrorResponse);
  }
};
