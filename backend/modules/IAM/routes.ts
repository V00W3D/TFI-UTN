import { Router } from 'express';
import { RegisterController } from './controllers/RegisterController';

const router = Router();

router.post('/IAM/Register', RegisterController);

export default router;
