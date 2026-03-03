import type { Request, Response } from 'express';
import { LoginSchema } from '@contracts/LoginSchema';
import { LoginService } from '../services/LoginService';
import jwt from 'jsonwebtoken';
import { BUN_MODE, SESSION_SECRET, REFRESH_SECRET } from '@env';

/* ============================================================
   LOGIN CONTROLLER (FULLY CONTRACT-BOUND)
============================================================ */

export const LoginController = async (req: Request, res: Response): Promise<void> => {
  try {
    /* ---------------------------
       INPUT VALIDATION
    ---------------------------- */

    const parsed = await LoginSchema.I.safeParseAsync(req.body);

    if (!parsed.success) {
      const errorResponse = LoginSchema.E.parse({
        ok: false,
        message: 'Credenciales inválidas',
      });

      res.status(400).json(errorResponse);
      return;
    }

    /* ---------------------------
       SERVICE EXECUTION
    ---------------------------- */

    const user = await LoginService(parsed.data);

    /* ---------------------------
       JWT GENERATION
    ---------------------------- */

    const accessToken = jwt.sign({ ...user }, SESSION_SECRET, { expiresIn: '1h' });

    const refreshToken = jwt.sign({ ...user }, REFRESH_SECRET, { expiresIn: '7d' });

    /* ---------------------------
       COOKIE SETUP
    ---------------------------- */

    res.cookie('CupCake', accessToken, {
      httpOnly: true,
      secure: BUN_MODE === 'prod',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60, // 1h
    });

    res.cookie('Cake', refreshToken, {
      httpOnly: true,
      secure: BUN_MODE === 'prod',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
    });

    /* ---------------------------
       SUCCESS RESPONSE (CONTRACT O)
    ---------------------------- */

    const successResponse = LoginSchema.O.parse({
      ok: true,
      message: 'Inicio de sesión exitoso',
      data: user,
    });

    res.status(200).json(successResponse);
    return;
  } catch (err: any) {
    console.error(err);

    /* ---------------------------
       DOMAIN AUTH ERROR
    ---------------------------- */

    if (err?.message === 'Credenciales inválidas') {
      const unauthorizedResponse = LoginSchema.E.parse({
        ok: false,
        message: 'Credenciales inválidas',
      });

      res.status(401).json(unauthorizedResponse);
      return;
    }

    /* ---------------------------
       INTERNAL ERROR
    ---------------------------- */

    const internalErrorResponse = LoginSchema.E.parse({
      ok: false,
      message: 'Error interno',
    });

    res.status(500).json(internalErrorResponse);
  }
};
