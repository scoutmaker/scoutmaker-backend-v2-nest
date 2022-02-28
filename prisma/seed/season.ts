import { prisma } from './client';

export async function generateSeasons() {
  const currentSeason = await prisma.season.create({
    data: {
      name: '2021/2022',
      startDate: new Date('2021-07-01'),
      endDate: new Date('2022-05-31'),
      isActive: true,
    },
  });

  return { currentSeason };
}
