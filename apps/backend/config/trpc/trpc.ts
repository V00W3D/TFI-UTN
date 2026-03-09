import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';

const t = initTRPC.context<Context>().create();

/* =========================
   ROUTER
========================= */

export const router = t.router;

/* =========================
   PUBLIC PROCEDURE
========================= */

export const publicProcedure = t.procedure;

/* =========================
   AUTH MIDDLEWARE
========================= */

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No autenticado',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

/* =========================
   PROTECTED PROCEDURE
========================= */

export const protectedProcedure = t.procedure.use(isAuthed);
