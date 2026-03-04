import { z } from 'zod';

export const sex = z.enum(['MALE', 'FEMALE', 'OTHER']);

export type CoreSex = z.infer<typeof sex>;

export const SEX_RULES = ['Elegí una de las opciones disponibles.'];
