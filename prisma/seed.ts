import { PrismaClient, ClimbingLevelName } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const levels: ClimbingLevelName[] = [
    'PRINCIPIANTE',
    'INTERMEDIO',
    'AVANZADO',
    'EXPERTO',
    'PRO',
  ];

  for (const name of levels) {
    await prisma.climbingLevel.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Climbing levels seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
