import { test as base, Page } from '@playwright/test';
import { createHmac, randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Client } from 'pg';

// Local docker-compose DB (see sys/docker-compose.yml)
const DATABASE_URL =
  process.env.E2E_DATABASE_URL ||
  'postgresql://yy-pg-hannari:hannari_password@localhost:5432/yy-pg-hannari_db';

function readJwtSecret(): string {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  const env = readFileSync(join(__dirname, '..', '..', '..', '.env'), 'utf8');
  const match = env.match(/^JWT_SECRET=(.*)$/m);
  if (!match) throw new Error('JWT_SECRET not found in sys/.env');
  return match[1].trim().replace(/^["']|["']$/g, '');
}

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64url');
}

// HS256 JWT compatible with the backend's JwtStrategy ({ sub, email })
function signJwt(payload: Record<string, unknown>, secret: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify({ ...payload, iat: now, exp: now + 3600 }));
  const signature = createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export interface TestUser {
  id: string;
  email: string;
  displayName: string;
  token: string;
}

async function createUser(): Promise<TestUser> {
  const id = randomUUID();
  const email = `e2e-${id}@example.com`;
  const displayName = 'E2Eテスト';
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    await client.query(
      'INSERT INTO "User" (id, "googleId", email, "displayName", "updatedAt") VALUES ($1, $2, $3, $4, now())',
      [id, `e2e-${id}`, email, displayName],
    );
  } finally {
    await client.end();
  }
  return { id, email, displayName, token: signJwt({ sub: id, email }, readJwtSecret()) };
}

async function deleteUser(userId: string): Promise<void> {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    await client.query('DELETE FROM "UserQuizAttempt" WHERE "userId" = $1', [userId]);
    await client.query('DELETE FROM "UserProgress" WHERE "userId" = $1', [userId]);
    await client.query('DELETE FROM "User" WHERE id = $1', [userId]);
  } finally {
    await client.end();
  }
}

async function login(page: Page, token: string): Promise<void> {
  await page.addInitScript((t) => {
    window.localStorage.setItem('token', t);
  }, token);
}

// Each test gets its own freshly created user, already logged in
export const test = base.extend<{ user: TestUser }>({
  user: async ({ page }, use) => {
    const user = await createUser();
    await login(page, user.token);
    await use(user);
    await deleteUser(user.id);
  },
});

export { expect } from '@playwright/test';
