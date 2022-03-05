import { PrismaClient } from '@prisma/client';

import { generateClubs } from './clubs';
import { generateAgeCategories } from './competition-age-categories';
import { generateCompetitionTypes } from './competition-types';
import { generateCompetitions } from './competitions';
import { generateCountries } from './countries';
import { generatePositions } from './positions';
import { generateRegions } from './regions';
import { generateSeasons } from './season';
import { generateUser } from './user';

const prisma = new PrismaClient();

async function main() {
  await prisma.competitionParticipation.deleteMany();
  await prisma.match.deleteMany();
  await prisma.teamAffiliation.deleteMany();
  await prisma.team.deleteMany();
  await prisma.club.deleteMany();
  await prisma.season.deleteMany();
  await prisma.regionsOnCompetitionGroups.deleteMany();
  await prisma.competitionGroup.deleteMany();
  await prisma.competition.deleteMany();
  await prisma.competitionAgeCategory.deleteMany();
  await prisma.competitionType.deleteMany();
  await prisma.competitionJuniorLevel.deleteMany();
  await prisma.secondaryPositionsOnPlayers.deleteMany();
  await prisma.player.deleteMany();
  await prisma.user.deleteMany();
  await prisma.region.deleteMany();
  await prisma.country.deleteMany();
  await prisma.playerPosition.deleteMany();

  const { poland } = await generateCountries();

  const {
    dolnoslaskie,
    kujawskoPomorskie,
    lubuskie,
    lubelskie,
    lodzkie,
    opolskie,
    mazowieckie,
    malopolskie,
    podkarpackie,
    podlaskie,
    pomorskie,
    slaskie,
    swietokrzyskie,
    warminskoMazurskie,
    wielkopolskie,
    zachodnioPomorskie,
  } = await generateRegions(poland.id);

  const admin = await generateUser(wielkopolskie.id);

  const { lech, legia, gornik, lubin } = await generateClubs({
    adminId: admin.id,
    dolnoslaskieId: dolnoslaskie.id,
    mazowieckieId: mazowieckie.id,
    polandId: poland.id,
    slaskieId: slaskie.id,
    wielkopolskieId: wielkopolskie.id,
  });

  const { currentSeason } = await generateSeasons();

  const { senior } = await generateAgeCategories();

  const { league } = await generateCompetitionTypes();

  const { ekstraklasa, Iliga, IIliga, IIIliga } = await generateCompetitions({
    seniorId: senior.id,
    polandId: poland.id,
    leagueId: league.id,
  });

  // Create competition groups
  const IIIligaGroupIPromise = prisma.competitionGroup.create({
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

  const IIIligaGroupIIPromise = prisma.competitionGroup.create({
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

  const IIIligaGroupIIIPromise = prisma.competitionGroup.create({
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

  const IIIligaGroupIVPromise = prisma.competitionGroup.create({
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

  const [IIIligaGroupI, IIIligaGroupII, IIIligaGroupIII, IIIligaGroupIV] =
    await Promise.all([
      IIIligaGroupIPromise,
      IIIligaGroupIIPromise,
      IIIligaGroupIIIPromise,
      IIIligaGroupIVPromise,
    ]);

  // Create teams
  const lechFirstPromise = prisma.team.create({
    data: {
      name: 'Lech Poznań',
      club: { connect: { id: lech.id } },
      competitions: {
        create: { competitionId: ekstraklasa.id, seasonId: currentSeason.id },
      },
      author: { connect: { id: admin.id } },
    },
  });

  const lechSecondPromise = prisma.team.create({
    data: {
      name: 'Lech II Poznań',
      club: { connect: { id: lech.id } },
      competitions: {
        create: { competitionId: IIliga.id, seasonId: currentSeason.id },
      },
      author: { connect: { id: admin.id } },
    },
  });

  const legiaFirstPromise = prisma.team.create({
    data: {
      name: 'Legia Warszawa',
      club: { connect: { id: legia.id } },
      competitions: {
        create: { competitionId: ekstraklasa.id, seasonId: currentSeason.id },
      },
      author: { connect: { id: admin.id } },
    },
  });

  const legiaSecondPromise = prisma.team.create({
    data: {
      name: 'Legia II Warszawa',
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

  const zaglebieFirstPromise = prisma.team.create({
    data: {
      name: 'Zagłębie Lubin',
      club: { connect: { id: lubin.id } },
      competitions: {
        create: { competitionId: ekstraklasa.id, seasonId: currentSeason.id },
      },
      author: { connect: { id: admin.id } },
    },
  });

  const zaglebieSecondPromise = prisma.team.create({
    data: {
      name: 'Zagłębie II Lubin',
      club: { connect: { id: lubin.id } },
      competitions: {
        create: {
          competitionId: IIIliga.id,
          seasonId: currentSeason.id,
          groupId: IIIligaGroupIII.id,
        },
      },
      author: { connect: { id: admin.id } },
    },
  });

  const gornikFirstPromise = prisma.team.create({
    data: {
      name: 'Górnik Zabrze',
      club: { connect: { id: gornik.id } },
      competitions: {
        create: { competitionId: ekstraklasa.id, seasonId: currentSeason.id },
      },
      author: { connect: { id: admin.id } },
    },
  });

  const gornikSecondPromise = prisma.team.create({
    data: {
      name: 'Górnik II Zabrze',
      club: { connect: { id: gornik.id } },
      competitions: {
        create: {
          competitionId: IIIliga.id,
          seasonId: currentSeason.id,
          groupId: IIIligaGroupIII.id,
        },
      },
      author: { connect: { id: admin.id } },
    },
  });

  const [
    lechFirst,
    lechSecond,
    legiaFirst,
    legiaSecond,
    zaglebieFirst,
    zaglebieSecond,
    gornikFirst,
    gornikSecond,
  ] = await Promise.all([
    lechFirstPromise,
    lechSecondPromise,
    legiaFirstPromise,
    legiaSecondPromise,
    zaglebieFirstPromise,
    zaglebieSecondPromise,
    gornikFirstPromise,
    gornikSecondPromise,
  ]);

  const { gk, lb, rb, cb, lw, cm, lm, f } = await generatePositions();

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

  const steffenPromise = prisma.player.create({
    data: {
      firstName: 'Alexander',
      lastName: 'Steffen',
      yearOfBirth: 2004,
      footed: 'RIGHT',
      country: { connect: { id: poland.id } },
      teams: {
        create: {
          startDate: new Date(),
          endDate: null,
          teamId: zaglebieSecond.id,
        },
      },
      primaryPosition: { connect: { id: gk.id } },
      author: { connect: { id: admin.id } },
    },
  });

  const zylaPromise = prisma.player.create({
    data: {
      firstName: 'Bartosz',
      lastName: 'Żyła',
      yearOfBirth: 2003,
      footed: 'RIGHT',
      country: { connect: { id: poland.id } },
      teams: {
        create: {
          startDate: new Date(),
          endDate: null,
          teamId: zaglebieSecond.id,
        },
      },
      primaryPosition: { connect: { id: lm.id } },
      author: { connect: { id: admin.id } },
    },
  });

  const kolodziejczykPromise = prisma.player.create({
    data: {
      firstName: 'Erwin',
      lastName: 'Kołodziejczyk',
      yearOfBirth: 2002,
      footed: 'RIGHT',
      country: { connect: { id: poland.id } },
      teams: {
        create: {
          startDate: new Date(),
          endDate: null,
          teamId: gornikSecond.id,
        },
      },
      primaryPosition: { connect: { id: f.id } },
      author: { connect: { id: admin.id } },
    },
  });

  const winglarekPromise = prisma.player.create({
    data: {
      firstName: 'Krzysztof',
      lastName: 'Winglarek',
      yearOfBirth: 2002,
      footed: 'RIGHT',
      country: { connect: { id: poland.id } },
      teams: {
        create: {
          startDate: new Date(),
          endDate: null,
          teamId: gornikSecond.id,
        },
      },
      primaryPosition: { connect: { id: cb.id } },
      secondaryPositions: { create: { playerPositionId: rb.id } },
      author: { connect: { id: admin.id } },
    },
  });

  const [marchwinski, skibicki, steffen, zyla, kolodziejczyk, winglarek] =
    await Promise.all([
      marchwinskiPromise,
      skibickiPromise,
      steffenPromise,
      zylaPromise,
      kolodziejczykPromise,
      winglarekPromise,
    ]);

  const lechLegiaPromise = prisma.match.create({
    data: {
      date: new Date('2021-02-13'),
      homeGoals: 2,
      awayGoals: 0,
      homeTeam: { connect: { id: lechFirst.id } },
      awayTeam: { connect: { id: legiaFirst.id } },
      competition: { connect: { id: ekstraklasa.id } },
      season: { connect: { id: currentSeason.id } },
      author: { connect: { id: admin.id } },
    },
  });

  const zaglebieGornikPromise = prisma.match.create({
    data: {
      date: new Date('2021-02-13'),
      homeGoals: 2,
      awayGoals: 0,
      homeTeam: { connect: { id: zaglebieFirst.id } },
      awayTeam: { connect: { id: gornikFirst.id } },
      competition: { connect: { id: ekstraklasa.id } },
      season: { connect: { id: currentSeason.id } },
      author: { connect: { id: admin.id } },
    },
  });

  const gornikZaglebieResPromise = prisma.match.create({
    data: {
      date: new Date('2021-02-13'),
      homeGoals: 2,
      awayGoals: 0,
      homeTeam: { connect: { id: gornikSecond.id } },
      awayTeam: { connect: { id: zaglebieSecond.id } },
      competition: { connect: { id: IIIliga.id } },
      group: { connect: { id: IIIligaGroupIII.id } },
      season: { connect: { id: currentSeason.id } },
      author: { connect: { id: admin.id } },
    },
  });

  const [lechLegiaMatch, zaglebieGornikMatch, gornikZaglebieResMatch] =
    await Promise.all([
      lechLegiaPromise,
      zaglebieGornikPromise,
      gornikZaglebieResPromise,
    ]);
}

main()
  .catch((e: Error) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
