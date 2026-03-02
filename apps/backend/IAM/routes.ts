import { Router } from 'express';
import { RegisterController } from './controllers/RegisterController';
import { LoginController } from './controllers/LoginController';

const router = Router();

router.post('/IAM/Register', RegisterController);
router.post('/IAM/Login', LoginController);

export default router;
