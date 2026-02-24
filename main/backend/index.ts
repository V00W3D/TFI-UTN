import { start } from 'main/backend/express';
import { BUN_MODE } from 'env';

if (BUN_MODE === 'dev') {
  console.clear();
}
start();
