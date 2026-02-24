import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BUN_MODE, SESSION_SECRET, REFRESH_SECRET } from 'src/env';

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies?.CupCake; // 1h
  const refreshToken = req.cookies?.Cake; // 7d

  // 1️⃣ Validar access token
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, SESSION_SECRET);
      req.user = decoded as any;
      return next();
    } catch {
      // vencido → intentamos refresh
    }
  }

  // 2️⃣ Intentar refresh
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as any;

      // 🎂 Nuevo access token usando datos del refresh
      const newAccessToken = jwt.sign(
        {
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          phone: decoded.phone,
          role: decoded.role,
        },
        SESSION_SECRET,
        { expiresIn: '1h' },
      );

      res.cookie('CupCake', newAccessToken, {
        httpOnly: true,
        secure: BUN_MODE === 'prod',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60,
      });

      req.user = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        phone: decoded.phone,
        role: decoded.role,
      };

      return next();
    } catch {
      // refresh inválido
    }
  }

  // 3️⃣ Nada válido
  return res.status(401).json({
    ok: false,
    code: 'SESSION_EXPIRED',
    message: 'Sesión expirada. Inicie sesión nuevamente.',
  });
};
