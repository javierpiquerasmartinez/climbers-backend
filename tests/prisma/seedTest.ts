import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedTestDb() {
  console.log('🌱 Seed de test: insertando datos mock...');

  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.user.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      name: 'Test User 1',
      email: 'user1@test.com',
      role: 'viajero',
      avatarUrl: 'https://i.pravatar.cc/100?u=user1',
      climbingStyles: ['boulder'],
      location: 'Valencia',
      level: 'intermedio'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Test User 2',
      email: 'user2@test.com',
      role: 'anfitrión',
      avatarUrl: 'https://i.pravatar.cc/100?u=user2',
      climbingStyles: ['deportiva'],
      location: 'Madrid',
      level: 'avanzado'
    }
  });

  await prisma.review.create({
    data: {
      authorId: user1.id,
      targetId: user2.id,
      rating: 4,
      comment: 'Muy buena experiencia'
    }
  });

  console.log('✅ Seed de test completado');
}

export async function clearTestDb() {
  console.log('🧹 Limpiando la base de datos de test...');

  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Base de datos de test limpiada');
}