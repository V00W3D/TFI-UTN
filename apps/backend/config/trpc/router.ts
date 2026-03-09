import { createAutoRouter } from '../../utils/autoRouter';

export const appRouter = await createAutoRouter(['IAM', 'POS', 'CORE', 'ADMIN']);

export type AppRouter = typeof appRouter;
