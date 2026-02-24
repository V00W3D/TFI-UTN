import type { Request, Response } from 'express';
import { LoginSchema } from '../schemas/LoginSchema';
import { LoginService } from '../services/LoginService';
import jwt from 'jsonwebtoken';
import { BUN_MODE, SESSION_SECRET, REFRESH_SECRET } from '@env';

export const LoginController = async (req: Request, res: Response) => {
  try {
    const parsed = await LoginSchema.safeParseAsync(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        message: 'Credenciales inválidas',
      });
    }

    const user = await LoginService(parsed.data);

    // 🧁 Access token (1 hora)
    const accessToken = jwt.sign(
      {
        ...user, // todo el user dentro del JWT
      },
      SESSION_SECRET,
      { expiresIn: '1h' },
    );

    // 🍰 Refresh token (7 días)
    const refreshToken = jwt.sign(
      {
        ...user,
      },
      REFRESH_SECRET,
      { expiresIn: '7d' },
    );

    // Cookie access
    res.cookie('CupCake', accessToken, {
      httpOnly: true,
      secure: BUN_MODE === 'prod',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60, // 1h
    });

    // Cookie refresh
    res.cookie('Cake', refreshToken, {
      httpOnly: true,
      secure: BUN_MODE === 'prod',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
    });

    return res.status(200).json({
      ok: true,
      message: 'Inicio de sesión exitoso',
      data: user,
    });
  } catch (err: any) {
    console.error(err);

    if (err.message === 'Credenciales inválidas') {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas',
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
};
