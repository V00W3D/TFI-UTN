import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BUN_MODE, SESSION_SECRET, REFRESH_SECRET } from '@env';

export type UserPayload = {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  role: string;
};

/* =========================================================
   EXTEND EXPRESS REQUEST
========================================================= */

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload | null;
    }
  }
}

/* =========================================================
   AUTH MIDDLEWARE
========================================================= */

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies?.CupCake; // 1h
  const refreshToken = req.cookies?.Cake; // 7d

  // 1️⃣ ACCESS TOKEN
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, SESSION_SECRET) as UserPayload;

      req.user = decoded;
      return next();
    } catch {
      // expirado → intentamos refresh
    }
  }

  // 2️⃣ REFRESH TOKEN
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as UserPayload;

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

      req.user = decoded;
      return next();
    } catch {
      req.user = null;
      return next();
    }
  }

  req.user = null;
  next();
};
