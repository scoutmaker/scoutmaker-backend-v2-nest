import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { FindAllPlayersDto } from './dto/find-all-players.dto';
import {
  PlayersPaginationOptionsDto,
  PlayersSortByUnion,
} from './dto/players-pagination-options.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

const include: Prisma.PlayerInclude = {
  country: true,
  primaryPosition: true,
  secondaryPositions: { include: { position: true } },
  teams: {
    include: {
      team: true,
    },
  },
};

const listInclude: Prisma.PlayerInclude = {
  country: true,
  primaryPosition: true,
  teams: { where: { endDate: null }, include: { team: true } },
};

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlayerDto: CreatePlayerDto, authorId: string) {
    const {
      countryId,
      primaryPositionId,
      secondaryPositionIds,
      teamId,
      ...rest
    } = createPlayerDto;

    return this.prisma.player.create({
      data: {
        ...rest,
        country: { connect: { id: countryId } },
        primaryPosition: { connect: { id: primaryPositionId } },
        secondaryPositions:
          secondaryPositionIds && secondaryPositionIds.length > 0
            ? {
                createMany: {
                  data: secondaryPositionIds.map((id) => ({
                    playerPositionId: id,
                  })),
                },
              }
            : undefined,
        teams: { create: { teamId, startDate: new Date(), endDate: null } },
        author: { connect: { id: authorId } },
      },
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: PlayersPaginationOptionsDto,
    query: FindAllPlayersDto,
  ) {
    let sort: Prisma.PlayerOrderByWithRelationInput;

    const regularSortBy: PlayersSortByUnion[] = [
      'firstName',
      'lastName',
      'footed',
      'height',
      'weight',
      'yearOfBirth',
    ];

    const relationSortBy: PlayersSortByUnion[] = ['country', 'primaryPosition'];

    if (regularSortBy.includes(sortBy)) {
      sort = { [sortBy]: sortingOrder };
    }

    if (relationSortBy.includes(sortBy)) {
      sort = { [sortBy]: { name: sortingOrder } };
    }

    const where: Prisma.PlayerWhereInput = {
      yearOfBirth: { gte: query.bornAfter, lte: query.bornBefore },
      footed: query.footed,
      countryId: query.countryId,
      teams: { some: { teamId: { in: query.teamIds }, endDate: null } },
      AND: [
        {
          OR: [
            { firstName: { contains: query.name, mode: 'insensitive' } },
            { lastName: { contains: query.name, mode: 'insensitive' } },
          ],
        },
        {
          OR: [
            { primaryPosition: { id: { in: query.positionIds } } },
            {
              secondaryPositions: {
                some: { playerPositionId: { in: query.positionIds } },
              },
            },
          ],
        },
      ],
    };

    const players = await this.prisma.player.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.player.count({ where });

    return formatPaginatedResponse({
      docs: players,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.player.findMany({ include: listInclude });
  }

  findOne(id: string) {
    return this.prisma.player.findUnique({ where: { id }, include });
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto) {
    const { secondaryPositionIds, ...rest } = updatePlayerDto;

    // If user wants to update players secondary positions, first we need to delete all existing SecondaryPositionsOnPlayers records, then create new ones
    if (secondaryPositionIds && secondaryPositionIds.length !== 0) {
      await this.prisma.secondaryPositionsOnPlayers.deleteMany({
        where: { playerId: id },
      });
    }

    return this.prisma.player.update({
      where: { id },
      data: {
        ...rest,
        secondaryPositions:
          secondaryPositionIds && secondaryPositionIds.length > 0
            ? {
                createMany: {
                  data: secondaryPositionIds.map((id) => ({
                    playerPositionId: id,
                  })),
                },
              }
            : undefined,
      },
      include,
    });
  }

  remove(id: string) {
    return this.prisma.player.delete({ where: { id } });
  }
}
