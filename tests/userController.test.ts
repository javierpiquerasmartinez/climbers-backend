import prisma from './prismaTestClient';
import { seedTestDb, clearTestDb } from './prisma/seedTest';

beforeEach(async () => {
  await seedTestDb();
});

afterAll(async () => {
  await clearTestDb();
  await prisma.$disconnect();
});
