import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

const include: Prisma.MatchInclude = {
  homeTeam: true,
  awayTeam: true,
  competition: true,
  group: true,
  season: true,
};

const { group, season, ...listInclude } = include;

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMatchDto: CreateMatchDto, authorId: string) {
    const {
      homeTeamId,
      awayTeamId,
      competitionId,
      groupId,
      seasonId,
      ...rest
    } = createMatchDto;

    return this.prisma.match.create({
      data: {
        ...rest,
        homeTeam: { connect: { id: homeTeamId } },
        awayTeam: { connect: { id: awayTeamId } },
        competition: { connect: { id: competitionId } },
        group: groupId ? { connect: { id: groupId } } : undefined,
        season: { connect: { id: seasonId } },
        author: { connect: { id: authorId } },
      },
      include,
    });
  }

  findAll() {
    return `This action returns all matches`;
  }

  findOne(id: string) {
    return `This action returns a #${id} match`;
  }

  update(id: string, updateMatchDto: UpdateMatchDto) {
    return `This action updates a #${id} match`;
  }

  remove(id: string) {
    return `This action removes a #${id} match`;
  }
}
