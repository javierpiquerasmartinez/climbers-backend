import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function clearTestDb() {
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.user.deleteMany();
}