import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PlayersService } from '../players/players.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerStatsDto } from './dto/create-player-stats.dto';
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

  async create(createPlayerStatsDto: CreatePlayerStatsDto, authorId: string) {
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

  findAll() {
    return `This action returns all playerStats`;
  }

  findOne(id: string) {
    return this.prisma.playerStats.findUnique({ where: { id }, include });
  }

  async update(id: string, updatePlayerStatsDto: UpdatePlayerStatsDto) {
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

  async remove(id: string) {
    await this.prisma.playerStatsMeta.delete({ where: { statsId: id } });
    return this.prisma.playerStats.delete({ where: { id }, include });
  }
}
