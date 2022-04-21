import { RedisService } from '@liaoliaots/nestjs-redis';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AccessControlEntryPermissionLevel,
  Note,
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

describe('Notes (e2e)', () => {
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

  let note1: Note,
    note2: Note,
    note3: Note,
    note4: Note,
    note5: Note,
    note6: Note,
    note7: Note,
    note8: Note,
    note9: Note,
    note10: Note,
    note11: Note;

  let notesIds: string[];

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

    // Note 1 - created by regularUser1
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (he's an author)
    // RegularUser2 - cannot access
    const note1Promise = prisma.note.create({
      data: {
        player: { connect: { id: player.id } },
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: regularUser1.id } },
        docNumber: 1,
        meta: {
          create: {
            competition: { connect: { id: competition3.id } },
            team: { connect: { id: team.id } },
            position: { connect: { id: position.id } },
          },
        },
      },
    });

    // Note 2 - created by PlaymakerScout1 in March 2022, is related to competition1
    // Admin - can access
    // PlaymakerScout1 - can access (he's an author)
    // PlaymakerScout2 - can access (Playmaker Scouts can access notes created by other playmaker scouts)
    // RegularUser1 - can access (has a subscription to competition1)
    // RegularUser2 - cannot access
    const note2Promise = prisma.note.create({
      data: {
        player: { connect: { id: player.id } },
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: playmakerScout1.id } },
        docNumber: 2,
        createdAt: new Date('2022-03-10'),
        meta: {
          create: {
            competition: { connect: { id: competition1.id } },
            team: { connect: { id: team.id } },
            position: { connect: { id: position.id } },
          },
        },
      },
    });

    // Note 3 - created by PlaymakerScout1 in April 2022, is related to competition1
    // Admin - can access
    // PlaymakerScout1 - can access (he's an author)
    // PlaymakerScout2 - can access (Playmaker Scouts can access notes created by other playmaker scouts)
    // RegularUser1 - cannot access
    // RegularUser2 - cannot access
    const note3Promise = prisma.note.create({
      data: {
        player: { connect: { id: player.id } },
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: playmakerScout1.id } },
        createdAt: new Date('2022-04-10'),
        docNumber: 3,
        meta: {
          create: {
            competition: { connect: { id: competition1.id } },
            team: { connect: { id: team.id } },
            position: { connect: { id: position.id } },
          },
        },
      },
    });

    // Note 4 - created by PlaymakerScout2 in March 2022, is related to competition2
    // Admin - can access
    // PlaymakerScout1 - can access (Playmaker Scouts can access notes created by other playmaker scouts)
    // PlaymakerScout2 - can access (he's an author)
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has a subscription to competition2)
    const note4Promise = prisma.note.create({
      data: {
        player: { connect: { id: player.id } },
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: playmakerScout2.id } },
        createdAt: new Date('2022-03-10'),
        docNumber: 4,
        meta: {
          create: {
            competition: { connect: { id: competition2.id } },
            team: { connect: { id: team.id } },
            position: { connect: { id: position.id } },
          },
        },
      },
    });

    // Note 5 - created by PlaymakerScout1 in April 2022, is related to competition1
    // Admin - can access
    // PlaymakerScout1 - can access (Playmaker Scouts can access notes created by other playmaker scouts)
    // PlaymakerScout2 - can access (he's an author)
    // RegularUser1 - cannot access
    // RegularUser2 - cannot access
    const note5Promise = prisma.note.create({
      data: {
        player: { connect: { id: player.id } },
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: playmakerScout2.id } },
        createdAt: new Date('2022-04-10'),
        docNumber: 5,
        meta: {
          create: {
            competition: { connect: { id: competition1.id } },
            team: { connect: { id: team.id } },
            position: { connect: { id: position.id } },
          },
        },
      },
    });

    // Note 6 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (has an ACE created for this note with READ permission)
    // RegularUser2 - cannot access
    const note6Promise = prisma.note.create({
      data: {
        player: { connect: { id: player.id } },
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: admin.id } },
        docNumber: 6,
        meta: {
          create: {
            competition: { connect: { id: competition3.id } },
            team: { connect: { id: team.id } },
            position: { connect: { id: position.id } },
          },
        },
      },
    });

    // Note 7 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has an ACE created for this note with READ permission)
    const note7Promise = prisma.note.create({
      data: {
        player: { connect: { id: player.id } },
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: admin.id } },
        docNumber: 7,
        meta: {
          create: {
            competition: { connect: { id: competition3.id } },
            team: { connect: { id: team.id } },
            position: { connect: { id: position.id } },
          },
        },
      },
    });

    // Note 8 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (has an ACE created for this note with READ_AND_WRITE permission)
    // RegularUser2 - cannot access
    const note8Promise = prisma.note.create({
      data: {
        player: { connect: { id: player.id } },
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: admin.id } },
        docNumber: 8,
        meta: {
          create: {
            competition: { connect: { id: competition3.id } },
            team: { connect: { id: team.id } },
            position: { connect: { id: position.id } },
          },
        },
      },
    });

    // Note 9 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has an ACE created for this note with READ_AND_WRITE permission)
    const note9Promise = prisma.note.create({
      data: {
        player: { connect: { id: player.id } },
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: admin.id } },
        docNumber: 9,
        meta: {
          create: {
            competition: { connect: { id: competition3.id } },
            team: { connect: { id: team.id } },
            position: { connect: { id: position.id } },
          },
        },
      },
    });

    // Note 10 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (has an ACE created for this note with FULL permission)
    // RegularUser2 - cannot access
    const note10Promise = prisma.note.create({
      data: {
        player: { connect: { id: player.id } },
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: admin.id } },
        docNumber: 10,
        meta: {
          create: {
            competition: { connect: { id: competition3.id } },
            team: { connect: { id: team.id } },
            position: { connect: { id: position.id } },
          },
        },
      },
    });

    // Note 11 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has an ACE created for this note with FULL permission)
    const note11Promise = prisma.note.create({
      data: {
        player: { connect: { id: player.id } },
        description: chance.sentence({ words: 10 }),
        author: { connect: { id: admin.id } },
        docNumber: 11,
        meta: {
          create: {
            competition: { connect: { id: competition3.id } },
            team: { connect: { id: team.id } },
            position: { connect: { id: position.id } },
          },
        },
      },
    });

    [
      note1,
      note2,
      note3,
      note4,
      note5,
      note6,
      note7,
      note8,
      note9,
      note10,
      note11,
    ] = await Promise.all([
      note1Promise,
      note2Promise,
      note3Promise,
      note4Promise,
      note5Promise,
      note6Promise,
      note7Promise,
      note8Promise,
      note9Promise,
      note10Promise,
      note11Promise,
    ]);

    notesIds = [
      note1.id,
      note2.id,
      note3.id,
      note4.id,
      note5.id,
      note6.id,
      note7.id,
      note8.id,
      note9.id,
      note10.id,
      note11.id,
    ];

    const permissionLevels: AccessControlEntryPermissionLevel[] = [
      'READ',
      'READ_AND_WRITE',
      'FULL',
    ];

    // Create regularUser1 ACEs for notes 6, 8 & 10
    const user1Notes = [note6, note8, note10];

    await Promise.all(
      permissionLevels.map((permissionLevel, idx) =>
        prisma.userNoteAccessControlEntry.create({
          data: {
            user: { connect: { id: regularUser1.id } },
            note: { connect: { id: user1Notes[idx].id } },
            permissionLevel,
          },
        }),
      ),
    );

    // Create organization ACEs for notes 7, 9 & 11
    const organizationNotes = [note7, note9, note11];

    await Promise.all(
      permissionLevels.map((permissionLevel, idx) =>
        prisma.organizationNoteAccessControlEntry.create({
          data: {
            organization: { connect: { id: organization.id } },
            note: {
              connect: { id: organizationNotes[idx].id },
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

  describe('GET /notes', () => {
    it('returns all notes for admin user', async () => {
      const { token } = authService.getAndVerifyJwt(
        admin.id,
        admin.role,
        admin.organizationId,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/notes')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(11);
      expect(body.data.totalDocs).toBe(11);

      const receivedNotesIds = body.data.docs.map((note) => note.id);

      expect(receivedNotesIds).toContain(note1.id);
      expect(receivedNotesIds).toContain(note2.id);
      expect(receivedNotesIds).toContain(note3.id);
      expect(receivedNotesIds).toContain(note4.id);
      expect(receivedNotesIds).toContain(note5.id);
      expect(receivedNotesIds).toContain(note6.id);
      expect(receivedNotesIds).toContain(note7.id);
      expect(receivedNotesIds).toContain(note8.id);
      expect(receivedNotesIds).toContain(note9.id);
      expect(receivedNotesIds).toContain(note10.id);
      expect(receivedNotesIds).toContain(note11.id);
    });

    it('returns proper set of notes for regularUser1', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser1.id,
        regularUser1.role,
        regularUser1.organizationId,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/notes')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(5);
      expect(body.data.totalDocs).toBe(5);

      const receivedNotesIds = body.data.docs.map((note) => note.id);

      expect(receivedNotesIds).toContain(note1.id);
      expect(receivedNotesIds).toContain(note2.id);
      expect(receivedNotesIds).not.toContain(note3.id);
      expect(receivedNotesIds).not.toContain(note4.id);
      expect(receivedNotesIds).not.toContain(note5.id);
      expect(receivedNotesIds).toContain(note6.id);
      expect(receivedNotesIds).not.toContain(note7.id);
      expect(receivedNotesIds).toContain(note8.id);
      expect(receivedNotesIds).not.toContain(note9.id);
      expect(receivedNotesIds).toContain(note10.id);
      expect(receivedNotesIds).not.toContain(note11.id);
    });

    it('returns proper set of notes for regularUser2', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser2.id,
        regularUser2.role,
        organization.id,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/notes')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(4);
      expect(body.data.totalDocs).toBe(4);

      const receivedNotesIds = body.data.docs.map((note) => note.id);

      expect(receivedNotesIds).not.toContain(note1.id);
      expect(receivedNotesIds).not.toContain(note2.id);
      expect(receivedNotesIds).not.toContain(note3.id);
      expect(receivedNotesIds).toContain(note4.id);
      expect(receivedNotesIds).not.toContain(note5.id);
      expect(receivedNotesIds).not.toContain(note6.id);
      expect(receivedNotesIds).toContain(note7.id);
      expect(receivedNotesIds).not.toContain(note8.id);
      expect(receivedNotesIds).toContain(note9.id);
      expect(receivedNotesIds).not.toContain(note10.id);
      expect(receivedNotesIds).toContain(note11.id);
    });

    it('returns proper set of notes for playakerScout1', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout1.id,
        playmakerScout1.role,
        playmakerScout1.organizationId,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/notes')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(4);
      expect(body.data.totalDocs).toBe(4);

      const receivedNotesIds = body.data.docs.map((note) => note.id);

      expect(receivedNotesIds).not.toContain(note1.id);
      expect(receivedNotesIds).toContain(note2.id);
      expect(receivedNotesIds).toContain(note3.id);
      expect(receivedNotesIds).toContain(note4.id);
      expect(receivedNotesIds).toContain(note5.id);
      expect(receivedNotesIds).not.toContain(note6.id);
      expect(receivedNotesIds).not.toContain(note7.id);
      expect(receivedNotesIds).not.toContain(note8.id);
      expect(receivedNotesIds).not.toContain(note9.id);
      expect(receivedNotesIds).not.toContain(note10.id);
      expect(receivedNotesIds).not.toContain(note11.id);
    });

    it('returns proper set of notes for playakerScout2', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout2.id,
        playmakerScout2.role,
        playmakerScout2.organizationId,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/notes')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(4);
      expect(body.data.totalDocs).toBe(4);

      const receivedNotesIds = body.data.docs.map((note) => note.id);

      expect(receivedNotesIds).not.toContain(note1.id);
      expect(receivedNotesIds).toContain(note2.id);
      expect(receivedNotesIds).toContain(note3.id);
      expect(receivedNotesIds).toContain(note4.id);
      expect(receivedNotesIds).toContain(note5.id);
      expect(receivedNotesIds).not.toContain(note6.id);
      expect(receivedNotesIds).not.toContain(note7.id);
      expect(receivedNotesIds).not.toContain(note8.id);
      expect(receivedNotesIds).not.toContain(note9.id);
      expect(receivedNotesIds).not.toContain(note10.id);
      expect(receivedNotesIds).not.toContain(note11.id);
    });
  });

  describe('GET /notes/:id', () => {
    it('returns proper responses for admin user', async () => {
      const { token } = authService.getAndVerifyJwt(
        admin.id,
        admin.role,
        admin.organizationId,
      );

      const responses = await Promise.all(
        notesIds.map((id) =>
          request(app.getHttpServer())
            .get(`/notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      responses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(notesIds[idx]);
      });
    });

    it('returns proper responses for regularUser1', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser1.id,
        regularUser1.role,
        regularUser1.organizationId,
      );

      const notesIdsUserCanRead = [
        note1.id,
        note2.id,
        note6.id,
        note8.id,
        note10.id,
      ];

      const notesIdsUserCannotRead = notesIds.filter(
        (id) => !notesIdsUserCanRead.includes(id),
      );

      const okResponses = await Promise.all(
        notesIdsUserCanRead.map((id) =>
          request(app.getHttpServer())
            .get(`/notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(notesIdsUserCanRead[idx]);
      });

      const errorResponses = await Promise.all(
        notesIdsUserCannotRead.map((id) =>
          request(app.getHttpServer())
            .get(`/notes/${id}`)
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

      const notesIdsUserCanRead = [note4.id, note7.id, note9.id, note11.id];

      const notesIdsUserCannotRead = notesIds.filter(
        (id) => !notesIdsUserCanRead.includes(id),
      );

      const okResponses = await Promise.all(
        notesIdsUserCanRead.map((id) =>
          request(app.getHttpServer())
            .get(`/notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(notesIdsUserCanRead[idx]);
      });

      const errorResponses = await Promise.all(
        notesIdsUserCannotRead.map((id) =>
          request(app.getHttpServer())
            .get(`/notes/${id}`)
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

      const notesIdsUserCanRead = [note2.id, note3.id, note4.id, note5.id];

      const notesIdsUserCannotRead = notesIds.filter(
        (id) => !notesIdsUserCanRead.includes(id),
      );

      const okResponses = await Promise.all(
        notesIdsUserCanRead.map((id) =>
          request(app.getHttpServer())
            .get(`/notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(notesIdsUserCanRead[idx]);
      });

      const errorResponses = await Promise.all(
        notesIdsUserCannotRead.map((id) =>
          request(app.getHttpServer())
            .get(`/notes/${id}`)
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

      const notesIdsUserCanRead = [note2.id, note3.id, note4.id, note5.id];

      const notesIdsUserCannotRead = notesIds.filter(
        (id) => !notesIdsUserCanRead.includes(id),
      );

      const okResponses = await Promise.all(
        notesIdsUserCanRead.map((id) =>
          request(app.getHttpServer())
            .get(`/notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(notesIdsUserCanRead[idx]);
      });

      const errorResponses = await Promise.all(
        notesIdsUserCannotRead.map((id) =>
          request(app.getHttpServer())
            .get(`/notes/${id}`)
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('PATCH /notes/:id', () => {
    it('allows admin user update all notes', async () => {
      const { token } = authService.getAndVerifyJwt(
        admin.id,
        admin.role,
        admin.organizationId,
      );

      const newDescription = chance.sentence({ words: 10 });

      const responses = await Promise.all(
        notesIds.map((id) =>
          request(app.getHttpServer())
            .patch(`/notes/${id}`)
            .send({ description: newDescription, playerId: player.id })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      responses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(notesIds[idx]);
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

      const notesIdsUserCanUpdate = [note1.id, note8.id, note10.id];

      const notesIdsUserCannotUpdate = notesIds.filter(
        (id) => !notesIdsUserCanUpdate.includes(id),
      );

      const okResponses = await Promise.all(
        notesIdsUserCanUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/notes/${id}`)
            .send({ description: newDescription, playerId: player.id })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(notesIdsUserCanUpdate[idx]);
        expect(response.body.data.description).toBe(newDescription);
      });

      const errorResponses = await Promise.all(
        notesIdsUserCannotUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/notes/${id}`)
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

      const notesIdsUserCanUpdate = [note9.id, note11.id];

      const notesIdsUserCannotUpdate = notesIds.filter(
        (id) => !notesIdsUserCanUpdate.includes(id),
      );

      const okResponses = await Promise.all(
        notesIdsUserCanUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/notes/${id}`)
            .send({ description: newDescription, playerId: player.id })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(notesIdsUserCanUpdate[idx]);
        expect(response.body.data.description).toBe(newDescription);
      });

      const errorResponses = await Promise.all(
        notesIdsUserCannotUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/notes/${id}`)
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

      const notesIdsUserCanUpdate = [note2.id, note3.id, note4.id, note5.id];

      const notesIdsUserCannotUpdate = notesIds.filter(
        (id) => !notesIdsUserCanUpdate.includes(id),
      );

      const okResponses = await Promise.all(
        notesIdsUserCanUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/notes/${id}`)
            .send({ description: newDescription, playerId: player.id })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(notesIdsUserCanUpdate[idx]);
        expect(response.body.data.description).toBe(newDescription);
      });

      const errorResponses = await Promise.all(
        notesIdsUserCannotUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/notes/${id}`)
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

      const notesIdsUserCanUpdate = [note2.id, note3.id, note4.id, note5.id];

      const notesIdsUserCannotUpdate = notesIds.filter(
        (id) => !notesIdsUserCanUpdate.includes(id),
      );

      const okResponses = await Promise.all(
        notesIdsUserCanUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/notes/${id}`)
            .send({ description: newDescription, playerId: player.id })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(notesIdsUserCanUpdate[idx]);
        expect(response.body.data.description).toBe(newDescription);
      });

      const errorResponses = await Promise.all(
        notesIdsUserCannotUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/notes/${id}`)
            .send({ description: newDescription, playerId: player.id })
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('DELETE /notes/:id', () => {
    it('allows regularUser1 delete proper set of notes', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser1.id,
        regularUser1.role,
        regularUser1.organizationId,
      );

      const notesIdsUserCanDelete = [note1.id, note10.id];

      const notesIdsUserCannotDelete = notesIds.filter(
        (id) => !notesIdsUserCanDelete.includes(id),
      );

      const okResponses = await Promise.all(
        notesIdsUserCanDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(notesIdsUserCanDelete[idx]);
      });

      const errorResponses = await Promise.all(
        notesIdsUserCannotDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/notes/${id}`)
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

      const notesIdsUserCanDelete = [note11.id];

      const notesIdsUserCannotDelete = notesIds.filter(
        (id) => !notesIdsUserCanDelete.includes(id),
      );

      const okResponses = await Promise.all(
        notesIdsUserCanDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(notesIdsUserCanDelete[idx]);
      });

      const errorResponses = await Promise.all(
        notesIdsUserCannotDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/notes/${id}`)
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

      const notesIdsUserCanDelete = [note2.id, note3.id];

      const notesIdsUserCannotDelete = notesIds.filter(
        (id) => !notesIdsUserCanDelete.includes(id),
      );

      const okResponses = await Promise.all(
        notesIdsUserCanDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(notesIdsUserCanDelete[idx]);
      });

      const errorResponses = await Promise.all(
        notesIdsUserCannotDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/notes/${id}`)
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

      const notesIdsUserCanDelete = [note4.id, note5.id];

      const notesIdsUserCannotDelete = notesIds.filter(
        (id) => !notesIdsUserCanDelete.includes(id),
      );

      const okResponses = await Promise.all(
        notesIdsUserCanDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/notes/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(notesIdsUserCanDelete[idx]);
      });

      const errorResponses = await Promise.all(
        notesIdsUserCannotDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/notes/${id}`)
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

      const remainingNotesIds = [note6.id, note7.id, note8.id, note9.id];

      const okResponses = await Promise.all(
        remainingNotesIds.map((id) =>
          request(app.getHttpServer())
            .delete(`/notes/${id}`)
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
        .get('/notes')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(0);
      expect(body.data.totalDocs).toBe(0);
    });
  });
});
