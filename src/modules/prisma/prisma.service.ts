import {
  HttpException,
  HttpStatus,
  INestApplication,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { hashPasswordMiddleware } from './middlewares/hash-password.middleware';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['error', 'info', 'query', 'warn'],
      rejectOnNotFound: (err) =>
        new HttpException(err.message, HttpStatus.NOT_FOUND),
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
