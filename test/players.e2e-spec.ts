import { RedisService } from '@liaoliaots/nestjs-redis';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  Organization,
  Player,
  ReportTemplate,
  User,
  UserRole,
} from '@prisma/client';
import { Chance } from 'chance';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { AuthService } from '../src/modules/auth/auth.service';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { generateCommonTestData } from './utils/common';
import { createTestUser } from './utils/users';

const chance = new Chance();

describe('Players (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let redis: RedisService;

  let admin: User,
    playmakerScout1: User,
    playmakerScout2: User,
    regularUser1: User,
    regularUser2: User;

  let organization: Organization;
  let template: ReportTemplate;

  let player1: Player,
    player2: Player,
    player3: Player,
    player4: Player,
    player5: Player,
    player6: Player,
    player7: Player,
    player8: Player,
    player9: Player,
    player10: Player,
    player11: Player,
    player12: Player,
    player13: Player,
    player14: Player,
    player15: Player,
    player16: Player,
    player17: Player,
    player18: Player,
    player19: Player,
    player20: Player;

  let countryId: string;
  let positionId: string;

  let playerIds: string[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    redis = app.get<RedisService>(RedisService);
    authService = app.get<AuthService>(AuthService);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        validateCustomDecorators: true,
        enableDebugMessages: true,
      }),
    );

    const redisClient = redis.getClient();

    // Clear cache
    await redisClient.flushall();

    const {
      country,
      region,
      competition1,
      competition2,
      competition3,
      position,
    } = await generateCommonTestData(prisma);

    countryId = country.id;
    positionId = position.id;

    // Create test users
    const roles: UserRole[] = [
      'ADMIN',
      'PLAYMAKER_SCOUT',
      'PLAYMAKER_SCOUT',
      'SCOUT',
      'SCOUT',
    ];

    [admin, playmakerScout1, playmakerScout2, regularUser1, regularUser2] =
      await Promise.all(
        roles.map((role) =>
          createTestUser({ prisma, args: { role, regionId: region.id } }),
        ),
      );

    // Create test competition groups
    const competitionGroup1 = await prisma.competitionGroup.create({
      data: {
        name: 'Test Group 1',
        competition: { connect: { id: competition3.id } },
      },
    });

    const competitionGroup2 = await prisma.competitionGroup.create({
      data: {
        name: 'Test Group 2',
        competition: { connect: { id: competition3.id } },
      },
    });

    // Create test seasons
    const season2020 = await prisma.season.create({
      data: {
        name: 'Season 1',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2020-12-31'),
      },
    });

    const season2021 = await prisma.season.create({
      data: {
        name: 'Season 2',
        startDate: new Date('2021-01-01'),
        endDate: new Date('2021-12-31'),
      },
    });

    // Create test club
    const club = await prisma.club.create({
      data: {
        name: 'test club',
        country: { connect: { id: country.id } },
        author: { connect: { id: admin.id } },
        region: { connect: { id: region.id } },
      },
    });

    // Create test teams
    const team1 = await prisma.team.create({
      data: {
        name: 'test team 1',
        author: { connect: { id: admin.id } },
        club: { connect: { id: club.id } },
        competitions: {
          create: {
            competition: { connect: { id: competition1.id } },
            season: { connect: { id: season2020.id } },
          },
        },
      },
    });

    const team2 = await prisma.team.create({
      data: {
        name: 'test team 2',
        author: { connect: { id: admin.id } },
        club: { connect: { id: club.id } },
        competitions: {
          create: {
            competition: { connect: { id: competition3.id } },
            group: { connect: { id: competitionGroup1.id } },
            season: { connect: { id: season2020.id } },
          },
        },
      },
    });

    const team3 = await prisma.team.create({
      data: {
        name: 'test team 3',
        author: { connect: { id: admin.id } },
        club: { connect: { id: club.id } },
        competitions: {
          create: {
            competition: { connect: { id: competition2.id } },
            season: { connect: { id: season2021.id } },
          },
        },
      },
    });

    const team4 = await prisma.team.create({
      data: {
        name: 'test team 4',
        author: { connect: { id: admin.id } },
        club: { connect: { id: club.id } },
        competitions: {
          create: {
            competition: { connect: { id: competition3.id } },
            group: { connect: { id: competitionGroup2.id } },
            season: { connect: { id: season2021.id } },
          },
        },
      },
    });

    // Create test organization
    organization = await prisma.organization.create({
      data: {
        name: 'test organization',
        members: { connect: { id: regularUser2.id } },
      },
    });

    // Create test report template
    template = await prisma.reportTemplate.create({
      data: {
        name: 'test template',
        maxRatingScore: 10,
        author: { connect: { id: admin.id } },
      },
    });

    // Create user subscription - regularUser1 for competition1 & competitionGroup1
    await prisma.userSubscription.create({
      data: {
        startDate: new Date('2020-03-01'),
        endDate: new Date('2020-03-31'),
        user: { connect: { id: regularUser1.id } },
        competitions: { create: [{ competitionId: competition1.id }] },
        competitionGroups: { create: [{ groupId: competitionGroup1.id }] },
      },
    });

    // Create organization subscription - organization for competition2 & competitionGroup2
    await prisma.organizationSubscription.create({
      data: {
        startDate: new Date('2021-03-01'),
        endDate: new Date('2021-03-31'),
        organization: { connect: { id: organization.id } },
        competitions: { create: [{ competitionId: competition2.id }] },
        competitionGroups: { create: [{ groupId: competitionGroup2.id }] },
      },
    });

    // Player 1 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (has a subscription for competition1)
    // RegularUser2 - cannot access
    const player1Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
        teams: {
          create: {
            team: { connect: { id: team1.id } },
            startDate: new Date('2020-01-01'),
            endDate: new Date('2020-12-31'),
          },
        },
      },
    });

    // Player 2 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (has a subscription for competitionGroup1)
    // RegularUser2 - cannot access
    const player2Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
        teams: {
          create: {
            team: { connect: { id: team2.id } },
            startDate: new Date('2020-01-01'),
            endDate: new Date('2020-12-31'),
          },
        },
      },
    });

    // Player 3 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has a subscription for competition2)
    const player3Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
        teams: {
          create: {
            team: { connect: { id: team3.id } },
            startDate: new Date('2021-01-01'),
            endDate: new Date('2021-12-31'),
          },
        },
      },
    });

    // Player 4 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has a subscription to competitionGroup2)
    const player4Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
        teams: {
          create: {
            team: { connect: { id: team4.id } },
            startDate: new Date('2021-01-01'),
            endDate: new Date('2021-12-31'),
          },
        },
      },
    });

    // Report 5 - created by PlaymakerScout2
    // Admin - can access
    // PlaymakerScout1 - can access (Playmaker Scouts can access reports created by other playmaker scouts)
    // PlaymakerScout2 - can access (he's an author)
    // RegularUser1 - cannot access
    // RegularUser2 - cannot access
    const player5Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: playmakerScout2.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
      },
    });

    // Player 6 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - can access (has an ACE created for this player with READ permission)
    const player6Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
      },
    });

    // Player 7 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has an ACE created for insider note related to this player)
    const player7Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
      },
    });

    // Player 8 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has an ACE created for note related to this player)
    const player8Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
      },
    });

    // Player 9 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has an ACE created for report related to this player)
    const player9Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
      },
    });

    // Player 10 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access (has an ACE created for this player with READ permission)
    // RegularUser2 - cannot access
    const player10Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
      },
    });

    // Player 11 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (has an ACE created for insider note related to this player)
    // RegularUser2 - cannot access
    const player11Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
      },
    });

    // Player 12 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (has an ACE created for note related to this player)
    // RegularUser2 - cannot access
    const player12Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
      },
    });

    // Player 13 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (has an ACE created for report related to this player)
    // RegularUser2 - cannot access
    const player13Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
      },
    });

    // Player 14 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (has an ACE created for report related to this player with READ_AND_WRITE permission)
    // RegularUser2 - cannot access
    const player14Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
      },
    });

    // Player 15 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has an ACE created for report related to this player with READ_AND_WRITE permission)
    const player15Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
      },
    });
    // Player 16 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (has an ACE created for this player with FULL permission)
    // RegularUser2 - cannot access
    const player16Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
      },
    });
    // Player 17 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has an ACE created for this player with FULL permission)
    const player17Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
      },
    });

    // Player 18 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - cannot access
    const player18Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
        teams: {
          create: {
            team: { connect: { id: team1.id } },
            startDate: new Date('2019-01-01'),
            endDate: new Date('2019-06-31'),
          },
        },
      },
    });

    // Player 19 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - cannot access
    const player19Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
        teams: {
          create: {
            team: { connect: { id: team2.id } },
            startDate: new Date('2019-01-01'),
            endDate: new Date('2019-06-31'),
          },
        },
      },
    });

    // Player 20 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - cannot access
    const player20Promise = prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        author: { connect: { id: admin.id } },
        footed: 'RIGHT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
        teams: {
          create: {
            team: { connect: { id: team3.id } },
            startDate: new Date('2019-01-01'),
            endDate: new Date('2019-06-31'),
          },
        },
      },
    });

    [
      player1,
      player2,
      player3,
      player4,
      player5,
      player6,
      player7,
      player8,
      player9,
      player10,
      player11,
      player12,
      player13,
      player14,
      player15,
      player16,
      player17,
      player18,
      player19,
      player20,
    ] = await Promise.all([
      player1Promise,
      player2Promise,
      player3Promise,
      player4Promise,
      player5Promise,
      player6Promise,
      player7Promise,
      player8Promise,
      player9Promise,
      player10Promise,
      player11Promise,
      player12Promise,
      player13Promise,
      player14Promise,
      player15Promise,
      player16Promise,
      player17Promise,
      player18Promise,
      player19Promise,
      player20Promise,
    ]);

    // Access to player 6 data
    await prisma.organizationPlayerAccessControlEntry.create({
      data: {
        player: { connect: { id: player6.id } },
        organization: { connect: { id: organization.id } },
      },
    });

    // Access to player 7 data
    const insiderNotePlayer7 = await prisma.insiderNote.create({
      data: {
        author: { connect: { id: admin.id } },
        player: { connect: { id: player7.id } },
      },
    });

    await prisma.organizationInsiderNoteAccessControlEntry.create({
      data: {
        insiderNote: { connect: { id: insiderNotePlayer7.id } },
        organization: { connect: { id: organization.id } },
      },
    });

    // Access to player 8 data
    const notePlayer8 = await prisma.note.create({
      data: {
        author: { connect: { id: admin.id } },
        player: { connect: { id: player8.id } },
      },
    });

    await prisma.organizationNoteAccessControlEntry.create({
      data: {
        note: { connect: { id: notePlayer8.id } },
        organization: { connect: { id: organization.id } },
      },
    });

    // Access to player 9 data
    const reportPlayer9 = await prisma.report.create({
      data: {
        player: { connect: { id: player9.id } },
        template: { connect: { id: template.id } },
        author: { connect: { id: admin.id } },
      },
    });

    await prisma.organizationReportAccessControlEntry.create({
      data: {
        report: { connect: { id: reportPlayer9.id } },
        organization: { connect: { id: organization.id } },
      },
    });

    // Access to player 10 data
    await prisma.userPlayerAccessControlEntry.create({
      data: {
        player: { connect: { id: player10.id } },
        user: { connect: { id: regularUser1.id } },
      },
    });

    // Access to player 11 data
    const insiderNotePlayer11 = await prisma.insiderNote.create({
      data: {
        author: { connect: { id: admin.id } },
        player: { connect: { id: player11.id } },
      },
    });

    await prisma.userInsiderNoteAccessControlEntry.create({
      data: {
        insiderNote: { connect: { id: insiderNotePlayer11.id } },
        user: { connect: { id: regularUser1.id } },
      },
    });

    // Access to player 12 data
    const notePlayer12 = await prisma.note.create({
      data: {
        author: { connect: { id: admin.id } },
        player: { connect: { id: player12.id } },
      },
    });

    await prisma.userNoteAccessControlEntry.create({
      data: {
        note: { connect: { id: notePlayer12.id } },
        user: { connect: { id: regularUser1.id } },
      },
    });

    // Access to player 13 data
    const reportPlayer13 = await prisma.report.create({
      data: {
        player: { connect: { id: player13.id } },
        template: { connect: { id: template.id } },
        author: { connect: { id: admin.id } },
      },
    });

    await prisma.userReportAccessControlEntry.create({
      data: {
        report: { connect: { id: reportPlayer13.id } },
        user: { connect: { id: regularUser1.id } },
      },
    });

    // Access to player 14 data
    await prisma.userPlayerAccessControlEntry.create({
      data: {
        player: { connect: { id: player14.id } },
        user: { connect: { id: regularUser1.id } },
        permissionLevel: 'READ_AND_WRITE',
      },
    });

    // Access to player 15 data
    await prisma.organizationPlayerAccessControlEntry.create({
      data: {
        player: { connect: { id: player15.id } },
        organization: { connect: { id: organization.id } },
        permissionLevel: 'READ_AND_WRITE',
      },
    });

    // Access to player 16 data
    await prisma.userPlayerAccessControlEntry.create({
      data: {
        player: { connect: { id: player16.id } },
        user: { connect: { id: regularUser1.id } },
        permissionLevel: 'FULL',
      },
    });

    // Access to player 17 data
    await prisma.organizationPlayerAccessControlEntry.create({
      data: {
        player: { connect: { id: player17.id } },
        organization: { connect: { id: organization.id } },
        permissionLevel: 'FULL',
      },
    });

    playerIds = [
      player1.id,
      player2.id,
      player3.id,
      player4.id,
      player5.id,
      player6.id,
      player7.id,
      player8.id,
      player9.id,
      player10.id,
      player11.id,
      player12.id,
      player13.id,
      player14.id,
      player15.id,
      player16.id,
      player17.id,
      player18.id,
      player19.id,
      player20.id,
    ];

    await app.init();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('GET /players', () => {
    it('returns all players for admin user', async () => {
      const { token } = authService.getAndVerifyJwt(
        admin.id,
        admin.role,
        admin.organizationId,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/players')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(20);
      expect(body.data.totalDocs).toBe(20);

      const receivedPlayerIds = body.data.docs.map((player) => player.id);

      playerIds.forEach((playerId) =>
        expect(receivedPlayerIds).toContain(playerId),
      );
    });

    it('returns proper set of players data for regularUser1', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser1.id,
        regularUser1.role,
        regularUser1.organizationId,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/players')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(8);
      expect(body.data.totalDocs).toBe(8);

      const receivedPlayerIds = body.data.docs.map((player) => player.id);

      expect(receivedPlayerIds).toContain(player1.id);
      expect(receivedPlayerIds).toContain(player2.id);
      expect(receivedPlayerIds).not.toContain(player3.id);
      expect(receivedPlayerIds).not.toContain(player4.id);
      expect(receivedPlayerIds).not.toContain(player5.id);
      expect(receivedPlayerIds).not.toContain(player6.id);
      expect(receivedPlayerIds).not.toContain(player7.id);
      expect(receivedPlayerIds).not.toContain(player8.id);
      expect(receivedPlayerIds).not.toContain(player9.id);
      expect(receivedPlayerIds).toContain(player10.id);
      expect(receivedPlayerIds).toContain(player11.id);
      expect(receivedPlayerIds).toContain(player12.id);
      expect(receivedPlayerIds).toContain(player13.id);
      expect(receivedPlayerIds).toContain(player14.id);
      expect(receivedPlayerIds).not.toContain(player15.id);
      expect(receivedPlayerIds).toContain(player16.id);
      expect(receivedPlayerIds).not.toContain(player17.id);
      expect(receivedPlayerIds).not.toContain(player18.id);
      expect(receivedPlayerIds).not.toContain(player19.id);
      expect(receivedPlayerIds).not.toContain(player20.id);
    });

    it('returns proper set of players data for regularUser2', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser2.id,
        regularUser2.role,
        organization.id,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/players')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      // expect(body.data.docs.length).toBe(8);
      // expect(body.data.totalDocs).toBe(8);

      const receivedPlayerIds = body.data.docs.map((player) => player.id);

      expect(receivedPlayerIds).not.toContain(player1.id);
      expect(receivedPlayerIds).not.toContain(player2.id);
      expect(receivedPlayerIds).toContain(player3.id);
      expect(receivedPlayerIds).toContain(player4.id);
      expect(receivedPlayerIds).not.toContain(player5.id);
      expect(receivedPlayerIds).toContain(player6.id);
      expect(receivedPlayerIds).toContain(player7.id);
      expect(receivedPlayerIds).toContain(player8.id);
      expect(receivedPlayerIds).toContain(player9.id);
      expect(receivedPlayerIds).not.toContain(player10.id);
      expect(receivedPlayerIds).not.toContain(player11.id);
      expect(receivedPlayerIds).not.toContain(player12.id);
      expect(receivedPlayerIds).not.toContain(player13.id);
      expect(receivedPlayerIds).not.toContain(player14.id);
      expect(receivedPlayerIds).toContain(player15.id);
      expect(receivedPlayerIds).not.toContain(player16.id);
      expect(receivedPlayerIds).toContain(player17.id);
      expect(receivedPlayerIds).not.toContain(player18.id);
      expect(receivedPlayerIds).not.toContain(player19.id);
      expect(receivedPlayerIds).not.toContain(player20.id);
    });

    it('returns proper set of players data for playakerScout1', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout1.id,
        playmakerScout1.role,
        playmakerScout1.organizationId,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/players')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(1);
      expect(body.data.totalDocs).toBe(1);

      const receivedPlayerIds = body.data.docs.map((player) => player.id);

      expect(receivedPlayerIds).not.toContain(player1.id);
      expect(receivedPlayerIds).not.toContain(player2.id);
      expect(receivedPlayerIds).not.toContain(player3.id);
      expect(receivedPlayerIds).not.toContain(player4.id);
      expect(receivedPlayerIds).toContain(player5.id);
      expect(receivedPlayerIds).not.toContain(player6.id);
      expect(receivedPlayerIds).not.toContain(player7.id);
      expect(receivedPlayerIds).not.toContain(player8.id);
      expect(receivedPlayerIds).not.toContain(player9.id);
      expect(receivedPlayerIds).not.toContain(player10.id);
      expect(receivedPlayerIds).not.toContain(player11.id);
      expect(receivedPlayerIds).not.toContain(player12.id);
      expect(receivedPlayerIds).not.toContain(player13.id);
      expect(receivedPlayerIds).not.toContain(player14.id);
      expect(receivedPlayerIds).not.toContain(player15.id);
      expect(receivedPlayerIds).not.toContain(player16.id);
      expect(receivedPlayerIds).not.toContain(player17.id);
      expect(receivedPlayerIds).not.toContain(player18.id);
      expect(receivedPlayerIds).not.toContain(player19.id);
      expect(receivedPlayerIds).not.toContain(player20.id);
    });

    it('returns proper set of players data for playakerScout2', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout2.id,
        playmakerScout2.role,
        playmakerScout2.organizationId,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/players')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(1);
      expect(body.data.totalDocs).toBe(1);

      const receivedPlayerIds = body.data.docs.map((player) => player.id);

      expect(receivedPlayerIds).not.toContain(player1.id);
      expect(receivedPlayerIds).not.toContain(player2.id);
      expect(receivedPlayerIds).not.toContain(player3.id);
      expect(receivedPlayerIds).not.toContain(player4.id);
      expect(receivedPlayerIds).toContain(player5.id);
      expect(receivedPlayerIds).not.toContain(player6.id);
      expect(receivedPlayerIds).not.toContain(player7.id);
      expect(receivedPlayerIds).not.toContain(player8.id);
      expect(receivedPlayerIds).not.toContain(player9.id);
      expect(receivedPlayerIds).not.toContain(player10.id);
      expect(receivedPlayerIds).not.toContain(player11.id);
      expect(receivedPlayerIds).not.toContain(player12.id);
      expect(receivedPlayerIds).not.toContain(player13.id);
      expect(receivedPlayerIds).not.toContain(player14.id);
      expect(receivedPlayerIds).not.toContain(player15.id);
      expect(receivedPlayerIds).not.toContain(player16.id);
      expect(receivedPlayerIds).not.toContain(player17.id);
      expect(receivedPlayerIds).not.toContain(player18.id);
      expect(receivedPlayerIds).not.toContain(player19.id);
      expect(receivedPlayerIds).not.toContain(player20.id);
    });
  });

  describe('GET /players/:id', () => {
    it('returns proper responses for admin user', async () => {
      const { token } = authService.getAndVerifyJwt(
        admin.id,
        admin.role,
        admin.organizationId,
      );

      const responses = await Promise.all(
        playerIds.map((id) =>
          request(app.getHttpServer())
            .get(`/players/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      responses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(playerIds[idx]);
      });
    });

    it('returns proper responses for regularUser1', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser1.id,
        regularUser1.role,
        regularUser1.organizationId,
      );

      const playerIdsUserCanRead = [
        player1.id,
        player2.id,
        player10.id,
        player11.id,
        player12.id,
        player13.id,
        player14.id,
        player16.id,
      ];

      const playerIdsUserCannotRead = playerIds.filter(
        (id) => !playerIdsUserCanRead.includes(id),
      );

      const okResponses = await Promise.all(
        playerIdsUserCanRead.map((id) =>
          request(app.getHttpServer())
            .get(`/players/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(playerIdsUserCanRead[idx]);
      });

      const errorResponses = await Promise.all(
        playerIdsUserCannotRead.map((id) =>
          request(app.getHttpServer())
            .get(`/players/${id}`)
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('returns proper responses for regularUser2', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser2.id,
        regularUser2.role,
        organization.id,
      );

      const playerIdsUserCanRead = [
        player3.id,
        player4.id,
        player6.id,
        player7.id,
        player8.id,
        player9.id,
        player15.id,
        player17.id,
      ];

      const playerIdsUserCannotRead = playerIds.filter(
        (id) => !playerIdsUserCanRead.includes(id),
      );

      const okResponses = await Promise.all(
        playerIdsUserCanRead.map((id) =>
          request(app.getHttpServer())
            .get(`/players/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(playerIdsUserCanRead[idx]);
      });

      const errorResponses = await Promise.all(
        playerIdsUserCannotRead.map((id) =>
          request(app.getHttpServer())
            .get(`/players/${id}`)
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('returns proper responses for playmakerScout1', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout1.id,
        playmakerScout1.role,
        playmakerScout1.organizationId,
      );

      const playerIdsUserCanRead = [player5.id];

      const playerIdsUserCannotRead = playerIds.filter(
        (id) => !playerIdsUserCanRead.includes(id),
      );

      const okResponses = await Promise.all(
        playerIdsUserCanRead.map((id) =>
          request(app.getHttpServer())
            .get(`/players/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(playerIdsUserCanRead[idx]);
      });

      const errorResponses = await Promise.all(
        playerIdsUserCannotRead.map((id) =>
          request(app.getHttpServer())
            .get(`/players/${id}`)
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('returns proper responses for playmakerScout2', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout2.id,
        playmakerScout2.role,
        playmakerScout2.organizationId,
      );

      const playerIdsUserCanRead = [player5.id];

      const playerIdsUserCannotRead = playerIds.filter(
        (id) => !playerIdsUserCanRead.includes(id),
      );

      const okResponses = await Promise.all(
        playerIdsUserCanRead.map((id) =>
          request(app.getHttpServer())
            .get(`/players/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(playerIdsUserCanRead[idx]);
      });

      const errorResponses = await Promise.all(
        playerIdsUserCannotRead.map((id) =>
          request(app.getHttpServer())
            .get(`/players/${id}`)
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('PATCH /players/:id', () => {
    it('allows admin user update all players', async () => {
      const { token } = authService.getAndVerifyJwt(
        admin.id,
        admin.role,
        admin.organizationId,
      );

      const newFirstName = chance.first();
      const newLastName = chance.last();

      const responses = await Promise.all(
        playerIds.map((id) =>
          request(app.getHttpServer())
            .patch(`/players/${id}`)
            .send({
              firstName: newFirstName,
              lastName: newLastName,
              countryId,
              primaryPositionId: positionId,
              yearOfBirth: 2002,
              footed: 'RIGHT',
            })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      responses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(playerIds[idx]);
        expect(response.body.data.firstName).toBe(newFirstName);
        expect(response.body.data.lastName).toBe(newLastName);
      });
    });

    it('allows regularUser1 update proper set of players', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser1.id,
        regularUser1.role,
        regularUser1.organizationId,
      );

      const newFirstName = chance.first();
      const newLastName = chance.last();

      const playersIdsUserCanUpdate = [player14.id, player16.id];

      const playersIdsUserCannotUpdate = playerIds.filter(
        (id) => !playersIdsUserCanUpdate.includes(id),
      );

      const okResponses = await Promise.all(
        playersIdsUserCanUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/players/${id}`)
            .send({
              firstName: newFirstName,
              lastName: newLastName,
              countryId,
              primaryPositionId: positionId,
              yearOfBirth: 2002,
              footed: 'RIGHT',
            })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(playersIdsUserCanUpdate[idx]);
        expect(response.body.data.firstName).toBe(newFirstName);
        expect(response.body.data.lastName).toBe(newLastName);
      });

      const errorResponses = await Promise.all(
        playersIdsUserCannotUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/players/${id}`)
            .send({
              firstName: newFirstName,
              lastName: newLastName,
              countryId,
              primaryPositionId: positionId,
              yearOfBirth: 2002,
              footed: 'RIGHT',
            })
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows regularUser2 update proper set of players', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser2.id,
        regularUser2.role,
        organization.id,
      );

      const newFirstName = chance.first();
      const newLastName = chance.last();

      const playersIdsUserCanUpdate = [player15.id, player17.id];

      const playersIdsUserCannotUpdate = playerIds.filter(
        (id) => !playersIdsUserCanUpdate.includes(id),
      );

      const okResponses = await Promise.all(
        playersIdsUserCanUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/players/${id}`)
            .send({
              firstName: newFirstName,
              lastName: newLastName,
              countryId,
              primaryPositionId: positionId,
              yearOfBirth: 2002,
              footed: 'RIGHT',
            })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(playersIdsUserCanUpdate[idx]);
        expect(response.body.data.firstName).toBe(newFirstName);
        expect(response.body.data.lastName).toBe(newLastName);
      });

      const errorResponses = await Promise.all(
        playersIdsUserCannotUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/players/${id}`)
            .send({
              firstName: newFirstName,
              lastName: newLastName,
              countryId,
              primaryPositionId: positionId,
              yearOfBirth: 2002,
              footed: 'RIGHT',
            })
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows playmakerScout1 update proper set of players', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout1.id,
        playmakerScout1.role,
        playmakerScout1.organizationId,
      );

      const newFirstName = chance.first();
      const newLastName = chance.last();

      const playersIdsUserCanUpdate = [player5.id];

      const playersIdsUserCannotUpdate = playerIds.filter(
        (id) => !playersIdsUserCanUpdate.includes(id),
      );

      const okResponses = await Promise.all(
        playersIdsUserCanUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/players/${id}`)
            .send({
              firstName: newFirstName,
              lastName: newLastName,
              countryId,
              primaryPositionId: positionId,
              yearOfBirth: 2002,
              footed: 'RIGHT',
            })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(playersIdsUserCanUpdate[idx]);
        expect(response.body.data.firstName).toBe(newFirstName);
        expect(response.body.data.lastName).toBe(newLastName);
      });

      const errorResponses = await Promise.all(
        playersIdsUserCannotUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/players/${id}`)
            .send({
              firstName: newFirstName,
              lastName: newLastName,
              countryId,
              primaryPositionId: positionId,
              yearOfBirth: 2002,
              footed: 'RIGHT',
            })
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows playmakerScout2 update proper set of players', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout2.id,
        playmakerScout2.role,
        playmakerScout2.organizationId,
      );

      const newFirstName = chance.first();
      const newLastName = chance.last();

      const playersIdsUserCanUpdate = [player5.id];

      const playersIdsUserCannotUpdate = playerIds.filter(
        (id) => !playersIdsUserCanUpdate.includes(id),
      );

      const okResponses = await Promise.all(
        playersIdsUserCanUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/players/${id}`)
            .send({
              firstName: newFirstName,
              lastName: newLastName,
              countryId,
              primaryPositionId: positionId,
              yearOfBirth: 2002,
              footed: 'RIGHT',
            })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(playersIdsUserCanUpdate[idx]);
        expect(response.body.data.firstName).toBe(newFirstName);
        expect(response.body.data.lastName).toBe(newLastName);
      });

      const errorResponses = await Promise.all(
        playersIdsUserCannotUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/players/${id}`)
            .send({
              firstName: newFirstName,
              lastName: newLastName,
              countryId,
              primaryPositionId: positionId,
              yearOfBirth: 2002,
              footed: 'RIGHT',
            })
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('DELETE /players/:id', () => {
    it('allows regularUser1 delete proper set of players', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser1.id,
        regularUser1.role,
        regularUser1.organizationId,
      );

      const playersIdsUserCanDelete = [player16.id];

      const playersIdsUserCannotDelete = playerIds.filter(
        (id) => !playersIdsUserCanDelete.includes(id),
      );

      const okResponses = await Promise.all(
        playersIdsUserCanDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/players/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(playersIdsUserCanDelete[idx]);
      });

      const errorResponses = await Promise.all(
        playersIdsUserCannotDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/players/${id}`)
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows regularUser2 delete proper set of reports', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser2.id,
        regularUser2.role,
        organization.id,
      );

      const playersIdsUserCanDelete = [player17.id];

      const playersIdsUserCannotDelete = playerIds.filter(
        (id) => !playersIdsUserCanDelete.includes(id),
      );

      const okResponses = await Promise.all(
        playersIdsUserCanDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/players/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(playersIdsUserCanDelete[idx]);
      });

      const errorResponses = await Promise.all(
        playersIdsUserCannotDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/players/${id}`)
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows playmakerScout2 delete proper set of players', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout2.id,
        playmakerScout2.role,
        organization.id,
      );

      const playersIdsUserCanDelete = [player5.id];

      const playersIdsUserCannotDelete = playerIds.filter(
        (id) => !playersIdsUserCanDelete.includes(id),
      );

      const okResponses = await Promise.all(
        playersIdsUserCanDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/players/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(playersIdsUserCanDelete[idx]);
      });

      const errorResponses = await Promise.all(
        playersIdsUserCannotDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/players/${id}`)
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});
