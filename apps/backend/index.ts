import { start } from '../../libs/server';
import { BUN_MODE } from '@env';

if (BUN_MODE === 'dev') {
  console.clear();
}
start();
