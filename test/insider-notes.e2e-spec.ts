import { RedisService } from '@liaoliaots/nestjs-redis';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AccessControlEntryPermissionLevel,
  InsiderNote,
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

describe('Insider notes (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let redis: RedisService;

  let admin: User,
    playmakerScout1: User,
    playmakerScout2: User,
    regularUser1: User,
    regularUser2: User;
  let insiderNote1: InsiderNote,
    insiderNote2: InsiderNote,
    insiderNote3: InsiderNote,
    insiderNote4: InsiderNote,
    insiderNote5: InsiderNote,
    insiderNote6: InsiderNote,
    insiderNote7: InsiderNote,
    insiderNote8: InsiderNote,
    insiderNote9: InsiderNote,
    insiderNote10: InsiderNote,
    insiderNote11: InsiderNote;

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
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const redisClient = redis.getClient();

    // Clear cache
    await redisClient.flushall();

    // Clear database
    await prisma.userInsiderNoteAccessControlEntry.deleteMany();
    await prisma.organizationInsiderNoteAccessControlEntry.deleteMany();
    await prisma.insiderNoteMeta.deleteMany();
    await prisma.insiderNote.deleteMany();
    await prisma.team.deleteMany();
    await prisma.club.deleteMany();
    await prisma.competitionsOnOrganizationSubscriptions.deleteMany();
    await prisma.competitionsOnUserSubscriptions.deleteMany();
    await prisma.competition.deleteMany();
    await prisma.competitionAgeCategory.deleteMany();
    await prisma.competitionType.deleteMany();
    await prisma.player.deleteMany();
    await prisma.playerPosition.deleteMany();
    await prisma.userSubscription.deleteMany();
    await prisma.organizationSubscription.deleteMany();
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.region.deleteMany();
    await prisma.country.deleteMany();

    const { country, region, competition1, competition2, position } =
      await generateCommonTestData(prisma);

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

    // Create test club
    const club = await prisma.club.create({
      data: {
        name: 'test club',
        country: { connect: { id: country.id } },
        author: { connect: { id: admin.id } },
        region: { connect: { id: region.id } },
      },
    });

    // Create test team
    const team = await prisma.team.create({
      data: {
        name: 'test team',
        author: { connect: { id: admin.id } },
        club: { connect: { id: club.id } },
      },
    });

    // Create test player
    const player = await prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        footed: 'LEFT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
        author: { connect: { id: regularUser1.id } },
      },
    });

    // Create test organization
    const organization = await prisma.organization.create({
      data: {
        name: 'test organization',
        members: { connect: { id: regularUser2.id } },
      },
    });

    // Create user subscription - regularUser1 for competition1
    const userSubscription = await prisma.userSubscription.create({
      data: {
        startDate: new Date('2022-03-01'),
        endDate: new Date('2022-03-31'),
        user: { connect: { id: regularUser1.id } },
        competitions: { create: [{ competitionId: competition1.id }] },
      },
    });

    // Create organization subscription - organization for competition2
    const organizationSubscription =
      await prisma.organizationSubscription.create({
        data: {
          startDate: new Date('2022-03-01'),
          endDate: new Date('2022-03-31'),
          organization: { connect: { id: organization.id } },
          competitions: { create: [{ competitionId: competition2.id }] },
        },
      });

    // Insider note 1 - created by regularUser1
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (he's an author)
    // RegularUser2 - cannot access
    const insiderNote1Promise = prisma.insiderNote.create({
      data: {
        player: { connect: { id: player.id } },
        informant: chance.word(),
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: regularUser1.id } },
      },
    });

    // Insider note 2 - created by PlaymakerScout1 in March 2022, is related to competition1
    // Admin - can access
    // PlaymakerScout1 - can access (he's an author)
    // PlaymakerScout2 - can access (Playmaker Scouts can access notes created by other playmaker scouts)
    // RegularUser1 - can access (has a subscription to competition1)
    // RegularUser2 - cannot access
    const insiderNote2Promise = prisma.insiderNote.create({
      data: {
        player: { connect: { id: player.id } },
        informant: chance.word(),
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: playmakerScout1.id } },
        createdAt: new Date('2022-03-10'),
        meta: {
          create: {
            competition: { connect: { id: competition1.id } },
            team: { connect: { id: team.id } },
          },
        },
      },
    });

    // Insider note 3 - created by PlaymakerScout1 in April 2022, is related to competition1
    // Admin - can access
    // PlaymakerScout1 - can access (he's an author)
    // PlaymakerScout2 - can access (Playmaker Scouts can access notes created by other playmaker scouts)
    // RegularUser1 - cannot access
    // RegularUser2 - cannot access
    const insiderNote3Promise = prisma.insiderNote.create({
      data: {
        player: { connect: { id: player.id } },
        informant: chance.word(),
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: playmakerScout1.id } },
        createdAt: new Date('2022-04-10'),
        meta: {
          create: {
            competition: { connect: { id: competition1.id } },
            team: { connect: { id: team.id } },
          },
        },
      },
    });

    // Insider note 4 - created by PlaymakerScout2 in March 2022, is related to competition2
    // Admin - can access
    // PlaymakerScout1 - can access (he's an author)
    // PlaymakerScout2 - can access (Playmaker Scouts can access notes created by other playmaker scouts)
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has a subscription to competition2)
    const insiderNote4Promise = prisma.insiderNote.create({
      data: {
        player: { connect: { id: player.id } },
        informant: chance.word(),
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: playmakerScout2.id } },
        createdAt: new Date('2022-03-10'),
        meta: {
          create: {
            competition: { connect: { id: competition2.id } },
            team: { connect: { id: team.id } },
          },
        },
      },
    });

    // Insider note 5 - created by PlaymakerScout1 in April 2022, is related to competition1
    // Admin - can access
    // PlaymakerScout1 - can access (he's an author)
    // PlaymakerScout2 - can access (Playmaker Scouts can access notes created by other playmaker scouts)
    // RegularUser1 - cannot access
    // RegularUser2 - cannot access
    const insiderNote5Promise = prisma.insiderNote.create({
      data: {
        player: { connect: { id: player.id } },
        informant: chance.word(),
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: playmakerScout2.id } },
        createdAt: new Date('2022-04-10'),
        meta: {
          create: {
            competition: { connect: { id: competition1.id } },
            team: { connect: { id: team.id } },
          },
        },
      },
    });

    // Insider note 6 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (has an ACE created for this note with READ permission)
    // RegularUser2 - cannot access
    const insiderNote6Promise = prisma.insiderNote.create({
      data: {
        player: { connect: { id: player.id } },
        informant: chance.word(),
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: admin.id } },
      },
    });

    // Insider note 7 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has an ACE created for this note with READ permission)
    const insiderNote7Promise = prisma.insiderNote.create({
      data: {
        player: { connect: { id: player.id } },
        informant: chance.word(),
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: admin.id } },
      },
    });

    // Insider note 8 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (has an ACE created for this note with READ_AND_WRITE permission)
    // RegularUser2 - cannot access
    const insiderNote8Promise = prisma.insiderNote.create({
      data: {
        player: { connect: { id: player.id } },
        informant: chance.word(),
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: admin.id } },
      },
    });

    // Insider note 9 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has an ACE created for this note with READ_AND_WRITE permission)
    const insiderNote9Promise = prisma.insiderNote.create({
      data: {
        player: { connect: { id: player.id } },
        informant: chance.word(),
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: admin.id } },
      },
    });

    // Insider note 10 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (has an ACE created for this note with FULL permission)
    // RegularUser2 - cannot access
    const insiderNote10Promise = prisma.insiderNote.create({
      data: {
        player: { connect: { id: player.id } },
        informant: chance.word(),
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: admin.id } },
      },
    });

    // Insider note 11 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has an ACE created for this note with FULL permission)
    const insiderNote11Promise = prisma.insiderNote.create({
      data: {
        player: { connect: { id: player.id } },
        informant: chance.word(),
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: admin.id } },
      },
    });

    [
      insiderNote1,
      insiderNote2,
      insiderNote3,
      insiderNote4,
      insiderNote5,
      insiderNote6,
      insiderNote7,
      insiderNote8,
      insiderNote9,
      insiderNote10,
      insiderNote11,
    ] = await Promise.all([
      insiderNote1Promise,
      insiderNote2Promise,
      insiderNote3Promise,
      insiderNote4Promise,
      insiderNote5Promise,
      insiderNote6Promise,
      insiderNote7Promise,
      insiderNote8Promise,
      insiderNote9Promise,
      insiderNote10Promise,
      insiderNote11Promise,
    ]);

    const permissionLevels: AccessControlEntryPermissionLevel[] = [
      'READ',
      'READ_AND_WRITE',
      'FULL',
    ];

    // Create regularUser1 ACEs for insider notes 6, 8 & 10
    const user1InsiderNoteIds = [insiderNote6, insiderNote8, insiderNote10];

    await Promise.all(
      permissionLevels.map((permissionLevel, idx) =>
        prisma.userInsiderNoteAccessControlEntry.create({
          data: {
            user: { connect: { id: regularUser1.id } },
            insiderNote: { connect: { id: user1InsiderNoteIds[idx].id } },
            permissionLevel,
          },
        }),
      ),
    );

    // Create organization ACEs for insider notes 7, 9 & 11
    const organizationInsiderNoteIds = [
      insiderNote7,
      insiderNote9,
      insiderNote11,
    ];

    await Promise.all(
      permissionLevels.map((permissionLevel, idx) =>
        prisma.organizationInsiderNoteAccessControlEntry.create({
          data: {
            organization: { connect: { id: organization.id } },
            insiderNote: {
              connect: { id: organizationInsiderNoteIds[idx].id },
            },
            permissionLevel,
          },
        }),
      ),
    );

    await app.init();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('GET /insider-notes', () => {
    it('returns all insider-notes for admin user', async () => {
      const { token } = authService.getAndVerifyJwt(
        admin.id,
        admin.role,
        admin.organizationId,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/insider-notes')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(11);
      expect(body.data.totalDocs).toBe(11);

      const insiderNoteIds = body.data.docs.map((note) => note.id);

      expect(insiderNoteIds).toContain(insiderNote1.id);
      expect(insiderNoteIds).toContain(insiderNote2.id);
      expect(insiderNoteIds).toContain(insiderNote3.id);
      expect(insiderNoteIds).toContain(insiderNote4.id);
      expect(insiderNoteIds).toContain(insiderNote5.id);
      expect(insiderNoteIds).toContain(insiderNote6.id);
      expect(insiderNoteIds).toContain(insiderNote7.id);
      expect(insiderNoteIds).toContain(insiderNote8.id);
      expect(insiderNoteIds).toContain(insiderNote9.id);
      expect(insiderNoteIds).toContain(insiderNote10.id);
      expect(insiderNoteIds).toContain(insiderNote11.id);
    });
  });

  it('returns proper set of insider-notes for regularUser1', async () => {
    const { token } = authService.getAndVerifyJwt(
      regularUser1.id,
      regularUser1.role,
      regularUser1.organizationId,
    );

    const { body, status } = await request(app.getHttpServer())
      .get('/insider-notes')
      .set('Cookie', [`token=${token}`]);

    expect(status).toBe(HttpStatus.OK);
    expect(body.success).toBe(true);
    expect(body.data.docs.length).toBe(5);
    expect(body.data.totalDocs).toBe(5);

    const insiderNoteIds = body.data.docs.map((note) => note.id);

    expect(insiderNoteIds).toContain(insiderNote1.id);
    expect(insiderNoteIds).toContain(insiderNote2.id);
    expect(insiderNoteIds).not.toContain(insiderNote3.id);
    expect(insiderNoteIds).not.toContain(insiderNote4.id);
    expect(insiderNoteIds).not.toContain(insiderNote5.id);
    expect(insiderNoteIds).toContain(insiderNote6.id);
    expect(insiderNoteIds).not.toContain(insiderNote7.id);
    expect(insiderNoteIds).toContain(insiderNote8.id);
    expect(insiderNoteIds).not.toContain(insiderNote9.id);
    expect(insiderNoteIds).toContain(insiderNote10.id);
    expect(insiderNoteIds).not.toContain(insiderNote11.id);
  });
});
