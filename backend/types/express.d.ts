import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id: string;
        username: string;
        email: string;
        phone: string;
        role: string;
      };
    }
  }
}

export {};
