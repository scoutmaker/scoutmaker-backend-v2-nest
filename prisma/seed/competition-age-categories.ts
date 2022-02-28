import { prisma } from './client';

export async function generateAgeCategories() {
  const senior = await prisma.competitionAgeCategory.create({
    data: {
      name: 'Senior',
    },
  });

  return { senior };
}
