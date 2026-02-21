import { createClient } from 'redis';
import { REDIS_URL } from '@env';

/* =========================
   CONFIG
========================= */

const client = createClient({
  url: REDIS_URL,
});

client.on('error', (err) => {
  console.error('[REDIS] ❌ Connection error');
  console.error(err);
});

/* =========================
   INIT TEST
========================= */

(async () => {
  try {
    await client.connect();
    await client.ping();

    const safeUrl = REDIS_URL.replace(/:(.*?)@/, ':*****@');

    console.log(`[REDIS] '${safeUrl}'`);
  } catch (err) {
    console.error('[REDIS] Connection failed');
    console.error(err);
    process.exit(1);
  }
})();

export default client;
