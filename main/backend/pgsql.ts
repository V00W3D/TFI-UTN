import { Pool } from 'pg';
import { PG_URL, BUN_MODE } from '@env';

/* =========================
   CONFIG
========================= */

const isProd = BUN_MODE === 'prod';

const pool = new Pool({
  connectionString: PG_URL,
  ssl: isProd
    ? {
        rejectUnauthorized: false,
      }
    : true,
});

/* =========================
   INIT TEST
========================= */

(async () => {
  try {
    await pool.query('SELECT 1');

    const safeUrl = PG_URL.replace(/:(.*?)@/, ':*****@');

    console.log(`[PGSQL] '${safeUrl}'`);
  } catch (err) {
    console.error('[PGSQL] Connection failed');
    console.error(err);
    process.exit(1);
  }
})();

export default pool;
