import { PrismaClient, ClimbingLevelName, ClimbingStyleName } from '@prisma/client';


const prisma = new PrismaClient();

async function seedClimbingStyles() {
  const styles: ClimbingStyleName[] = [
    'DEPORTIVA',
    'BOULDER',
    'VIA_LARGA',
    'CLASICA',
    'PSICOBLOC',
  ];

  for (const name of styles) {
    await prisma.climbingStyle.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Climbing styles seeded!');
}

async function seedClimbingLevels() {
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

async function main() {
  await seedClimbingLevels();
  await seedClimbingStyles();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
