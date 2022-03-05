import { prisma } from './client';

export async function generateCountries() {
  // Create Poland
  const poland = await prisma.country.create({
    data: { name: 'Poland', code: 'PL', isEuMember: true },
  });

  return { poland };
}
