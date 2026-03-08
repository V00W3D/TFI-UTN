import { Router } from 'express';
import { RegisterController } from './procedures/RegisterController';
import { LoginController } from './procedures/login';
import { CORE_ROUTES } from '@contracts/CoreSchema';

const router = Router();

router.post(CORE_ROUTES.IAM.FULL.REGISTER, RegisterController);
router.post(CORE_ROUTES.IAM.FULL.LOGIN, LoginController);

export default router;
