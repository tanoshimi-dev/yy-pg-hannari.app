import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // Production image has no ts-node: run the compiled seed instead
    seed:
      process.env.NODE_ENV === 'production'
        ? 'node dist/prisma/seed.js'
        : 'ts-node prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
