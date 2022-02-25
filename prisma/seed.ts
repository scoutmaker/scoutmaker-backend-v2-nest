import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.competitionParticipation.deleteMany();
  await prisma.team.deleteMany();
  await prisma.club.deleteMany();
  await prisma.season.deleteMany();
  await prisma.regionsOnCompetitionGroups.deleteMany();
  await prisma.competitionGroup.deleteMany();
  await prisma.competition.deleteMany();
  await prisma.competitionAgeCategory.deleteMany();
  await prisma.competitionType.deleteMany();
  await prisma.competitionJuniorLevel.deleteMany();
  await prisma.user.deleteMany();
  await prisma.region.deleteMany();
  await prisma.country.deleteMany();
  // delete secondary positions on players
  await prisma.secondaryPositionsOnPlayers.deleteMany();
  // delete players
  await prisma.player.deleteMany();
  // delete positions
  await prisma.playerPosition.deleteMany();

  // Create Poland
  const poland = await prisma.country.create({
    data: { name: 'Poland', code: 'PL', isEuMember: true },
  });

  // Create Poland voivodeships
  const dolnoslaskie = await prisma.region.create({
    data: { name: 'Dolnośląskie', countryId: poland.id },
  });
  const kujawskoPomorskie = await prisma.region.create({
    data: { name: 'Kujawsko-pomorskie', countryId: poland.id },
  });
  const lubelskie = await prisma.region.create({
    data: { name: 'Lubelskie', countryId: poland.id },
  });
  const lubuskie = await prisma.region.create({
    data: { name: 'Lubuskie', countryId: poland.id },
  });
  const lodzkie = await prisma.region.create({
    data: { name: 'Łódzkie', countryId: poland.id },
  });
  const opolskie = await prisma.region.create({
    data: { name: 'Opolskie', countryId: poland.id },
  });
  const mazowieckie = await prisma.region.create({
    data: { name: 'Mazowieckie', countryId: poland.id },
  });
  const malopolskie = await prisma.region.create({
    data: { name: 'Małopolskie', countryId: poland.id },
  });
  const podkarpackie = await prisma.region.create({
    data: { name: 'Podkarpackie', countryId: poland.id },
  });
  const podlaskie = await prisma.region.create({
    data: { name: 'Podlaskie', countryId: poland.id },
  });
  const pomorskie = await prisma.region.create({
    data: { name: 'Pomorskie', countryId: poland.id },
  });
  const slaskie = await prisma.region.create({
    data: { name: 'Śląskie', countryId: poland.id },
  });
  const swietokrzyskie = await prisma.region.create({
    data: { name: 'Świętokrzyskie', countryId: poland.id },
  });
  const warminskoMazurskie = await prisma.region.create({
    data: { name: 'Warmińsko-mazurskie', countryId: poland.id },
  });
  const wielkopolskie = await prisma.region.create({
    data: { name: 'Wielkopolskie', countryId: poland.id },
  });
  const zachodnioPomorskie = await prisma.region.create({
    data: { name: 'Zachodniopomorskie', countryId: poland.id },
  });

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      firstName: 'John',
      lastName: 'Admin',
      password: 'Password123',
      regionId: wielkopolskie.id,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  // Create clubs
  const lech = await prisma.club.create({
    data: {
      name: 'KKS Lech Poznań',
      countryId: poland.id,
      regionId: wielkopolskie.id,
      authorId: admin.id,
    },
  });

  const legia = await prisma.club.create({
    data: {
      name: 'CWKS Legia Warszawa',
      countryId: poland.id,
      regionId: mazowieckie.id,
      authorId: admin.id,
    },
  });

  // Create current season
  const currentSeason = await prisma.season.create({
    data: {
      name: '2021/2022',
      startDate: new Date('2021-07-01'),
      endDate: new Date('2022-05-31'),
      isActive: true,
    },
  });

  // Create age category
  const senior = await prisma.competitionAgeCategory.create({
    data: {
      name: 'Senior',
    },
  });

  // Create competition type
  const league = await prisma.competitionType.create({
    data: { name: 'Rozgrywki ligowe' },
  });

  // Create competitions
  const ekstraklasa = await prisma.competition.create({
    data: {
      name: 'Ekstraklasa',
      level: 1,
      gender: 'MALE',
      countryId: poland.id,
      ageCategoryId: senior.id,
      typeId: league.id,
    },
  });

  const Iliga = await prisma.competition.create({
    data: {
      name: 'I liga',
      level: 2,
      gender: 'MALE',
      countryId: poland.id,
      ageCategoryId: senior.id,
      typeId: league.id,
    },
  });

  const IIliga = await prisma.competition.create({
    data: {
      name: 'II liga',
      level: 3,
      gender: 'MALE',
      countryId: poland.id,
      ageCategoryId: senior.id,
      typeId: league.id,
    },
  });

  const IIIliga = await prisma.competition.create({
    data: {
      name: 'III liga',
      level: 4,
      gender: 'MALE',
      countryId: poland.id,
      ageCategoryId: senior.id,
      typeId: league.id,
    },
  });

  // Create competition groups
  const IIIligaGroupI = await prisma.competitionGroup.create({
    data: {
      name: 'Grupa I',
      competitionId: IIIliga.id,
      regions: {
        createMany: {
          data: [
            { regionId: lodzkie.id },
            { regionId: mazowieckie.id },
            { regionId: podlaskie.id },
            { regionId: warminskoMazurskie.id },
          ],
        },
      },
    },
  });

  const IIIligaGroupII = await prisma.competitionGroup.create({
    data: {
      name: 'Grupa II',
      competitionId: IIIliga.id,
      regions: {
        createMany: {
          data: [
            { regionId: kujawskoPomorskie.id },
            { regionId: pomorskie.id },
            { regionId: wielkopolskie.id },
            { regionId: zachodnioPomorskie.id },
          ],
        },
      },
    },
  });

  const IIIligaGroupIII = await prisma.competitionGroup.create({
    data: {
      name: 'Grupa III',
      competitionId: IIIliga.id,
      regions: {
        createMany: {
          data: [
            { regionId: dolnoslaskie.id },
            { regionId: lubuskie.id },
            { regionId: opolskie.id },
            { regionId: slaskie.id },
          ],
        },
      },
    },
  });

  const IIIligaGroupIV = await prisma.competitionGroup.create({
    data: {
      name: 'Grupa IV',
      competitionId: IIIliga.id,
      regions: {
        createMany: {
          data: [
            { regionId: lubelskie.id },
            { regionId: malopolskie.id },
            { regionId: podkarpackie.id },
            { regionId: swietokrzyskie.id },
          ],
        },
      },
    },
  });

  // Create teams
  const lechFirst = await prisma.team.create({
    data: {
      name: 'Lech Poznań',
      club: { connect: { id: lech.id } },
      competitions: {
        create: { competitionId: ekstraklasa.id, seasonId: currentSeason.id },
      },
      author: { connect: { id: admin.id } },
    },
  });

  const lechSecond = await prisma.team.create({
    data: {
      name: 'Lech II Poznań',
      club: { connect: { id: lech.id } },
      competitions: {
        create: { competitionId: IIliga.id, seasonId: currentSeason.id },
      },
      author: { connect: { id: admin.id } },
    },
  });

  const legiaFirst = await prisma.team.create({
    data: {
      name: 'Legia Warszawa',
      club: { connect: { id: legia.id } },
      competitions: {
        create: { competitionId: ekstraklasa.id, seasonId: currentSeason.id },
      },
      author: { connect: { id: admin.id } },
    },
  });

  const legiaSecond = await prisma.team.create({
    data: {
      name: 'Legia Warszawa',
      club: { connect: { id: legia.id } },
      competitions: {
        create: {
          competitionId: IIIliga.id,
          seasonId: currentSeason.id,
          groupId: IIIligaGroupI.id,
        },
      },
      author: { connect: { id: admin.id } },
    },
  });

  const gkPromise = prisma.playerPosition.create({
    data: { name: 'bramkarz', code: 'GK' },
  });

  const lbPromise = prisma.playerPosition.create({
    data: { name: 'lewy obrońca', code: 'LB' },
  });

  const rbPromise = prisma.playerPosition.create({
    data: { name: 'prawy obrońca', code: 'RB' },
  });

  const lwPromise = prisma.playerPosition.create({
    data: { name: 'lewy wahadłowy', code: 'LW' },
  });

  const cmPromise = prisma.playerPosition.create({
    data: { name: 'środkowy pomocnik', code: 'CM' },
  });

  const lmPromise = prisma.playerPosition.create({
    data: { name: 'lewy pomocnik', code: 'LM' },
  });

  const fPromise = prisma.playerPosition.create({
    data: { name: 'napastnik', code: 'F' },
  });

  const [gk, lb, rb, lw, cm, lm, f] = await Promise.all([
    gkPromise,
    lbPromise,
    rbPromise,
    lwPromise,
    cmPromise,
    lmPromise,
    fPromise,
  ]);

  const marchwinskiPromise = prisma.player.create({
    data: {
      firstName: 'Filip',
      lastName: 'Marchwiński',
      yearOfBirth: 2002,
      footed: 'RIGHT',
      country: { connect: { id: poland.id } },
      teams: {
        create: { startDate: new Date(), endDate: null, teamId: lechFirst.id },
      },
      primaryPosition: { connect: { id: cm.id } },
      secondaryPositions: { create: { playerPositionId: lm.id } },
      author: { connect: { id: admin.id } },
    },
  });

  const skibickiPromise = prisma.player.create({
    data: {
      firstName: 'Kacper',
      lastName: 'Skibicki',
      yearOfBirth: 2001,
      footed: 'RIGHT',
      country: { connect: { id: poland.id } },
      teams: {
        create: { startDate: new Date(), endDate: null, teamId: legiaFirst.id },
      },
      primaryPosition: { connect: { id: lm.id } },
      secondaryPositions: { create: { playerPositionId: lw.id } },
      author: { connect: { id: admin.id } },
    },
  });

  const [marchwinski, skibicki] = await Promise.all([
    marchwinskiPromise,
    skibickiPromise,
  ]);
}

main()
  .catch((e: Error) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());