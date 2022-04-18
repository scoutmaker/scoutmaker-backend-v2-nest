import { PrismaService } from '../../src/modules/prisma/prisma.service';

export async function generateCommonTestData(prisma: PrismaService) {
  // Create test country
  const country = await prisma.country.create({
    data: { name: 'test country', code: 'tc' },
  });

  // Create test region
  const region = await prisma.region.create({
    data: { name: 'test region', country: { connect: { id: country.id } } },
  });

  // Create test competition type & age category
  const [type, ageCategory] = await Promise.all([
    prisma.competitionType.create({
      data: {
        name: 'test type',
      },
    }),
    prisma.competitionAgeCategory.create({
      data: {
        name: 'test age category',
      },
    }),
  ]);

  // Create test competitions
  const names = [
    'test competition 1',
    'test competition 2',
    'test competition 3',
  ];

  const [competition1, competition2, competition3] = await Promise.all(
    names.map((name) =>
      prisma.competition.create({
        data: {
          name,
          ageCategory: { connect: { id: ageCategory.id } },
          type: { connect: { id: type.id } },
          country: { connect: { id: country.id } },
        },
      }),
    ),
  );

  // Create test position
  const position = await prisma.playerPosition.create({
    data: {
      name: 'test position',
      code: 'tp',
    },
  });

  return {
    country,
    region,
    type,
    ageCategory,
    competition1,
    competition2,
    competition3,
    position,
  };
}
