import { prisma } from './client';

export async function generateCompetitionTypes() {
  const league = await prisma.competitionType.create({
    data: { name: 'Rozgrywki ligowe' },
  });

  return { league };
}
