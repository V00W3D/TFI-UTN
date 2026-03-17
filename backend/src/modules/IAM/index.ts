import { LoginHandler } from '@modules/IAM/controllers/login';
import { RegisterHandler } from '@modules/IAM/controllers/register';
import { createRouter } from '@tools/ApiFactory';

export const IAMRouter = createRouter([LoginHandler, RegisterHandler]);
