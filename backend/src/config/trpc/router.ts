import { router } from './trpc';

/* IAM */
import login from '@modules/IAM/procedures/login';
import { registerController } from '@modules/IAM/procedures/register';
// import logout from '@IAM/procedures/logout'

// /* POS */
// import createOrder from '@POS/procedures/createOrder'
// import getOrders from '@POS/procedures/getOrders'

// /* CORE */
// import health from '@CORE/procedures/health'

// /* ADMIN */
// import getUsers from '@ADMIN/procedures/getUsers'

/* ======================================================
   MODULE ROUTERS
====================================================== */

const iamRouter = router({
  login,
  registerController,
  // logout,
});

const posRouter = router({
  // createOrder,
  // getOrders,
});

const coreRouter = router({
  // health,
});

const adminRouter = router({
  // getUsers,
});

/* ======================================================
   APP ROUTER
====================================================== */

export const appRouter = router({
  iam: iamRouter,
  // pos: posRouter,
  // core: coreRouter,
  // admin: adminRouter,
});

export type AppRouter = typeof appRouter;
