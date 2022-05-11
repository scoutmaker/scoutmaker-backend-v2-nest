import {
  HttpException,
  HttpStatus,
  INestApplication,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { hashPasswordMiddleware } from './middlewares/hash-password.middleware';

const {
  User,
  UserPlayerAccessControlEntry,
  OrganizationPlayerAccessControlEntry,
  UserReportAccessControlEntry,
  OrganizationReportAccessControlEntry,
  UserNoteAccessControlEntry,
  OrganizationNoteAccessControlEntry,
  UserInsiderNoteAccessControlEntry,
  OrganizationInsiderNoteAccessControlEntry,
  MatchAttendance,
  ...ModelsToReject
} = Prisma.ModelName;

const rejectOnNotFound = (err: Error) =>
  new HttpException(err.message, HttpStatus.NOT_FOUND);

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      rejectOnNotFound: {
        findUnique: Object.fromEntries(
          Object.keys(ModelsToReject).map((key) => [key, rejectOnNotFound]),
        ),
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    // Hash the password on every user creation
    this.$use(hashPasswordMiddleware);
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
