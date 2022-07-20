import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PlayersService } from '../players/players.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerStatsDto } from './dto/create-player-stats.dto';
import { FindAllPlayerStatsDto } from './dto/find-all-player-stats.dto';
import { PlayerStatsPaginationOptionsDto } from './dto/player-stats-pagination-options.dto';
import { UpdatePlayerStatsDto } from './dto/update-player-stats.dto';

const include = Prisma.validator<Prisma.PlayerStatsInclude>()({
  player: { include: { country: true, primaryPosition: true } },
  match: { include: { homeTeam: true, awayTeam: true, competition: true } },
});

@Injectable()
export class PlayerStatsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly playersService: PlayersService,
  ) {}

  async create(createPlayerStatsDto: CreatePlayerStatsDto, authorId: number) {
    const { playerId, matchId, teamId, ...rest } = createPlayerStatsDto;

    let metaTeamId = teamId;

    if (!metaTeamId) {
      const player = await this.playersService.findOneWithCurrentTeamDetails(
        playerId,
      );
      metaTeamId = player.teams[0].teamId;
    }

    return this.prisma.playerStats.create({
      data: {
        ...rest,
        player: { connect: { id: playerId } },
        match: { connect: { id: matchId } },
        author: { connect: { id: authorId } },
        meta: { create: { teamId: metaTeamId } },
      },
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: PlayerStatsPaginationOptionsDto,
    { playerId, matchId, teamId }: FindAllPlayerStatsDto,
  ) {
    let sort: Prisma.PlayerStatsOrderByWithRelationInput;

    switch (sortBy) {
      case 'player':
        sort = { player: { lastName: sortingOrder } };
        break;
      case 'match':
        sort = { match: { date: sortingOrder } };
      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const where: Prisma.PlayerStatsWhereInput = {
      player: { id: playerId },
      match: { id: matchId },
      OR: [
        { match: { homeTeam: { id: teamId } } },
        { match: { awayTeam: { id: teamId } } },
        { meta: { team: { id: teamId } } },
      ],
    };

    const [stats, total] = await Promise.all([
      this.prisma.playerStats.findMany({
        where,
        take: limit,
        skip: calculateSkip(page, limit),
        orderBy: sort,
        include,
      }),
      this.prisma.playerStats.count({ where }),
    ]);

    return formatPaginatedResponse({
      docs: stats,
      totalDocs: total,
      limit,
      page,
    });
  }

  findOne(id: number) {
    return this.prisma.playerStats.findUnique({ where: { id }, include });
  }

  async update(id: number, updatePlayerStatsDto: UpdatePlayerStatsDto) {
    const { playerId, teamId, ...rest } = updatePlayerStatsDto;

    let metaTeamId = teamId;

    if (playerId && !metaTeamId) {
      const player = await this.playersService.findOneWithCurrentTeamDetails(
        playerId,
      );
      metaTeamId = player.teams[0].teamId;
      await this.prisma.playerStatsMeta.update({
        where: { statsId: id },
        data: { teamId: metaTeamId },
      });
    }

    if (teamId) {
      await this.prisma.playerStatsMeta.update({
        where: { statsId: id },
        data: { teamId },
      });
    }

    return this.prisma.playerStats.update({
      where: { id },
      data: { ...rest, playerId },
      include,
    });
  }

  async remove(id: number) {
    await this.prisma.playerStatsMeta.delete({ where: { statsId: id } });
    return this.prisma.playerStats.delete({ where: { id }, include });
  }
}
