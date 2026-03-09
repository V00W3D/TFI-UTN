import { defineConfig } from 'prisma/config';
import { DATABASE_URL } from '@config/env'; // ajustá la ruta si cambia

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
  },
  datasource: {
    url: DATABASE_URL,
  },
});
