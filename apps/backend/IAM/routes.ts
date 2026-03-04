import { Router } from 'express';
import { RegisterController } from './controllers/RegisterController';
import { LoginController } from './controllers/LoginController';
import { CORE_ROUTES } from '@contracts/CoreSchema';

const router = Router();

router.post(CORE_ROUTES.IAM.FULL.REGISTER, RegisterController);
router.post(CORE_ROUTES.IAM.FULL.LOGIN, LoginController);

export default router;
