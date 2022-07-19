import { prisma } from './client';

interface GenerateCompetitionsArgs {
  polandId: number;
  seniorId: number;
  leagueId: number;
}

export async function generateCompetitions({
  polandId,
  seniorId,
  leagueId,
}: GenerateCompetitionsArgs) {
  const ekstraklasaPromise = prisma.competition.create({
    data: {
      name: 'Ekstraklasa',
      level: 1,
      gender: 'MALE',
      countryId: polandId,
      ageCategoryId: seniorId,
      typeId: leagueId,
    },
  });

  const IligaPromise = prisma.competition.create({
    data: {
      name: 'I liga',
      level: 2,
      gender: 'MALE',
      countryId: polandId,
      ageCategoryId: seniorId,
      typeId: leagueId,
    },
  });

  const IIligaPromise = prisma.competition.create({
    data: {
      name: 'II liga',
      level: 3,
      gender: 'MALE',
      countryId: polandId,
      ageCategoryId: seniorId,
      typeId: leagueId,
    },
  });

  const IIIligaPromise = prisma.competition.create({
    data: {
      name: 'III liga',
      level: 4,
      gender: 'MALE',
      countryId: polandId,
      ageCategoryId: seniorId,
      typeId: leagueId,
    },
  });

  const [ekstraklasa, Iliga, IIliga, IIIliga] = await Promise.all([
    ekstraklasaPromise,
    IligaPromise,
    IIligaPromise,
    IIIligaPromise,
  ]);

  return { ekstraklasa, Iliga, IIliga, IIIliga };
}
