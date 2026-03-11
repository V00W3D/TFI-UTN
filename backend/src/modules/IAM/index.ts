import { loginController } from '@modules/IAM/controllers/login';
import { registerController } from '@modules/IAM/controllers/register';
import { Router } from 'express';
const router = Router();

router.post('/iam/register', registerController);
router.post('/iam/login', loginController);

export default router;
