import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import Redis from 'ioredis';

import { NotesService } from '../notes/notes.service';
import { ReportsService } from '../reports/reports.service';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { LandingPageNumbersDto } from './dto/landing.dto';

@Injectable()
export class LandingService {
  constructor(
    private readonly usersService: UsersService,
    private readonly notesService: NotesService,
    private readonly reportsService: ReportsService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getAppNumbers(): Promise<LandingPageNumbersDto> {
    const redisKey = 'landing-app-numbers';

    const cached = await this.redis.get(redisKey);
    if (cached) return JSON.parse(cached);

    const roles: Array<UserDto['role']> = [
      'PLAYMAKER_SCOUT',
      'ADMIN',
      'PLAYMAKER_SCOUT_MANAGER',
    ];

    const where: Prisma.NoteWhereInput | Prisma.ReportWhereInput = {
      author: {
        role: {
          in: roles,
        },
      },
    };

    const [notes, reports, scouts] = await Promise.all([
      this.notesService.getCount(where),
      this.reportsService.getCount(where),
      this.usersService.getCount({ role: { in: roles } }),
    ]);

    const data: LandingPageNumbersDto = {
      notesCount: notes,
      reportsCount: reports,
      scoutsCount: scouts,
    };

    this.redis.set(redisKey, JSON.stringify(data), 'EX', 60 * 60 * 2);

    return data;
  }
}
