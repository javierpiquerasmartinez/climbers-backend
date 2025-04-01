
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export function resetTestDb() {
  execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
}
