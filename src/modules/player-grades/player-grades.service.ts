import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import Redis from 'ioredis';

import { REDIS_TTL } from '../../utils/constants';
import {
  calculateSkip,
  formatPaginatedResponse,
  isIdsArrayFilterDefined,
} from '../../utils/helpers';
import { PlayersService } from '../players/players.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerGradeDto } from './dto/create-player-grade.dto';
import { FindAllPlayerGradesDto } from './dto/find-all-player-grades.dto';
import { PlayerGradesPaginationOptionsDto } from './dto/player-grades-pagination-options.dto';
import { UpdatePlayerGradeDto } from './dto/update-player-grade.dto';

const include: Prisma.PlayerGradeInclude = {
  player: {
    include: {
      country: true,
      primaryPosition: { include: { positionType: true } },
      teams: { where: { endDate: null }, include: { team: true } },
    },
  },
  competition: {
    include: {
      country: true,
      ageCategory: true,
      type: true,
      juniorLevel: true,
    },
  },
};

@Injectable()
export class PlayerGradesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly playersService: PlayersService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  getRedisKey(id: string) {
    return `player-grade:${id}`;
  }

  async deleteFromCache(id: string) {
    await this.redis.del(this.getRedisKey(id));
  }

  async setToCache(id: string, grade: any) {
    await this.redis.set(
      this.getRedisKey(id),
      JSON.stringify(grade),
      'EX',
      REDIS_TTL,
    );
  }

  getFromCache(id: string) {
    return this.redis.get(this.getRedisKey(id));
  }

  async create(createPlayerGradeDto: CreatePlayerGradeDto, authorId: string) {
    const { playerId, ...rest } = createPlayerGradeDto;
    const player = await this.playersService.findOneWithCurrentTeamDetails(
      playerId,
    );
    const competitionId = player.teams[0]?.team.competitions[0]?.competitionId;
    const created = await this.prisma.playerGrade.create({
      data: {
        ...rest,
        player: { connect: { id: playerId } },
        competition: competitionId
          ? { connect: { id: competitionId } }
          : undefined,
        author: { connect: { id: authorId } },
      },
    });

    await this.playersService.update(playerId, { latestGradeId: created.id });

    return created;
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: PlayerGradesPaginationOptionsDto,
    { competitionIds, grades, playerIds }: FindAllPlayerGradesDto,
  ) {
    const where: Prisma.PlayerGradeWhereInput = {
      competitionId: isIdsArrayFilterDefined(competitionIds)
        ? { in: competitionIds }
        : undefined,
      playerId: isIdsArrayFilterDefined(playerIds)
        ? { in: playerIds }
        : undefined,
      grade: isIdsArrayFilterDefined(grades) ? { in: grades } : undefined,
    };

    let sort: Prisma.PlayerGradeOrderByWithRelationInput;

    switch (sortBy) {
      case 'player':
        sort = { player: { lastName: sortingOrder } };
        break;

      case 'competition':
        sort = { competition: { name: sortingOrder } };
        break;

      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const playerGrades = await this.prisma.playerGrade.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      include,
      orderBy: sort,
    });

    const total = await this.prisma.playerGrade.count({ where });

    return formatPaginatedResponse({
      docs: playerGrades,
      totalDocs: total,
      limit,
      page,
    });
  }

  async findOne(id: string) {
    const cached = await this.getFromCache(id);

    if (cached) {
      return JSON.parse(cached);
    }

    const grade = await this.prisma.playerGrade.findUnique({
      where: { id },
      include,
    });

    this.setToCache(id, grade);

    return grade;
  }

  async update(id: string, updatePlayerGradeDto: UpdatePlayerGradeDto) {
    const updated = await this.prisma.playerGrade.update({
      where: { id },
      data: updatePlayerGradeDto,
      include,
    });

    await this.playersService.deleteFromCache(updated.playerId);
    this.deleteFromCache(id);

    return updated;
  }

  async remove(id: string) {
    const deleted = await this.prisma.playerGrade.delete({ where: { id } });

    await this.playersService.deleteFromCache(deleted.playerId);
    this.deleteFromCache(id);
    this.playersService.setLatestGradeIfExists(deleted.playerId);

    return deleted;
  }
}
