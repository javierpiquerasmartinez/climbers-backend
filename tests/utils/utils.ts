import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function clearTestDb() {
  console.log('🧹 Limpiando la base de datos de test...');

  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Base de datos de test limpiada');
}