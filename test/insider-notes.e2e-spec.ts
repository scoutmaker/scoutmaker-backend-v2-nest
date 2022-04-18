import { RedisService } from '@liaoliaots/nestjs-redis';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AccessControlEntryPermissionLevel,
  InsiderNote,
  Organization,
  Player,
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

  let organization: Organization;
  let player: Player;

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

  let insiderNotesIds: string[];

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

    // Clear database
    await prisma.userInsiderNoteAccessControlEntry.deleteMany();
    await prisma.organizationInsiderNoteAccessControlEntry.deleteMany();
    await prisma.insiderNoteMeta.deleteMany();
    await prisma.insiderNote.deleteMany();
    await prisma.teamAffiliation.deleteMany();
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

    const {
      country,
      region,
      competition1,
      competition2,
      competition3,
      position,
    } = await generateCommonTestData(prisma);

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
    player = await prisma.player.create({
      data: {
        firstName: chance.first(),
        lastName: chance.last(),
        footed: 'LEFT',
        yearOfBirth: 2000,
        country: { connect: { id: country.id } },
        primaryPosition: { connect: { id: position.id } },
        author: { connect: { id: regularUser1.id } },
        teams: {
          create: { teamId: team.id, startDate: new Date(), endDate: null },
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

    // Create user subscription - regularUser1 for competition1
    await prisma.userSubscription.create({
      data: {
        startDate: new Date('2022-03-01'),
        endDate: new Date('2022-03-31'),
        user: { connect: { id: regularUser1.id } },
        competitions: { create: [{ competitionId: competition1.id }] },
      },
    });

    // Create organization subscription - organization for competition2
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
        meta: {
          create: {
            competition: { connect: { id: competition3.id } },
            team: { connect: { id: team.id } },
          },
        },
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
    // PlaymakerScout1 - can access (Playmaker Scouts can access notes created by other playmaker scouts)
    // PlaymakerScout2 - can access (he's an author)
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
    // PlaymakerScout1 - can access (Playmaker Scouts can access notes created by other playmaker scouts)
    // PlaymakerScout2 - can access (he's an author)
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
        meta: {
          create: {
            competition: { connect: { id: competition3.id } },
            team: { connect: { id: team.id } },
          },
        },
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
        meta: {
          create: {
            competition: { connect: { id: competition3.id } },
            team: { connect: { id: team.id } },
          },
        },
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
        meta: {
          create: {
            competition: { connect: { id: competition3.id } },
            team: { connect: { id: team.id } },
          },
        },
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
        meta: {
          create: {
            competition: { connect: { id: competition3.id } },
            team: { connect: { id: team.id } },
          },
        },
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
        meta: {
          create: {
            competition: { connect: { id: competition3.id } },
            team: { connect: { id: team.id } },
          },
        },
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
        meta: {
          create: {
            competition: { connect: { id: competition3.id } },
            team: { connect: { id: team.id } },
          },
        },
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

    insiderNotesIds = [
      insiderNote1.id,
      insiderNote2.id,
      insiderNote3.id,
      insiderNote4.id,
      insiderNote5.id,
      insiderNote6.id,
      insiderNote7.id,
      insiderNote8.id,
      insiderNote9.id,
      insiderNote10.id,
      insiderNote11.id,
    ];

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

      const receivedInsiderNotesIds = body.data.docs.map((note) => note.id);

      expect(receivedInsiderNotesIds).toContain(insiderNote1.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote2.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote3.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote4.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote5.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote6.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote7.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote8.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote9.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote10.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote11.id);
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

      const receivedInsiderNotesIds = body.data.docs.map((note) => note.id);

      expect(receivedInsiderNotesIds).toContain(insiderNote1.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote2.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote3.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote4.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote5.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote6.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote7.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote8.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote9.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote10.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote11.id);
    });

    it('returns proper set of insider-notes for regularUser2', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser2.id,
        regularUser2.role,
        organization.id,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/insider-notes')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(4);
      expect(body.data.totalDocs).toBe(4);

      const receivedInsiderNotesIds = body.data.docs.map((note) => note.id);

      expect(receivedInsiderNotesIds).not.toContain(insiderNote1.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote2.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote3.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote4.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote5.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote6.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote7.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote8.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote9.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote10.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote11.id);
    });

    it('returns proper set of insider-notes for playakerScout1', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout1.id,
        playmakerScout1.role,
        playmakerScout1.organizationId,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/insider-notes')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(4);
      expect(body.data.totalDocs).toBe(4);

      const receivedInsiderNotesIds = body.data.docs.map((note) => note.id);

      expect(receivedInsiderNotesIds).not.toContain(insiderNote1.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote2.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote3.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote4.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote5.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote6.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote7.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote8.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote9.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote10.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote11.id);
    });

    it('returns proper set of insider-notes for playakerScout2', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout2.id,
        playmakerScout2.role,
        playmakerScout2.organizationId,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/insider-notes')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(4);
      expect(body.data.totalDocs).toBe(4);

      const receivedInsiderNotesIds = body.data.docs.map((note) => note.id);

      expect(receivedInsiderNotesIds).not.toContain(insiderNote1.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote2.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote3.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote4.id);
      expect(receivedInsiderNotesIds).toContain(insiderNote5.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote6.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote7.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote8.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote9.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote10.id);
      expect(receivedInsiderNotesIds).not.toContain(insiderNote11.id);
    });
  });

  describe('GET /insider-notes/:id', () => {
    it('returns proper responses for admin user', async () => {
      const { token } = authService.getAndVerifyJwt(
        admin.id,
        admin.role,
        admin.organizationId,
      );

      const responses = await Promise.all(
        insiderNotesIds.map((id) =>
          request(app.getHttpServer())
            .get(`/insider-notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      responses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(insiderNotesIds[idx]);
      });
    });

    it('returns proper responses for regularUser1', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser1.id,
        regularUser1.role,
        regularUser1.organizationId,
      );

      const insiderNotesIdsUserCanRead = [
        insiderNote1.id,
        insiderNote2.id,
        insiderNote6.id,
        insiderNote8.id,
        insiderNote10.id,
      ];

      const insiderNotesIdsUserCannotRead = insiderNotesIds.filter(
        (id) => !insiderNotesIdsUserCanRead.includes(id),
      );

      const okResponses = await Promise.all(
        insiderNotesIdsUserCanRead.map((id) =>
          request(app.getHttpServer())
            .get(`/insider-notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(insiderNotesIdsUserCanRead[idx]);
      });

      const errorResponses = await Promise.all(
        insiderNotesIdsUserCannotRead.map((id) =>
          request(app.getHttpServer())
            .get(`/insider-notes/${id}`)
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

      const insiderNotesIdsUserCanRead = [
        insiderNote4.id,
        insiderNote7.id,
        insiderNote9.id,
        insiderNote11.id,
      ];

      const insiderNotesIdsUserCannotRead = insiderNotesIds.filter(
        (id) => !insiderNotesIdsUserCanRead.includes(id),
      );

      const okResponses = await Promise.all(
        insiderNotesIdsUserCanRead.map((id) =>
          request(app.getHttpServer())
            .get(`/insider-notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(insiderNotesIdsUserCanRead[idx]);
      });

      const errorResponses = await Promise.all(
        insiderNotesIdsUserCannotRead.map((id) =>
          request(app.getHttpServer())
            .get(`/insider-notes/${id}`)
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

      const insiderNotesIdsUserCanRead = [
        insiderNote2.id,
        insiderNote3.id,
        insiderNote4.id,
        insiderNote5.id,
      ];

      const insiderNotesIdsUserCannotRead = insiderNotesIds.filter(
        (id) => !insiderNotesIdsUserCanRead.includes(id),
      );

      const okResponses = await Promise.all(
        insiderNotesIdsUserCanRead.map((id) =>
          request(app.getHttpServer())
            .get(`/insider-notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(insiderNotesIdsUserCanRead[idx]);
      });

      const errorResponses = await Promise.all(
        insiderNotesIdsUserCannotRead.map((id) =>
          request(app.getHttpServer())
            .get(`/insider-notes/${id}`)
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

      const insiderNotesIdsUserCanRead = [
        insiderNote2.id,
        insiderNote3.id,
        insiderNote4.id,
        insiderNote5.id,
      ];

      const insiderNotesIdsUserCannotRead = insiderNotesIds.filter(
        (id) => !insiderNotesIdsUserCanRead.includes(id),
      );

      const okResponses = await Promise.all(
        insiderNotesIdsUserCanRead.map((id) =>
          request(app.getHttpServer())
            .get(`/insider-notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(insiderNotesIdsUserCanRead[idx]);
      });

      const errorResponses = await Promise.all(
        insiderNotesIdsUserCannotRead.map((id) =>
          request(app.getHttpServer())
            .get(`/insider-notes/${id}`)
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('PATCH /insider-notes/:id', () => {
    it('allows admin user update all notes', async () => {
      const { token } = authService.getAndVerifyJwt(
        admin.id,
        admin.role,
        admin.organizationId,
      );

      const newDescription = chance.sentence({ words: 10 });

      const responses = await Promise.all(
        insiderNotesIds.map((id) =>
          request(app.getHttpServer())
            .patch(`/insider-notes/${id}`)
            .send({ description: newDescription, playerId: player.id })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      responses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(insiderNotesIds[idx]);
        expect(response.body.data.description).toBe(newDescription);
      });
    });

    it('allows regularUser1 update proper set of notes', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser1.id,
        regularUser1.role,
        regularUser1.organizationId,
      );

      const newDescription = chance.sentence({ words: 10 });

      const insiderNotesIdsUserCanUpdate = [
        insiderNote1.id,
        insiderNote8.id,
        insiderNote10.id,
      ];

      const insiderNotesIdsUserCannotUpdate = insiderNotesIds.filter(
        (id) => !insiderNotesIdsUserCanUpdate.includes(id),
      );

      const okResponses = await Promise.all(
        insiderNotesIdsUserCanUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/insider-notes/${id}`)
            .send({ description: newDescription, playerId: player.id })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(insiderNotesIdsUserCanUpdate[idx]);
        expect(response.body.data.description).toBe(newDescription);
      });

      const errorResponses = await Promise.all(
        insiderNotesIdsUserCannotUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/insider-notes/${id}`)
            .send({ description: newDescription, playerId: player.id })
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows regularUser2 update proper set of notes', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser2.id,
        regularUser2.role,
        organization.id,
      );

      const newDescription = chance.sentence({ words: 10 });

      const insiderNotesIdsUserCanUpdate = [insiderNote9.id, insiderNote11.id];

      const insiderNotesIdsUserCannotUpdate = insiderNotesIds.filter(
        (id) => !insiderNotesIdsUserCanUpdate.includes(id),
      );

      const okResponses = await Promise.all(
        insiderNotesIdsUserCanUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/insider-notes/${id}`)
            .send({ description: newDescription, playerId: player.id })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(insiderNotesIdsUserCanUpdate[idx]);
        expect(response.body.data.description).toBe(newDescription);
      });

      const errorResponses = await Promise.all(
        insiderNotesIdsUserCannotUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/insider-notes/${id}`)
            .send({ description: newDescription, playerId: player.id })
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows playmakerScout1 update proper set of notes', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout1.id,
        playmakerScout1.role,
        playmakerScout1.organizationId,
      );

      const newDescription = chance.sentence({ words: 10 });

      const insiderNotesIdsUserCanUpdate = [
        insiderNote2.id,
        insiderNote3.id,
        insiderNote4.id,
        insiderNote5.id,
      ];

      const insiderNotesIdsUserCannotUpdate = insiderNotesIds.filter(
        (id) => !insiderNotesIdsUserCanUpdate.includes(id),
      );

      const okResponses = await Promise.all(
        insiderNotesIdsUserCanUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/insider-notes/${id}`)
            .send({ description: newDescription, playerId: player.id })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(insiderNotesIdsUserCanUpdate[idx]);
        expect(response.body.data.description).toBe(newDescription);
      });

      const errorResponses = await Promise.all(
        insiderNotesIdsUserCannotUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/insider-notes/${id}`)
            .send({ description: newDescription, playerId: player.id })
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows playmakerScout2 update proper set of notes', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout2.id,
        playmakerScout2.role,
        playmakerScout2.organizationId,
      );

      const newDescription = chance.sentence({ words: 10 });

      const insiderNotesIdsUserCanUpdate = [
        insiderNote2.id,
        insiderNote3.id,
        insiderNote4.id,
        insiderNote5.id,
      ];

      const insiderNotesIdsUserCannotUpdate = insiderNotesIds.filter(
        (id) => !insiderNotesIdsUserCanUpdate.includes(id),
      );

      const okResponses = await Promise.all(
        insiderNotesIdsUserCanUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/insider-notes/${id}`)
            .send({ description: newDescription, playerId: player.id })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(insiderNotesIdsUserCanUpdate[idx]);
        expect(response.body.data.description).toBe(newDescription);
      });

      const errorResponses = await Promise.all(
        insiderNotesIdsUserCannotUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/insider-notes/${id}`)
            .send({ description: newDescription, playerId: player.id })
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('DELETE /insider-notes/:id', () => {
    it('allows regularUser1 delete proper set of notes', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser1.id,
        regularUser1.role,
        regularUser1.organizationId,
      );

      const insiderNotesIdsUserCanDelete = [insiderNote1.id, insiderNote10.id];

      const insiderNotesIdsUserCannotDelete = insiderNotesIds.filter(
        (id) => !insiderNotesIdsUserCanDelete.includes(id),
      );

      const okResponses = await Promise.all(
        insiderNotesIdsUserCanDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/insider-notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(insiderNotesIdsUserCanDelete[idx]);
      });

      const errorResponses = await Promise.all(
        insiderNotesIdsUserCannotDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/insider-notes/${id}`)
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows regularUser2 delete proper set of notes', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser2.id,
        regularUser2.role,
        organization.id,
      );

      const insiderNotesIdsUserCanDelete = [insiderNote11.id];

      const insiderNotesIdsUserCannotDelete = insiderNotesIds.filter(
        (id) => !insiderNotesIdsUserCanDelete.includes(id),
      );

      const okResponses = await Promise.all(
        insiderNotesIdsUserCanDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/insider-notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(insiderNotesIdsUserCanDelete[idx]);
      });

      const errorResponses = await Promise.all(
        insiderNotesIdsUserCannotDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/insider-notes/${id}`)
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows playmakerScout1 delete proper set of notes', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout1.id,
        playmakerScout1.role,
        playmakerScout1.organizationId,
      );

      const insiderNotesIdsUserCanDelete = [insiderNote2.id, insiderNote3.id];

      const insiderNotesIdsUserCannotDelete = insiderNotesIds.filter(
        (id) => !insiderNotesIdsUserCanDelete.includes(id),
      );

      const okResponses = await Promise.all(
        insiderNotesIdsUserCanDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/insider-notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(insiderNotesIdsUserCanDelete[idx]);
      });

      const errorResponses = await Promise.all(
        insiderNotesIdsUserCannotDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/insider-notes/${id}`)
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows playmakerScout2 delete proper set of notes', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout2.id,
        playmakerScout2.role,
        playmakerScout2.organizationId,
      );

      const insiderNotesIdsUserCanDelete = [insiderNote4.id, insiderNote5.id];

      const insiderNotesIdsUserCannotDelete = insiderNotesIds.filter(
        (id) => !insiderNotesIdsUserCanDelete.includes(id),
      );

      const okResponses = await Promise.all(
        insiderNotesIdsUserCanDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/insider-notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(insiderNotesIdsUserCanDelete[idx]);
      });

      const errorResponses = await Promise.all(
        insiderNotesIdsUserCannotDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/insider-notes/${id}`)
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows admin delete remaining notes', async () => {
      const { token } = authService.getAndVerifyJwt(
        admin.id,
        admin.role,
        admin.organizationId,
      );

      const remainingNotesIds = [
        insiderNote6.id,
        insiderNote7.id,
        insiderNote8.id,
        insiderNote9.id,
      ];

      const okResponses = await Promise.all(
        remainingNotesIds.map((id) =>
          request(app.getHttpServer())
            .delete(`/insider-notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(remainingNotesIds[idx]);
      });

      // Check if there's no notes left in the database
      const { body, status } = await request(app.getHttpServer())
        .get('/insider-notes')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(0);
      expect(body.data.totalDocs).toBe(0);
    });
  });
});
