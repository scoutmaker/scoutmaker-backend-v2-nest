import { RedisService } from '@liaoliaots/nestjs-redis';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AccessControlEntryPermissionLevel,
  Organization,
  Player,
  Report,
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

describe('Reports (e2e)', () => {
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
  let player: Player;

  let report1: Report,
    report2: Report,
    report3: Report,
    report4: Report,
    report5: Report,
    report6: Report,
    report7: Report,
    report8: Report,
    report9: Report,
    report10: Report,
    report11: Report;

  let reportIds: string[];

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

    // Create test report template
    template = await prisma.reportTemplate.create({
      data: {
        name: 'test template',
        maxRatingScore: 10,
        author: { connect: { id: admin.id } },
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

    // Report 1 - created by regularUser1
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (he's an author)
    // RegularUser2 - cannot access
    const report1Promise = prisma.report.create({
      data: {
        player: { connect: { id: player.id } },
        author: { connect: { id: regularUser1.id } },
        template: { connect: { id: template.id } },
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

    // Report 2 - created by PlaymakerScout1 in March 2022, is related to competition1
    // Admin - can access
    // PlaymakerScout1 - can access (he's an author)
    // PlaymakerScout2 - can access (Playmaker Scouts can access reports created by other playmaker scouts)
    // RegularUser1 - can access (has a subscription to competition1)
    // RegularUser2 - cannot access
    const report2Promise = prisma.report.create({
      data: {
        player: { connect: { id: player.id } },
        author: { connect: { id: playmakerScout1.id } },
        template: { connect: { id: template.id } },
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

    // Report 3 - created by PlaymakerScout1 in April 2022, is related to competition1
    // Admin - can access
    // PlaymakerScout1 - can access (he's an author)
    // PlaymakerScout2 - can access (Playmaker Scouts can access reports created by other playmaker scouts)
    // RegularUser1 - cannot access
    // RegularUser2 - cannot access
    const report3Promise = prisma.report.create({
      data: {
        player: { connect: { id: player.id } },
        author: { connect: { id: playmakerScout1.id } },
        template: { connect: { id: template.id } },
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

    // Report 4 - created by PlaymakerScout2 in March 2022, is related to competition2
    // Admin - can access
    // PlaymakerScout1 - can access (Playmaker Scouts can access reports created by other playmaker scouts)
    // PlaymakerScout2 - can access (he's an author)
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has a subscription to competition2)
    const report4Promise = prisma.report.create({
      data: {
        player: { connect: { id: player.id } },
        author: { connect: { id: playmakerScout2.id } },
        template: { connect: { id: template.id } },
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

    // Report 5 - created by PlaymakerScout1 in April 2022, is related to competition1
    // Admin - can access
    // PlaymakerScout1 - can access (Playmaker Scouts can access reports created by other playmaker scouts)
    // PlaymakerScout2 - can access (he's an author)
    // RegularUser1 - cannot access
    // RegularUser2 - cannot access
    const report5Promise = prisma.report.create({
      data: {
        player: { connect: { id: player.id } },
        author: { connect: { id: playmakerScout2.id } },
        template: { connect: { id: template.id } },
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

    // Report 6 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (has an ACE created for this report with READ permission)
    // RegularUser2 - cannot access
    const report6Promise = prisma.report.create({
      data: {
        player: { connect: { id: player.id } },
        author: { connect: { id: admin.id } },
        template: { connect: { id: template.id } },
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

    // Report 7 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has an ACE created for this report with READ permission)
    const report7Promise = prisma.report.create({
      data: {
        player: { connect: { id: player.id } },
        author: { connect: { id: admin.id } },
        template: { connect: { id: template.id } },
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

    // Report 8 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (has an ACE created for this report with READ_AND_WRITE permission)
    // RegularUser2 - cannot access
    const report8Promise = prisma.report.create({
      data: {
        player: { connect: { id: player.id } },
        author: { connect: { id: admin.id } },
        template: { connect: { id: template.id } },
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

    // Report 9 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has an ACE created for this report with READ_AND_WRITE permission)
    const report9Promise = prisma.report.create({
      data: {
        player: { connect: { id: player.id } },
        author: { connect: { id: admin.id } },
        template: { connect: { id: template.id } },
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

    // Report 10 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - can access (has an ACE created for this report with FULL permission)
    // RegularUser2 - cannot access
    const report10Promise = prisma.report.create({
      data: {
        player: { connect: { id: player.id } },
        author: { connect: { id: admin.id } },
        template: { connect: { id: template.id } },
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

    // Report 11 - created by admin
    // Admin - can access
    // PlaymakerScout1 - cannot access
    // PlaymakerScout2 - cannot access
    // RegularUser1 - cannot access
    // RegularUser2 - can access (his organization has an ACE created for this report with FULL permission)
    const report11Promise = prisma.report.create({
      data: {
        player: { connect: { id: player.id } },
        author: { connect: { id: admin.id } },
        template: { connect: { id: template.id } },
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
      report1,
      report2,
      report3,
      report4,
      report5,
      report6,
      report7,
      report8,
      report9,
      report10,
      report11,
    ] = await Promise.all([
      report1Promise,
      report2Promise,
      report3Promise,
      report4Promise,
      report5Promise,
      report6Promise,
      report7Promise,
      report8Promise,
      report9Promise,
      report10Promise,
      report11Promise,
    ]);

    reportIds = [
      report1.id,
      report2.id,
      report3.id,
      report4.id,
      report5.id,
      report6.id,
      report7.id,
      report8.id,
      report9.id,
      report10.id,
      report11.id,
    ];

    const permissionLevels: AccessControlEntryPermissionLevel[] = [
      'READ',
      'READ_AND_WRITE',
      'FULL',
    ];

    // Create regularUser1 ACEs for reports 6, 8 & 10
    const user1Reports = [report6, report8, report10];

    await Promise.all(
      permissionLevels.map((permissionLevel, idx) =>
        prisma.userReportAccessControlEntry.create({
          data: {
            user: { connect: { id: regularUser1.id } },
            report: { connect: { id: user1Reports[idx].id } },
            permissionLevel,
          },
        }),
      ),
    );

    // Create organization ACEs for reports 7, 9 & 11
    const organizationReports = [report7, report9, report11];

    await Promise.all(
      permissionLevels.map((permissionLevel, idx) =>
        prisma.organizationReportAccessControlEntry.create({
          data: {
            organization: { connect: { id: organization.id } },
            report: {
              connect: { id: organizationReports[idx].id },
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

  describe('GET /reports', () => {
    it('returns all reports for admin user', async () => {
      const { token } = authService.getAndVerifyJwt(
        admin.id,
        admin.role,
        admin.organizationId,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/reports')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(11);
      expect(body.data.totalDocs).toBe(11);

      const receivedReportIds = body.data.docs.map((report) => report.id);

      expect(receivedReportIds).toContain(report1.id);
      expect(receivedReportIds).toContain(report2.id);
      expect(receivedReportIds).toContain(report3.id);
      expect(receivedReportIds).toContain(report4.id);
      expect(receivedReportIds).toContain(report5.id);
      expect(receivedReportIds).toContain(report6.id);
      expect(receivedReportIds).toContain(report7.id);
      expect(receivedReportIds).toContain(report8.id);
      expect(receivedReportIds).toContain(report9.id);
      expect(receivedReportIds).toContain(report10.id);
      expect(receivedReportIds).toContain(report11.id);
    });

    it('returns proper set of reports for regularUser1', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser1.id,
        regularUser1.role,
        regularUser1.organizationId,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/reports')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(5);
      expect(body.data.totalDocs).toBe(5);

      const receivedReportIds = body.data.docs.map((report) => report.id);

      expect(receivedReportIds).toContain(report1.id);
      expect(receivedReportIds).toContain(report2.id);
      expect(receivedReportIds).not.toContain(report3.id);
      expect(receivedReportIds).not.toContain(report4.id);
      expect(receivedReportIds).not.toContain(report5.id);
      expect(receivedReportIds).toContain(report6.id);
      expect(receivedReportIds).not.toContain(report7.id);
      expect(receivedReportIds).toContain(report8.id);
      expect(receivedReportIds).not.toContain(report9.id);
      expect(receivedReportIds).toContain(report10.id);
      expect(receivedReportIds).not.toContain(report11.id);
    });

    it('returns proper set of reports for regularUser2', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser2.id,
        regularUser2.role,
        organization.id,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/reports')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(4);
      expect(body.data.totalDocs).toBe(4);

      const receivedReportsIds = body.data.docs.map((report) => report.id);

      expect(receivedReportsIds).not.toContain(report1.id);
      expect(receivedReportsIds).not.toContain(report2.id);
      expect(receivedReportsIds).not.toContain(report3.id);
      expect(receivedReportsIds).toContain(report4.id);
      expect(receivedReportsIds).not.toContain(report5.id);
      expect(receivedReportsIds).not.toContain(report6.id);
      expect(receivedReportsIds).toContain(report7.id);
      expect(receivedReportsIds).not.toContain(report8.id);
      expect(receivedReportsIds).toContain(report9.id);
      expect(receivedReportsIds).not.toContain(report10.id);
      expect(receivedReportsIds).toContain(report11.id);
    });

    it('returns proper set of reports for playakerScout1', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout1.id,
        playmakerScout1.role,
        playmakerScout1.organizationId,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/reports')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(4);
      expect(body.data.totalDocs).toBe(4);

      const receivedReportsIds = body.data.docs.map((report) => report.id);

      expect(receivedReportsIds).not.toContain(report1.id);
      expect(receivedReportsIds).toContain(report2.id);
      expect(receivedReportsIds).toContain(report3.id);
      expect(receivedReportsIds).toContain(report4.id);
      expect(receivedReportsIds).toContain(report5.id);
      expect(receivedReportsIds).not.toContain(report6.id);
      expect(receivedReportsIds).not.toContain(report7.id);
      expect(receivedReportsIds).not.toContain(report8.id);
      expect(receivedReportsIds).not.toContain(report9.id);
      expect(receivedReportsIds).not.toContain(report10.id);
      expect(receivedReportsIds).not.toContain(report11.id);
    });

    it('returns proper set of reports for playakerScout2', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout2.id,
        playmakerScout2.role,
        playmakerScout2.organizationId,
      );

      const { body, status } = await request(app.getHttpServer())
        .get('/reports')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(4);
      expect(body.data.totalDocs).toBe(4);

      const receivedReportsIds = body.data.docs.map((report) => report.id);

      expect(receivedReportsIds).not.toContain(report1.id);
      expect(receivedReportsIds).toContain(report2.id);
      expect(receivedReportsIds).toContain(report3.id);
      expect(receivedReportsIds).toContain(report4.id);
      expect(receivedReportsIds).toContain(report5.id);
      expect(receivedReportsIds).not.toContain(report6.id);
      expect(receivedReportsIds).not.toContain(report7.id);
      expect(receivedReportsIds).not.toContain(report8.id);
      expect(receivedReportsIds).not.toContain(report9.id);
      expect(receivedReportsIds).not.toContain(report10.id);
      expect(receivedReportsIds).not.toContain(report11.id);
    });
  });

  describe('GET /reports/:id', () => {
    it('returns proper responses for admin user', async () => {
      const { token } = authService.getAndVerifyJwt(
        admin.id,
        admin.role,
        admin.organizationId,
      );

      const responses = await Promise.all(
        reportIds.map((id) =>
          request(app.getHttpServer())
            .get(`/reports/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      responses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(reportIds[idx]);
      });
    });

    it('returns proper responses for regularUser1', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser1.id,
        regularUser1.role,
        regularUser1.organizationId,
      );

      const reportsIdsUserCanRead = [
        report1.id,
        report2.id,
        report6.id,
        report8.id,
        report10.id,
      ];

      const reportsIdsUserCannotRead = reportIds.filter(
        (id) => !reportsIdsUserCanRead.includes(id),
      );

      const okResponses = await Promise.all(
        reportsIdsUserCanRead.map((id) =>
          request(app.getHttpServer())
            .get(`/reports/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(reportsIdsUserCanRead[idx]);
      });

      const errorResponses = await Promise.all(
        reportsIdsUserCannotRead.map((id) =>
          request(app.getHttpServer())
            .get(`/reports/${id}`)
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

      const reportsIdsUserCanRead = [
        report4.id,
        report7.id,
        report9.id,
        report11.id,
      ];

      const reportsIdsUserCannotRead = reportIds.filter(
        (id) => !reportsIdsUserCanRead.includes(id),
      );

      const okResponses = await Promise.all(
        reportsIdsUserCanRead.map((id) =>
          request(app.getHttpServer())
            .get(`/reports/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(reportsIdsUserCanRead[idx]);
      });

      const errorResponses = await Promise.all(
        reportsIdsUserCannotRead.map((id) =>
          request(app.getHttpServer())
            .get(`/reports/${id}`)
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

      const reportsIdsUserCanRead = [
        report2.id,
        report3.id,
        report4.id,
        report5.id,
      ];

      const reportsIdsUserCannotRead = reportIds.filter(
        (id) => !reportsIdsUserCanRead.includes(id),
      );

      const okResponses = await Promise.all(
        reportsIdsUserCanRead.map((id) =>
          request(app.getHttpServer())
            .get(`/reports/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(reportsIdsUserCanRead[idx]);
      });

      const errorResponses = await Promise.all(
        reportsIdsUserCannotRead.map((id) =>
          request(app.getHttpServer())
            .get(`/reports/${id}`)
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

      const reportsIdsUserCanRead = [
        report2.id,
        report3.id,
        report4.id,
        report5.id,
      ];

      const reportsIdsUserCannotRead = reportIds.filter(
        (id) => !reportsIdsUserCanRead.includes(id),
      );

      const okResponses = await Promise.all(
        reportsIdsUserCanRead.map((id) =>
          request(app.getHttpServer())
            .get(`/reports/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(reportsIdsUserCanRead[idx]);
      });

      const errorResponses = await Promise.all(
        reportsIdsUserCannotRead.map((id) =>
          request(app.getHttpServer())
            .get(`/reports/${id}`)
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('PATCH /reports/:id', () => {
    it('allows admin user update all reports', async () => {
      const { token } = authService.getAndVerifyJwt(
        admin.id,
        admin.role,
        admin.organizationId,
      );

      const newSummary = chance.sentence({ words: 10 });

      const responses = await Promise.all(
        reportIds.map((id) =>
          request(app.getHttpServer())
            .patch(`/reports/${id}`)
            .send({
              summary: newSummary,
              playerId: player.id,
              templateId: template.id,
            })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      responses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(reportIds[idx]);
        expect(response.body.data.summary).toBe(newSummary);
      });
    });

    it('allows regularUser1 update proper set of reports', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser1.id,
        regularUser1.role,
        regularUser1.organizationId,
      );

      const newSummary = chance.sentence({ words: 10 });

      const reportsIdsUserCanUpdate = [report1.id, report8.id, report10.id];

      const reportsIdsUserCannotUpdate = reportIds.filter(
        (id) => !reportsIdsUserCanUpdate.includes(id),
      );

      const okResponses = await Promise.all(
        reportsIdsUserCanUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/reports/${id}`)
            .send({
              summary: newSummary,
              playerId: player.id,
              templateId: template.id,
            })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(reportsIdsUserCanUpdate[idx]);
        expect(response.body.data.summary).toBe(newSummary);
      });

      const errorResponses = await Promise.all(
        reportsIdsUserCannotUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/reports/${id}`)
            .send({
              summary: newSummary,
              playerId: player.id,
              templateId: template.id,
            })
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows regularUser2 update proper set of reports', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser2.id,
        regularUser2.role,
        organization.id,
      );

      const newSummary = chance.sentence({ words: 10 });

      const reportsIdsUserCanUpdate = [report9.id, report11.id];

      const reportsIdsUserCannotUpdate = reportIds.filter(
        (id) => !reportsIdsUserCanUpdate.includes(id),
      );

      const okResponses = await Promise.all(
        reportsIdsUserCanUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/reports/${id}`)
            .send({
              summary: newSummary,
              playerId: player.id,
              templateId: template.id,
            })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(reportsIdsUserCanUpdate[idx]);
        expect(response.body.data.summary).toBe(newSummary);
      });

      const errorResponses = await Promise.all(
        reportsIdsUserCannotUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/summary/${id}`)
            .send({
              summary: newSummary,
              playerId: player.id,
              templateId: template.id,
            })
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows playmakerScout1 update proper set of reports', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout1.id,
        playmakerScout1.role,
        playmakerScout1.organizationId,
      );

      const newSummary = chance.sentence({ words: 10 });

      const reportsIdsUserCanUpdate = [
        report2.id,
        report3.id,
        report4.id,
        report5.id,
      ];

      const reportsIdsUserCannotUpdate = reportIds.filter(
        (id) => !reportsIdsUserCanUpdate.includes(id),
      );

      const okResponses = await Promise.all(
        reportsIdsUserCanUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/reports/${id}`)
            .send({
              summary: newSummary,
              playerId: player.id,
              templateId: template.id,
            })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(reportsIdsUserCanUpdate[idx]);
        expect(response.body.data.summary).toBe(newSummary);
      });

      const errorResponses = await Promise.all(
        reportsIdsUserCannotUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/reports/${id}`)
            .send({
              summary: newSummary,
              playerId: player.id,
              templateId: template.id,
            })
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows playmakerScout2 update proper set of reports', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout2.id,
        playmakerScout2.role,
        playmakerScout2.organizationId,
      );

      const newSummary = chance.sentence({ words: 10 });

      const reportsIdsUserCanUpdate = [
        report2.id,
        report3.id,
        report4.id,
        report5.id,
      ];

      const reportsIdsUserCannotUpdate = reportIds.filter(
        (id) => !reportsIdsUserCanUpdate.includes(id),
      );

      const okResponses = await Promise.all(
        reportsIdsUserCanUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/reports/${id}`)
            .send({
              summary: newSummary,
              playerId: player.id,
              templateId: template.id,
            })
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(reportsIdsUserCanUpdate[idx]);
        expect(response.body.data.summary).toBe(newSummary);
      });

      const errorResponses = await Promise.all(
        reportsIdsUserCannotUpdate.map((id) =>
          request(app.getHttpServer())
            .patch(`/reports/${id}`)
            .send({
              summary: newSummary,
              playerId: player.id,
              templateId: template.id,
            })
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('DELETE /reports/:id', () => {
    it('allows regularUser1 delete proper set of reports', async () => {
      const { token } = authService.getAndVerifyJwt(
        regularUser1.id,
        regularUser1.role,
        regularUser1.organizationId,
      );

      const reportsIdsUserCanDelete = [report1.id, report10.id];

      const reportsIdsUserCannotDelete = reportIds.filter(
        (id) => !reportsIdsUserCanDelete.includes(id),
      );

      const okResponses = await Promise.all(
        reportsIdsUserCanDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/reports/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(reportsIdsUserCanDelete[idx]);
      });

      const errorResponses = await Promise.all(
        reportsIdsUserCannotDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/reports/${id}`)
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

      const reportsIdsUserCanDelete = [report11.id];

      const reportsIdsUserCannotDelete = reportIds.filter(
        (id) => !reportsIdsUserCanDelete.includes(id),
      );

      const okResponses = await Promise.all(
        reportsIdsUserCanDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/reports/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(reportsIdsUserCanDelete[idx]);
      });

      const errorResponses = await Promise.all(
        reportsIdsUserCannotDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/reports/${id}`)
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows playmakerScout1 delete proper set of reports', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout1.id,
        playmakerScout1.role,
        playmakerScout1.organizationId,
      );

      const reportsIdsUserCanDelete = [report2.id, report3.id];

      const reportsIdsUserCannotDelete = reportIds.filter(
        (id) => !reportsIdsUserCanDelete.includes(id),
      );

      const okResponses = await Promise.all(
        reportsIdsUserCanDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/reports/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(reportsIdsUserCanDelete[idx]);
      });

      const errorResponses = await Promise.all(
        reportsIdsUserCannotDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/reports/${id}`)
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows playmakerScout2 delete proper set of reports', async () => {
      const { token } = authService.getAndVerifyJwt(
        playmakerScout2.id,
        playmakerScout2.role,
        playmakerScout2.organizationId,
      );

      const reportsIdsUserCanDelete = [report4.id, report5.id];

      const reportsIdsUserCannotDelete = reportIds.filter(
        (id) => !reportsIdsUserCanDelete.includes(id),
      );

      const okResponses = await Promise.all(
        reportsIdsUserCanDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/reports/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(reportsIdsUserCanDelete[idx]);
      });

      const errorResponses = await Promise.all(
        reportsIdsUserCannotDelete.map((id) =>
          request(app.getHttpServer())
            .delete(`/reports/${id}`)
            .set({ Cookie: [`token=${token}`], 'Accept-Language': 'en' }),
        ),
      );

      errorResponses.forEach((response) => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    it('allows admin delete remaining reports', async () => {
      const { token } = authService.getAndVerifyJwt(
        admin.id,
        admin.role,
        admin.organizationId,
      );

      const remainingReportsIds = [
        report6.id,
        report7.id,
        report8.id,
        report9.id,
      ];

      const okResponses = await Promise.all(
        remainingReportsIds.map((id) =>
          request(app.getHttpServer())
            .delete(`/reports/${id}`)
            .set('Cookie', [`token=${token}`]),
        ),
      );

      okResponses.forEach((response, idx) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(remainingReportsIds[idx]);
      });

      // Check if there's no reports left in the database
      const { body, status } = await request(app.getHttpServer())
        .get('/reports')
        .set('Cookie', [`token=${token}`]);

      expect(status).toBe(HttpStatus.OK);
      expect(body.success).toBe(true);
      expect(body.data.docs.length).toBe(0);
      expect(body.data.totalDocs).toBe(0);
    });
  });
});
