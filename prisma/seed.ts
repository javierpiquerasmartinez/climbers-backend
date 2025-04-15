import { PrismaClient, ClimbingLevelName, ClimbingStyleName } from '@prisma/client';

const prisma = new PrismaClient();

async function seedLanguages() {
  const languages: string[] = ['Español', 'Inglés', 'Francés', 'Alemán'];

  for (const name of languages) {
    await prisma.languages.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Languages seeded!');
}

async function seedEquipment() {
  const equipment: string[] = ['Cuerda', 'Casco', 'Friends', 'Cintas express', 'Crashpad'];

  for (const name of equipment) {
    await prisma.equipment.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Equipment seeded!');
}

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
  //await seedClimbingLevels();
  //await seedClimbingStyles();
  await seedEquipment();
  await seedLanguages();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
