import { PrismaClient, ClimbingLevelName, ClimbingStyleName } from '@prisma/client';

const prisma = new PrismaClient();

async function seedLanguages() {
  const languages: { name: string; flag: string }[] = [
    { name: 'Español', flag: '🇪🇸' },
    { name: 'Inglés', flag: '🇬🇧' },
    { name: 'Francés', flag: '🇫🇷' },
    { name: 'Alemán', flag: '🇩🇪' },
  ];

  for (const { name, flag } of languages) {
    await prisma.languages.upsert({
      where: { name },
      update: { flag },
      create: { name, flag },
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

async function seedBio() {
  const bio = `Me llamo Javi Piqueras, aunque en el mundo vertical muchos me conocen como “El Zorro”. Tengo 32 años, soy argentino y me enamoré de la escalada casi por accidente, durante un viaje con amigos al Valle de los Cóndores cuando tenía 19. Desde entonces, no he dejado de buscar roca, magnesio y esa sensación única de fluir en la pared.
  
  Me especializo en escalada deportiva y boulder, aunque no le hago asco a una buena vía clásica. Mi grado máximo hasta ahora ha sido 8c+ en deportiva y V13 en bloque. Me gusta combinar la potencia con la técnica, pero lo que más valoro es la cabeza: esa calma que hace la diferencia cuando estás al límite.
  
  He tenido la suerte de escalar en lugares increíbles como Siurana, Kalymnos, Céüse y Bishop, pero siempre vuelvo a las sierras de Córdoba, donde equipé algunas rutas y abrí “Resiliencia”, un 8b+ que me costó sudor y sonrisas.
  
  Fuera de la roca, doy talleres de entrenamiento funcional para escaladores y escribo en un blog donde mezclo reflexiones, viajes y experiencias verticales. Soy vegetariano, no empiezo el día sin mate amargo, y tengo clavado un sueño en la cabeza: liberar una gran pared en la Patagonia algún día.`;

  await prisma.user.update({
    where: { email: 'javipiquerasm@gmail.com' },
    data: { bio },
  });
}

async function main() {
  // await seedClimbingLevels();
  // await seedClimbingStyles();
  // await seedEquipment();
  // await seedLanguages();
  // await seedBio();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
