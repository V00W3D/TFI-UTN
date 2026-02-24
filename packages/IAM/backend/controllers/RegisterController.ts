import type { Request, Response } from 'express';
import { RegisterSchema } from '../schemas/RegisterSchema';
import { RegisterService } from '../services/RegisterService';

export const RegisterController = async (req: Request, res: Response) => {
  try {
    const parsed = await RegisterSchema.safeParseAsync(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        message: 'Credenciales inválidas',
      });
    }

    await RegisterService(parsed.data);

    return res.status(201).json({
      ok: true,
      message: 'Usuario registrado correctamente',
    });
  } catch (err: any) {
    console.error(err);
    if (err.message.includes('uso')) {
      return res.status(409).json({
        ok: false,
        message: err.message,
      });
    }
    return res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
};
