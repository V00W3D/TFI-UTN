import { start } from '@b-config/express';
import { BUN_MODE } from 'env';

if (BUN_MODE === 'dev') {
  console.clear();
}
start();
