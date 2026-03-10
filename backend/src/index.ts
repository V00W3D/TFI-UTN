import { start } from '@config/server';
import { BUN_MODE } from '@env';

if (BUN_MODE === 'dev') {
  console.clear();
}
start();
