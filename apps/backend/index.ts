import { start } from '@config/server';
import { BUN_MODE } from '@config/env';

if (BUN_MODE === 'dev') {
  console.clear();
}
start();
