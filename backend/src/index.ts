import { start } from './express';
import { BUN_MODE } from 'src/env';

if (BUN_MODE === 'dev') {
  console.clear();
}
start();
